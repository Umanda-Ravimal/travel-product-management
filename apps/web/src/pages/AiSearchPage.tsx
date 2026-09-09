import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  searchProductsWithAi,
  type AiSearchResponse,
} from '../api/ai.api';
import { Alert, Box, Stack } from '../components/atoms';
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

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const handleNext = () => {
    if (searchResult && currentPage < searchResult.meta.totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const hasResults = searchResult !== null;

  return (
    <Box>
      <SearchHeader />

      <SearchQueryBox
        query={query}
        loading={loading}
        onQueryChange={setQuery}
        onSubmit={() => performSearch()}
        onExampleSelect={handleQuickSearch}
      />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {hasResults && searchResult && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <SearchFiltersPanel
            filters={searchResult.filters}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          <SearchResultsPanel
            result={searchResult}
            currentPage={currentPage}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onProductClick={(id) => navigate(`/products/${id}`)}
          />
        </Stack>
      )}

      {!hasResults && !loading && !error && <SearchIdleState />}
    </Box>
  );
}
