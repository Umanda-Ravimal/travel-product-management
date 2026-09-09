import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '../atoms';
import {
  CategoryOutlined,
  FilterAltOutlined,
  LocationOnOutlined,
  RefreshOutlined,
  SearchOutlined,
} from '../atoms/icons';

export const PRODUCT_CATEGORIES = [
  'Dining',
  'Accommodation',
  'Tour',
  'Transport',
  'Activity',
  'Travel Package',
  'Airport Transfer',
];

export const PRODUCT_DESTINATIONS = [
  'Colombo',
  'Ella',
  'Kandy',
  'Bentota',
  'Galle',
  'Sigiriya',
];

export interface ProductFilters {
  search: string;
  destination: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface ProductsFilterBarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

const fieldSx = {
  backgroundColor: '#FFFFFF',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    height: 42,
  },
};

export default function ProductsFilterBar({
  filters,
  onChange,
  onApply,
  onReset,
}: ProductsFilterBarProps) {
  const update = (patch: Partial<ProductFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.25,
        alignItems: 'center',
        p: 1.5,
        borderRadius: 2,
        backgroundColor: '#EEF2F3',
      }}
    >
      <TextField
        placeholder="Search products..."
        value={filters.search}
        onChange={(event) => update({ search: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onApply();
          }
        }}
        sx={{
          ...fieldSx,
          flex: { xs: '1 1 100%', md: '1 1 220px' },
          minWidth: { md: 200 },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl
        size="small"
        sx={{
          ...fieldSx,
          minWidth: { xs: 'calc(50% - 6px)', sm: 170 },
          flex: { xs: '1 1 160px', md: '0 0 170px' },
        }}
      >
        <Select
          displayEmpty
          value={filters.destination}
          onChange={(event) => update({ destination: event.target.value })}
          startAdornment={
            <InputAdornment position="start">
              <LocationOnOutlined sx={{ color: 'text.secondary', fontSize: 18 }} />
            </InputAdornment>
          }
          renderValue={(value) => value || 'All destinations'}
        >
          <MenuItem value="">All destinations</MenuItem>
          {PRODUCT_DESTINATIONS.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          ...fieldSx,
          minWidth: { xs: 'calc(50% - 6px)', sm: 170 },
          flex: { xs: '1 1 160px', md: '0 0 170px' },
        }}
      >
        <Select
          displayEmpty
          value={filters.category}
          onChange={(event) => update({ category: event.target.value })}
          startAdornment={
            <InputAdornment position="start">
              <CategoryOutlined sx={{ color: 'text.secondary', fontSize: 18 }} />
            </InputAdornment>
          }
          renderValue={(value) => value || 'All categories'}
        >
          <MenuItem value="">All categories</MenuItem>
          {PRODUCT_CATEGORIES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={(event) => update({ minPrice: event.target.value })}
        sx={{
          ...fieldSx,
          width: { xs: 'calc(50% - 6px)', sm: 140 },
          flex: { xs: '1 1 130px', md: '0 0 140px' },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none',
              margin: 0,
            },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>
                  LKR
                </Box>
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(event) => update({ maxPrice: event.target.value })}
        sx={{
          ...fieldSx,
          width: { xs: 'calc(50% - 6px)', sm: 140 },
          flex: { xs: '1 1 130px', md: '0 0 140px' },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none',
              margin: 0,
            },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>
                  LKR
                </Box>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        variant="outlined"
        startIcon={<RefreshOutlined />}
        onClick={onReset}
        sx={{
          height: 42,
          px: 2,
          borderColor: 'primary.main',
          color: 'primary.main',
          backgroundColor: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}
      >
        Reset
      </Button>

      <Button
        variant="contained"
        startIcon={<FilterAltOutlined />}
        onClick={onApply}
        sx={{
          height: 42,
          px: 2.2,
          whiteSpace: 'nowrap',
        }}
      >
        Apply Filters
      </Button>
    </Box>
  );
}
