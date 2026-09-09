import { memo } from 'react';

import { AppBar, Box, InputAdornment, TextField, Toolbar, Typography } from '../atoms';
import { EnergySavingsLeafOutlined, SearchOutlined } from '../atoms/icons';

function Header() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ml: '240px',
        width: 'calc(100% - 240px)',
        backgroundColor: '#FFFFFF',
        color: '#142433',
        borderBottom: '1px solid #E5E9EC',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '64px !important',
          px: { xs: 2, md: 3 },
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search products, destinations, or anything..."
          sx={{
            width: {
              xs: '100%',
              sm: 420,
              md: 520,
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F5F7F8',
              borderRadius: 2,
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined
                    sx={{
                      color: '#607080',
                      fontSize: 21,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box
          sx={{
            ml: 'auto',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.8,
            color: 'text.secondary',
          }}
        >
          <Typography sx={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            Amazing Destinations
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', opacity: 0.5 }}>/</Typography>
          <Typography sx={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            Memorable Experiences
          </Typography>
          <EnergySavingsLeafOutlined sx={{ fontSize: 18, color: '#2E7D5B', ml: 0.4 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default memo(Header);
