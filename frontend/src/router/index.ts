import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout.vue';
import AccountsPage from '@/pages/AccountsPage.vue';
import BudgetsPage from '@/pages/BudgetsPage.vue';
import CategoriesPage from '@/pages/CategoriesPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import ReportsPage from '@/pages/ReportsPage.vue';
import SettingsPage from '@/pages/SettingsPage.vue';
import TransactionsPage from '@/pages/TransactionsPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import { useAuthStore } from '@/stores/auth.store';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { public: true },
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardPage,
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionsPage,
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: AccountsPage,
        },
        {
          path: 'categories',
          name: 'categories',
          component: CategoriesPage,
        },
        {
          path: 'budgets',
          name: 'budgets',
          component: BudgetsPage,
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportsPage,
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsPage,
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (to.meta.public) {
    return authStore.isAuthenticated ? '/dashboard' : true;
  }

  if (!to.matched.some((route) => route.meta.requiresAuth)) {
    return true;
  }

  if (!authStore.token) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }

  if (!authStore.user) {
    const user = await authStore.fetchCurrentUser();

    if (!user) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }
  }

  return true;
});
