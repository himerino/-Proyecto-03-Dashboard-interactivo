import { Box, Chip, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { MonthlyRevenuePoint, ProductCategory } from '../types/dashboard';

export interface LineChartWidgetProps {
  title: string;
  subtitle: string;
  data: MonthlyRevenuePoint[];
  selectedCategories: ProductCategory[];
}

const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

function niceStep(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1000;
  const base = 10 ** Math.floor(Math.log10(value));
  const fraction = value / base;
  return (NICE_STEPS.find((candidate) => candidate >= fraction) ?? 10) * base;
}

function axisLabel(value: number): string {
  if (value === 0) return '$0';
  if (value >= 1000 && value % 1000 === 0) return `$${value / 1000}k`;
  return `$${value.toLocaleString('en-US')}`;
}

export function LineChartWidget({
  title,
  subtitle,
  data,
  selectedCategories,
}: LineChartWidgetProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const series = data.map((point) => {
    const total = selectedCategories.reduce((acc, cat) => acc + point[cat], 0);
    return {
      month: point.month,
      value: total,
      isPartial: point.isPartial,
      partialDays: point.partialDays,
    };
  });

  const maxPoint = series.reduce(
    (best, cur) => (cur.value > best.value ? cur : best),
    series[0] ?? { month: '-', value: 0 }
  );

  const maxValue = series.reduce((max, point) => Math.max(max, point.value), 0);
  const step = niceStep(maxValue / 4);
  const maxScale = step * 4;
  const width = isMobile ? 340 : 620;
  const height = isMobile ? 190 : 210;
  const padLeft = isMobile ? 38 : 44;
  const padRight = isMobile ? 12 : 18;
  const padTop = 16;
  const padBottom = 28;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const coords = series.map((item, idx) => {
    const x = padLeft + (idx / Math.max(series.length - 1, 1)) * plotW;
    const y = padTop + plotH - (Math.min(item.value, maxScale) / maxScale) * plotH;
    return { ...item, x, y };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPoints =
    coords.length > 0
      ? `${coords[0].x},${padTop + plotH} ${polylinePoints} ${
          coords[coords.length - 1].x
        },${padTop + plotH}`
      : '';

  const yTicks = [0, step, step * 2, step * 3, maxScale];
  const partialPoint = series.find((point) => point.isPartial);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          mb: 1.5,
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {subtitle}
          </Typography>
        </Box>
        <Chip
          label="Mensual"
          size="small"
          sx={{
            bgcolor: '#F1F5F9',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.72rem',
            borderRadius: 1.5,
          }}
        />
      </Stack>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B66F5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3B66F5" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = padTop + plotH - (tick / maxScale) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={isMobile ? 9 : 10}
                  fill="#94A3B8"
                >
                  {axisLabel(tick)}
                </text>
              </g>
            );
          })}

          {areaPoints && <polygon points={areaPoints} fill="url(#revenueFill)" />}
          {polylinePoints && (
            <polyline
              fill="none"
              stroke="#3B66F5"
              strokeWidth="2"
              points={polylinePoints}
            />
          )}

          {coords.map((c, idx) => {
            const visible = !isMobile || idx % 3 === 0 || Boolean(c.isPartial);
            return (
              <g key={c.month}>
                <circle cx={c.x} cy={c.y} r="3" fill="#3B66F5" />
                <text
                  x={c.x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize={isMobile ? 9 : 10}
                  fontWeight={c.isPartial ? 700 : 500}
                  fill={c.isPartial ? '#3B66F5' : '#64748B'}
                  style={{ display: visible ? undefined : 'none' }}
                >
                  {c.month}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={0.5}
        sx={{ mt: 1, justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: '#3B66F5' }} />
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
            Ingresos · Máximo en {maxPoint.month.toLowerCase()}: $
            {maxPoint.value.toLocaleString('en-US')}
          </Typography>
        </Stack>
        {partialPoint && (
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
            *{partialPoint.month}: período parcial,{' '}
            {partialPoint.partialDays === 1
              ? 'solo 1 día'
              : `${partialPoint.partialDays} días`}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}