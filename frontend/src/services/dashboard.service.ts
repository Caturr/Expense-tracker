import { apiClient } from './api-client';
import type { Account, Category, Transaction, TransactionType, AccountPurpose, AccountType } from '@/types/finance';

type BackendAmount = number | string;

interface BackendAccount {
  id: string;
  name: string;
  type: AccountType;
  purpose?: AccountPurpose;
  balance: BackendAmount;
}

interface BackendCategory {
  id: string;
  name: string;
  type: TransactionType;
  color?: string | null;
}

interface BackendTransaction {
  id: string;
  type: TransactionType;
  amount: BackendAmount;
  description?: string | null;
  occurredAt: string;
  destinationAccount?: BackendAccount | null;
  account: BackendAccount;
  category?: BackendCategory | null;
}

interface BackendDashboardSummary {
  totals: {
    availableBalance?: BackendAmount;
    savingsBalance?: BackendAmount;
    income: BackendAmount;
    expense: BackendAmount;
  };
  recentTransactions: BackendTransaction[];
}

export interface DashboardData {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  availableBalance: number;
  savingsBalance: number;
}

function toNumber(value: BackendAmount) {
  return typeof value === 'number' ? value : Number(value);
}

function mapAccount(account: BackendAccount): Account {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    purpose: account.purpose ?? 'OPERATIONAL',
    balance: toNumber(account.balance),
  };
}

function mapCategory(category: BackendCategory): Category {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    color: category.color ?? undefined,
  };
}

function mapTransaction(transaction: BackendTransaction): Transaction {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: toNumber(transaction.amount),
    description: transaction.description ?? undefined,
    occurredAt: transaction.occurredAt,
    accountName: transaction.account.name,
    destinationAccountName: transaction.destinationAccount?.name,
    categoryName: transaction.category?.name,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [summary, accounts, categories] = await Promise.all([
    apiClient.get<BackendDashboardSummary>('/dashboard'),
    apiClient.get<BackendAccount[]>('/accounts'),
    apiClient.get<BackendCategory[]>('/categories'),
  ]);

  return {
    accounts: accounts.map(mapAccount),
    categories: categories.map(mapCategory),
    transactions: summary.recentTransactions.map(mapTransaction),
    totalIncome: toNumber(summary.totals.income),
    totalExpense: toNumber(summary.totals.expense),
    availableBalance: toNumber(summary.totals.availableBalance ?? 0),
    savingsBalance: toNumber(summary.totals.savingsBalance ?? 0),
  };
}
