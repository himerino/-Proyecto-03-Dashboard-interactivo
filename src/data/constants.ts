import type { ProductCategory } from '../types/dashboard';

/** Categorías de producto disponibles en el dataset. */
export const ALL_CATEGORIES: ProductCategory[] = ['Beauty', 'Clothing', 'Electronics'];

/** Color asociado a cada categoría para los gráficos. */
export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  Electronics: '#3B66F5',
  Clothing: '#14B8A6',
  Beauty: '#7C5DFA',
};
