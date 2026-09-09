import { Box, Paper, Typography } from '../atoms';
import { AutoAwesome } from '../atoms/icons';

export default function SearchIdleState() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 7 },
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          mx: 'auto',
          mb: 2,
          borderRadius: '50%',
          backgroundColor: 'primary.light',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AutoAwesome fontSize="large" />
      </Box>

      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: 700 }}
      >
        Search your travel catalog with AI
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 550,
          mx: 'auto',
        }}
      >
        Instead of selecting multiple filters, simply
        describe the travel experience you're looking
        for and AI will find the relevant products.
      </Typography>
    </Paper>
  );
}
