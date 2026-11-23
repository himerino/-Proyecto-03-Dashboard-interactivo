import type { ReactNode } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';

export interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle: string;
  icon: ReactNode;
}

export function KPICard({ title, value, unit, subtitle, icon }: KPICardProps) {
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
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          borderColor: '#BFDBFE',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 1 }}>
            {title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', mb: 0.75 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontSize: { xs: '1.75rem', sm: '1.9rem' },
                letterSpacing: '-0.02em',
              }}
            >
              {value}
            </Typography>
            {unit && (
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                {unit}
              </Typography>
            )}
          </Stack>
        </Box>

        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: '#EFF6FF',
            color: '#3B66F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Stack>

      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}