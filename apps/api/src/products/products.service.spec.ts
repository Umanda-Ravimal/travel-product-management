import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from './dto/create-product.dto';

const now = new Date('2026-09-09T12:00:00.000Z');

const product = {
  id: 'prod-1',
  productName: 'Kandy Day Tour',
  destination: 'Kandy',
  category: 'Tour',
  description: 'A full day tour around Kandy city highlights.',
  price: '25000.00',
  inventoryCount: 10,
  validFrom: new Date('2026-09-01T00:00:00.000Z'),
  validUntil: new Date('2026-12-01T00:00:00.000Z'),
  status: 'ACTIVE',
  highlights: ['Temple of the Tooth'],
  inclusions: ['Transport'],
  tags: ['day-trip'],
  images: ['/images/dest-kandy.png'],
};

const createDto = {
  productName: product.productName,
  destination: product.destination,
  category: product.category,
  description: product.description,
  price: product.price,
  inventoryCount: product.inventoryCount,
  validFrom: '2026-09-01T00:00:00.000Z',
  validUntil: '2026-12-01T00:00:00.000Z',
  status: ProductStatus.ACTIVE,
  highlights: product.highlights,
  inclusions: product.inclusions,
  tags: product.tags,
  images: product.images,
};

describe('ProductsService', () => {
  let service: ProductsService;
  const prisma = {
    product: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('creates a product with parsed dates and optional arrays', async () => {
      prisma.product.create.mockResolvedValue(product);

      await expect(service.create(createDto)).resolves.toEqual(product);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          productName: createDto.productName,
          destination: createDto.destination,
          category: createDto.category,
          description: createDto.description,
          price: createDto.price,
          inventoryCount: createDto.inventoryCount,
          validFrom: new Date(createDto.validFrom),
          validUntil: new Date(createDto.validUntil),
          status: createDto.status,
          highlights: createDto.highlights,
          inclusions: createDto.inclusions,
          tags: createDto.tags,
          images: createDto.images,
        },
      });
    });

    it('defaults optional arrays when omitted', async () => {
      prisma.product.create.mockResolvedValue(product);

      const { highlights, inclusions, tags, images, ...required } = createDto;

      await service.create(required);

      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            highlights: [],
            inclusions: [],
            tags: [],
            images: [],
          }),
        }),
      );
    });

    it('rejects a validUntil date that is not after validFrom', async () => {
      await expect(
        service.create({
          ...createDto,
          validFrom: '2026-12-01T00:00:00.000Z',
          validUntil: '2026-12-01T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.product.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const availableFilter = {
      status: 'ACTIVE',
      inventoryCount: { gt: 0 },
      validFrom: { lte: now },
      validUntil: { gte: now },
    };

    beforeEach(() => {
      prisma.product.findMany.mockResolvedValue([product]);
      prisma.product.count.mockResolvedValue(1);
    });

    it('lists only currently available products and paginates', async () => {
      await expect(service.findAll({})).resolves.toEqual({
        data: [product],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: availableFilter,
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.product.count).toHaveBeenCalledWith({
        where: availableFilter,
      });
    });

    it('applies search, destination, category, and price filters', async () => {
      await service.findAll({
        search: 'kandy',
        destination: 'Kandy',
        category: 'Tour',
        minPrice: 10000,
        maxPrice: 40000,
        page: 2,
        limit: 5,
      });

      const where = {
        ...availableFilter,
        destination: { contains: 'Kandy', mode: 'insensitive' },
        category: { contains: 'Tour', mode: 'insensitive' },
        price: { gte: 10000, lte: 40000 },
        OR: [
          { productName: { contains: 'kandy', mode: 'insensitive' } },
          { description: { contains: 'kandy', mode: 'insensitive' } },
          { destination: { contains: 'kandy', mode: 'insensitive' } },
          { category: { contains: 'kandy', mode: 'insensitive' } },
        ],
      };

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where,
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });

    it.each([
      ['oldest', { createdAt: 'asc' }],
      ['price_asc', { price: 'asc' }],
      ['price_desc', { price: 'desc' }],
      ['name', { productName: 'asc' }],
      ['newest', { createdAt: 'desc' }],
    ] as const)('sorts by %s', async (sort, orderBy) => {
      await service.findAll({ sort });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy }),
      );
    });

    it('computes totalPages from the matching count', async () => {
      prisma.product.count.mockResolvedValue(23);

      const result = await service.findAll({ page: 3, limit: 10 });

      expect(result.meta).toEqual({
        page: 3,
        limit: 10,
        total: 23,
        totalPages: 3,
      });
    });
  });

  describe('findOne', () => {
    it('returns a product by id', async () => {
      prisma.product.findUnique.mockResolvedValue(product);

      await expect(service.findOne('prod-1')).resolves.toEqual(product);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
      });
    });

    it('throws when the product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates a product after confirming it exists', async () => {
      prisma.product.findUnique.mockResolvedValue(product);
      prisma.product.update.mockResolvedValue({
        ...product,
        productName: 'Updated Tour',
      });

      await expect(
        service.update('prod-1', {
          productName: 'Updated Tour',
          validFrom: '2026-10-01T00:00:00.000Z',
          validUntil: '2026-11-01T00:00:00.000Z',
        }),
      ).resolves.toMatchObject({ productName: 'Updated Tour' });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          productName: 'Updated Tour',
          validFrom: new Date('2026-10-01T00:00:00.000Z'),
          validUntil: new Date('2026-11-01T00:00:00.000Z'),
        },
      });
    });

    it('rejects invalid date ranges', async () => {
      prisma.product.findUnique.mockResolvedValue(product);

      await expect(
        service.update('prod-1', {
          validFrom: '2026-11-01T00:00:00.000Z',
          validUntil: '2026-10-01T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it('throws when updating a missing product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing', { productName: 'Gone' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes an existing product', async () => {
      prisma.product.findUnique.mockResolvedValue(product);
      prisma.product.delete.mockResolvedValue(product);

      await expect(service.remove('prod-1')).resolves.toEqual({
        message: 'Product deleted successfully.',
      });
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
      });
    });

    it('throws when deleting a missing product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.product.delete).not.toHaveBeenCalled();
    });
  });
});
