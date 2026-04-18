<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import type { Category } from '@/types/finance';

defineProps<{
  categories: Category[];
  showActions?: boolean;
}>();

defineEmits<{
  edit: [category: Category];
  delete: [category: Category];
}>();
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <article
      v-for="category in categories"
      :key="category.id"
      class="rounded-lg border border-ink/10 bg-white p-4"
    >
      <div class="flex items-center gap-3">
        <span
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: category.color || '#2f9e7e' }"
        />
        <div>
          <p class="font-medium text-ink">{{ category.name }}</p>
          <p class="text-xs text-ink/55">{{ category.type || 'EXPENSE' }}</p>
        </div>
      </div>
      <div v-if="showActions" class="mt-4 flex flex-wrap gap-3">
        <button class="inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:text-mint/80" @click="$emit('edit', category)">
          <Pencil class="h-3.5 w-3.5" />
          Edit
        </button>
        <button class="inline-flex items-center gap-1.5 text-sm font-medium text-coral hover:text-coral/80" @click="$emit('delete', category)">
          <Trash2 class="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </article>
  </div>
</template>
