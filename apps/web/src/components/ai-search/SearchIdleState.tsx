import { Box, Typography } from '../atoms';
import { AutoAwesome } from '../atoms/icons';

export default function SearchIdleState() {
  return (
    <Box
      sx={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
        py: 6,
        border: '1px dashed #D8E0E3',
        borderRadius: 2,
        backgroundColor: '#F8FAFA',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          mb: 1.5,
          borderRadius: 2,
          backgroundColor: '#E4F6F4',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AutoAwesome />
      </Box>

      <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
        Search your travel catalog with AI
      </Typography>

      <Typography
        color="text.secondary"
        variant="body2"
        sx={{ maxWidth: 480 }}
      >
        Describe the travel experience you want and AI will match products from
        your catalog.
      </Typography>
    </Box>
  );
}
