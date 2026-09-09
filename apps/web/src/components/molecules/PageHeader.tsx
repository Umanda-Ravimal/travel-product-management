import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Box, Stack, Typography } from '../atoms';

export interface PageBreadcrumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  breadcrumbs?: PageBreadcrumb[];
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <Box>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 1, alignItems: 'center', flexWrap: 'wrap' }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Stack
              key={`${crumb.label}-${index}`}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              {index > 0 && (
                <Typography variant="body2" color="text.disabled">
                  ›
                </Typography>
              )}

              {crumb.to ? (
                <Typography
                  component={Link}
                  to={crumb.to}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {crumb.label}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h1">{title}</Typography>

          {description ? (
            <Typography
              color="text.secondary"
              sx={{
                mt: 0.75,
                maxWidth: 800,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>

        {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
      </Box>
    </Box>
  );
}
