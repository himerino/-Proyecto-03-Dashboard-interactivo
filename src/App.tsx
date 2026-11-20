import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { DashboardContainer } from './components/DashboardContainer';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardContainer />
    </ThemeProvider>
  );
}

export default App;