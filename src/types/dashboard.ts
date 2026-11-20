export type ProductCategory = 'Beauty' | 'Clothing' | 'Electronics';

export interface TransactionRecord {
  transactionId: number;
  date: string; // Formato YYYY-MM-DD
  customerId: string;
  gender: 'Male' | 'Female';
  age: number;
  productCategory: ProductCategory;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  Beauty: number;
  Clothing: number;
  Electronics: number;
  isPartial?: boolean;
}

export interface CategorySummary {
  category: ProductCategory;
  revenue: number;
  transactions: number;
  maleUnits: number;
  femaleUnits: number;
  color: string;
}