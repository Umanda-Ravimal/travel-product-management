import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  const dashboardService = {
    getSummary: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: dashboardService,
        },
      ],
    }).compile();

    controller = module.get(DashboardController);
  });

  it('returns the dashboard summary', async () => {
    const summary = { totalProducts: 3, activeProducts: 2 };
    dashboardService.getSummary.mockResolvedValue(summary);

    await expect(controller.getSummary()).resolves.toEqual(summary);
    expect(dashboardService.getSummary).toHaveBeenCalledOnce();
  });
});
