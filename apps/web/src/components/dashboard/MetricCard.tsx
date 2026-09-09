import type { ReactNode } from 'react';

import { Box, Card, CardContent, Typography } from '../atoms';

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  caption?: string;
  captionColor?: string;
  progress?: number;
  progressColor?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  caption,
  captionColor = 'text.secondary',
  progress,
  progressColor,
}: MetricCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: '2rem',
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: '-0.04em',
              }}
            >
              {value}
            </Typography>

            {caption && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: captionColor,
                }}
              >
                {caption}
              </Typography>
            )}

            {progress !== undefined && (
              <Box
                sx={{
                  mt: 1.4,
                  height: 6,
                  borderRadius: 10,
                  backgroundColor: '#EEF2F3',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    height: '100%',
                    borderRadius: 10,
                    backgroundColor: progressColor,
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: iconBg,
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
