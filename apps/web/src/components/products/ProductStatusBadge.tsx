import { Box } from '../atoms';
import type { ProductStatus } from '../../types/product';

export type BadgeStatus = ProductStatus | 'EXPIRING' | 'EXPIRED';

interface ProductStatusBadgeProps {
  status: BadgeStatus;
}

const styles: Record<
  BadgeStatus,
  { background: string; color: string; dot: string }
> = {
  ACTIVE: {
    background: '#22C55E',
    color: '#FFFFFF',
    dot: '#FFFFFF',
  },
  EXPIRING: {
    background: '#FFF3D6',
    color: '#B45309',
    dot: '#F59E0B',
  },
  EXPIRED: {
    background: '#FDE2E2',
    color: '#B91C1C',
    dot: '#EF4444',
  },
  INACTIVE: {
    background: '#EEF1F3',
    color: '#607080',
    dot: '#94A3B8',
  },
};

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  const item = styles[status];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.7,
        px: 1.2,
        py: 0.45,
        borderRadius: 10,
        backgroundColor: item.background,
        color: item.color,
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: item.dot,
        }}
      />

      {status}
    </Box>
  );
}
