import type { AiSearchFilters } from '../../api/ai.api';
import {
  Chip,
  Divider,
  Paper,
  Slider,
  Stack,
  Typography,
} from '../atoms';
import { TuneOutlined } from '../atoms/icons';

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
    <Paper
      elevation={0}
      sx={{
        width: {
          xs: '100%',
          md: 260,
        },
        flexShrink: 0,
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2.5, alignItems: 'center' }}
      >
        <TuneOutlined sx={{ color: 'primary.main' }} />

        <Typography sx={{ fontWeight: 700 }}>
          Refine Results
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Category
      </Typography>

      {filters.category ? (
        <Chip
          label={filters.category}
          size="small"
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          All categories
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body2"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Destination
      </Typography>

      {filters.destination ? (
        <Chip
          label={filters.destination}
          size="small"
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          All destinations
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body2"
        sx={{ mb: 1, fontWeight: 600 }}
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
        valueLabelFormat={(value) =>
          `LKR ${value.toLocaleString()}`
        }
      />

      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between' }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          LKR {priceRange[0].toLocaleString()}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          LKR {priceRange[1].toLocaleString()}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body2"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        AI Detected Filters
      </Typography>

      <Stack spacing={1}>
        {filters.minPrice !== null && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Minimum price:{' '}
            <strong>
              LKR {filters.minPrice.toLocaleString()}
            </strong>
          </Typography>
        )}

        {filters.maxPrice !== null && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Maximum price:{' '}
            <strong>
              LKR {filters.maxPrice.toLocaleString()}
            </strong>
          </Typography>
        )}

        {!filters.minPrice && !filters.maxPrice && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            No price restriction detected
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
