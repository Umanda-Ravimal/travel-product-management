import { Box, Typography } from '../atoms';
import { PageHeader } from '../molecules';
import heroSriLanka from '../../assets/images/hero-sri-lanka.png';

export default function WelcomeHero() {
  return (
    <PageHeader
      title="Welcome back"
      description="Here's what's happening with your travel products today."
      actions={
        <Box
          sx={{
            width: { xs: '100%', md: 420 },
            height: { xs: 132, md: 148 },
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={heroSriLanka}
            alt="Sri Lanka coastline"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(8, 28, 36, 0.08) 0%, rgba(8, 28, 36, 0.28) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 2.5, md: 3.5 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#FFFFFF',
                textShadow: '0 2px 16px rgba(0,0,0,0.28)',
              }}
            >
              Sri Lanka
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: 'rgba(255,255,255,0.92)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                fontWeight: 700,
              }}
            >
              A WORLD OF DISCOVERY
            </Typography>
          </Box>
        </Box>
      }
    />
  );
}
