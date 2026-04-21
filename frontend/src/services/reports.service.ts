import { apiClient } from './api-client';

type BackendAmount = number | string;

interface BackendExpenseByCategory {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string | null;
  amount: BackendAmount;
}

interface BackendExpenseByAccount {
  accountId: string;
  accountName: string;
  accountType: string;
  amount: BackendAmount;
}

interface BackendIncomeExpenseTrend {
  date: string;
  income: BackendAmount;
  expense: BackendAmount;
  net: BackendAmount;
}

export interface ExpenseByCategory {
  categoryId: string | null;
  categoryName: string;
  categoryColor?: string;
  amount: number;
}

export interface ExpenseByAccount {
  accountId: string;
  accountName: string;
  accountType: string;
  amount: number;
}

export interface IncomeExpenseTrend {
  date: string;
  income: number;
  expense: number;
  net: number;
}

export interface ReportsData {
  expenseByCategory: ExpenseByCategory[];
  expenseByAccount: ExpenseByAccount[];
  incomeExpenseTrend: IncomeExpenseTrend[];
}

export interface ReportFilters {
  from?: string;
  to?: string;
}

function toNumber(value: BackendAmount) {
  return typeof value === 'number' ? value : Number(value);
}

function getReportPath(path: string, filters: ReportFilters) {
  const query = new URLSearchParams();

  if (filters.from) {
    query.set('from', filters.from);
  }

  if (filters.to) {
    query.set('to', filters.to);
  }

  const queryString = query.toString();

  return queryString ? `${path}?${queryString}` : path;
}

export async function getReportsData(filters: ReportFilters = {}): Promise<ReportsData> {
  const [expenseByCategory, expenseByAccount, incomeExpenseTrend] = await Promise.all([
    apiClient.get<BackendExpenseByCategory[]>(getReportPath('/reports/expense-by-category', filters)),
    apiClient.get<BackendExpenseByAccount[]>(getReportPath('/reports/expense-by-account', filters)),
    apiClient.get<BackendIncomeExpenseTrend[]>(getReportPath('/reports/income-expense-trend', filters)),
  ]);

  return {
    expenseByCategory: expenseByCategory.map((item) => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryColor: item.categoryColor ?? undefined,
      amount: toNumber(item.amount),
    })),
    expenseByAccount: expenseByAccount.map((item) => ({
      accountId: item.accountId,
      accountName: item.accountName,
      accountType: item.accountType,
      amount: toNumber(item.amount),
    })),
    incomeExpenseTrend: incomeExpenseTrend.map((item) => ({
      date: item.date,
      income: toNumber(item.income),
      expense: toNumber(item.expense),
      net: toNumber(item.net),
    })),
  };
}
