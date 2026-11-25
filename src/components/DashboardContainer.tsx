import { Box, Container, Stack, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import type { TransactionRecord } from '../types/dashboard';
import { Header } from './Header';
import { FilterControls } from './FilterControls';
import { KPICard } from './KPICard';
import { LineChartWidget } from './LineChartWidget';
import { DonutChartWidget } from './DonutChartWidget';
import { BarChartWidget } from './BarChartWidget';
import { TransactionTable } from './TransactionTable';

interface DashboardContainerProps {
  transactions: TransactionRecord[];
}

export function DashboardContainer({ transactions }: DashboardContainerProps) {
  const {
    startDate,
    endDate,
    minDate,
    maxDate,
    selectedCategories,
    showMobileFilters,
    activeSummaries,
    monthlyRevenue,
    recentTransactions,
    totalRevenue,
    totalTransactions,
    totalUnits,
    averageTicket,
    onStartDateChange,
    onEndDateChange,
    onToggleCategory,
    onToggleAllCategories,
    onToggleMobileFilters,
    onCloseMobileFilters,
  } = useDashboardFilters(transactions);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6FA', py: { xs: 2.5, md: 3.5 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'stretch', lg: 'flex-start' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Header
            eyebrow="Analítica Retail"
            title="Dashboard de ventas"
            subtitle="Una visión completa del rendimiento comercial."
            showMobileFilters={showMobileFilters}
            onToggleFilters={onToggleMobileFilters}
          />

          <FilterControls
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            selectedCategories={selectedCategories}
            isOpenMobile={showMobileFilters}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            onToggleCategory={onToggleCategory}
            onToggleAllCategories={onToggleAllCategories}
            onCloseMobile={onCloseMobileFilters}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.5,
            mb: 2.5,
            '& > *': { minWidth: 0 },
          }}
        >
          <KPICard
            title="Ingresos Totales"
            value={`$${totalRevenue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle={`Suma de montos · ${totalTransactions.toLocaleString('en-US')} transacciones`}
            icon={<AttachMoneyIcon fontSize="small" />}
          />

          <KPICard
            title="Volumen de Ventas"
            value={totalUnits.toLocaleString('en-US')}
            unit="unidades"
            subtitle="Suma de cantidades vendidas"
            icon={<ShoppingBagOutlinedIcon fontSize="small" />}
          />

          <KPICard
            title="Ticket Promedio"
            value={`$${averageTicket.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle="Monto promedio por transacción"
            icon={<ReceiptLongOutlinedIcon fontSize="small" />}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 2fr) minmax(0, 1fr)',
            },
            gap: 2.5,
            mb: 2.5,
            '& > *': { minWidth: 0 },
          }}
        >
          <LineChartWidget
            title="Ingresos en el tiempo"
            subtitle="Evolución mensual de los ingresos"
            data={monthlyRevenue}
            selectedCategories={selectedCategories}
          />

          <DonutChartWidget
            title="Ventas por categoría"
            subtitle="Participación sobre los ingresos totales"
            categories={activeSummaries}
            totalRevenue={totalRevenue}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 5fr) minmax(0, 7fr)',
            },
            gap: 2.5,
            mb: 2.5,
            '& > *': { minWidth: 0 },
          }}
        >
          <BarChartWidget
            title="Unidades por categoría y género"
            subtitle="Cantidad vendida · Suma de Quantity"
            categories={activeSummaries}
          />

          <TransactionTable
            title="Transacciones recientes"
            subtitle="Orden descendente por fecha e ID de transacción"
            transactions={recentTransactions}
            totalCount={totalTransactions}
            startDate={startDate}
            endDate={endDate}
          />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={0.5}
          sx={{ pt: 1, justifyContent: 'space-between' }}
        >
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            Fuente: Kaggle · Retail Sales Dataset
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            {totalTransactions.toLocaleString('en-US')} transacciones · Rango inclusivo ·
            Importes en dólares ($)
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}