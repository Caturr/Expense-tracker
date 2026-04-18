<script setup lang="ts">
import { TrendingDown, TrendingUp, Wallet } from 'lucide-vue-next';

defineProps<{
  label: string;
  value: string;
  icon?: 'wallet' | 'trending-up' | 'trending-down';
  tone?: 'neutral' | 'positive' | 'negative';
}>();
</script>

<template>
  <div class="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
    <div class="flex items-center gap-2 text-sm font-medium text-ink/60">
      <Wallet v-if="icon === 'wallet'" class="h-4 w-4" />
      <TrendingUp v-else-if="icon === 'trending-up'" class="h-4 w-4" />
      <TrendingDown v-else-if="icon === 'trending-down'" class="h-4 w-4" />
      <span>{{ label }}</span>
    </div>
    <p
      class="mt-3 text-2xl font-semibold"
      :class="{
        'text-ink': !tone || tone === 'neutral',
        'text-mint': tone === 'positive',
        'text-coral': tone === 'negative',
      }"
    >
      {{ value }}
    </p>
  </div>
</template>
