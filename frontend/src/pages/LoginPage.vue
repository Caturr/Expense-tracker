<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();
const form = reactive({
  email: '',
  password: '',
});

async function handleSubmit() {
  try {
    await authStore.login(form);
    await router.push('/dashboard');
  } catch {
    // The store owns the visible error message.
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-paper px-4 py-8 text-ink">
    <section class="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
      <p class="text-sm font-medium uppercase tracking-[0.18em] text-mint">Expense Tracker</p>
      <h1 class="mt-2 text-3xl font-semibold">Login</h1>
      <p class="mt-2 text-sm leading-6 text-ink/60">Sign in to manage your accounts and transactions.</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <label class="block">
          <span class="text-sm font-medium text-ink/70">Email</span>
          <input
            v-model="form.email"
            required
            type="email"
            autocomplete="email"
            class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-ink/70">Password</span>
          <input
            v-model="form.password"
            required
            minlength="6"
            type="password"
            autocomplete="current-password"
            class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          />
        </label>

        <p v-if="authStore.error" class="text-sm text-coral">{{ authStore.error }}</p>

        <BaseButton class="w-full" type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Signing in...' : 'Login' }}
        </BaseButton>
      </form>
    </section>
  </main>
</template>
