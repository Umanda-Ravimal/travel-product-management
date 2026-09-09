import type { ReactElement } from 'react';

import { Chip } from '../atoms';
import {
  CategoryOutlined,
  DirectionsBusOutlined,
  DirectionsWalkOutlined,
  HotelOutlined,
  RestaurantOutlined,
  TerrainOutlined,
  TravelExploreOutlined,
} from '../atoms/icons';

const styles: Record<
  string,
  { background: string; color: string; icon: ReactElement }
> = {
  Dining: {
    background: '#E6F6EC',
    color: '#1F7A4D',
    icon: <RestaurantOutlined sx={{ fontSize: 14 }} />,
  },
  'Travel Package': {
    background: '#E7EEF9',
    color: '#3451B2',
    icon: <TerrainOutlined sx={{ fontSize: 14 }} />,
  },
  Transport: {
    background: '#EEE8F8',
    color: '#5B3CC4',
    icon: <DirectionsBusOutlined sx={{ fontSize: 14 }} />,
  },
  'Airport Transfer': {
    background: '#EEE8F8',
    color: '#5B3CC4',
    icon: <DirectionsBusOutlined sx={{ fontSize: 14 }} />,
  },
  Activity: {
    background: '#FFF1E0',
    color: '#C2410C',
    icon: <DirectionsWalkOutlined sx={{ fontSize: 14 }} />,
  },
  Accommodation: {
    background: '#FDE8E8',
    color: '#B42318',
    icon: <HotelOutlined sx={{ fontSize: 14 }} />,
  },
  Tour: {
    background: '#E6F4F8',
    color: '#0E7490',
    icon: <TravelExploreOutlined sx={{ fontSize: 14 }} />,
  },
};

interface CategoryChipProps {
  category: string;
}

export default function CategoryChip({ category }: CategoryChipProps) {
  const style = styles[category] ?? {
    background: '#EEF2F3',
    color: '#475569',
    icon: <CategoryOutlined sx={{ fontSize: 14 }} />,
  };

  return (
    <Chip
      size="small"
      icon={style.icon}
      label={category}
      sx={{
        height: 26,
        backgroundColor: style.background,
        color: style.color,
        fontWeight: 700,
        fontSize: '0.72rem',
        borderRadius: 999,
        '& .MuiChip-label': {
          px: 0.8,
        },
        '& .MuiChip-icon': {
          color: style.color,
          marginLeft: '8px',
          marginRight: '-2px',
        },
      }}
    />
  );
}
