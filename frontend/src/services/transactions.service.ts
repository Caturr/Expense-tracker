import { apiClient } from './api-client';
import type {
  Account,
  AccountPurpose,
  AccountType,
  Category,
  TransactionFilters,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from '@/types/finance';

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
  accountId: string;
  destinationAccountId?: string | null;
  categoryId?: string | null;
  account: BackendAccount;
  destinationAccount?: BackendAccount | null;
  category?: BackendCategory | null;
}

interface BackendTransactionListResponse {
  items: BackendTransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
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
    accountId: transaction.accountId,
    destinationAccountId: transaction.destinationAccountId ?? undefined,
    categoryId: transaction.categoryId ?? undefined,
    accountName: transaction.account.name,
    destinationAccountName: transaction.destinationAccount?.name,
    categoryName: transaction.category?.name,
  };
}

export async function getTransactionsData(filters: TransactionFilters = {}) {
  const [transactions, accounts, categories] = await Promise.all([
    getAllTransactions(filters),
    apiClient.get<BackendAccount[]>('/accounts'),
    apiClient.get<BackendCategory[]>('/categories'),
  ]);

  return {
    transactions: transactions.map(mapTransaction),
    accounts: accounts.map(mapAccount),
    categories: categories.map(mapCategory),
  };
}

async function getAllTransactions(filters: TransactionFilters) {
  const limit = 100;
  const query = new URLSearchParams({
    page: '1',
    limit: String(limit),
  });

  if (filters.type) {
    query.set('type', filters.type);
  }

  if (filters.categoryId) {
    query.set('categoryId', filters.categoryId);
  }

  if (filters.from) {
    query.set('from', new Date(filters.from).toISOString());
  }

  if (filters.to) {
    query.set('to', new Date(filters.to).toISOString());
  }

  const firstPage = await apiClient.get<BackendTransactionListResponse>(
    `/transactions?${query.toString()}`,
  );
  const transactions = [...firstPage.items];
  const totalPages = Math.ceil(firstPage.meta.total / firstPage.meta.limit);

  if (totalPages <= 1) {
    return transactions;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      apiClient.get<BackendTransactionListResponse>(getTransactionsPagePath(query, index + 2)),
    ),
  );

  for (const page of remainingPages) {
    transactions.push(...page.items);
  }

  return transactions;
}

function getTransactionsPagePath(query: URLSearchParams, page: number) {
  const pageQuery = new URLSearchParams(query);
  pageQuery.set('page', String(page));

  return `/transactions?${pageQuery.toString()}`;
}

export function createTransaction(values: TransactionFormValues) {
  return apiClient.post<BackendTransaction>('/transactions', values);
}

export function updateTransaction(id: string, values: TransactionFormValues) {
  return apiClient.patch<BackendTransaction>(`/transactions/${id}`, values);
}

export function deleteTransaction(id: string) {
  return apiClient.delete<BackendTransaction>(`/transactions/${id}`);
}
