# Proyecto 03 – Dashboard interactivo

Repositorio del proyecto de dashboard interactivo de ventas (*Retail Sales*). La **única fuente de datos de la aplicación** es **Firebase Realtime Database** (1000 registros importados desde el JSON del sprint 1). La **interfaz web responsiva** está desarrollada con **React, TypeScript, Vite y Material UI**.

---

## 1. Estructura del repositorio

```text
-Proyecto-03-Dashboard-interactivo/
├── data/
│   ├── retail_sales_dataset.csv      # Fuente original (1000 registros)
│   └── retail_sales_dataset.json     # Archivo generado en el sprint 1 e importado a Firebase
├── scripts/
│   ├── csv_to_json.py                # Transforma y valida el CSV → JSON
│   └── validate_json.py              # Valida el JSON resultante
├── src/
│   ├── components/
│   │   ├── DashboardContainer.tsx    # Contenedor raíz y gestión de estado (useState)
│   │   ├── Header.tsx                # Encabezado y botón de filtros en móvil
│   │   ├── FilterControls.tsx        # Filtros por fecha y selección múltiple de categoría
│   │   ├── KPICard.tsx               # Tarjeta reutilizable de indicadores clave
│   │   ├── LineChartWidget.tsx       # Gráfico de líneas (ingresos mensuales)
│   │   ├── DonutChartWidget.tsx      # Gráfico circular (participación por categoría)
│   │   ├── BarChartWidget.tsx        # Gráfico de barras agrupadas (categoría y género)
│   │   └── TransactionTable.tsx      # Tabla de transacciones recientes
│   ├── data/
│   │   └── constants.ts              # Categorías y colores (constantes de la interfaz)
│   ├── firebase/
│   │   └── firebase.ts               # Configuración e inicialización de Firebase
│   ├── hooks/
│   │   ├── useTransactions.ts        # Hook personalizado: useEffect + useState (datos, loading, error)
│   │   └── useDashboardFilters.ts    # Filtros y métricas derivadas de los registros
│   ├── services/
│   │   └── transactionsService.ts    # Servicio de acceso a datos (ref → get → val)
│   ├── types/
│   │   └── dashboard.ts              # Interfaces y tipos estáticos en TypeScript
│   ├── App.tsx                       # Integración del hook, tema y CssBaseline de Material UI
│   └── main.tsx                      # Punto de entrada de la aplicación React
├── index.html                        # Plantilla HTML principal de Vite
├── package.json                      # Dependencias y scripts de Node.js
└── README.md                         # Documentación del proyecto
```

---

## 2. Dataset: `data/retail_sales_dataset.csv`

| # | Campo original (CSV)   | Campo en JSON     | Tipo de dato   | Descripción / regla de validación                              |
|---|------------------------|-------------------|----------------|----------------------------------------------------------------|
| 1 | `Transaction ID`       | `transactionId`   | **numérico** (`int`) | Entero positivo y único (sin duplicados).              |
| 2 | `Date`                 | `date`            | **temporal** (`string`, formato ISO `YYYY-MM-DD`) | Se normaliza a fecha ISO 8601. Formatos de entrada aceptados: `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`. |
| 3 | `Customer ID`          | `customerId`      | **categórico** (`string`) | Texto sin espacios extra, ej. `CUST001`.              |
| 4 | `Gender`               | `gender`          | **categórico** (`string`) | Dominio limitado a `Male` / `Female`.                 |
| 5 | `Age`                  | `age`             | **numérico** (`int`) | Entero entre 0 y 120.                                 |
| 6 | `Product Category`     | `productCategory` | **categórico** (`string`) | Dominio limitado a `Beauty`, `Clothing`, `Electronics`. |
| 7 | `Quantity`             | `quantity`        | **numérico** (`int`) | Entero > 0.                                           |
| 8 | `Price per Unit`       | `pricePerUnit`    | **numérico** (`float`/`int`) | ≥ 0.                                          |
| 9 | `Total Amount`         | `totalAmount`     | **numérico** (`float`/`int`) | ≥ 0 y debe cumplir `Quantity × Price per Unit = Total Amount`. |

### Tratamiento de espacios en blanco y valores faltantes

- Se elimina el *trim* (espacios al inicio y al final) de **todos** los campos antes de convertirlos.
- El CSV se lee con `encoding="utf-8-sig"` para descartar el BOM que suelen añadir Excel y otras herramientas.
- Un campo vacío (`""`), `null` o ausente se considera **valor faltante**: la fila se reporta como error y **no** se exporta al JSON.
- Si un valor no cumple su regla (fecha inválida, categoría fuera de dominio, cuadratura matemática incorrecta), la fila también se reporta como error y se detiene la exportación para no publicar datos inconsistentes.

