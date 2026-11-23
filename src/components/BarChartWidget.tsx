import { Box, Paper, Stack, Typography } from '@mui/material';
import type { CategorySummary } from '../types/dashboard';

export interface BarChartWidgetProps {
  title: string;
  subtitle: string;
  categories: CategorySummary[];
}

export function BarChartWidget({ title, subtitle, categories }: BarChartWidgetProps) {
  const ordered = ['Beauty', 'Clothing', 'Electronics']
    .map((name) => categories.find((c) => c.category === name))
    .filter((c): c is CategorySummary => Boolean(c));

  const totalUnits = ordered.reduce(
    (sum, item) => sum + item.maleUnits + item.femaleUnits,
    0
  );
  const maxBar = Math.max(
    1,
    ...ordered.map((cat) => Math.max(cat.maleUnits, cat.femaleUnits))
  );
  const chartHeight = 140;

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
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
          {subtitle}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: '#3B66F5' }} />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
              Hombre
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: '#14B8A6' }} />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
              Mujer
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: chartHeight + 48,
          pt: 3,
          pb: 1,
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {ordered.map((cat) => {
          const maleH = Math.round((cat.maleUnits / maxBar) * chartHeight);
          const femaleH = Math.round((cat.femaleUnits / maxBar) * chartHeight);

          return (
            <Stack key={cat.category} spacing={1} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-end' }}>
                <Stack spacing={0.4} sx={{ alignItems: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#334155' }}
                  >
                    {cat.maleUnits}
                  </Typography>
                  <Box
                    sx={{
                      width: 24,
                      height: maleH,
                      bgcolor: '#3B66F5',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.25s ease',
                    }}
                  />
                </Stack>

                <Stack spacing={0.4} sx={{ alignItems: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#334155' }}
                  >
                    {cat.femaleUnits}
                  </Typography>
                  <Box
                    sx={{
                      width: 24,
                      height: femaleH,
                      bgcolor: '#14B8A6',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.25s ease',
                    }}
                  />
                </Stack>
              </Stack>

              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                {cat.category}
              </Typography>
            </Stack>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        sx={{ mt: 1.5, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
          Eje Y: unidades vendidas
        </Typography>
        <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 700 }}>
          Total: {totalUnits.toLocaleString('en-US')} unidades
        </Typography>
      </Stack>
    </Paper>
  );
}