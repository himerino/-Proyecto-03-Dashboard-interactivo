import { Box, Paper, Stack, Typography } from '@mui/material';
import type { CategorySummary } from '../types/dashboard';

export interface DonutChartWidgetProps {
  title: string;
  subtitle: string;
  categories: CategorySummary[];
  totalRevenue: number;
}

export function DonutChartWidget({
  title,
  subtitle,
  categories,
  totalRevenue,
}: DonutChartWidgetProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const ratios = categories.map((cat) =>
    totalRevenue > 0 ? cat.revenue / totalRevenue : 0
  );
  const segments = categories.map((cat, idx) => ({
    category: cat.category,
    color: cat.color,
    dash: ratios[idx] * circumference,
    offset: -ratios.slice(0, idx).reduce((acc, val) => acc + val, 0) * circumference,
  }));

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
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          {subtitle}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ my: 'auto', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box sx={{ position: 'relative', width: 152, height: 152, flexShrink: 0 }}>
          <svg viewBox="0 0 152 152" width="152" height="152">
            <circle
              cx="76"
              cy="76"
              r={radius}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="16"
            />
            {segments.map((seg) => (
              <circle
                key={seg.category}
                cx="76"
                cy="76"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${Math.max(seg.dash - 3, 0)} ${circumference}`}
                strokeDashoffset={seg.offset}
                transform="rotate(-90 76 76)"
              />
            ))}
          </svg>

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
              ${totalRevenue.toLocaleString('en-US')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
              Ingresos totales
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.75} sx={{ flex: 1, width: '100%' }}>
          {categories.map((cat) => {
            const pct =
              totalRevenue > 0 ? ((cat.revenue / totalRevenue) * 100).toFixed(1) : '0.0';
            return (
              <Stack
                key={cat.category}
                direction="row"
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: 0.5,
                      bgcolor: cat.color,
                      mt: 0.7,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {cat.category}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ${cat.revenue.toLocaleString('en-US')}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                  {pct}%
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}