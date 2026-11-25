import { get, onValue, ref } from "firebase/database";
import { database } from "../firebase/firebase";
import type { TransactionRecord } from "../types/dashboard";

/** Convierte el valor crudo de un snapshot en una lista de registros. */
function aLista(
  valor: TransactionRecord[] | Record<string, TransactionRecord> | null
): TransactionRecord[] | null {
  if (valor === null) return null;
  // Firebase devuelve un array cuando las claves son consecutivas (0..n-1)
  // y un objeto con claves string en cualquier otro caso.
  return Array.isArray(valor) ? valor : Object.values(valor);
}

/**
 * Lee una sola vez el nodo indicado en Realtime Database.
 * @param ruta Ruta del nodo que se desea leer (por ejemplo "/").
 * @returns Los registros del nodo, o null si la ruta no contiene datos.
 */
export async function obtenerTransacciones(
  ruta: string
): Promise<TransactionRecord[] | null> {
  const referencia = ref(database, `${ruta}`);

  const snapshot = await get(referencia);

  if (snapshot.exists()) {
    return aLista(snapshot.val() as TransactionRecord[] | Record<string, TransactionRecord>);
  }

  return null;
}

/**
 * Se suscribe a los cambios del nodo indicado en tiempo real.
 * onValue registra un observador y retorna la función para cancelar la suscripción.
 *
 * @param ruta Ruta del nodo que se desea observar.
 * @param onData Se ejecuta con los datos en cada cambio (null si el nodo está vacío).
 * @param onError Se ejecuta si la suscripción es denegada (p. ej. reglas de seguridad).
 * @returns Función que cancela la suscripción.
 */
export function suscribirTransacciones(
  ruta: string,
  onData: (datos: TransactionRecord[] | null) => void,
  onError: (error: Error) => void
): () => void {
  const referencia = ref(database, `${ruta}`);

  return onValue(
    referencia,
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }
      onData(
        aLista(snapshot.val() as TransactionRecord[] | Record<string, TransactionRecord>)
      );
    },
    (error) => onError(error)
  );
}
