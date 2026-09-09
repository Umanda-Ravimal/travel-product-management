import { Chip } from '../atoms';
import type { ProductStatus } from '../../types/product';

type StatusChipProps = {
  status: ProductStatus;
};

export function StatusChip({ status }: StatusChipProps) {
  const isActive = status === 'ACTIVE';

  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      size="small"
    />
  );
}
