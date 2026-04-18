<script setup lang="ts">
import { ref } from 'vue';
import AccountForm from '@/components/domain/AccountForm/AccountForm.vue';
import AccountList from '@/components/domain/AccountList/AccountList.vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import BaseModal from '@/components/ui/BaseModal/BaseModal.vue';
import EmptyState from '@/components/ui/EmptyState/EmptyState.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import { useAccounts } from '@/composables/use-accounts';
import type { Account, AccountFormValues } from '@/types/finance';

const {
  accounts,
  editingAccount,
  isLoading,
  isSaving,
  isEmpty,
  error,
  saveAccount,
  removeAccount,
  startEdit,
  cancelEdit,
} = useAccounts();
const isAccountModalOpen = ref(false);

function openCreateModal() {
  cancelEdit();
  isAccountModalOpen.value = true;
}

function openEditModal(account: Account) {
  startEdit(account);
  isAccountModalOpen.value = true;
}

async function handleSaveAccount(values: AccountFormValues) {
  try {
    await saveAccount(values);
    isAccountModalOpen.value = false;
  } catch {
    // The composable owns the user-facing error message.
  }
}

function closeModal() {
  isAccountModalOpen.value = false;
  cancelEdit();
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Accounts" description="Manage the cash, bank, and wallet balances used by transactions.">
      <template #actions>
        <BaseButton icon="plus" @click="openCreateModal">Account</BaseButton>
      </template>
    </PageHeader>

    <p v-if="isLoading" class="text-sm text-ink/60">Loading accounts...</p>
    <p v-else-if="error" class="text-sm text-coral">{{ error }}</p>
    <EmptyState
      v-else-if="isEmpty"
      title="No accounts yet"
      message="Create an account before adding transactions."
    />
    <AccountList
      v-else
      :accounts="accounts"
      show-actions
      @edit="openEditModal"
      @delete="removeAccount"
    />

    <BaseModal
      :is-open="isAccountModalOpen"
      :title="editingAccount ? 'Edit account' : 'Create account'"
      @close="closeModal"
    >
      <p v-if="error && !isLoading" class="mb-4 text-sm text-coral">{{ error }}</p>
      <AccountForm
        :account="editingAccount"
        :is-submitting="isSaving"
        @submit="handleSaveAccount"
        @cancel="closeModal"
      />
    </BaseModal>
  </div>
</template>
