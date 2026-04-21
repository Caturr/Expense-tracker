<script setup lang="ts">
import { Folder, Landmark, Pencil, Smartphone, Trash2, Wallet } from 'lucide-vue-next';
import type { Account } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

defineProps<{
  accounts: Account[];
  showActions?: boolean;
}>();

defineEmits<{
  edit: [account: Account];
  delete: [account: Account];
}>();

function getAccountIcon(type: Account['type']) {
  if (type === 'BANK') {
    return Landmark;
  }

  if (type === 'EWALLET') {
    return Smartphone;
  }

  if (type === 'CASH') {
    return Wallet;
  }

  return Folder;
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="account in accounts"
      :key="account.id"
      class="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 rounded-md bg-mint/10 p-2 text-mint">
            <component :is="getAccountIcon(account.type)" class="h-4 w-4" />
          </span>
          <div>
            <h3 class="font-semibold text-ink">{{ account.name }}</h3>
            <p class="mt-1 text-sm text-ink/55">{{ account.type }} - {{ account.purpose }}</p>
          </div>
        </div>
        <span class="rounded-md bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">
          Active
        </span>
      </div>
      <p class="mt-6 text-2xl font-semibold text-ink">{{ formatCurrency(account.balance) }}</p>
      <div v-if="showActions" class="mt-5 flex flex-wrap gap-3">
        <button class="inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:text-mint/80" @click="$emit('edit', account)">
          <Pencil class="h-3.5 w-3.5" />
          Edit
        </button>
        <button class="inline-flex items-center gap-1.5 text-sm font-medium text-coral hover:text-coral/80" @click="$emit('delete', account)">
          <Trash2 class="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </article>
  </div>
</template>
