import { Link } from 'react-router-dom';

import type { Product, ProductListResponse } from '../../types/product';
import { formatDate, formatPrice, getDisplayStatus } from '../../utils/format';
import { getProductImage } from '../../utils/productImages';
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '../atoms';
import {
  DeleteOutlineOutlined,
  EditOutlined,
  VisibilityOutlined,
} from '../atoms/icons';
import { CategoryChip, ProductTitle } from '../molecules';
import ProductStatusBadge from './ProductStatusBadge';

export type ProductSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name';

interface ProductsTableProps {
  result: ProductListResponse;
  loading: boolean;
  page: number;
  rowsPerPage: number;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onDelete: (product: Product) => void;
}

const headerCellSx = {
  color: 'text.secondary',
  fontSize: '0.78rem',
  fontWeight: 700,
  borderBottom: '1px solid #E5E9EC',
  py: 1.5,
  backgroundColor: '#FFFFFF',
};

export default function ProductsTable({
  result,
  loading,
  page,
  rowsPerPage,
  sort,
  onSortChange,
  onPageChange,
  onRowsPerPageChange,
  onDelete,
}: ProductsTableProps) {
  const { data, meta } = result;
  const from = meta.total === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, meta.total);

  return (
    <Box
      sx={{
        border: '1px solid #E5E9EC',
        borderRadius: 2.5,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
          Showing {data.length} of{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
            {meta.total}
          </Box>{' '}
          products
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
            Sort by
          </Typography>
          <FormControl size="small">
            <Select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as ProductSort)}
              sx={{
                minWidth: 150,
                height: 36,
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name">Name A-Z</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1080 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellSx, pl: 2.5 }}>Product</TableCell>
              <TableCell sx={headerCellSx}>Destination</TableCell>
              <TableCell sx={headerCellSx}>Category</TableCell>
              <TableCell sx={headerCellSx}>Price</TableCell>
              <TableCell sx={headerCellSx}>Inventory</TableCell>
              <TableCell sx={headerCellSx}>Validity</TableCell>
              <TableCell sx={headerCellSx}>Status</TableCell>
              <TableCell align="right" sx={{ ...headerCellSx, pr: 2.5 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ fontWeight: 700 }}>No products found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Try changing your filters or create a new product.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '& td': { borderColor: '#EEF2F3', py: 1.6 },
                  }}
                >
                  <TableCell sx={{ pl: 2.5 }}>
                    <Stack direction="row" spacing={1.4} sx={{ alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={getProductImage(product)}
                        alt=""
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <ProductTitle>{product.productName}</ProductTitle>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.25,
                            maxWidth: 240,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {product.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontSize: '0.84rem' }}>
                      {product.destination}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <CategoryChip category={product.category} />
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontSize: '0.84rem', fontWeight: 700 }}>
                      {formatPrice(product)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: '0.84rem',
                        fontWeight: product.inventoryCount <= 5 ? 700 : 500,
                        color:
                          product.inventoryCount <= 5 ? 'warning.dark' : 'text.primary',
                      }}
                    >
                      {product.inventoryCount} available
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {formatDate(product.validFrom)} - {formatDate(product.validUntil)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <ProductStatusBadge status={getDisplayStatus(product)} />
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 1.5 }}>
                    <Stack direction="row" spacing={0.2} sx={{ justifyContent: 'flex-end' }}>
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
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Delete product"
                        sx={{ color: '#EF4444' }}
                        onClick={() => onDelete(product)}
                      >
                        <DeleteOutlineOutlined fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          borderTop: '1px solid #E5E9EC',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
            Rows per page:
          </Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
              sx={{ height: 34, fontSize: '0.82rem', minWidth: 64 }}
            >
              {[5, 10, 25].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
            {from}-{to} of {meta.total} products
          </Typography>
        </Stack>

        <Pagination
          count={Math.max(meta.totalPages, 1)}
          page={page + 1}
          onChange={(_, nextPage) => onPageChange(nextPage - 1)}
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            '& .MuiPaginationItem-root': {
              minWidth: 32,
              height: 32,
              fontWeight: 700,
              fontSize: '0.8rem',
            },
            '& .Mui-selected': {
              backgroundColor: 'primary.main !important',
              color: '#FFFFFF',
            },
          }}
        />
      </Box>
    </Box>
  );
}
