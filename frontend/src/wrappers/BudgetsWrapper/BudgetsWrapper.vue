<script setup lang="ts">
import BudgetList from '@/components/domain/BudgetList/BudgetList.vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import { useFinanceStore } from '@/stores/finance.store';

const financeStore = useFinanceStore();
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Budgets" description="Compare planned spending against current phase 1 expense data.">
      <template #actions>
        <BaseButton>+ Budget</BaseButton>
      </template>
    </PageHeader>

    <BudgetList :budgets="financeStore.budgets" />
  </div>
</template>
