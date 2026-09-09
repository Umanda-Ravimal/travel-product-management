import type { AiSearchFilters } from '../../api/ai.api';
import {
  Card,
  CardContent,
  Divider,
  Slider,
  Stack,
  Typography,
} from '../atoms';
import { TuneOutlined } from '../atoms/icons';
import { CategoryChip } from '../molecules';

export const MIN_PRICE = 0;
export const MAX_PRICE = 50000;

export type PriceRange = [number, number];

interface SearchFiltersPanelProps {
  filters: AiSearchFilters;
  priceRange: PriceRange;
  onPriceRangeChange: (value: PriceRange) => void;
}

export default function SearchFiltersPanel({
  filters,
  priceRange,
  onPriceRangeChange,
}: SearchFiltersPanelProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2.2, alignItems: 'center' }}
        >
          <TuneOutlined sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h3">Refine Results</Typography>
        </Stack>

        <Typography
          sx={{
            mb: 1,
            color: 'text.secondary',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Category
        </Typography>

        {filters.category ? (
          <CategoryChip category={filters.category} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            All categories
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            mb: 1,
            color: 'text.secondary',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Destination
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: filters.destination ? 700 : 400 }}>
          {filters.destination || 'All destinations'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            mb: 1,
            color: 'text.secondary',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Price Range
        </Typography>

        <Slider
          value={priceRange}
          onChange={(_, value) => {
            if (Array.isArray(value)) {
              onPriceRangeChange(value as PriceRange);
            }
          }}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={1000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `LKR ${value.toLocaleString()}`}
          sx={{ mt: 1, mb: 0.5 }}
        />

        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            LKR {priceRange[0].toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            LKR {priceRange[1].toLocaleString()}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            mb: 1,
            color: 'text.secondary',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          AI Detected Filters
        </Typography>

        <Stack spacing={0.75}>
          {filters.minPrice !== null && (
            <Typography variant="caption" color="text.secondary">
              Minimum price:{' '}
              <strong>LKR {filters.minPrice.toLocaleString()}</strong>
            </Typography>
          )}

          {filters.maxPrice !== null && (
            <Typography variant="caption" color="text.secondary">
              Maximum price:{' '}
              <strong>LKR {filters.maxPrice.toLocaleString()}</strong>
            </Typography>
          )}

          {filters.minPrice === null && filters.maxPrice === null && (
            <Typography variant="caption" color="text.secondary">
              No price restriction detected
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
