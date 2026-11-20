import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ProductCategory, TransactionRecord } from '../types/dashboard';

export interface TransactionTableProps {
  title: string;
  subtitle: string;
  transactions: TransactionRecord[];
  totalCount: number;
}

const CATEGORY_BADGE_STYLES: Record<
  ProductCategory,
  { bgcolor: string; color: string }
> = {
  Electronics: { bgcolor: '#EFF6FF', color: '#2563EB' },
  Beauty: { bgcolor: '#F3E8FF', color: '#7C3AED' },
  Clothing: { bgcolor: '#CCFBF1', color: '#0D9488' },
};

function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function TransactionTable({
  title,
  subtitle,
  transactions,
  totalCount,
}: TransactionTableProps) {
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
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1.5 }}
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
          label="Últimos registros"
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

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}>
                Fecha ↓
              </TableCell>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}>
                ID Transacción
              </TableCell>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}>
                Categoría
              </TableCell>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}>
                Género
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}
              >
                Cantidad
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}
              >
                Monto Total
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.slice(0, 8).map((row) => {
              const badge = CATEGORY_BADGE_STYLES[row.productCategory];
              return (
                <TableRow key={row.transactionId} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.8rem' }}>
                    {formatDisplayDate(row.date)}
                  </TableCell>
                  <TableCell sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                    {row.transactionId}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.productCategory}
                      size="small"
                      sx={{
                        bgcolor: badge.bgcolor,
                        color: badge.color,
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: '0.8rem' }}>
                    {row.gender === 'Male' ? 'Hombre' : 'Mujer'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#334155', fontSize: '0.8rem' }}>
                    {row.quantity}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}
                  >
                    ${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.5 }}
      >
        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
          {Math.min(transactions.length, 8)} de {totalCount.toLocaleString('en-US')}{' '}
          transacciones
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
          28/12/2023 – 01/01/2024
        </Typography>
      </Stack>
    </Paper>
  );
}