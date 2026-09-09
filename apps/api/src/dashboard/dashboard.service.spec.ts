import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  const findMany = jest.fn();

  beforeEach(async () => {
    findMany.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany,
            },
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('summarizes product metrics, categories, and monthly overview', async () => {
    const now = new Date();
    const inTenDays = new Date(now);
    inTenDays.setDate(now.getDate() + 10);
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);

    findMany.mockResolvedValue([
      {
        category: 'Dining',
        status: 'ACTIVE',
        inventoryCount: 12,
        validFrom: lastYear,
        validUntil: inTenDays,
        createdAt: lastYear,
      },
      {
        category: 'Tour',
        status: 'ACTIVE',
        inventoryCount: 4,
        validFrom: lastYear,
        validUntil: new Date(now.getFullYear() + 1, 0, 1),
        createdAt: lastYear,
      },
      {
        category: 'Dining',
        status: 'ACTIVE',
        inventoryCount: 2,
        validFrom: lastYear,
        validUntil: lastYear,
        createdAt: lastYear,
      },
    ]);

    const summary = await service.getSummary();

    expect(summary.totalProducts).toBe(3);
    expect(summary.activeProducts).toBe(2);
    expect(summary.expiringSoon).toBe(1);
    expect(summary.expiredProducts).toBe(1);
    expect(summary.categoryBreakdown).toEqual([
      { category: 'Dining', count: 2, percent: 67 },
      { category: 'Tour', count: 1, percent: 33 },
    ]);
    expect(summary.overview).toHaveLength(6);
    expect(summary.overview.every((point) => point.total === 3)).toBe(true);
    expect(summary.overview.at(-1)).toMatchObject({
      total: 3,
      active: 2,
      expired: 1,
    });
  });
});
