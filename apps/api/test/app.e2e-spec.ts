import request from 'supertest';
import { Test } from '@nestjs/testing';
import { DashboardController } from '../src/dashboard/dashboard.controller';
import { DashboardService } from '../src/dashboard/dashboard.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { initApp } from './init-app';

describe('Dashboard (e2e)', () => {
  const findMany = vi.fn();
  let app: Awaited<ReturnType<typeof initApp>>;

  beforeEach(async () => {
    findMany.mockReset();

    const module = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            product: { findMany },
          },
        },
      ],
    }).compile();

    app = await initApp(module);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/dashboard returns summary metrics', async () => {
    const now = new Date();
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);

    findMany.mockResolvedValue([
      {
        category: 'Tour',
        status: 'ACTIVE',
        inventoryCount: 4,
        validFrom: lastYear,
        validUntil: nextYear,
        createdAt: lastYear,
      },
    ]);

    const response = await request(app.getHttpServer())
      .get('/api/v1/dashboard')
      .expect(200);

    expect(response.body).toMatchObject({
      totalProducts: 1,
      activeProducts: 1,
      expiredProducts: 0,
    });
    expect(response.body.categoryBreakdown).toEqual([
      { category: 'Tour', count: 1, percent: 100 },
    ]);
  });
});
