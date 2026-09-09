export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface Product {
  id: string;
  productName: string;
  destination: string;
  category: string;
  description: string;
  price: string;
  currency: string;
  inventoryCount: number;
  validFrom: string;
  validUntil: string;
  status: ProductStatus;
  highlights: string[];
  inclusions: string[];
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardCategoryBreakdown {
  category: string;
  count: number;
  percent: number;
}

export interface DashboardOverviewPoint {
  month: string;
  total: number;
  active: number;
  expired: number;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  expiringSoon: number;
  expiredProducts: number;
  monthlyChangePercent: number;
  categoryBreakdown: DashboardCategoryBreakdown[];
  overview: DashboardOverviewPoint[];
}