import { Box, Card, CardContent, Stack, Typography } from '../atoms';
import type { DashboardOverviewPoint } from '../../types/product';

const SERIES = [
  { key: 'total' as const, label: 'Total Products', color: '#0F766E' },
  { key: 'active' as const, label: 'Active', color: '#10B981' },
  { key: 'expired' as const, label: 'Expired', color: '#EF4444' },
];

const WIDTH = 640;
const HEIGHT = 280;
const PADDING = { top: 16, right: 16, bottom: 36, left: 36 };

type Point = { x: number; y: number };

function niceMax(value: number) {
  if (value <= 4) return 4;
  if (value <= 8) return 8;
  if (value <= 16) return 16;
  if (value <= 24) return 24;
  if (value <= 32) return 32;
  return Math.ceil(value / 8) * 8;
}

function toSmoothPath(points: Point[]) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const after = points[index + 2] ?? next;

    path += ` C ${current.x + (next.x - previous.x) / 6} ${current.y + (next.y - previous.y) / 6}, ${next.x - (after.x - current.x) / 6} ${next.y - (after.y - current.y) / 6}, ${next.x} ${next.y}`;
  }

  return path;
}

interface ProductsOverviewChartProps {
  data: DashboardOverviewPoint[];
}

export default function ProductsOverviewChart({
  data,
}: ProductsOverviewChartProps) {
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = niceMax(
    Math.max(0, ...data.flatMap((point) => [point.total, point.active, point.expired])),
  );
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxValue * ratio));

  const getX = (index: number) =>
    PADDING.left +
    (data.length <= 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth);

  const getY = (value: number) =>
    PADDING.top + innerHeight - (value / maxValue) * innerHeight;

  const seriesPoints = SERIES.map((series) => ({
    ...series,
    points: data.map((point, index) => ({
      x: getX(index),
      y: getY(point[series.key]),
    })),
  }));

  const totalPoints = seriesPoints[0]?.points ?? [];
  const areaPath =
    totalPoints.length > 0
      ? `${toSmoothPath(totalPoints)} L ${totalPoints[totalPoints.length - 1].x} ${PADDING.top + innerHeight} L ${totalPoints[0].x} ${PADDING.top + innerHeight} Z`
      : '';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h3">Products Overview</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1.2, flexWrap: 'wrap' }}>
              {SERIES.map((series) => (
                <Box
                  key={series.key}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: series.color,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {series.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.secondary' }}>
            Last 6 months
          </Typography>
        </Box>

        {data.length === 0 ? (
          <Box
            sx={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              No product activity yet.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
              component="svg"
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              sx={{ width: '100%', height: { xs: 220, md: 260 }, display: 'block' }}
              role="img"
              aria-label="Products created, active, and expired over the last six months"
            >
            {ticks.map((tick) => {
              const y = getY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    x2={WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="#E8EEF0"
                    strokeWidth="1"
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#8A97A6"
                    fontSize="11"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {data.map((point, index) => (
              <text
                key={point.month}
                x={getX(index)}
                y={HEIGHT - 10}
                textAnchor="middle"
                fill="#8A97A6"
                fontSize="11"
              >
                {point.month}
              </text>
            ))}

            {areaPath && <path d={areaPath} fill="rgba(15, 118, 110, 0.12)" />}

            {seriesPoints.map((series) => (
              <g key={series.key}>
                <path
                  d={toSmoothPath(series.points)}
                  fill="none"
                  stroke={series.color}
                  strokeWidth={series.key === 'total' ? 3 : 2.4}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {series.points.map((point) => (
                  <circle
                    key={`${series.key}-${point.x}`}
                    cx={point.x}
                    cy={point.y}
                    r={3.4}
                    fill="#FFFFFF"
                    stroke={series.color}
                    strokeWidth="2"
                  />
                ))}
              </g>
            ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
