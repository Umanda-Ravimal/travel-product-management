import type { AiSearchResponse } from '../../api/ai.api';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '../atoms';
import {
  ArrowForwardOutlined,
  AutoAwesome,
  ChevronLeft,
  ChevronRight,
} from '../atoms/icons';
import SearchProductCard from './SearchProductCard';

interface SearchResultsPanelProps {
  result: AiSearchResponse;
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
  onProductClick: (id: string) => void;
}

export default function SearchResultsPanel({
  result,
  currentPage,
  onPrevious,
  onNext,
  onProductClick,
}: SearchResultsPanelProps) {
  const start =
    result.meta.total > 0
      ? Math.min(
          (currentPage - 1) * result.meta.limit + 1,
          result.meta.total,
        )
      : 0;

  const end = Math.min(
    currentPage * result.meta.limit,
    result.meta.total,
  );

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          mb: 2.5,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            {result.meta.total} products found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Results for "{result.query}"
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowForwardOutlined />}
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          Most Relevant
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 2.5,
        }}
      >
        {result.data.map((product, index) => (
          <SearchProductCard
            key={product.id}
            product={product}
            isBestMatch={index === 0}
            onClick={() => onProductClick(product.id)}
          />
        ))}
      </Box>

      {result.data.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2.5,
          }}
        >
          <AutoAwesome
            sx={{
              fontSize: 42,
              color: 'text.disabled',
              mb: 1,
            }}
          />

          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontWeight: 700 }}
          >
            No matching products
          </Typography>

          <Typography color="text.secondary">
            Try describing your search in a different way.
          </Typography>
        </Paper>
      )}

      {result.meta.totalPages > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={onPrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </IconButton>

          <Typography
            variant="body2"
            sx={{ px: 2, fontWeight: 600 }}
          >
            Page {currentPage} of {result.meta.totalPages}
          </Typography>

          <IconButton
            onClick={onNext}
            disabled={currentPage === result.meta.totalPages}
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 1,
        }}
      >
        {result.meta.total > 0
          ? `Showing ${start}–${end} of ${result.meta.total} results`
          : 'No results'}
      </Typography>
    </Box>
  );
}
