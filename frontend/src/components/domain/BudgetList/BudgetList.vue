<script setup lang="ts">
import type { Budget } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

defineProps<{
  budgets: Budget[];
}>();

function getProgress(budget: Budget) {
  if (budget.amount === 0) {
    return 0;
  }

  return Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
}
</script>

<template>
  <div class="space-y-4">
    <article
      v-for="budget in budgets"
      :key="budget.id"
      class="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="font-semibold text-ink">{{ budget.name }}</h3>
          <p class="text-sm text-ink/55">{{ budget.categoryName || 'All categories' }}</p>
        </div>
        <p class="text-sm font-semibold text-ink">
          {{ formatCurrency(budget.spent) }} / {{ formatCurrency(budget.amount) }}
        </p>
      </div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
        <div class="h-full rounded-full bg-mint" :style="{ width: `${getProgress(budget)}%` }" />
      </div>
    </article>
  </div>
</template>
