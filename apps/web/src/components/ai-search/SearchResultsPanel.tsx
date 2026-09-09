import { useMemo, useState } from 'react';

import type { Product } from '../../types/product';
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '../atoms';
import { AutoAwesome } from '../atoms/icons';
import SearchProductCard from './SearchProductCard';

type SearchSort = 'relevant' | 'newest' | 'price_asc' | 'price_desc' | 'name';

const PAGE_SIZE = 6;

interface SearchResultsPanelProps {
  query: string;
  products: Product[];
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onProductClick: (id: string) => void;
}

export default function SearchResultsPanel({
  query,
  products,
  loading,
  currentPage,
  onPageChange,
  onProductClick,
}: SearchResultsPanelProps) {
  const [sort, setSort] = useState<SearchSort>('relevant');

  const sortedProducts = useMemo(() => {
    const next = [...products];

    if (sort === 'newest') {
      next.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sort === 'price_asc') {
      next.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price_desc') {
      next.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'name') {
      next.sort((a, b) => a.productName.localeCompare(b.productName));
    }

    return next;
  }, [products, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const start = sortedProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE;
  const visible = sortedProducts.slice(start, start + PAGE_SIZE);
  const from = sortedProducts.length === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, sortedProducts.length);
  const bestMatchId = sort === 'relevant' ? products[0]?.id : undefined;

  return (
    <Box
      sx={{
        border: '1px solid #E5E9EC',
        borderRadius: 2.5,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        minHeight: '100%',
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
        <Box>
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            Showing {visible.length} of{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
              {sortedProducts.length}
            </Box>{' '}
            products
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Results for “{query}”
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
            Sort by
          </Typography>
          <FormControl size="small">
            <Select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SearchSort);
                onPageChange(1);
              }}
              sx={{
                minWidth: 150,
                height: 36,
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <MenuItem value="relevant">Most Relevant</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name">Name A-Z</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : visible.length === 0 ? (
          <Box
            sx={{
              minHeight: 240,
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
            <AutoAwesome sx={{ fontSize: 28, color: 'text.disabled', mb: 1 }} />
            <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
              No matching products
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Try a different description or adjust the filters.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {visible.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6 }}>
                <SearchProductCard
                  product={product}
                  isBestMatch={product.id === bestMatchId && page === 1}
                  onClick={() => onProductClick(product.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

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
        <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
          {from}-{to} of {sortedProducts.length} products
        </Typography>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, nextPage) => onPageChange(nextPage)}
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
