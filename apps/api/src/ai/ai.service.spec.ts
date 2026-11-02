import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ProductsService } from '../products/products.service';

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock('openai', () => ({
  default: class OpenAI {
    responses = { create: mockCreate };
  },
}));

const generatedProduct = {
  productName: 'Ella Hiking Tour',
  destination: 'Ella',
  category: 'Tour',
  description: 'A guided hike through Ella’s tea country trails.',
  highlights: ['Nine Arches Bridge'],
  inclusions: ['Guide'],
  tags: ['hiking'],
  validFrom: '2026-09-10T00:00:00.000Z',
  validUntil: '2026-09-20T00:00:00.000Z',
};

const searchFilters = {
  search: 'ella hike',
  destination: 'Ella',
  category: 'Tour',
  minPrice: 10000,
  maxPrice: 40000,
};

describe('AiService', () => {
  async function createService(config: Record<string, string | undefined> = {
    OPENAI_API_KEY: 'test-key',
    OPENAI_MODEL: 'gpt-5.6-luna',
  }) {
    const productsService = {
      findAll: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => config[key]),
          },
        },
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    }).compile();

    return {
      service: module.get(AiService),
      productsService,
    };
  }

  beforeEach(() => {
    mockCreate.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when OPENAI_API_KEY is missing', async () => {
    const module = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue(undefined) },
        },
        {
          provide: ProductsService,
          useValue: { findAll: vi.fn() },
        },
      ],
    }).compile();

    expect(() => module.get(AiService)).toThrow(InternalServerErrorException);
  });

  it('uses the default model when OPENAI_MODEL is unset', async () => {
    mockCreate.mockResolvedValue({
      output_text: JSON.stringify(generatedProduct),
    });

    const { service } = await createService({ OPENAI_API_KEY: 'test-key' });
    await service.generateProduct({ prompt: 'Create an Ella hiking tour' });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-5.6-luna' }),
    );
  });

  describe('generateProduct', () => {
    it('returns a parsed product from OpenAI', async () => {
      mockCreate.mockResolvedValue({
        output_text: JSON.stringify(generatedProduct),
      });

      const { service } = await createService();

      await expect(
        service.generateProduct({ prompt: 'Create an Ella hiking tour' }),
      ).resolves.toEqual(generatedProduct);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-5.6-luna',
          input: 'Create an Ella hiking tour',
        }),
      );
    });

    it('rejects an empty OpenAI response', async () => {
      mockCreate.mockResolvedValue({ output_text: '' });
      const { service } = await createService();

      await expect(
        service.generateProduct({ prompt: 'Create an Ella hiking tour' }),
      ).rejects.toThrow('OpenAI returned an empty response.');
    });

    it('rejects invalid JSON from OpenAI', async () => {
      mockCreate.mockResolvedValue({ output_text: 'not-json' });
      const { service } = await createService();

      await expect(
        service.generateProduct({ prompt: 'Create an Ella hiking tour' }),
      ).rejects.toThrow('OpenAI returned an invalid product response.');
    });

    it('wraps unexpected OpenAI errors', async () => {
      mockCreate.mockRejectedValue(new Error('network down'));
      const { service } = await createService();

      await expect(
        service.generateProduct({ prompt: 'Create an Ella hiking tour' }),
      ).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('searchProducts', () => {
    it('parses the query and searches available products', async () => {
      mockCreate.mockResolvedValue({
        output_text: JSON.stringify(searchFilters),
      });
      const { service, productsService } = await createService();
      productsService.findAll.mockResolvedValue({
        data: [{ id: 'prod-1' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });

      await expect(
        service.searchProducts({ query: 'ella hiking under 40000' }),
      ).resolves.toEqual({
        query: 'ella hiking under 40000',
        filters: searchFilters,
        data: [{ id: 'prod-1' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });

      expect(productsService.findAll).toHaveBeenCalledWith({
        search: 'ella hike',
        destination: 'Ella',
        category: 'Tour',
        minPrice: 10000,
        maxPrice: 40000,
      });
    });

    it('passes undefined for null parsed filters', async () => {
      mockCreate.mockResolvedValue({
        output_text: JSON.stringify({
          search: null,
          destination: null,
          category: null,
          minPrice: null,
          maxPrice: null,
        }),
      });
      const { service, productsService } = await createService();
      productsService.findAll.mockResolvedValue({ data: [], meta: {} });

      await service.searchProducts({ query: 'show me trips' });

      expect(productsService.findAll).toHaveBeenCalledWith({
        search: undefined,
        destination: undefined,
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      });
    });

    it('rejects an empty search response', async () => {
      mockCreate.mockResolvedValue({ output_text: '' });
      const { service } = await createService();

      await expect(
        service.searchProducts({ query: 'ella hiking' }),
      ).rejects.toThrow('OpenAI returned an empty search response.');
    });

    it('rejects invalid search JSON', async () => {
      mockCreate.mockResolvedValue({ output_text: '{bad' });
      const { service } = await createService();

      await expect(
        service.searchProducts({ query: 'ella hiking' }),
      ).rejects.toThrow('OpenAI returned an invalid search response.');
    });

    it('wraps unexpected search errors', async () => {
      mockCreate.mockRejectedValue(new Error('timeout'));
      const { service } = await createService();

      await expect(
        service.searchProducts({ query: 'ella hiking' }),
      ).rejects.toThrow('Failed to process AI search query.');
    });
  });
});
