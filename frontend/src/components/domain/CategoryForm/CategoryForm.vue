<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import type { Category, CategoryFormValues } from '@/types/finance';

const props = defineProps<{
  category?: Category | null;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [values: CategoryFormValues];
  cancel: [];
}>();

const form = reactive<CategoryFormValues>({
  name: '',
  type: 'EXPENSE',
  color: '#2f9e7e',
});

const submitLabel = computed(() => (props.category ? 'Update category' : 'Create category'));
const isSubmitDisabled = computed(() => props.isSubmitting || !form.name.trim() || !form.type);

watch(
  () => props.category,
  (category) => {
    form.name = category?.name ?? '';
    form.type = category?.type === 'INCOME' ? 'INCOME' : 'EXPENSE';
    form.color = category?.color ?? '#2f9e7e';
  },
  { immediate: true },
);

function handleSubmit() {
  if (isSubmitDisabled.value) {
    return;
  }

  emit('submit', {
    name: form.name.trim(),
    type: form.type,
    color: form.color || undefined,
  });
}
</script>

<template>
  <form class="rounded-lg border border-ink/10 bg-white p-4 shadow-soft sm:p-5" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label class="block">
        <span class="text-sm font-medium text-ink/70">Name</span>
        <input
          v-model="form.name"
          required
          type="text"
          placeholder="Food"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Type</span>
        <select
          v-model="form.type"
          required
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Color</span>
        <input
          v-model="form.color"
          type="color"
          class="mt-2 h-10 w-full rounded-md border border-ink/15 bg-white px-2 py-1"
        />
      </label>
    </div>

    <div class="mt-4 flex flex-wrap gap-3">
      <BaseButton type="submit" :disabled="isSubmitDisabled">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
      <BaseButton v-if="category" type="button" variant="secondary" @click="emit('cancel')">
        Cancel
      </BaseButton>
    </div>
  </form>
</template>
