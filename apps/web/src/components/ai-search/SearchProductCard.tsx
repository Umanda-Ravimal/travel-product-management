import type { Product } from '../../types/product';
import { Box, Card, CardContent, Chip, Stack, Typography } from '../atoms';
import {
  CalendarMonthOutlined,
  Inventory2Outlined,
  LocationOnOutlined,
} from '../atoms/icons';
import { formatDate, formatPrice, getDisplayStatus } from '../../utils/format';
import { getProductImage } from '../../utils/productImages';
import { CategoryChip, ProductTitle } from '../molecules';
import ProductStatusBadge from '../products/ProductStatusBadge';

interface SearchProductCardProps {
  product: Product;
  isBestMatch: boolean;
  onClick: () => void;
}

export default function SearchProductCard({
  product,
  isBestMatch,
  onClick,
}: SearchProductCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(20, 36, 51, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 132,
          overflow: 'hidden',
          backgroundColor: '#E8EEEE',
        }}
      >
        <Box
          component="img"
          src={getProductImage(product)}
          alt={product.productName}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {isBestMatch && (
          <Chip
            label="Best match"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              height: 22,
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          p: 1.75,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 0.5 }}>
          <ProductTitle clamp={2}>{product.productName}</ProductTitle>
        </Box>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', mb: 1 }}
        >
          <LocationOnOutlined sx={{ fontSize: 15, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {product.destination}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 38,
          }}
        >
          {product.description}
        </Typography>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mb: 1.25, alignItems: 'center', flexWrap: 'wrap', rowGap: 0.75 }}
        >
          <CategoryChip category={product.category} />
          <ProductStatusBadge status={getDisplayStatus(product)} />
        </Stack>

        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#087F7B',
            }}
          >
            {formatPrice(product)}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mt: 1.1, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Inventory2Outlined sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {product.inventoryCount} available
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <CalendarMonthOutlined
              sx={{ fontSize: 14, color: 'text.secondary' }}
            />
            <Typography variant="caption" color="text.secondary">
              Until {formatDate(product.validUntil)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
