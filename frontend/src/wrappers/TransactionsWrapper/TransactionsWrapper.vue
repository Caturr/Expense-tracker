<script setup lang="ts">
import TransactionFilters from '@/components/domain/TransactionFilters/TransactionFilters.vue';
import TransactionForm from '@/components/domain/TransactionForm/TransactionForm.vue';
import TransactionList from '@/components/domain/TransactionList/TransactionList.vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import EmptyState from '@/components/ui/EmptyState/EmptyState.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import { useTransactions } from '@/composables/use-transactions';

const {
  accounts,
  categories,
  transactions,
  filters,
  editingTransaction,
  isLoading,
  isSaving,
  isEmpty,
  error,
  saveTransaction,
  removeTransaction,
  startEdit,
  cancelEdit,
  updateFilters,
  resetFilters,
} = useTransactions();
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Transactions" description="Track income and expenses for phase 1 workflows.">
      <template #actions>
        <BaseButton icon="plus">Transaction</BaseButton>
      </template>
    </PageHeader>

    <TransactionForm
      :accounts="accounts"
      :categories="categories"
      :transaction="editingTransaction"
      :is-submitting="isSaving"
      @submit="saveTransaction"
      @cancel="cancelEdit"
    />

    <TransactionFilters
      :filters="filters"
      :categories="categories"
      @change="updateFilters"
      @reset="resetFilters"
    />

    <p v-if="isLoading" class="text-sm text-ink/60">Loading transactions...</p>
    <p v-else-if="error" class="text-sm text-coral">{{ error }}</p>
    <EmptyState
      v-else-if="isEmpty"
      title="No transactions yet"
      message="Create the first transaction to start filling the dashboard."
    />
    <TransactionList
      v-else
      :transactions="transactions"
      show-actions
      @edit="startEdit"
      @delete="removeTransaction"
    />
  </div>
</template>
