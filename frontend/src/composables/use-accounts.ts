import { computed, onMounted, ref } from 'vue';
import {
  createAccount as createAccountRequest,
  deleteAccount as deleteAccountRequest,
  getAccounts,
  updateAccount as updateAccountRequest,
} from '@/services/accounts.service';
import { useFinanceStore } from '@/stores/finance.store';
import type { Account, AccountFormValues } from '@/types/finance';

export function useAccounts() {
  const financeStore = useFinanceStore();
  const editingAccount = ref<Account | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  const accounts = computed(() => financeStore.accounts);
  const isEmpty = computed(() => !isLoading.value && accounts.value.length === 0);

  async function refreshAccounts() {
    isLoading.value = true;
    error.value = null;

    try {
      financeStore.setAccounts(await getAccounts());
    } catch {
      error.value = 'Unable to load accounts.';
    } finally {
      isLoading.value = false;
    }
  }

  async function saveAccount(values: AccountFormValues) {
    isSaving.value = true;
    error.value = null;

    try {
      if (editingAccount.value) {
        await updateAccountRequest(editingAccount.value.id, values);
      } else {
        await createAccountRequest(values);
      }

      editingAccount.value = null;
      await refreshAccounts();
    } catch {
      error.value = 'Unable to save account.';
      throw new Error(error.value);
    } finally {
      isSaving.value = false;
    }
  }

  async function removeAccount(account: Account) {
    isSaving.value = true;
    error.value = null;

    try {
      await deleteAccountRequest(account.id);
      if (editingAccount.value?.id === account.id) {
        editingAccount.value = null;
      }
      await refreshAccounts();
    } catch {
      error.value = 'Unable to delete account.';
    } finally {
      isSaving.value = false;
    }
  }

  function startEdit(account: Account) {
    editingAccount.value = account;
  }

  function cancelEdit() {
    editingAccount.value = null;
  }

  onMounted(() => {
    void refreshAccounts();
  });

  return {
    accounts,
    editingAccount,
    isLoading,
    isSaving,
    isEmpty,
    error,
    refreshAccounts,
    saveAccount,
    removeAccount,
    startEdit,
    cancelEdit,
  };
}
