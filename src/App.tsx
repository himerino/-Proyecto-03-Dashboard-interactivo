import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { DashboardContainer } from './components/DashboardContainer';
import useTransactions from './hooks/useTransactions';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export function App() {
  const { transactions, loading, error } = useTransactions('/');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && (
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: '#F4F6FA',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: '#3B66F5' }} />
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Cargando datos desde Firebase…
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Container maxWidth="sm" sx={{ pt: 6 }}>
          <Alert severity="error" variant="outlined">
            No se pudieron consultar los datos de Firebase: {error}
          </Alert>
        </Container>
      )}

      {!loading && !error && <DashboardContainer transactions={transactions} />}
    </ThemeProvider>
  );
}

export default App;
