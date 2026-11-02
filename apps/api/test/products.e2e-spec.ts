import request from 'supertest';
import { Test } from '@nestjs/testing';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { initApp } from './init-app';

const product = {
  id: 'prod-1',
  productName: 'Kandy Day Tour',
  destination: 'Kandy',
  category: 'Tour',
  description: 'A full day tour around Kandy city highlights.',
  price: '25000.00',
  inventoryCount: 10,
  validFrom: '2026-09-01T00:00:00.000Z',
  validUntil: '2026-12-01T00:00:00.000Z',
  status: 'ACTIVE',
  highlights: ['Temple of the Tooth'],
  inclusions: ['Transport'],
  tags: ['day-trip'],
  images: ['/images/dest-kandy.png'],
};

const createBody = {
  productName: product.productName,
  destination: product.destination,
  category: product.category,
  description: product.description,
  price: product.price,
  inventoryCount: product.inventoryCount,
  validFrom: product.validFrom,
  validUntil: product.validUntil,
  status: product.status,
  highlights: product.highlights,
  inclusions: product.inclusions,
  tags: product.tags,
  images: product.images,
};

describe('Products (e2e)', () => {
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

  let app: Awaited<ReturnType<typeof initApp>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    app = await initApp(module);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/v1/products creates a product', async () => {
    prisma.product.create.mockResolvedValue(product);

    const response = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send(createBody)
      .expect(201);

    expect(response.body.productName).toBe('Kandy Day Tour');
    expect(prisma.product.create).toHaveBeenCalled();
  });

  it('POST /api/v1/products rejects invalid dates', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        ...createBody,
        validFrom: '2026-12-01T00:00:00.000Z',
        validUntil: '2026-09-01T00:00:00.000Z',
      })
      .expect(400);

    expect(prisma.product.create).not.toHaveBeenCalled();
  });

  it('POST /api/v1/products rejects incomplete payloads', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({ productName: 'Too short payload' })
      .expect(400);
  });

  it('GET /api/v1/products lists available products', async () => {
    prisma.product.findMany.mockResolvedValue([product]);
    prisma.product.count.mockResolvedValue(1);

    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .query({ destination: 'Kandy', page: 1, limit: 10 })
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ACTIVE',
          inventoryCount: { gt: 0 },
        }),
      }),
    );
  });

  it('GET /api/v1/products/:id returns a product', async () => {
    prisma.product.findUnique.mockResolvedValue(product);

    const response = await request(app.getHttpServer())
      .get('/api/v1/products/prod-1')
      .expect(200);

    expect(response.body.id).toBe('prod-1');
  });

  it('GET /api/v1/products/:id returns 404 when missing', async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    await request(app.getHttpServer())
      .get('/api/v1/products/missing')
      .expect(404);
  });

  it('PATCH /api/v1/products/:id updates a product', async () => {
    prisma.product.findUnique.mockResolvedValue(product);
    prisma.product.update.mockResolvedValue({
      ...product,
      productName: 'Updated Tour',
    });

    const response = await request(app.getHttpServer())
      .patch('/api/v1/products/prod-1')
      .send({ productName: 'Updated Tour' })
      .expect(200);

    expect(response.body.productName).toBe('Updated Tour');
  });

  it('DELETE /api/v1/products/:id deletes a product', async () => {
    prisma.product.findUnique.mockResolvedValue(product);
    prisma.product.delete.mockResolvedValue(product);

    const response = await request(app.getHttpServer())
      .delete('/api/v1/products/prod-1')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Product deleted successfully.',
    });
  });

  it('DELETE /api/v1/products/:id returns 404 when missing', async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    await request(app.getHttpServer())
      .delete('/api/v1/products/missing')
      .expect(404);
  });
});
