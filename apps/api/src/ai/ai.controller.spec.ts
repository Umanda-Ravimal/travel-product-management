import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  const aiService = {
    generateProduct: vi.fn(),
    searchProducts: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: aiService,
        },
      ],
    }).compile();

    controller = module.get(AiController);
  });

  it('generates a product from a prompt', async () => {
    const generated = { productName: 'Ella Hiking Tour' };
    aiService.generateProduct.mockResolvedValue(generated);

    const dto = { prompt: 'Create an Ella hiking tour' };
    await expect(controller.generateProduct(dto)).resolves.toEqual(generated);
    expect(aiService.generateProduct).toHaveBeenCalledWith(dto);
  });

  it('searches products from a natural-language query', async () => {
    const result = { query: 'ella hike', data: [] };
    aiService.searchProducts.mockResolvedValue(result);

    const dto = { query: 'ella hike' };
    await expect(controller.searchProducts(dto)).resolves.toEqual(result);
    expect(aiService.searchProducts).toHaveBeenCalledWith(dto);
  });
});
