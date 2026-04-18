<script setup lang="ts">
import StatCard from '@/components/ui/StatCard/StatCard.vue';

defineProps<{
  income: string;
  expense: string;
  savingsRate: string;
}>();
</script>

<template>
  <div class="grid gap-4 md:grid-cols-3">
    <StatCard label="Income" :value="income" tone="positive" />
    <StatCard label="Expense" :value="expense" tone="negative" />
    <StatCard label="Savings rate" :value="savingsRate" />
  </div>
</template>
