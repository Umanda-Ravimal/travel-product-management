import {
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '../atoms';
import { AutoAwesome, SearchOutlined } from '../atoms/icons';

const QUICK_SEARCHES = [
  'Beach resorts in Mirissa',
  'Cultural tours around Kandy',
  'Dinner buffets in Colombo',
  'Adventure activities for couples',
  'Family-friendly hotels',
];

interface SearchQueryBoxProps {
  query: string;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onExampleSelect: (example: string) => void;
}

const fieldSx = {
  backgroundColor: '#FFFFFF',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    height: 42,
  },
};

export default function SearchQueryBox({
  query,
  loading,
  onQueryChange,
  onSubmit,
  onExampleSelect,
}: SearchQueryBoxProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        background:
          'linear-gradient(90deg, #E7F7F3 0%, #DDF4F1 50%, #EAF8F6 100%)',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.25}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <TextField
          fullWidth
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSubmit();
            }
          }}
          placeholder="e.g. Show me dinner buffets in Colombo"
          sx={fieldSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined
                    sx={{ color: 'text.secondary', fontSize: 20 }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading || !query.trim()}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AutoAwesome />
            )
          }
          sx={{
            height: 42,
            px: 2.2,
            whiteSpace: 'nowrap',
            minWidth: { sm: 168 },
          }}
        >
          {loading ? 'Searching...' : 'Search with AI'}
        </Button>
      </Stack>

      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1,
            fontWeight: 600,
            color: '#226B69',
          }}
        >
          Try an example
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {QUICK_SEARCHES.map((example) => {
            const selected = query === example;

            return (
              <Chip
                key={example}
                label={example}
                size="small"
                onClick={() => onExampleSelect(example)}
                sx={{
                  height: 26,
                  backgroundColor: selected ? 'primary.main' : '#FFFFFF',
                  color: selected ? '#FFFFFF' : 'text.primary',
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : '#C9E8E4',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: selected ? '#FFFFFF' : 'primary.main',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
