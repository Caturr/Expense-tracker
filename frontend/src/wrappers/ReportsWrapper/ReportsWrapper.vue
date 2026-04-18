<script setup lang="ts">
import { computed } from 'vue';
import ReportSummary from '@/components/domain/ReportSummary/ReportSummary.vue';
import BaseCard from '@/components/ui/BaseCard/BaseCard.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader.vue';
import { useFinanceStore } from '@/stores/finance.store';
import { formatCurrency } from '@/utils/formatters';

const financeStore = useFinanceStore();
const savingsRate = computed(() =>
  financeStore.totalIncome === 0
    ? '0%'
    : `${Math.round(((financeStore.totalIncome - financeStore.totalExpense) / financeStore.totalIncome) * 100)}%`,
);
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Reports" description="Review spending signals prepared for dashboard-first analysis." />

    <ReportSummary
      :income="formatCurrency(financeStore.totalIncome)"
      :expense="formatCurrency(financeStore.totalExpense)"
      :savings-rate="savingsRate"
    />

    <BaseCard>
      <SectionHeader title="Report scope" />
      <p class="text-sm leading-6 text-ink/65">
        Reports stay focused on phase 1 totals and trends until deeper analytics are requested.
      </p>
    </BaseCard>
  </div>
</template>
