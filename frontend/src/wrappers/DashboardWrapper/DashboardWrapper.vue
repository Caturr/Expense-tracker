<script setup lang="ts">
import { ref } from 'vue';
import AccountList from '@/components/domain/AccountList/AccountList.vue';
import TransactionForm from '@/components/domain/TransactionForm/TransactionForm.vue';
import TransactionList from '@/components/domain/TransactionList/TransactionList.vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal/BaseModal.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader.vue';
import StatCard from '@/components/ui/StatCard/StatCard.vue';
import { useDashboard } from '@/composables/use-dashboard';
import type { TransactionFormValues } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

const {
  accounts,
  categories,
  transactions,
  totalBalance,
  totalIncome,
  totalExpense,
  isLoading,
  isSaving,
  error,
  saveTransaction,
} = useDashboard();
const isTransactionModalOpen = ref(false);

async function handleCreateTransaction(values: TransactionFormValues) {
  try {
    await saveTransaction(values);
    isTransactionModalOpen.value = false;
  } catch {
    // The composable owns the user-facing error message.
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Phase 1"
      title="Dashboard"
      description="Daily expense visibility across accounts, spending, and recent activity."
    >
      <template #actions>
        <BaseButton icon="plus" @click="isTransactionModalOpen = true">Transaction</BaseButton>
      </template>
    </PageHeader>

    <div class="grid gap-4 md:grid-cols-3">
      <StatCard label="Balance" :value="formatCurrency(totalBalance)" icon="wallet" />
      <StatCard label="Income" :value="formatCurrency(totalIncome)" icon="trending-up" tone="positive" />
      <StatCard label="Expense" :value="formatCurrency(totalExpense)" icon="trending-down" tone="negative" />
    </div>

    <BaseCard>
      <SectionHeader title="Recent transactions" />
      <p v-if="isLoading" class="text-sm text-ink/60">Loading dashboard data...</p>
      <p v-else-if="error" class="text-sm text-coral">{{ error }}</p>
      <TransactionList v-else :transactions="transactions" centered />
    </BaseCard>

    <section>
      <SectionHeader title="Accounts" />
      <p v-if="isLoading" class="text-sm text-ink/60">Loading accounts...</p>
      <p v-else-if="error" class="text-sm text-coral">{{ error }}</p>
      <AccountList v-else :accounts="accounts" />
    </section>

    <BaseModal
      :is-open="isTransactionModalOpen"
      title="Create transaction"
      @close="isTransactionModalOpen = false"
    >
      <p v-if="error && !isLoading" class="mb-4 text-sm text-coral">{{ error }}</p>
      <TransactionForm
        :accounts="accounts"
        :categories="categories"
        :is-submitting="isSaving"
        @submit="handleCreateTransaction"
      />
    </BaseModal>
  </div>
</template>
