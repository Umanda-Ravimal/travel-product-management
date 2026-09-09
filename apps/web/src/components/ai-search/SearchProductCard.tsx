import type { Product } from '../../types/product';
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '../atoms';
import {
  CalendarMonthOutlined,
  FavoriteBorderOutlined,
  Inventory2Outlined,
  LocationOnOutlined,
} from '../atoms/icons';
import { formatDate, formatPrice } from '../../utils/format';
import { getProductImage } from '../../utils/productImages';
import { ProductTitle } from '../molecules';

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
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(20, 36, 51, 0.08)',
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'relative',
          height: 190,
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
          }}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />

        {isBestMatch && (
          <Chip
            label="BEST MATCH"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 700,
              fontSize: 10,
            }}
          />
        )}

        <IconButton
          onClick={(event) => {
            event.stopPropagation();
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.92)',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          <FavoriteBorderOutlined />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <ProductTitle>{product.productName}</ProductTitle>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: 'center' }}
            >
              <LocationOnOutlined
                sx={{
                  fontSize: 15,
                  color: 'text.secondary',
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {product.destination}
              </Typography>
            </Stack>
          </Box>

          <Typography
            color="primary.main"
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 800,
            }}
          >
            {formatPrice(product)}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.5,
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
          }}
        >
          {product.description}
        </Typography>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mb: 1.5, flexWrap: 'wrap' }}
        >
          <Chip
            label={product.category}
            size="small"
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.dark',
              fontWeight: 600,
            }}
          />

          {product.tags.slice(0, 2).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'divider',
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center' }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center' }}
          >
            <Inventory2Outlined
              sx={{
                fontSize: 16,
                color: 'text.secondary',
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {product.inventoryCount} available
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center' }}
          >
            <CalendarMonthOutlined
              sx={{
                fontSize: 16,
                color: 'text.secondary',
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Until {formatDate(product.validUntil)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
