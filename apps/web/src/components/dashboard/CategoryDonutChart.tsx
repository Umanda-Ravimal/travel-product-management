import { Box, Card, CardContent, Stack, Typography } from '../atoms';
import type { DashboardCategoryBreakdown } from '../../types/product';

const CATEGORY_COLORS = [
  '#0F766E',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#10B981',
  '#F43F5E',
  '#06B6D4',
  '#84CC16',
];

const RADIUS = 68;
const STROKE = 22;
const SIZE = 200;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CategoryDonutChartProps {
  total: number;
  categories: DashboardCategoryBreakdown[];
}

export default function CategoryDonutChart({
  total,
  categories,
}: CategoryDonutChartProps) {
  let offset = 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h3">Products by Category</Typography>

        {categories.length === 0 ? (
          <Box
            sx={{
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              No category data yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 2.5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', lg: 'column', xl: 'row' },
              alignItems: 'center',
              gap: 2.5,
            }}
          >
            <Box sx={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
              <Box
                component="svg"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                sx={{ width: '100%', height: '100%' }}
                role="img"
                aria-label="Product counts grouped by category"
              >
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke="#EEF2F3"
                  strokeWidth={STROKE}
                />
                {categories.map((item, index) => {
                  const ratio = total === 0 ? 0 : item.count / total;
                  const dash = ratio * CIRCUMFERENCE;
                  const circle = (
                    <circle
                      key={item.category}
                      cx={SIZE / 2}
                      cy={SIZE / 2}
                      r={RADIUS}
                      fill="none"
                      stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      strokeWidth={STROKE}
                      strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="butt"
                      transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    />
                  );
                  offset += dash;
                  return circle;
                })}
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', lineHeight: 1 }}>
                  {total}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  Products
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.1} sx={{ width: '100%' }}>
              {categories.map((item, index) => (
                <Box
                  key={item.category}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor:
                          CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.category}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>
                    {item.count} ({item.percent}%)
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
