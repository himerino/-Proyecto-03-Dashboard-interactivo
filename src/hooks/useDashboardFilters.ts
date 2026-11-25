import { useEffect, useMemo, useState } from 'react';
import { ALL_CATEGORIES, CATEGORY_COLORS } from '../data/constants';
import type {
  CategorySummary,
  MonthlyRevenuePoint,
  ProductCategory,
  TransactionRecord,
} from '../types/dashboard';

const MONTH_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

function clampDate(value: string, fallback: string, min: string, max: string): string {
  if (!value) return fallback;
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
}

function dateBounds(rows: TransactionRecord[]): { min: string; max: string } {
  if (rows.length === 0) return { min: '', max: '' };
  const dates = rows.map((tx) => tx.date);
  return {
    min: dates.reduce((min, date) => (date < min ? date : min)),
    max: dates.reduce((max, date) => (date > max ? date : max)),
  };
}

function monthsBetween(startDate: string, endDate: string): string[] {
  const months: string[] = [];
  let [year, month] = startDate.split('-').map(Number);
  const [endYear, endMonth] = endDate.split('-').map(Number);

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, '0')}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

function monthLabel(key: string, isFirst: boolean): string {
  const label = MONTH_LABELS[Number(key.slice(5, 7)) - 1];
  return isFirst || key.endsWith('-01') ? `${label} ${key.slice(2, 4)}` : label;
}

function daysInMonth(isoDate: string): number {
  const [year, month] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function buildMonthlySeries(
  rows: TransactionRecord[],
  startDate: string,
  endDate: string
): MonthlyRevenuePoint[] {
  if (!startDate || !endDate) return [];

  const byMonth = new Map<string, TransactionRecord[]>();
  rows.forEach((tx) => {
    const key = tx.date.slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), tx]);
  });

  const months = monthsBetween(startDate, endDate);
  const lastMonth = months[months.length - 1];

  return months.map((key, index) => {
    const point: MonthlyRevenuePoint = {
      month: monthLabel(key, index === 0),
      Beauty: 0,
      Clothing: 0,
      Electronics: 0,
    };

    (byMonth.get(key) ?? []).forEach((tx) => {
      point[tx.productCategory] += tx.totalAmount;
    });

    const isLastMonth = key === lastMonth;
    const dayOfMonth = Number(endDate.slice(8, 10));
    if (isLastMonth && dayOfMonth < daysInMonth(endDate)) {
      point.isPartial = true;
      point.partialDays = dayOfMonth;
    }

    return point;
  });
}

function summarize(
  rows: TransactionRecord[],
  selectedCategories: ProductCategory[]
): CategorySummary[] {
  return ALL_CATEGORIES.filter((category) => selectedCategories.includes(category))
    .map((category) => {
      const items = rows.filter((tx) => tx.productCategory === category);
      const units = (gender: TransactionRecord['gender']) =>
        items
          .filter((tx) => tx.gender === gender)
          .reduce((sum, tx) => sum + tx.quantity, 0);

      return {
        category,
        revenue: items.reduce((sum, tx) => sum + tx.totalAmount, 0),
        transactions: items.length,
        maleUnits: units('Male'),
        femaleUnits: units('Female'),
        color: CATEGORY_COLORS[category],
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export function useDashboardFilters(transactions: TransactionRecord[]) {
  const { min: dataMinDate, max: dataMaxDate } = useMemo(
    () => dateBounds(transactions),
    [transactions]
  );

  const [startDate, setStartDate] = useState<string>(dataMinDate);
  const [endDate, setEndDate] = useState<string>(dataMaxDate);
  const [selectedCategories, setSelectedCategories] =
    useState<ProductCategory[]>(ALL_CATEGORIES);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Ajusta el rango de fechas cuando llegan (o cambian) los datos de Firebase.
  useEffect(() => {
    if (!dataMinDate || !dataMaxDate) return;
    setStartDate((prev) =>
      prev && prev >= dataMinDate && prev <= dataMaxDate ? prev : dataMinDate
    );
    setEndDate((prev) =>
      prev && prev >= dataMinDate && prev <= dataMaxDate ? prev : dataMaxDate
    );
  }, [dataMinDate, dataMaxDate]);

  const onStartDateChange = (value: string) => {
    const next = clampDate(value, startDate, dataMinDate, dataMaxDate);
    setStartDate(next);
    if (next > endDate) setEndDate(next);
  };

  const onEndDateChange = (value: string) => {
    const next = clampDate(value, endDate, dataMinDate, dataMaxDate);
    setEndDate(next);
    if (next < startDate) setStartDate(next);
  };

  const onToggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.length > 1 ? prev.filter((item) => item !== category) : prev;
      }
      return [...prev, category];
    });
  };

  const onToggleAllCategories = () => setSelectedCategories(ALL_CATEGORIES);
  const onToggleMobileFilters = () => setShowMobileFilters((prev) => !prev);
  const onCloseMobileFilters = () => setShowMobileFilters(false);

  const filtered = transactions.filter(
    (tx) =>
      selectedCategories.includes(tx.productCategory) &&
      tx.date >= startDate &&
      tx.date <= endDate
  );

  const totalTransactions = filtered.length;
  const totalRevenue = filtered.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalUnits = filtered.reduce((sum, tx) => sum + tx.quantity, 0);
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const recentTransactions = [...filtered].sort(
    (a, b) =>
      (a.date < b.date ? 1 : a.date > b.date ? -1 : 0) ||
      b.transactionId - a.transactionId
  );

  return {
    startDate,
    endDate,
    minDate: dataMinDate,
    maxDate: dataMaxDate,
    selectedCategories,
    showMobileFilters,
    totalRevenue,
    totalTransactions,
    totalUnits,
    averageTicket,
    activeSummaries: summarize(filtered, selectedCategories),
    monthlyRevenue: buildMonthlySeries(filtered, startDate, endDate),
    recentTransactions,
    onStartDateChange,
    onEndDateChange,
    onToggleCategory,
    onToggleAllCategories,
    onToggleMobileFilters,
    onCloseMobileFilters,
  };
}
