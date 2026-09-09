import type { ReactNode } from 'react';

import { Typography } from '../atoms';

interface ProductTitleProps {
  children: ReactNode;
  clamp?: 1 | 2;
}

export default function ProductTitle({
  children,
  clamp = 1,
}: ProductTitleProps) {
  return (
    <Typography
      variant="subtitle1"
      sx={
        clamp === 1
          ? {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          : {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }
      }
    >
      {children}
    </Typography>
  );
}
