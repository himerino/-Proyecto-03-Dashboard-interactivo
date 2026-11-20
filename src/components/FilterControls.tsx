import {
  Box,
  Checkbox,
  Collapse,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ALL_CATEGORIES } from '../data/mockData';
import type { ProductCategory } from '../types/dashboard';

export interface FilterControlsProps {
  startDate: string;
  endDate: string;
  selectedCategories: ProductCategory[];
  isOpenMobile: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onToggleCategory: (category: ProductCategory) => void;
  onToggleAllCategories: () => void;
  onCloseMobile: () => void;
}

export function FilterControls({
  startDate,
  endDate,
  selectedCategories,
  isOpenMobile,
  onStartDateChange,
  onEndDateChange,
  onToggleCategory,
  onToggleAllCategories,
  onCloseMobile,
}: FilterControlsProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const allSelected = selectedCategories.length === ALL_CATEGORIES.length;

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'flex-start' },
        gap: { xs: 2, lg: 2.5 },
      }}
    >
      {/* Encabezado interno solo para tarjeta colapsable móvil */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ display: { xs: 'flex', lg: 'none' } }}
      >
        <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
          Filtros
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          onClick={onCloseMobile}
          sx={{ cursor: 'pointer', color: '#3B66F5' }}
        >
          <Typography variant="caption" fontWeight={600}>
            Ocultar
          </Typography>
          <ExpandLessIcon fontSize="small" />
        </Stack>
      </Stack>

      {/* Selectores de Fecha */}
      <Stack direction="row" spacing={1.5}>
        <Box sx={{ flex: 1, minWidth: { lg: 150 } }}>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#64748B', mb: 0.5, fontWeight: 500 }}
          >
            Desde
          </Typography>
          <TextField
            type="date"
            size="small"
            fullWidth
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            sx={{
              bgcolor: '#FFFFFF',
              '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.85rem' },
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: { lg: 150 } }}>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#64748B', mb: 0.5, fontWeight: 500 }}
          >
            Hasta
          </Typography>
          <TextField
            type="date"
            size="small"
            fullWidth
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            sx={{
              bgcolor: '#FFFFFF',
              '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.85rem' },
            }}
          />
        </Box>
      </Stack>

      {/* Selección múltiple de categorías */}
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 0.5 }}
        >
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
            Categoría · Selección múltiple
          </Typography>
          <Typography variant="caption" sx={{ color: '#3B66F5', fontWeight: 600 }}>
            {selectedCategories.length} de {ALL_CATEGORIES.length} seleccionadas
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, auto)' },
            gap: 1,
          }}
        >
          {/* Opción Todos */}
          <Box
            onClick={onToggleAllCategories}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.25,
              py: 0.4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: allSelected ? '#BFDBFE' : '#E2E8F0',
              bgcolor: allSelected ? '#EFF6FF' : '#FFFFFF',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Checkbox
              checked={allSelected}
              size="small"
              sx={{ p: 0.25, mr: 0.75, color: '#3B66F5' }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.82rem',
                fontWeight: 500,
                color: allSelected ? '#2563EB' : '#475569',
              }}
            >
              Todos
            </Typography>
          </Box>

          {/* Categorías individuales */}
          {ALL_CATEGORIES.map((category) => {
            const active = selectedCategories.includes(category);
            return (
              <Box
                key={category}
                onClick={() => onToggleCategory(category)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.25,
                  py: 0.4,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: active ? '#BFDBFE' : '#E2E8F0',
                  bgcolor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <Checkbox
                  checked={active}
                  size="small"
                  sx={{ p: 0.25, mr: 0.75, color: '#3B66F5' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: active ? '#2563EB' : '#475569',
                  }}
                >
                  {category}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#64748B', mt: 0.6, fontSize: '0.72rem' }}
        >
          {allSelected
            ? 'Se incluyen todas las categorías del dataset.'
            : `Mostrando métricas filtradas para: ${selectedCategories.join(', ')}.`}
        </Typography>
      </Box>
    </Box>
  );

  if (isDesktop) {
    return content;
  }

  return (
    <Collapse in={isOpenMobile} unmountOnExit>
      <Paper
        elevation={0}
        sx={{
          p: 2.25,
          mt: 2,
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
        }}
      >
        {content}
      </Paper>
    </Collapse>
  );
}