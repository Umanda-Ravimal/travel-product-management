import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AiController } from '../src/ai/ai.controller';
import { AiService } from '../src/ai/ai.service';
import { initApp } from './init-app';

describe('AI (e2e)', () => {
  const aiService = {
    generateProduct: vi.fn(),
    searchProducts: vi.fn(),
  };

  let app: Awaited<ReturnType<typeof initApp>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: aiService }],
    }).compile();

    app = await initApp(module);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/v1/ai/products/generate returns a generated product', async () => {
    const generated = {
      productName: 'Ella Hiking Tour',
      destination: 'Ella',
      category: 'Tour',
      description: 'A guided hike through Ella tea country.',
      highlights: ['Nine Arches Bridge'],
      inclusions: ['Guide'],
      tags: ['hiking'],
      validFrom: '2026-09-10T00:00:00.000Z',
      validUntil: '2026-09-20T00:00:00.000Z',
    };
    aiService.generateProduct.mockResolvedValue(generated);

    const response = await request(app.getHttpServer())
      .post('/api/v1/ai/products/generate')
      .send({ prompt: 'Create an Ella hiking tour for next week' })
      .expect(201);

    expect(response.body).toEqual(generated);
    expect(aiService.generateProduct).toHaveBeenCalledWith({
      prompt: 'Create an Ella hiking tour for next week',
    });
  });

  it('POST /api/v1/ai/products/generate rejects a short prompt', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/ai/products/generate')
      .send({ prompt: 'too short' })
      .expect(400);

    expect(aiService.generateProduct).not.toHaveBeenCalled();
  });

  it('POST /api/v1/ai/products/search returns matching products', async () => {
    const result = {
      query: 'ella hiking under 40000',
      filters: { destination: 'Ella', maxPrice: 40000 },
      data: [{ id: 'prod-1' }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    aiService.searchProducts.mockResolvedValue(result);

    const response = await request(app.getHttpServer())
      .post('/api/v1/ai/products/search')
      .send({ query: 'ella hiking under 40000' })
      .expect(201);

    expect(response.body).toEqual(result);
    expect(aiService.searchProducts).toHaveBeenCalledWith({
      query: 'ella hiking under 40000',
    });
  });

  it('POST /api/v1/ai/products/search rejects a short query', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/ai/products/search')
      .send({ query: 'ab' })
      .expect(400);

    expect(aiService.searchProducts).not.toHaveBeenCalled();
  });
});
