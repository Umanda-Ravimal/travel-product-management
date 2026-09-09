import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Stack,
} from '../components/atoms';
import {
  AccessTimeOutlined,
  CheckCircleOutlineOutlined,
  Inventory2Outlined,
  WarningAmberOutlined,
} from '../components/atoms/icons';
import { getDashboardStats } from '../api/dashboard.api';
import { getProducts } from '../api/products.api';
import type { DashboardStats, Product } from '../types/product';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import MetricCard from '../components/dashboard/MetricCard';
import ProductsOverviewChart from '../components/dashboard/ProductsOverviewChart';
import QuickActions from '../components/dashboard/QuickActions';
import RecentProducts from '../components/dashboard/RecentProducts';
import WelcomeHero from '../components/dashboard/WelcomeHero';

const emptyStats: DashboardStats = {
  totalProducts: 0,
  activeProducts: 0,
  expiringSoon: 0,
  expiredProducts: 0,
  monthlyChangePercent: 0,
  categoryBreakdown: [],
  overview: [],
};

function percentOf(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function trendCaption(change: number) {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change}% from last month`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const [dashboard, productResponse] = await Promise.all([
          getDashboardStats(),
          getProducts({ page: 1, limit: 5 }),
        ]);

        setStats({
          ...emptyStats,
          ...dashboard,
          categoryBreakdown: dashboard.categoryBreakdown ?? [],
          overview: dashboard.overview ?? [],
        });
        setProducts(productResponse.data);
      } catch (err) {
        console.error(err);
        setError(
          'Unable to load dashboard data. Please make sure the API is running.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const total = stats.totalProducts;
  const activeShare = percentOf(stats.activeProducts, total);
  const expiringShare = percentOf(stats.expiringSoon, total);
  const expiredShare = percentOf(stats.expiredProducts, total);
  const trendUp = stats.monthlyChangePercent >= 0;

  return (
    <Stack spacing={3}>
      <WelcomeHero />

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Products"
            value={stats.totalProducts}
            caption={trendCaption(stats.monthlyChangePercent)}
            captionColor={trendUp ? '#059669' : '#DC2626'}
            icon={<Inventory2Outlined />}
            iconBg="#E4F6F4"
            iconColor="#0F766E"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Active Products"
            value={stats.activeProducts}
            caption={`${activeShare}% of total`}
            progress={activeShare}
            progressColor="#10B981"
            icon={<CheckCircleOutlineOutlined />}
            iconBg="#E4F8EF"
            iconColor="#10A86B"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            caption={`${expiringShare}% of total`}
            progress={expiringShare}
            progressColor="#F59E0B"
            icon={<AccessTimeOutlined />}
            iconBg="#FFF4E0"
            iconColor="#D97706"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Expired Products"
            value={stats.expiredProducts}
            caption={`${expiredShare}% of total`}
            progress={expiredShare}
            progressColor="#EF4444"
            icon={<WarningAmberOutlined />}
            iconBg="#FDE9E7"
            iconColor="#EF4444"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ProductsOverviewChart data={stats.overview} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <CategoryDonutChart
            total={stats.totalProducts}
            categories={stats.categoryBreakdown}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <RecentProducts products={products} />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <QuickActions />
        </Grid>
      </Grid>
    </Stack>
  );
}
