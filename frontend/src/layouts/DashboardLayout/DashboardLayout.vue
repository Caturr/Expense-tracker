<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { LogOut, Menu, X } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store';
import { mainNavigation } from './navigation';

const isMobileMenuOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  isMobileMenuOpen.value = false;
  void router.push('/login');
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-paper text-ink">
    <aside
      class="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-ink/10 bg-white/85 px-5 py-6 lg:flex"
    >
      <RouterLink to="/" class="block">
        <h1 class="text-sm font-medium-semibold uppercase tracking-[0.18em] text-mint">Expense Tracker</h1>
        <!-- <h1 class="mt-2 text-2xl font-semibold">Dashboard</h1> -->
      </RouterLink>

      <nav class="mt-8 space-y-1">
        <RouterLink
          v-for="item in mainNavigation"
          :key="item.to"
          :to="item.to"
          v-slot="{ href, navigate, isExactActive }"
          custom
        >
          <a
            :href="href"
            class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition"
            :class="
              isExactActive
                ? 'bg-mint text-white hover:bg-mint hover:text-white'
                : 'text-ink/70 hover:bg-mint/10 hover:text-ink'
            "
            @click="navigate"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </a>
        </RouterLink>
      </nav>

      <button
        type="button"
        class="mt-auto flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-coral transition hover:bg-coral/10"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        <span>Logout</span>
      </button>
    </aside>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur md:px-8 lg:hidden">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <RouterLink to="/" @click="isMobileMenuOpen = false">
            <span class="text-lg font-semibold">Expense Tracker</span>
          </RouterLink>

          <button
            type="button"
            class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-ink/10 bg-white text-ink shadow-soft"
            aria-label="Open navigation"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="h-5 w-5" />
          </button>
        </div>
      </header>

      <Teleport to="body">
        <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            class="absolute inset-0 bg-ink/45 transition-opacity"
            aria-label="Close navigation"
            @click="isMobileMenuOpen = false"
          />
          <aside
            class="relative z-10 flex h-full w-[min(19rem,86vw)] translate-x-0 flex-col border-r border-ink/10 bg-white px-5 py-5 shadow-soft transition-transform"
          >
            <div class="flex items-start justify-between gap-4">
              <RouterLink to="/" class="block" @click="isMobileMenuOpen = false">
                <p class="text-sm font-medium uppercase tracking-[0.18em] text-mint">Expense Tracker</p>
                <h1 class="mt-2 text-2xl font-semibold">Dashboard</h1>
              </RouterLink>
              <button
                type="button"
                class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-ink/70 hover:bg-ink/5"
                aria-label="Close navigation"
                @click="isMobileMenuOpen = false"
              >
                <X class="h-5 w-5" />
              </button>
            </div>

            <nav class="mt-8 space-y-1">
              <RouterLink
                v-for="item in mainNavigation"
                :key="item.to"
                :to="item.to"
                v-slot="{ href, navigate, isExactActive }"
                custom
              >
                <a
                  :href="href"
                  class="flex min-h-10 items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium"
                  :class="isExactActive ? 'bg-mint text-white' : 'text-ink/70 hover:bg-mint/10 hover:text-ink'"
                  @click="
                    navigate($event);
                    isMobileMenuOpen = false;
                  "
                >
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.label }}</span>
                </a>
              </RouterLink>
            </nav>

            <button
              type="button"
              class="mt-auto flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-coral transition hover:bg-coral/10"
              @click="handleLogout"
            >
              <LogOut class="h-4 w-4" />
              <span>Logout</span>
            </button>
          </aside>
        </div>
      </Teleport>

      <main class="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
