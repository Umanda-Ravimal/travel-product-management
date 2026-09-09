import type { ReactNode } from 'react';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '../atoms';
import {
  CalendarMonthOutlined,
  CategoryOutlined,
  Inventory2Outlined,
  LayersOutlined,
  LocationOnOutlined,
  SellOutlined,
} from '../atoms/icons';
import type { Product } from '../../types/product';
import { formatDate, formatPrice, getDisplayStatus } from '../../utils/format';
import ProductStatusBadge from './ProductStatusBadge';

interface ProductKeyInformationProps {
  product: Product;
}

export default function ProductKeyInformation({
  product,
}: ProductKeyInformationProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <SectionTitle icon={<LayersOutlined />} title="Key Information" />

        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 6, md: 4 }}>
            <InfoItem icon={<CategoryOutlined />} label="Category">
              <Chip
                label={product.category}
                size="small"
                sx={{
                  mt: 0.7,
                  height: 26,
                  backgroundColor: '#E2F5F1',
                  color: '#087F7B',
                  fontWeight: 700,
                }}
              />
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <InfoItem icon={<LocationOnOutlined />} label="Destination">
              <Typography sx={{ fontWeight: 700, mt: 0.7, fontSize: '0.9rem' }}>
                {product.destination}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <InfoItem icon={<SellOutlined />} label="Price">
              <Typography
                sx={{
                  fontWeight: 800,
                  mt: 0.5,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.03em',
                  color: '#087F7B',
                }}
              >
                {formatPrice(product)}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <InfoItem icon={<Inventory2Outlined />} label="Inventory">
              <Typography sx={{ fontWeight: 700, mt: 0.7, fontSize: '0.9rem' }}>
                {product.inventoryCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                available
              </Typography>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <InfoItem icon={<CalendarMonthOutlined />} label="Valid From">
              <Typography sx={{ fontWeight: 700, mt: 0.7, fontSize: '0.9rem' }}>
                {formatDate(product.validFrom)}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <InfoItem icon={<CalendarMonthOutlined />} label="Valid Until">
              <Typography sx={{ fontWeight: 700, mt: 0.7, fontSize: '0.9rem' }}>
                {formatDate(product.validUntil)}
              </Typography>
            </InfoItem>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2.5 }}>
          <SectionTitle icon={<LayersOutlined />} title="Short Description" />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1.2,
              lineHeight: 1.8,
            }}
          >
            {product.description}
          </Typography>
        </Box>

        <Box sx={{ mt: 2.25 }}>
          <ProductStatusBadge status={getDisplayStatus(product)} />
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E4F6F4',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontWeight: 800,
          fontSize: '1rem',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: 96,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: '#F8FAFA',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ color: '#087F7B', display: 'flex' }}>{icon}</Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
      </Stack>

      {children}
    </Box>
  );
}
