<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
}>();
</script>

<template>
  <div class="rounded-lg border border-dashed border-ink/20 bg-white p-8 text-center">
    <h3 class="text-lg font-semibold text-ink">{{ title }}</h3>
    <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">{{ message }}</p>
  </div>
</template>
