<script setup lang="ts">
defineProps<{
  title: string;
  eyebrow?: string;
  description?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <p v-if="eyebrow" class="text-sm font-semibold uppercase tracking-[0.16em] text-mint">
        {{ eyebrow }}
      </p>
      <h2 class="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{{ title }}</h2>
      <p v-if="description" class="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
