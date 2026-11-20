import { useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import {
  ALL_CATEGORIES,
  CATEGORY_SUMMARIES,
  MONTHLY_REVENUE_MOCK,
  RECENT_TRANSACTIONS_MOCK,
} from '../data/mockData';
import type { ProductCategory } from '../types/dashboard';
import { Header } from './Header';
import { FilterControls } from './FilterControls';
import { KPICard } from './KPICard';
import { LineChartWidget } from './LineChartWidget';
import { DonutChartWidget } from './DonutChartWidget';
import { BarChartWidget } from './BarChartWidget';
import { TransactionTable } from './TransactionTable';

export function DashboardContainer() {
  // Estados controlados mediante useState
  const [startDate, setStartDate] = useState<string>('2023-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-01');
  const [selectedCategories, setSelectedCategories] =
    useState<ProductCategory[]>(ALL_CATEGORIES);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const handleToggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Evitar dejar 0 categorías seleccionadas
        return prev.length > 1 ? prev.filter((item) => item !== category) : prev;
      }
      return [...prev, category];
    });
  };

  const handleToggleAllCategories = () => {
    setSelectedCategories(ALL_CATEGORIES);
  };

  // Cálculo reactivo de métricas según las categorías seleccionadas
  const activeSummaries = CATEGORY_SUMMARIES.filter((item) =>
    selectedCategories.includes(item.category)
  );

  const totalRevenue = activeSummaries.reduce((acc, item) => acc + item.revenue, 0);
  const totalTransactions = activeSummaries.reduce(
    (acc, item) => acc + item.transactions,
    0
  );
  const totalUnits = activeSummaries.reduce(
    (acc, item) => acc + item.maleUnits + item.femaleUnits,
    0
  );
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const filteredTransactions = RECENT_TRANSACTIONS_MOCK.filter(
    (tx) =>
      selectedCategories.includes(tx.productCategory) &&
      tx.date >= startDate &&
      tx.date <= endDate
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6FA', py: { xs: 2.5, md: 3.5 } }}>
      <Container maxWidth="xl">
        {/* Cabecera y Filtros Globales */}
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
            onToggleFilters={() => setShowMobileFilters((prev) => !prev)}
          />

          <FilterControls
            startDate={startDate}
            endDate={endDate}
            selectedCategories={selectedCategories}
            isOpenMobile={showMobileFilters}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onToggleCategory={handleToggleCategory}
            onToggleAllCategories={handleToggleAllCategories}
            onCloseMobile={() => setShowMobileFilters(false)}
          />
        </Box>

        {/* Fila de 3 Tarjetas KPI */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
            mb: 2.5,
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

        {/* Sección Central: Evolución Temporal y Participación por Categoría */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 2.5,
            mb: 2.5,
          }}
        >
          <LineChartWidget
            title="Ingresos en el tiempo"
            subtitle="Evolución mensual de los ingresos"
            data={MONTHLY_REVENUE_MOCK}
            selectedCategories={selectedCategories}
          />

          <DonutChartWidget
            title="Ventas por categoría"
            subtitle="Participación sobre los ingresos totales"
            categories={activeSummaries}
            totalRevenue={totalRevenue}
          />
        </Box>

        {/* Sección Inferior: Comparativa Demográfica y Tabla de Transacciones */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '5fr 7fr' },
            gap: 2.5,
            mb: 2.5,
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
            transactions={filteredTransactions}
            totalCount={totalTransactions}
          />
        </Box>

        {/* Pie de página informativo */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={0.5}
          sx={{ pt: 1 }}
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