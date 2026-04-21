<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ReportCharts from '@/components/domain/ReportCharts/ReportCharts.vue';
import ReportSummary from '@/components/domain/ReportSummary/ReportSummary.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import { getReportsData, type ReportsData } from '@/services/reports.service';
import { formatCurrency } from '@/utils/formatters';

type ReportPeriod = 'week' | 'month' | 'year';

const reports = ref<ReportsData>({
  expenseByCategory: [],
  expenseByAccount: [],
  incomeExpenseTrend: [],
});
const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedPeriod = ref<ReportPeriod>('month');
const periodOptions: { label: string; value: ReportPeriod }[] = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
];

const totalIncome = computed(() =>
  reports.value.incomeExpenseTrend.reduce((total, item) => total + item.income, 0),
);
const totalExpense = computed(() =>
  reports.value.incomeExpenseTrend.reduce((total, item) => total + item.expense, 0),
);
const savingsRate = computed(() =>
  totalIncome.value === 0
    ? 'No income data'
    : `${Math.round(((totalIncome.value - totalExpense.value) / totalIncome.value) * 100)}%`,
);

function toDateParam(date: Date) {
  return date.toISOString();
}

function getPeriodRange(period: ReportPeriod) {
  const now = new Date();
  const start = new Date(now);

  if (period === 'week') {
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);
  }

  if (period === 'month') {
    start.setDate(1);
  }

  if (period === 'year') {
    start.setMonth(0, 1);
  }

  start.setHours(0, 0, 0, 0);

  return {
    from: toDateParam(start),
    to: toDateParam(now),
  };
}

async function refreshReports() {
  isLoading.value = true;
  error.value = null;

  try {
    reports.value = await getReportsData(getPeriodRange(selectedPeriod.value));
  } catch {
    error.value = 'Unable to load reports.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void refreshReports();
});
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Reports" description="Review spending signals prepared for dashboard-first analysis." />

    <ReportSummary
      :income="formatCurrency(totalIncome)"
      :expense="formatCurrency(totalExpense)"
      :savings-rate="savingsRate"
    />

    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in periodOptions"
        :key="option.value"
        type="button"
        class="rounded-md border px-3 py-2 text-sm font-semibold transition"
        :class="
          selectedPeriod === option.value
            ? 'border-mint bg-mint text-white'
            : 'border-ink/10 bg-white text-ink/65 hover:border-mint/40 hover:text-ink'
        "
        @click="
          selectedPeriod = option.value;
          refreshReports();
        "
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="isLoading" class="text-sm text-ink/55">Loading reports...</p>
    <p v-else-if="error" class="text-sm text-coral">{{ error }}</p>

    <ReportCharts
      v-else
      :expense-by-category="reports.expenseByCategory"
      :expense-by-account="reports.expenseByAccount"
      :income-expense-trend="reports.incomeExpenseTrend"
    />
  </div>
</template>
