import dataset from '../../data/retail_sales_dataset.json';
import type { ProductCategory, TransactionRecord } from '../types/dashboard';

export const TRANSACTIONS: TransactionRecord[] = dataset.map((row) => ({
  ...row,
  gender: row.gender as TransactionRecord['gender'],
  productCategory: row.productCategory as TransactionRecord['productCategory'],
}));

export const ALL_CATEGORIES: ProductCategory[] = ['Beauty', 'Clothing', 'Electronics'];

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  Electronics: '#3B66F5',
  Clothing: '#14B8A6',
  Beauty: '#7C5DFA',
};

const dates = TRANSACTIONS.map((tx) => tx.date);
export const DATA_MIN_DATE = dates.reduce((min, date) => (date < min ? date : min));
export const DATA_MAX_DATE = dates.reduce((max, date) => (date > max ? date : max));
