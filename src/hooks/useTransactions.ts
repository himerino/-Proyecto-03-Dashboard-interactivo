import { useEffect, useState } from 'react';
import { suscribirTransacciones } from '../services/transactionsService';
import type { TransactionRecord } from '../types/dashboard';

interface UseTransactionsResult {
  transactions: TransactionRecord[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook personalizado suscrito a Firebase Realtime Database.
 *
 * @param ruta Ruta del nodo que se desea leer (por ejemplo '/').
 *             Se agrega a las dependencias del efecto: la suscripción se
 *             vuelve a registrar cada vez que cambia la ruta.
 *
 * Retorna un objeto con las propiedades transactions, loading y error.
 */
export default function useTransactions(ruta: string = '/'): UseTransactionsResult {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: con una ruta vacía no se consulta nada (evitaría leer la raíz completa).
    if (!ruta) {
      setLoading(false);
      return;
    }

    // Registra el observador con onValue; la suscripción se cancela al
    // cambiar la ruta o al desmontar el componente.
    const cancelarSuscripcion = suscribirTransacciones(
      ruta,
      (datos) => {
        setTransactions(datos ?? []);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Error al consultar Firebase');
        setLoading(false);
      }
    );

    // onValue retorna la función para cancelar la suscripción anterior.
    return cancelarSuscripcion;
  }, [ruta]);

  return { transactions, loading, error };
}
