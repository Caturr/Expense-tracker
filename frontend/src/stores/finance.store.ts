import { defineStore } from 'pinia';
import type { DashboardData } from '@/services/dashboard.service';
import type { Account, Budget, Category, Transaction } from '@/types/finance';

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
}

export const useFinanceStore = defineStore('finance', {
  state: (): FinanceState => ({
    accounts: [],
    categories: [],
    transactions: [],
    budgets: [],
  }),
  getters: {
    totalIncome: (state) =>
      state.transactions
        .filter((transaction) => transaction.type === 'INCOME')
        .reduce((total, transaction) => total + transaction.amount, 0),
    totalExpense: (state) =>
      state.transactions
        .filter((transaction) => transaction.type === 'EXPENSE')
        .reduce((total, transaction) => total + transaction.amount, 0),
    totalBalance: (state) =>
      state.accounts.reduce((total, account) => total + account.balance, 0),
  },
  actions: {
    setDashboardData(data: DashboardData) {
      this.accounts = data.accounts;
      this.categories = data.categories;
      this.transactions = data.transactions;
    },
    setAccounts(accounts: Account[]) {
      this.accounts = accounts;
    },
    setTransactions(transactions: Transaction[]) {
      this.transactions = transactions;
    },
    setCategories(categories: Category[]) {
      this.categories = categories;
    },
  },
});
