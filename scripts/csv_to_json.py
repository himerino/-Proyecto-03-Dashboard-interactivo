import csv
import json
from datetime import datetime
from pathlib import Path

INPUT_CSV = Path("data/retail_sales_dataset.csv")
OUTPUT_JSON = Path("data/retail_sales_dataset.json")

VALID_CATEGORIES = {"Beauty", "Clothing", "Electronics"}
VALID_GENDERS = {"Male", "Female"}

def parse_and_validate_date(date_str: str) -> str:
    """Valida y estandariza la fecha al formato ISO YYYY-MM-DD."""
    clean_date = date_str.strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(clean_date, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    raise ValueError(f"Formato de fecha inválido: {date_str}")

def transform_csv_to_json():
    if not INPUT_CSV.exists():
        raise FileNotFoundError(f"No se encontró el archivo fuente: {INPUT_CSV}")

    records = []
    errors = []

    with INPUT_CSV.open(mode="r", encoding="utf-8-sig", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        
        for row_num, row in enumerate(reader, start=2):
            try:
                # 1. Limpieza de espacios en blanco y validación de nulos
                if any(val is None or str(val).strip() == "" for val in row.values()):
                    raise ValueError("Existen campos vacíos o nulos en el registro.")

                transaction_id = int(row["Transaction ID"].strip())
                date_iso = parse_and_validate_date(row["Date"])
                customer_id = row["Customer ID"].strip()
                gender = row["Gender"].strip()
                age = int(row["Age"].strip())
                category = row["Product Category"].strip()
                quantity = int(row["Quantity"].strip())
                price_per_unit = float(row["Price per Unit"].strip())
                total_amount = float(row["Total Amount"].strip())

                # 2. Validación de dominios e integridad de negocio
                if category not in VALID_CATEGORIES:
                    raise ValueError(f"Categoría no reconocida: {category}")
                if gender not in VALID_GENDERS:
                    raise ValueError(f"Género no reconocido: {gender}")
                if round(quantity * price_per_unit, 2) != round(total_amount, 2):
                    raise ValueError(f"Inconsistencia matemática: {quantity} * {price_per_unit} != {total_amount}")

                # 3. Construcción del objeto tipado
                records.append({
                    "transactionId": transaction_id,
                    "date": date_iso,
                    "customerId": customer_id,
                    "gender": gender,
                    "age": age,
                    "productCategory": category,
                    "quantity": quantity,
                    "pricePerUnit": int(price_per_unit) if price_per_unit.is_integer() else price_per_unit,
                    "totalAmount": int(total_amount) if total_amount.is_integer() else total_amount
                })

            except Exception as e:
                errors.append(f"Fila {row_num}: {e}")

    if errors:
        print(f"Se encontraron {len(errors)} errores de validación:")
        for err in errors[:10]:
            print(" -", err)
        return

    # 4. Exportación a JSON formateado
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_JSON.open(mode="w", encoding="utf-8") as json_file:
        json.dump(records, json_file, indent=2, ensure_ascii=False)

    # 5. Resumen de auditoría
    total_revenue = sum(r["totalAmount"] for r in records)
    total_units = sum(r["quantity"] for r in records)
    print(f"Transformación exitosa: {len(records)} registros validados.")
    print(f"Ingresos totales verificados: ${total_revenue:,.2f} | Unidades totales: {total_units}")

if __name__ == "__main__":
    transform_csv_to_json()