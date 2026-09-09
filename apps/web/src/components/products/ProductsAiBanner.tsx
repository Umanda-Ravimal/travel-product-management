import { Link } from 'react-router-dom';

import { Box, Button, Stack, Typography } from '../atoms';
import { AutoAwesome } from '../atoms/icons';

export default function ProductsAiBanner() {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 2,
        borderRadius: 2.5,
        background:
          'linear-gradient(90deg, #E7F7F3 0%, #DDF4F1 50%, #EAF8F6 100%)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <AutoAwesome sx={{ color: 'primary.main', fontSize: 22 }} />
        <Typography
          sx={{
            color: '#226B69',
            fontSize: { xs: '0.86rem', md: '0.92rem' },
            lineHeight: 1.5,
          }}
        >
          Need help creating product details? Use AI to generate product
          information from a simple description.
        </Typography>
      </Stack>

      <Button
        component={Link}
        to="/products/new"
        variant="contained"
        startIcon={<AutoAwesome />}
        sx={{
          backgroundColor: '#FFFFFF',
          color: 'primary.main',
          boxShadow: '0 2px 8px rgba(8, 127, 123, 0.12)',
          whiteSpace: 'nowrap',
          '&:hover': {
            backgroundColor: '#F7FFFE',
          },
        }}
      >
        Generate with AI
      </Button>
    </Box>
  );
}
