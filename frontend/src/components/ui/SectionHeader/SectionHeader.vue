<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="mb-4 flex items-center justify-between gap-3">
    <h3 class="text-lg font-semibold text-ink">{{ title }}</h3>
    <slot />
  </div>
</template>
