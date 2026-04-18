<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import type { Category, TransactionFilters } from '@/types/finance';

defineProps<{
  filters: TransactionFilters;
  categories: Category[];
}>();

const emit = defineEmits<{
  change: [filters: TransactionFilters];
  reset: [];
}>();

function updateFilter(key: keyof TransactionFilters, event: Event) {
  const value = (event.target as HTMLInputElement | HTMLSelectElement).value;

  emit('change', {
    [key]: value || undefined,
  });
}
</script>

<template>
  <section class="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <label class="block">
        <span class="text-sm font-medium text-ink/70">Type</span>
        <select
          :value="filters.type ?? ''"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          @change="updateFilter('type', $event)"
        >
          <option value="">All types</option>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Category</span>
        <select
          :value="filters.categoryId ?? ''"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          @change="updateFilter('categoryId', $event)"
        >
          <option value="">All categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">From</span>
        <input
          :value="filters.from ?? ''"
          type="date"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          @input="updateFilter('from', $event)"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">To</span>
        <input
          :value="filters.to ?? ''"
          type="date"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          @input="updateFilter('to', $event)"
        />
      </label>

      <div class="flex items-end">
        <BaseButton type="button" variant="secondary" @click="$emit('reset')">
          Reset filters
        </BaseButton>
      </div>
    </div>
  </section>
</template>
