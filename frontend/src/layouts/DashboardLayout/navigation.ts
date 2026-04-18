import {
  BarChart3,
  Home,
  PiggyBank,
  Receipt,
  Settings,
  Tags,
  Wallet,
} from 'lucide-vue-next';

export const mainNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Transactions', to: '/transactions', icon: Receipt },
  { label: 'Accounts', to: '/accounts', icon: Wallet },
  { label: 'Categories', to: '/categories', icon: Tags },
  { label: 'Budgets', to: '/budgets', icon: PiggyBank },
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: Settings },
] as const;
