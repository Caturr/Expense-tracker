import { computed, onMounted, ref } from 'vue';
import { getDashboardData } from '@/services/dashboard.service';
import { createTransaction } from '@/services/transactions.service';
import { useFinanceStore } from '@/stores/finance.store';
import type { TransactionFormValues } from '@/types/finance';

export function useDashboard() {
  const financeStore = useFinanceStore();
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  const availableBalance = ref(0);
  const savingsBalance = ref(0);
  const totalIncome = ref(0);
  const totalExpense = ref(0);

  const accounts = computed(() => financeStore.accounts);
  const categories = computed(() => financeStore.categories);
  const transactions = computed(() => financeStore.transactions);
  async function refreshDashboard() {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await getDashboardData();
      financeStore.setDashboardData(data);
      availableBalance.value = data.availableBalance;
      savingsBalance.value = data.savingsBalance;
      totalIncome.value = data.totalIncome;
      totalExpense.value = data.totalExpense;
    } catch {
      error.value = 'Unable to load dashboard data.';
    } finally {
      isLoading.value = false;
    }
  }

  async function saveTransaction(values: TransactionFormValues) {
    isSaving.value = true;
    error.value = null;

    try {
      await createTransaction(values);
      await refreshDashboard();
    } catch {
      error.value = 'Unable to save transaction.';
      throw new Error(error.value);
    } finally {
      isSaving.value = false;
    }
  }

  onMounted(() => {
    void refreshDashboard();
  });

  return {
    accounts,
    categories,
    transactions,
    availableBalance,
    savingsBalance,
    totalIncome,
    totalExpense,
    isLoading,
    isSaving,
    error,
    refreshDashboard,
    saveTransaction,
  };
}
