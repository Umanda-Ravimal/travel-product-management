import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getSummary() {
    const now = new Date();

    const [
      totalProducts,
      activeProducts,
      expiredProducts,
    ] = await Promise.all([
      this.prisma.product.count(),

      this.prisma.product.count({
        where: {
          status: 'ACTIVE',
          inventoryCount: {
            gt: 0,
          },
          validFrom: {
            lte: now,
          },
          validUntil: {
            gte: now,
          },
        },
      }),

      this.prisma.product.count({
        where: {
          validUntil: {
            lt: now,
          },
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      expiredProducts,
    };
  }
}