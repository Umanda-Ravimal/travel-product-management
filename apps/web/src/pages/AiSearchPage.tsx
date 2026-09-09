import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  searchProductsWithAi,
  type AiSearchResponse,
} from '../api/ai.api';
import { Alert, Box, CircularProgress, Grid, Stack } from '../components/atoms';
import SearchFiltersPanel, {
  MAX_PRICE,
  MIN_PRICE,
  type PriceRange,
} from '../components/ai-search/SearchFiltersPanel';
import SearchHeader from '../components/ai-search/SearchHeader';
import SearchIdleState from '../components/ai-search/SearchIdleState';
import SearchQueryBox from '../components/ai-search/SearchQueryBox';
import SearchResultsPanel from '../components/ai-search/SearchResultsPanel';

export default function AiSearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] =
    useState<AiSearchResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [priceRange, setPriceRange] = useState<PriceRange>([
    MIN_PRICE,
    MAX_PRICE,
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  const visibleProducts = useMemo(() => {
    if (!searchResult) {
      return [];
    }

    return searchResult.data.filter((product) => {
      const price = Number(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
  }, [searchResult, priceRange]);

  const performSearch = async (searchQuery = query) => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    setLoading(true);
    setError('');
    setCurrentPage(1);

    try {
      const result = await searchProductsWithAi(trimmedQuery);

      setSearchResult(result);
      setPriceRange([
        result.filters.minPrice ?? MIN_PRICE,
        result.filters.maxPrice ?? MAX_PRICE,
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while searching.',
      );
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  const handlePriceRangeChange = (value: PriceRange) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const hasResults = searchResult !== null;

  return (
    <Stack spacing={2.5}>
      <SearchHeader />

      <SearchQueryBox
        query={query}
        loading={loading}
        onQueryChange={setQuery}
        onSubmit={() => performSearch()}
        onExampleSelect={handleQuickSearch}
      />

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {hasResults && searchResult ? (
        <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <SearchFiltersPanel
              filters={searchResult.filters}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <SearchResultsPanel
              query={searchResult.query}
              products={visibleProducts}
              loading={loading}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onProductClick={(id) => navigate(`/products/${id}`)}
            />
          </Grid>
        </Grid>
      ) : loading ? (
        <Box
          sx={{
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        !error && <SearchIdleState />
      )}
    </Stack>
  );
}
