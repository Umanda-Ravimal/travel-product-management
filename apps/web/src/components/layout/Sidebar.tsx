import { memo } from 'react';
import { Link, NavLink } from 'react-router-dom';

import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '../atoms';
import {
  ArrowForwardOutlined,
  AutoAwesomeOutlined,
  DashboardOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  TravelExploreOutlined,
} from '../atoms/icons';
import sidebarPromo from '../../assets/images/sidebar-promo.png';

const navigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Products',
    path: '/products',
    icon: <Inventory2Outlined />,
  },
  {
    label: 'AI Search',
    path: '/ai-search',
    icon: <AutoAwesomeOutlined />,
  },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0F4A43 0%, #0A332F 100%)',
        color: '#fff',
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TravelExploreOutlined />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.98rem',
              lineHeight: 1.2,
            }}
          >
            Travel Products
          </Typography>
          <Typography
            sx={{
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              opacity: 0.65,
              mt: 0.4,
            }}
          >
            MANAGEMENT
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5, flex: 1 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === '/'}
            sx={{
              minHeight: 48,
              mb: 0.75,
              px: 2,
              borderRadius: 2,
              color: 'rgba(255,255,255,0.82)',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
              '&.active': {
                backgroundColor: 'rgba(37, 183, 174, 0.22)',
              },
              '&.active .MuiListItemIcon-root': {
                color: '#70D5CF',
              },
              '&.active .MuiListItemText-primary': {
                fontWeight: 600,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 2.5, mb: 1.5 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.14)' }} />
      </Box>

      <Box
        sx={{
          mx: 2,
          mb: 2,
          p: 2.2,
          borderRadius: 2.5,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 168,
          backgroundImage: `linear-gradient(180deg, rgba(8, 40, 38, 0.28) 0%, rgba(8, 40, 38, 0.88) 100%), url(${sidebarPromo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            mb: 0.8,
            position: 'relative',
          }}
        >
          Explore Sri Lanka
        </Typography>
        <Typography
          sx={{
            fontSize: '0.78rem',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.82)',
            position: 'relative',
          }}
        >
          Create and manage amazing travel experiences.
        </Typography>
        <Button
          component={Link}
          to="/products"
          size="small"
          variant="outlined"
          endIcon={<ArrowForwardOutlined sx={{ fontSize: 16 }} />}
          sx={{
            mt: 1.6,
            color: '#FFFFFF',
            borderColor: 'rgba(255,255,255,0.45)',
            fontSize: '0.75rem',
            '&:hover': {
              borderColor: '#FFFFFF',
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          Discover More
        </Button>
      </Box>
    </Box>
  );
}

export default memo(Sidebar);
