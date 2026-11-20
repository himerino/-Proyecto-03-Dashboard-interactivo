# Proyecto 03 – Dashboard interactivo

Repositorio del proyecto de dashboard interactivo. Contiene el dataset de ventas en **CSV**, su versión transformada y validada en **JSON**, el **script de transformación** en Python y el **script de validación** que comprueba la estructura, el número de registros y el tratamiento de valores faltantes o inconsistentes.

---

## 1. Estructura del repositorio

```
-Proyecto-03-Dashboard-interactivo/
├── data/
│   ├── retail_sales_dataset.csv    # Fuente original (1000 registros)
│   └── retail_sales_dataset.json   # Resultado de la transformación (1000 registros)
├── scripts/
│   ├── csv_to_json.py              # Transforma y valida el CSV → JSON
│   └── validate_json.py            # Valida el JSON resultante
└── README.md                       # Este archivo
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

## 3. Requisitos previos

- **Python 3.8 o superior** ([python.org](https://www.python.org/downloads/)). Verifica con:

  ```bash
  python --version
  ```

- No se requieren paquetes externos: los scripts usan solo la biblioteca estándar (`csv`, `json`, `datetime`, `pathlib`, `re`), por lo que **no hay nada que instalar con pip**.

---

## 4. Cómo ejecutar los scripts

> Los scripts usan rutas relativas (`data/...`), así que **ejecútalos desde la raíz del repositorio**.

### 4.1. Transformar CSV → JSON

```bash
python scripts/csv_to_json.py
```

**Qué hace:**

1. Lee `data/retail_sales_dataset.csv`.
2. Limpia espacios en blanco y valida que no haya campos vacíos o nulos.
3. Convierte los tipos: numéricos a `int`/`float`, categóricos a `string`, fechas a ISO `YYYY-MM-DD`.
4. Valida dominios categóricos y la consistencia `Quantity × Price per Unit = Total Amount`.
5. Escribe `data/retail_sales_dataset.json` con indentación de 2 espacios y `ensure_ascii=False` (tildes y ñ legibles).
6. Imprime el resumen de auditoría.

**Salida esperada:**

```
Transformación exitosa: 1000 registros validados.
Ingresos totales verificados: $456,000.00 | Unidades totales: 2514
```

Si hay errores, el script lista las filas afectadas (máximo 10) y **no** sobrescribe el JSON:

```
Se encontraron N errores de validación:
 - Fila 47: Categoría no reconocida: ...
```

### 4.2. Validar el JSON generado

```bash
python scripts/validate_json.py
```

**Qué comprueba:**

1. Que el JSON sea sintácticamente válido y que la raíz sea una **lista de objetos**.
2. Que la **cantidad de registros** del JSON coincida con las filas del CSV (1000).
3. El **esquema exacto** de cada registro: mismas claves y tipos de datos correctos (`int`, `float`, `string`).
4. Que **no existan valores faltantes** (`null` o cadenas vacías).
5. Que todas las fechas cumplan el formato **ISO `YYYY-MM-DD`** y correspondan a fechas reales.
6. Registros **inconsistentes**: edades fuera de rango, cantidades no positivas, montos negativos y descuadres de `Quantity × Price per Unit = Total Amount`.
7. `transactionId` **duplicados**.

**Salida esperada (código de salida `0`):**

```
Validación exitosa.
 - Registros: 1000 (CSV: 1000)
 - Esquema y tipos: correctos en los 1000 registros
 - Valores faltantes: 0
 - Fechas en formato ISO YYYY-MM-DD: correctas
 - Registros inconsistentes: 0
 - transactionId únicos: 1000
 - Ingresos totales: $456,000.00
```

Si algo falla, imprime `[ERROR] ...` o `Validación FALLIDA` y devuelve el código de salida `1` (útil para automatizarlo en CI o con `&&`):

```bash
python scripts/csv_to_json.py && python scripts/validate_json.py
```

---

## 5. Estructura del JSON resultante

`data/retail_sales_dataset.json` es un arreglo de 1000 objetos con esta forma:

```json
[
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
]
```

Notas:

- Los nombres de campos usan *camelCase* para facilitar su uso desde JavaScript.
- `pricePerUnit` y `totalAmount` se escriben como entero cuando el valor no tiene decimales y como decimal en caso contrario.
- `date` conserva siempre el formato de texto `YYYY-MM-DD` (compatible con `new Date(...)` en JavaScript y con `Date.from` / `CAST` en SQL).

---

## 6. Alternativa sin Python (servicio online)

Si no quieres instalar Python, el CSV puede convertirse con el servicio [CSV to JSON Converter](https://www.convertcsv.com/csv-to-json.htm) u otra herramienta equivalente. Consideraciones:

- El servicio **solo convierte tipos**: no aplica las validaciones de dominio, la cuadratura matemática ni la normalización de fechas, así que el resultado debe revisarse manualmente.
- El archivo obtenido debe guardarse como `data/retail_sales_dataset.json` para que `scripts/validate_json.py` pueda comprobarlo:

  ```bash
  python scripts/validate_json.py
  ```

---

## 7. Flujo completo de trabajo

```bash
# 1. Clonar el repositorio
git clone <URL-del-repositorio>
cd -Proyecto-03-Dashboard-interactivo

# 2. Transformar CSV a JSON (validando tipos, espacios en blanco y fechas)
python scripts/csv_to_json.py

# 3. Validar la estructura, el conteo y la calidad del JSON
python scripts/validate_json.py

# 4. Verificar el JSON antes de subirlo (opcional)
git status
```

Ambos archivos (`data/retail_sales_dataset.csv` y `data/retail_sales_dataset.json`) ya están incluidos en el repositorio, junto con el script de transformación y estas instrucciones.
