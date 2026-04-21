export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type AccountType = 'CASH' | 'BANK' | 'EWALLET' | 'CREDIT_CARD' | 'OTHER';

export type AccountPurpose = 'OPERATIONAL' | 'SAVINGS';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  purpose: AccountPurpose;
  balance: number;
}

export interface AccountFormValues {
  name: string;
  type: AccountType;
  purpose: AccountPurpose;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  type?: TransactionType;
}

export interface CategoryFormValues {
  name: string;
  type: Extract<TransactionType, 'INCOME' | 'EXPENSE'>;
  color?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  occurredAt: string;
  accountId?: string;
  destinationAccountId?: string;
  categoryId?: string;
  accountName: string;
  destinationAccountName?: string;
  categoryName?: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryName?: string;
}

export interface TransactionFormValues {
  type: TransactionType;
  amount: number;
  description?: string;
  occurredAt: string;
  accountId: string;
  destinationAccountId?: string;
  categoryId?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: string;
  from?: string;
  to?: string;
}
