<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    icon?: 'plus';
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
);
</script>

<template>
  <button
    :type="type"
    class="inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2"
    :class="
      variant === 'primary'
        ? 'bg-mint text-white hover:bg-mint/90'
        : 'border border-ink/15 bg-white text-ink hover:bg-ink/5'
    "
  >
    <Plus v-if="icon === 'plus'" class="h-4 w-4" />
    <slot />
  </button>
</template>
