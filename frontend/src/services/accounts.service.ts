import { apiClient } from './api-client';
import type { Account, AccountFormValues, AccountType } from '@/types/finance';

type BackendAmount = number | string;

interface BackendAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: BackendAmount;
}

function toNumber(value: BackendAmount) {
  return typeof value === 'number' ? value : Number(value);
}

function mapAccount(account: BackendAccount): Account {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    balance: toNumber(account.balance),
  };
}

export async function getAccounts() {
  const accounts = await apiClient.get<BackendAccount[]>('/accounts');

  return accounts.map(mapAccount);
}

export function createAccount(values: AccountFormValues) {
  return apiClient.post<BackendAccount>('/accounts', values);
}

export function updateAccount(id: string, values: AccountFormValues) {
  return apiClient.patch<BackendAccount>(`/accounts/${id}`, values);
}

export function deleteAccount(id: string) {
  return apiClient.delete<BackendAccount>(`/accounts/${id}`);
}
