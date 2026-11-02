import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductStatus } from './dto/create-product.dto';

const dto = {
  productName: 'Kandy Day Tour',
  destination: 'Kandy',
  category: 'Tour',
  description: 'A full day tour around Kandy city highlights.',
  price: '25000.00',
  inventoryCount: 10,
  validFrom: '2026-09-01T00:00:00.000Z',
  validUntil: '2026-12-01T00:00:00.000Z',
  status: ProductStatus.ACTIVE,
};

describe('ProductsController', () => {
  let controller: ProductsController;
  const productsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    }).compile();

    controller = module.get(ProductsController);
  });

  it('creates a product', async () => {
    productsService.create.mockResolvedValue({ id: 'prod-1', ...dto });

    await expect(controller.create(dto)).resolves.toMatchObject({
      id: 'prod-1',
    });
    expect(productsService.create).toHaveBeenCalledWith(dto);
  });

  it('lists products with query filters', async () => {
    const query = { destination: 'Kandy', page: 1 };
    productsService.findAll.mockResolvedValue({ data: [], meta: {} });

    await controller.findAll(query);

    expect(productsService.findAll).toHaveBeenCalledWith(query);
  });

  it('gets a product by id', async () => {
    productsService.findOne.mockResolvedValue({ id: 'prod-1' });

    await expect(controller.findOne('prod-1')).resolves.toEqual({
      id: 'prod-1',
    });
    expect(productsService.findOne).toHaveBeenCalledWith('prod-1');
  });

  it('updates a product', async () => {
    productsService.update.mockResolvedValue({ id: 'prod-1', productName: 'New' });

    await controller.update('prod-1', { productName: 'New' });

    expect(productsService.update).toHaveBeenCalledWith('prod-1', {
      productName: 'New',
    });
  });

  it('removes a product', async () => {
    productsService.remove.mockResolvedValue({
      message: 'Product deleted successfully.',
    });

    await expect(controller.remove('prod-1')).resolves.toEqual({
      message: 'Product deleted successfully.',
    });
    expect(productsService.remove).toHaveBeenCalledWith('prod-1');
  });
});
