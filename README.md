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

## 3. Estructura del JSON resultante

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