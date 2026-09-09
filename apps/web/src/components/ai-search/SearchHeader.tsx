import { Box, Button, Stack } from '../atoms';
import { TuneOutlined } from '../atoms/icons';
import { PageHeader } from '../molecules';

export default function SearchHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <PageHeader
        title="AI Search"
        description="Find the perfect travel experiences using natural language. Just describe what you're looking for."
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'AI Search' },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<TuneOutlined />}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              whiteSpace: 'nowrap',
            }}
          >
            View Search History
          </Button>
        }
      />
    </Box>
  );
}
