import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const EXPIRING_SOON_DAYS = 30;
const OVERVIEW_MONTHS = 6;

type ProductSnapshot = {
  category: string;
  status: string;
  inventoryCount: number;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const expiringUntil = new Date(now);
    expiringUntil.setDate(expiringUntil.getDate() + EXPIRING_SOON_DAYS);

    const products = await this.prisma.product.findMany({
      select: {
        category: true,
        status: true,
        inventoryCount: true,
        validFrom: true,
        validUntil: true,
        createdAt: true,
      },
    });

    const totalProducts = products.length;
    const activeProducts = products.filter((product) =>
      this.isActiveAt(product, now),
    ).length;
    const expiredProducts = products.filter(
      (product) => product.validUntil < now,
    ).length;
    const expiringSoon = products.filter(
      (product) =>
        this.isActiveAt(product, now) && product.validUntil <= expiringUntil,
    ).length;

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousTotal = products.filter(
      (product) => product.createdAt < monthStart,
    ).length;
    const monthlyChangePercent =
      previousTotal === 0
        ? totalProducts > 0
          ? 100
          : 0
        : Math.round(((totalProducts - previousTotal) / previousTotal) * 100);

    return {
      totalProducts,
      activeProducts,
      expiringSoon,
      expiredProducts,
      monthlyChangePercent,
      categoryBreakdown: this.buildCategoryBreakdown(products, totalProducts),
      overview: this.buildOverview(products, now),
    };
  }

  private isActiveAt(product: ProductSnapshot, at: Date) {
    return (
      product.status === 'ACTIVE' &&
      product.inventoryCount > 0 &&
      product.createdAt <= at &&
      product.validFrom <= at &&
      product.validUntil >= at
    );
  }

  private buildCategoryBreakdown(
    products: ProductSnapshot[],
    totalProducts: number,
  ) {
    const counts = new Map<string, number>();

    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }

    return [...counts.entries()]
      .map(([category, count]) => ({
        category,
        count,
        percent:
          totalProducts === 0 ? 0 : Math.round((count / totalProducts) * 100),
      }))
      .sort((left, right) => right.count - left.count);
  }

  private buildOverview(products: ProductSnapshot[], now: Date) {
    return Array.from({ length: OVERVIEW_MONTHS }, (_, index) => {
      const offset = OVERVIEW_MONTHS - 1 - index;
      const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      const at = offset === 0 ? now : monthEnd;

      return {
        month: monthDate.toLocaleString('en-US', { month: 'short' }),
        total: products.filter((product) => product.createdAt <= at).length,
        active: products.filter((product) => this.isActiveAt(product, at))
          .length,
        expired: products.filter(
          (product) => product.createdAt <= at && product.validUntil < at,
        ).length,
      };
    });
  }
}