---

## 3. Estructura de los datos en Realtime Database

Los 1000 registros viven en la **raíz** de Firebase Realtime Database (`https://proyecto3g7-default-rtdb.firebaseio.com/`). Cada registro tiene esta forma:

```json
{
  "transactionId": 1,
  "date": "2023-11-24",
  "customerId": "CUST001",
  "gender": "Male",
  "age": 34,
  "productCategory": "Beauty",
  "quantity": 3,
  "pricePerUnit": 50,
  "totalAmount": 150
}
```

Notas:

- Los nombres de campos usan *camelCase* para facilitar su uso desde JavaScript.
- `pricePerUnit` y `totalAmount` se escriben como entero cuando el valor no tiene decimales y como decimal en caso contrario.
- `date` conserva siempre el formato de texto `YYYY-MM-DD` (compatible con `new Date(...)` en JavaScript y con `Date.from` / `CAST` en SQL).

---

## 4. Procesamiento y validación de datos (Python)

Requiere **Python 3.8 o superior**. Este proceso generó el archivo que se importó a Firebase Realtime Database en el sprint 2 (ya no se usa como fuente de datos de la aplicación). Desde la raíz del repositorio:

```bash
# Generar data/retail_sales_dataset.json a partir del CSV
python3 scripts/csv_to_json.py

# Verificar estructura, tipos de datos y cuadratura matemática del JSON
python3 scripts/validate_json.py
```

---

## 5. Aplicación Frontend (Dashboard interactivo)

### Tecnologías utilizadas

- **React 18 + TypeScript:** Construcción de componentes funcionales modulares con tipado estático.
- **Vite:** Entorno de desarrollo rápido y empaquetado de la aplicación.
- **Material UI (MUI) & Emotion:** Sistema de diseño, componentes de interfaz (`Paper`, `Table`, `Chip`, `Collapse`, `TextField`) y normalización global mediante `CssBaseline`.

### Características implementadas

- **Filtrado reactivo con `useState`:** Selección de rango de fechas (`Desde` / `Hasta`) y filtrado múltiple por categoría (`Todos`, `Beauty`, `Clothing`, `Electronics`) que recalcula en tiempo real las tarjetas KPI, los gráficos y la tabla.
- **Visualizaciones estadísticas:** Tres tarjetas de indicadores (*Ingresos Totales*, *Volumen de Ventas* y *Ticket Promedio*), gráfico de evolución mensual, gráfico de dona por participación de categoría, gráfico de barras agrupadas por género y tabla de transacciones recientes.
- **Diseño responsivo (Desktop y Mobile):** Distribución en cuadrícula para escritorio y adaptación a columna única en dispositivos móviles, ocultando los filtros bajo un botón desplegable en la cabecera para optimizar el espacio vertical.

### Integración con Firebase Realtime Database

- **`src/firebase/firebase.ts`:** inicializa la app con `initializeApp(firebaseConfig)` y exporta la instancia de la base con `getDatabase(app)`. Declara `databaseURL` explícita (`https://proyecto3g7-default-rtdb.firebaseio.com/`).
- **`src/services/transactionsService.ts`:** servicio de acceso a datos. `obtenerTransacciones(ruta)` crea la referencia con `ref(database, ruta)`, lee una sola vez con `get(referencia)` y retorna `snapshot.val()` si `snapshot.exists()`, o `null` en caso contrario. Los componentes nunca importan el SDK de Firebase directamente.
- **`src/hooks/useTransactions.ts`:** hook personalizado. Recibe la ruta, declara `useState` para los registros, `loading` y `error`, y dentro de `useEffect` llama a la función asincrónica `cargarDatos()`; la ruta va en el arreglo de dependencias.
- **`src/App.tsx`:** ejecuta el hook al montar, muestra un indicador de carga mientras Firebase responde, un mensaje de error si la consulta falla y el dashboard cuando los datos están disponibles.
- **Reglas de seguridad:** la base está configurada en **solo lectura** (`read: true, write: false`), de modo que la consulta anónima funciona pero cualquier escritura retorna `permission_denied`.

### Instalación y ejecución local

Requiere **Node.js 18 o superior** y **npm**. Desde la raíz del repositorio:

```bash
# 1. Instalar las dependencias del proyecto (incluye Vite y Material UI)
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Una vez iniciado el servidor, abra la URL local indicada en consola (por defecto `http://localhost:5173/`). Para inspeccionar la vista móvil en el navegador, active las herramientas de desarrollador (`F12` → `Ctrl + Shift + M`).