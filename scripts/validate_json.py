"""Valida el archivo JSON generado a partir del CSV.

Comprueba:
  1. Que el JSON sea sintácticamente válido y sea una lista de objetos.
  2. Que la cantidad de registros coincida con las filas del CSV fuente.
  3. El esquema de cada registro (claves exactas y tipos de datos).
  4. La ausencia de valores faltantes (null / cadena vacía).
  5. El formato de fecha ISO YYYY-MM-DD.
  6. Valores inconsistentes (negativos, edades fuera de rango, cuadratura
     Quantity * Price per Unit == Total Amount).
  7. IDs duplicados.
"""

import csv
import json
import re
from datetime import datetime
from pathlib import Path

INPUT_CSV = Path("data/retail_sales_dataset.csv")
OUTPUT_JSON = Path("data/retail_sales_dataset.json")

DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# Esquema esperado: clave -> tipo Python
EXPECTED_SCHEMA = {
    "transactionId": int,
    "date": str,
    "customerId": str,
    "gender": str,
    "age": int,
    "productCategory": str,
    "quantity": int,
    "pricePerUnit": (int, float),
    "totalAmount": (int, float),
}


def fail(message: str) -> None:
    print(f"[ERROR] {message}")


def main() -> int:
    errors = []

    # 1. Sintaxis y estructura general -------------------------------------
    if not OUTPUT_JSON.exists():
        fail(f"No existe el archivo {OUTPUT_JSON}. Ejecuta primero scripts/csv_to_json.py")
        return 1

    try:
        with OUTPUT_JSON.open(mode="r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as exc:
        fail(f"El JSON no es válido: {exc}")
        return 1

    if not isinstance(data, list):
        fail("La raíz del JSON debe ser una lista de objetos.")
        return 1
    if not all(isinstance(item, dict) for item in data):
        fail("Todos los elementos de la lista deben ser objetos.")
        return 1

    # 2. Cantidad de registros ---------------------------------------------
    with INPUT_CSV.open(mode="r", encoding="utf-8-sig", newline="") as csv_file:
        csv_rows = sum(1 for _ in csv.DictReader(csv_file))

    if len(data) != csv_rows:
        errors.append(f"Registros JSON ({len(data)}) != filas CSV ({csv_rows}).")

    # 3-6. Validación registro por registro --------------------------------
    seen_ids = set()
    for idx, record in enumerate(data, start=1):
        label = f"Registro {idx}"
        errors_before = len(errors)

        missing_keys = set(EXPECTED_SCHEMA) - set(record)
        extra_keys = set(record) - set(EXPECTED_SCHEMA)
        if missing_keys:
            errors.append(f"{label}: faltan claves {sorted(missing_keys)}.")
            continue
        if extra_keys:
            errors.append(f"{label}: claves inesperadas {sorted(extra_keys)}.")

        # Tipos de datos y valores faltantes
        for key, expected_type in EXPECTED_SCHEMA.items():
            value = record[key]
            if value is None or (isinstance(value, str) and value.strip() == ""):
                errors.append(f"{label}: valor faltante en '{key}'.")
            elif not isinstance(value, expected_type) or isinstance(value, bool):
                errors.append(
                    f"{label}: '{key}' debe ser {expected_type}, "
                    f"recibido {type(value).__name__}."
                )

        if len(errors) > errors_before:
            continue

        # Formato de fecha consistente
        if not DATE_PATTERN.match(record["date"]):
            errors.append(f"{label}: fecha fuera del formato ISO YYYY-MM-DD: {record['date']}.")
        else:
            try:
                datetime.strptime(record["date"], "%Y-%m-%d")
            except ValueError:
                errors.append(f"{label}: fecha inválida: {record['date']}.")

        # Valores inconsistentes
        if record["age"] < 0 or record["age"] > 120:
            errors.append(f"{label}: edad fuera de rango: {record['age']}.")
        if record["quantity"] <= 0:
            errors.append(f"{label}: cantidad no positiva: {record['quantity']}.")
        if record["pricePerUnit"] < 0 or record["totalAmount"] < 0:
            errors.append(f"{label}: montos negativos.")
        if round(record["quantity"] * record["pricePerUnit"], 2) != round(record["totalAmount"], 2):
            errors.append(
                f"{label}: inconsistencia matemática "
                f"{record['quantity']} * {record['pricePerUnit']} != {record['totalAmount']}."
            )

        # IDs duplicados
        if record["transactionId"] in seen_ids:
            errors.append(f"{label}: transactionId duplicado: {record['transactionId']}.")
        seen_ids.add(record["transactionId"])

    # 7. Reporte ------------------------------------------------------------
    if errors:
        print(f"Validación FALLIDA: {len(errors)} problema(s) detectado(s):")
        for err in errors[:20]:
            print(" -", err)
        if len(errors) > 20:
            print(f" ... y {len(errors) - 20} más.")
        return 1

    total = sum(r["totalAmount"] for r in data)
    print("Validación exitosa.")
    print(f" - Registros: {len(data)} (CSV: {csv_rows})")
    print(f" - Esquema y tipos: correctos en los {len(data)} registros")
    print(" - Valores faltantes: 0")
    print(" - Fechas en formato ISO YYYY-MM-DD: correctas")
    print(" - Registros inconsistentes: 0")
    print(f" - transactionId únicos: {len(seen_ids)}")
    print(f" - Ingresos totales: ${total:,.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
