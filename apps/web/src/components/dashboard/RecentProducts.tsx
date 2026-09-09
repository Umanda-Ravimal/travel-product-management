import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '../atoms';
import { ArrowForwardOutlined, MoreVert, VisibilityOutlined } from '../atoms/icons';
import type { Product } from '../../types/product';
import { formatDate, formatPrice, getDisplayStatus } from '../../utils/format';
import { getProductImage } from '../../utils/productImages';
import ProductStatusBadge from '../products/ProductStatusBadge';
import { ProductTitle } from '../molecules';

interface RecentProductsProps {
  products: Product[];
}

export default function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: 2.5,
            pt: 2.5,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="h3">Recent Products</Typography>

          <Button
            component={Link}
            to="/products"
            endIcon={<ArrowForwardOutlined />}
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            View All Products
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 780 }}>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    backgroundColor: '#F7F9FA',
                    color: 'text.secondary',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #E5E9EC',
                    py: 1.2,
                  },
                }}
              >
                <TableCell sx={{ pl: 2.5 }}>Product Name</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Inventory</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell align="right" sx={{ pr: 2.5 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      No products available yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ pl: 2.5 }}>
                      <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={getProductImage(product)}
                          alt=""
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                        <ProductTitle>{product.productName}</ProductTitle>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem' }}>
                        {product.destination}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem' }}>
                        {product.category}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>
                        {formatPrice(product)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem' }}>
                        {product.inventoryCount}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <ProductStatusBadge status={getDisplayStatus(product)} />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem' }}>
                        {formatDate(product.validUntil)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 2 }}>
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/products/${product.id}`}
                        title="View product"
                      >
                        <VisibilityOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/products/${product.id}/edit`}
                        title="Edit product"
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
