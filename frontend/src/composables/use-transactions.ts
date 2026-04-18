import { computed, onMounted, ref } from 'vue';
import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  getTransactionsData,
  updateTransaction as updateTransactionRequest,
} from '@/services/transactions.service';
import { useFinanceStore } from '@/stores/finance.store';
import type { Transaction, TransactionFilters, TransactionFormValues } from '@/types/finance';

export function useTransactions() {
  const financeStore = useFinanceStore();
  const editingTransaction = ref<Transaction | null>(null);
  const filters = ref<TransactionFilters>({});
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  const transactions = computed(() => financeStore.transactions);
  const accounts = computed(() => financeStore.accounts);
  const categories = computed(() => financeStore.categories);
  const isEmpty = computed(() => !isLoading.value && transactions.value.length === 0);

  async function refreshTransactions() {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await getTransactionsData(filters.value);
      financeStore.setAccounts(data.accounts);
      financeStore.setCategories(data.categories);
      financeStore.setTransactions(data.transactions);
    } catch {
      error.value = 'Unable to load transactions.';
    } finally {
      isLoading.value = false;
    }
  }

  async function saveTransaction(values: TransactionFormValues) {
    isSaving.value = true;
    error.value = null;

    try {
      if (editingTransaction.value) {
        await updateTransactionRequest(editingTransaction.value.id, values);
      } else {
        await createTransactionRequest(values);
      }

      editingTransaction.value = null;
      await refreshTransactions();
    } catch {
      error.value = 'Unable to save transaction.';
    } finally {
      isSaving.value = false;
    }
  }

  async function removeTransaction(transaction: Transaction) {
    isSaving.value = true;
    error.value = null;

    try {
      await deleteTransactionRequest(transaction.id);
      if (editingTransaction.value?.id === transaction.id) {
        editingTransaction.value = null;
      }
      await refreshTransactions();
    } catch {
      error.value = 'Unable to delete transaction.';
    } finally {
      isSaving.value = false;
    }
  }

  function startEdit(transaction: Transaction) {
    editingTransaction.value = transaction;
  }

  function cancelEdit() {
    editingTransaction.value = null;
  }

  async function updateFilters(nextFilters: TransactionFilters) {
    filters.value = {
      ...filters.value,
      ...nextFilters,
    };

    await refreshTransactions();
  }

  async function resetFilters() {
    filters.value = {};
    await refreshTransactions();
  }

  onMounted(() => {
    void refreshTransactions();
  });

  return {
    accounts,
    categories,
    transactions,
    filters,
    editingTransaction,
    isLoading,
    isSaving,
    isEmpty,
    error,
    refreshTransactions,
    saveTransaction,
    removeTransaction,
    startEdit,
    cancelEdit,
    updateFilters,
    resetFilters,
  };
}
