<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end justify-center px-3 py-3 sm:items-center sm:px-4 sm:py-6">
      <button
        type="button"
        class="absolute inset-0 bg-ink/45"
        aria-label="Close modal"
        @click="$emit('close')"
      />
      <section class="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-paper p-4 shadow-soft sm:p-5">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-ink sm:text-xl">{{ title }}</h2>
          <button type="button" class="min-h-10 rounded-md px-2 text-sm font-semibold text-ink/60 hover:text-ink" @click="$emit('close')">
            Close
          </button>
        </div>
        <slot />
      </section>
    </div>
  </Teleport>
</template>
