import { useNavigate } from 'react-router-dom';

import { Box, Card, CardContent, Grid, Typography } from '../atoms';
import type { Product } from '../../types/product';
import { formatPrice, getDisplayStatus } from '../../utils/format';
import { getProductImage } from '../../utils/productImages';
import ProductStatusBadge from './ProductStatusBadge';
import { ProductTitle } from '../molecules';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <EmptyTab
        title="Related Products"
        message="No related products are available for this destination."
      />
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            onClick={() => navigate(`/products/${product.id}`)}
            sx={{
              height: '100%',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(20, 36, 51, 0.08)',
              },
            }}
          >
            <Box
              component="img"
              src={getProductImage(product)}
              alt={product.productName}
              sx={{
                width: '100%',
                height: 132,
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <CardContent sx={{ p: 1.75 }}>
              <Box sx={{ mb: 0.5 }}>
                <ProductTitle clamp={2}>{product.productName}</ProductTitle>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {product.destination}
              </Typography>

              <Box
                sx={{
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

                <ProductStatusBadge status={getDisplayStatus(product)} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function EmptyTab({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Box
      sx={{
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: '1px dashed #D8E0E3',
        borderRadius: 2,
        backgroundColor: '#F8FAFA',
        px: 2,
      }}
    >
      <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{title}</Typography>
      <Typography color="text.secondary" variant="body2">
        {message}
      </Typography>
    </Box>
  );
}
