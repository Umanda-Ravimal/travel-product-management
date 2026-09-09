import {
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
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

export default function SearchQueryBox({
  query,
  loading,
  onQueryChange,
  onSubmit,
  onExampleSelect,
}: SearchQueryBoxProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        border: '1px solid',
        borderColor: 'primary.light',
        background: 'linear-gradient(135deg, #F0FBF9 0%, #E7F7F5 100%)',
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2.5, alignItems: 'flex-start' }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
            flexShrink: 0,
          }}
        >
          <AutoAwesome />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontWeight: 700 }}
          >
            What are you looking for?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Describe your ideal travel experience and let AI
            find matching products for you.
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
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
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading || !query.trim()}
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <AutoAwesome />
            )
          }
          sx={{
            minWidth: 170,
            height: 56,
          }}
        >
          {loading ? 'Searching...' : 'Search with AI'}
        </Button>
      </Stack>

      <Box sx={{ mt: 2.5 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1 }}
        >
          Try an example
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap' }}
        >
          {QUICK_SEARCHES.map((example) => (
            <Chip
              key={example}
              label={example}
              onClick={() => onExampleSelect(example)}
              sx={{
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
