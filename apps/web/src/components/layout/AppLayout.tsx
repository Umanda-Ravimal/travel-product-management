import type { ReactNode } from 'react';

import { Box } from '../atoms';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Sidebar />
      <Header />
      <Box
        component="main"
        sx={{
          ml: {
            xs: 0,
            md: '240px',
          },
          pt: '64px',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
              lg: 4,
            },
            py: {
              xs: 2.5,
              md: 3.5,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
