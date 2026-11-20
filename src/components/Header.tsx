import { Box, IconButton, Stack, Typography } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

export interface HeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  showMobileFilters: boolean;
  onToggleFilters: () => void;
}

export function Header({
  eyebrow,
  title,
  subtitle,
  showMobileFilters,
  onToggleFilters,
}: HeaderProps) {
  return (
    <Box sx={{ flex: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 0.75 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <ShowChartIcon sx={{ fontSize: 18, color: '#3B66F5' }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#3B66F5',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </Typography>
        </Stack>

        {/* Botón de embudo visible únicamente en vista móvil */}
        <IconButton
          onClick={onToggleFilters}
          aria-label="Mostrar u ocultar filtros"
          sx={{
            display: { xs: 'inline-flex', lg: 'none' },
            border: '1px solid',
            borderColor: showMobileFilters ? '#3B66F5' : '#E2E8F0',
            bgcolor: showMobileFilters ? '#EFF6FF' : '#FFFFFF',
            color: '#3B66F5',
            borderRadius: 2,
            p: 1,
          }}
        >
          <FilterAltOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 800,
          color: '#0F172A',
          fontSize: { xs: '1.65rem', sm: '2rem' },
          lineHeight: 1.2,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: '#64748B' }}>
        {subtitle}
      </Typography>
    </Box>
  );
}