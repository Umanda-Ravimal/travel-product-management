import { Link } from 'react-router-dom';

import { Box, Button, Card, CardContent, Stack, Typography } from '../atoms';
import {
  AddOutlined,
  ArrowForwardOutlined,
  AutoAwesomeOutlined,
  LightbulbOutlined,
} from '../atoms/icons';

export default function QuickActions() {
  return (
    <Stack spacing={2}>
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h3">Quick Actions</Typography>

          <Stack spacing={1.2} sx={{ mt: 2.2 }}>
            <Button
              component={Link}
              to="/products/new"
              fullWidth
              variant="contained"
              startIcon={<AddOutlined />}
              sx={{ justifyContent: 'flex-start', py: 1.25 }}
            >
              Add New Product
            </Button>

            <Button
              component={Link}
              to="/products"
              fullWidth
              variant="outlined"
              startIcon={<ArrowForwardOutlined />}
              sx={{ justifyContent: 'flex-start', py: 1.25 }}
            >
              View All Products
            </Button>

            <Button
              component={Link}
              to="/ai-search"
              fullWidth
              variant="outlined"
              startIcon={<AutoAwesomeOutlined />}
              sx={{ justifyContent: 'flex-start', py: 1.25 }}
            >
              AI Search Products
            </Button>

            <Button
              component={Link}
              to="/products/new"
              fullWidth
              variant="outlined"
              startIcon={<AutoAwesomeOutlined />}
              sx={{
                justifyContent: 'flex-start',
                py: 1.25,
                color: 'primary.main',
                borderColor: '#C9E8E4',
                backgroundColor: '#F3FBFA',
              }}
            >
              Generate with AI
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          backgroundColor: '#EAF8F3',
          display: 'flex',
          gap: 1.2,
          alignItems: 'flex-start',
        }}
      >
        <LightbulbOutlined sx={{ color: '#0F766E', fontSize: 22, mt: '1px' }} />
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#0F766E' }}>
            Pro Tip
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              fontSize: '0.78rem',
              lineHeight: 1.5,
              color: '#3F6B66',
            }}
          >
            Use AI to quickly generate product details from a simple description.
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
