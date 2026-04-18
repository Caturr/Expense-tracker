<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import type { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';

withDefaults(defineProps<{
  transactions: Transaction[];
  variant?: 'table' | 'compact';
  centered?: boolean;
  showActions?: boolean;
}>(), {
  variant: 'table',
  centered: false,
  showActions: false,
});

defineEmits<{
  edit: [transaction: Transaction];
  delete: [transaction: Transaction];
}>();

function getTypeBadgeClass(type: Transaction['type']) {
  if (type === 'INCOME') {
    return 'bg-mint/10 text-mint';
  }

  if (type === 'EXPENSE') {
    return 'bg-coral/10 text-coral';
  }

  return 'bg-ink/5 text-ink/70';
}
</script>

<template>
  <div v-if="variant === 'compact'" class="space-y-3">
    <article
      v-for="transaction in transactions"
      :key="transaction.id"
      class="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold"
            :class="getTypeBadgeClass(transaction.type)"
          >
            {{ transaction.type }}
          </span>
          <span class="text-sm text-ink/55">{{ formatDate(transaction.occurredAt) }}</span>
        </div>
        <p class="mt-2 truncate text-sm font-semibold text-ink">
          {{ transaction.description || transaction.categoryName || 'Transaction' }}
        </p>
        <p class="mt-1 text-xs text-ink/55">
          {{ transaction.accountName }}
          <span v-if="transaction.type === 'TRANSFER'">
            to {{ transaction.destinationAccountName || 'another account' }}
          </span>
          <span v-else> · {{ transaction.categoryName || 'Uncategorized' }}</span>
        </p>
      </div>

      <p
        class="whitespace-nowrap text-right text-base font-semibold"
        :class="transaction.type === 'INCOME' ? 'text-mint' : 'text-coral'"
      >
        {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
      </p>
    </article>
  </div>

  <div v-else class="overflow-x-auto rounded-lg border border-ink/10 bg-white">
    <table
      class="w-full divide-y divide-ink/10"
      :class="{
        'min-w-[760px]': showActions,
        'table-fixed': centered,
      }"
    >
      <thead class="bg-ink/[0.03]">
        <tr>
          <th
            class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55"
            :class="[
              centered ? 'w-[14%] text-center' : 'w-32 text-left',
            ]"
          >
            Date
          </th>
          <th
            class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55"
            :class="centered ? 'w-[28%] text-center' : 'text-left'"
          >
            Description
          </th>
          <th
            class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55"
            :class="centered ? 'w-[16%] text-center' : 'w-40 text-left'"
          >
            Account
          </th>
          <th
            class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55"
            :class="centered ? 'w-[18%] text-center' : 'w-40 text-right'"
          >
            Amount
          </th>
          <th
            class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55"
            :class="centered ? 'w-[24%] text-center' : 'w-52 text-left'"
          >
            Detail
          </th>
          <th
            v-if="showActions"
            class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-ink/55"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-ink/10">
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td class="whitespace-nowrap px-4 py-4 text-sm text-ink/65" :class="{ 'text-center': centered }">
            {{ formatDate(transaction.occurredAt) }}
          </td>
          <td class="px-4 py-4" :class="{ 'text-center': centered }">
            <p class="text-sm font-medium text-ink">
              {{ transaction.description || transaction.categoryName || 'Transaction' }}
            </p>
            <p class="text-xs text-ink/55">
              {{
                transaction.type === 'TRANSFER'
                  ? `Transfer to ${transaction.destinationAccountName || 'another account'}`
                  : transaction.categoryName || 'Uncategorized'
              }}
            </p>
          </td>
          <td class="whitespace-nowrap px-4 py-4 text-sm text-ink/65" :class="{ 'text-center': centered }">
            {{ transaction.accountName }}
          </td>
          <td
            class="whitespace-nowrap px-4 py-4 text-sm font-semibold"
            :class="[
              centered ? 'text-center' : 'text-right',
              transaction.type === 'INCOME' ? 'text-mint' : 'text-coral',
            ]"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
          </td>
          <td class="px-4 py-4 text-sm text-ink/65" :class="{ 'text-center': centered }">
            <span
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold"
              :class="getTypeBadgeClass(transaction.type)"
            >
              {{ transaction.type }}
            </span>
            <span class="mt-1 block text-xs text-ink/55">
              {{
                transaction.type === 'TRANSFER'
                  ? transaction.destinationAccountName || 'Transfer'
                  : transaction.categoryName || 'Uncategorized'
              }}
            </span>
          </td>
          <td v-if="showActions" class="whitespace-nowrap px-4 py-3 text-right">
            <button class="inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:text-mint/80" @click="$emit('edit', transaction)">
              <Pencil class="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              class="ml-3 inline-flex items-center gap-1.5 text-sm font-medium text-coral hover:text-coral/80"
              @click="$emit('delete', transaction)"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
