<script setup lang="ts">
import { computed } from 'vue';
import BaseCard from '@/components/ui/BaseCard/BaseCard.vue';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader.vue';
import type { ExpenseByAccount, ExpenseByCategory, IncomeExpenseTrend } from '@/services/reports.service';
import { formatCurrency, formatDate } from '@/utils/formatters';

const props = defineProps<{
  expenseByCategory: ExpenseByCategory[];
  expenseByAccount: ExpenseByAccount[];
  incomeExpenseTrend: IncomeExpenseTrend[];
}>();

const fallbackColors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed', '#0891b2', '#db2777', '#ea580c'];
const chartWidth = 520;
const chartHeight = computed(() => (hasEnoughTrendData.value ? 220 : 120));
const chartPadding = 24;

const totalCategoryExpense = computed(() =>
  props.expenseByCategory.reduce((total, item) => total + item.amount, 0),
);

const donutGradient = computed(() => {
  if (totalCategoryExpense.value <= 0) {
    return '#eef2f0';
  }

  let cursor = 0;
  const stops = props.expenseByCategory.map((item, index) => {
    const color = getCategoryColor(item, index);
    const start = cursor;
    const end = cursor + (item.amount / totalCategoryExpense.value) * 100;
    cursor = end;

    return `${color} ${start}% ${end}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
});

const maxAccountExpense = computed(() =>
  Math.max(...props.expenseByAccount.map((item) => item.amount), 0),
);

const maxTrendValue = computed(() =>
  Math.max(...props.incomeExpenseTrend.flatMap((item) => [item.income, item.expense]), 0),
);
const hasEnoughTrendData = computed(
  () => props.incomeExpenseTrend.length >= 2 && maxTrendValue.value > 0,
);

const incomePoints = computed(() => getLinePoints('income'));
const expensePoints = computed(() => getLinePoints('expense'));

function getCategoryColor(item: ExpenseByCategory, index: number) {
  return item.categoryColor || fallbackColors[index % fallbackColors.length];
}

function getLinePoints(key: 'income' | 'expense') {
  const values = props.incomeExpenseTrend;

  if (!hasEnoughTrendData.value) {
    return '';
  }

  const drawableWidth = chartWidth - chartPadding * 2;
  const drawableHeight = chartHeight.value - chartPadding * 2;

  return values
    .map((item, index) => {
      const x =
        values.length === 1
          ? chartWidth / 2
          : chartPadding + (index / (values.length - 1)) * drawableWidth;
      const y = chartPadding + drawableHeight - (item[key] / maxTrendValue.value) * drawableHeight;

      return `${x},${y}`;
    })
    .join(' ');
}
</script>

<template>
  <div class="grid gap-4 xl:grid-cols-2">
    <BaseCard>
      <SectionHeader title="Expense by category" />
      <div v-if="expenseByCategory.length" class="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
        <div
          class="mx-auto grid h-44 w-44 place-items-center rounded-full"
          :style="{ background: donutGradient }"
          aria-hidden="true"
        >
          <div class="grid h-24 w-24 place-items-center rounded-full bg-white text-center shadow-soft">
            <span class="text-xs font-medium text-ink/55">Total</span>
            <span class="text-sm font-semibold text-ink">{{ formatCurrency(totalCategoryExpense) }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, index) in expenseByCategory"
            :key="item.categoryId ?? item.categoryName"
            class="flex items-center justify-between gap-3 text-sm"
          >
            <div class="flex min-w-0 items-center gap-2">
              <span
                class="h-3 w-3 shrink-0 rounded-full"
                :style="{ backgroundColor: getCategoryColor(item, index) }"
              />
              <span class="truncate font-medium text-ink">{{ item.categoryName }}</span>
            </div>
            <span class="shrink-0 text-ink/65">{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-ink/55">No expense data yet.</p>
    </BaseCard>

    <BaseCard>
      <SectionHeader title="Expense by account" />
      <div v-if="expenseByAccount.length" class="space-y-4">
        <div v-for="item in expenseByAccount" :key="item.accountId" class="space-y-2">
          <div class="flex items-center justify-between gap-3 text-sm">
            <div class="min-w-0">
              <p class="truncate font-medium text-ink">{{ item.accountName }}</p>
              <p class="text-xs text-ink/50">{{ item.accountType }}</p>
            </div>
            <span class="shrink-0 font-medium text-ink/70">{{ formatCurrency(item.amount) }}</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-ink/10">
            <div
              class="h-full rounded-full bg-coral"
              :style="{ width: `${maxAccountExpense ? (item.amount / maxAccountExpense) * 100 : 0}%` }"
            />
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-ink/55">No account expense data yet.</p>
    </BaseCard>

    <BaseCard class="xl:col-span-2">
      <SectionHeader title="Income vs expense trend" />
      <div v-if="hasEnoughTrendData" class="overflow-x-auto">
        <svg
          class="min-w-[520px]"
          :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
          role="img"
          aria-label="Income and expense trend over time"
        >
          <line
            :x1="chartPadding"
            :x2="chartWidth - chartPadding"
            :y1="chartHeight - chartPadding"
            :y2="chartHeight - chartPadding"
            stroke="#d7ddd9"
            stroke-width="1"
          />
          <polyline
            :points="incomePoints"
            fill="none"
            stroke="#2f9d71"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
          <polyline
            :points="expensePoints"
            fill="none"
            stroke="#f9735b"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
        </svg>
        <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/55">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-mint" />Income</span>
            <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-coral" />Expense</span>
          </div>
          <span>
            {{ formatDate(incomeExpenseTrend[0].date) }} - {{ formatDate(incomeExpenseTrend[incomeExpenseTrend.length - 1].date) }}
          </span>
        </div>
      </div>
      <div v-else class="grid min-h-28 place-items-center rounded-lg border border-dashed border-ink/15 bg-paper/60 px-4 text-center">
        <p class="text-sm font-medium text-ink/60">Add more transactions to see trends</p>
      </div>
    </BaseCard>
  </div>
</template>
