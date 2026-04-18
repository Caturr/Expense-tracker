<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import type {
  Account,
  Category,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from '@/types/finance';

const props = defineProps<{
  accounts: Account[];
  categories: Category[];
  transaction?: Transaction | null;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [values: TransactionFormValues];
  cancel: [];
}>();

interface TransactionFormState {
  type: TransactionType;
  amount: string;
  description: string;
  occurredAt: string;
  accountId: string;
  destinationAccountId: string;
  categoryId: string;
}

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getRawAmount(value: string) {
  return Number(value.replace(/\D/g, ''));
}

function formatAmount(value: string | number) {
  const rawValue = String(value).replace(/\D/g, '');

  if (!rawValue) {
    return '';
  }

  return new Intl.NumberFormat('id-ID').format(Number(rawValue));
}

const form = reactive<TransactionFormState>({
  type: 'EXPENSE',
  amount: '',
  description: '',
  occurredAt: getTodayInputValue(),
  accountId: '',
  destinationAccountId: '',
  categoryId: '',
});

const submitLabel = computed(() => (props.transaction ? 'Update transaction' : 'Create transaction'));
const isTransfer = computed(() => form.type === 'TRANSFER');
const filteredCategories = computed(() =>
  props.categories.filter((category) => !category.type || category.type === form.type),
);
const isSubmitDisabled = computed(
  () =>
    props.isSubmitting ||
    !form.type ||
    !form.accountId ||
    (isTransfer.value
      ? !form.destinationAccountId || form.accountId === form.destinationAccountId
      : !form.categoryId) ||
    !form.occurredAt ||
    getRawAmount(form.amount) <= 0,
);

watch(
  () => [props.transaction, props.accounts] as const,
  ([transaction]) => {
    form.type = transaction?.type ?? 'EXPENSE';
    form.amount = transaction ? String(transaction.amount) : '';
    form.description = transaction?.description ?? '';
    form.occurredAt = transaction?.occurredAt.slice(0, 10) ?? getTodayInputValue();
    form.accountId = transaction?.accountId ?? props.accounts[0]?.id ?? '';
    form.destinationAccountId = transaction?.destinationAccountId ?? '';
    form.categoryId = transaction?.categoryId ?? '';
  },
  { immediate: true },
);

watch(
  () => [form.type, filteredCategories.value] as const,
  () => {
    if (!filteredCategories.value.some((category) => category.id === form.categoryId)) {
      form.categoryId = '';
    }
  },
);

watch(
  () => form.type,
  () => {
    if (isTransfer.value) {
      form.categoryId = '';
      return;
    }

    form.destinationAccountId = '';
  },
);

function handleAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  form.amount = formatAmount(input.value);
}

function handleSubmit() {
  if (isSubmitDisabled.value) {
    return;
  }

  emit('submit', {
    type: form.type as TransactionType,
    amount: getRawAmount(form.amount),
    description: form.description.trim() || undefined,
    occurredAt: new Date(form.occurredAt).toISOString(),
    accountId: form.accountId,
    destinationAccountId: isTransfer.value ? form.destinationAccountId : undefined,
    categoryId: isTransfer.value ? undefined : form.categoryId,
  });
}
</script>

<template>
  <form class="rounded-lg border border-ink/10 bg-white p-4 shadow-soft sm:p-5" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <label class="block">
        <span class="text-sm font-medium text-ink/70">Type</span>
        <select
          v-model="form.type"
          required
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Amount</span>
        <input
          :value="form.amount"
          required
          inputmode="numeric"
          type="text"
          placeholder="0"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          @input="handleAmountInput"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Date</span>
        <input
          v-model="form.occurredAt"
          required
          type="date"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">{{ isTransfer ? 'From Account' : 'Account' }}</span>
        <select
          v-model="form.accountId"
          required
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option v-for="account in accounts" :key="account.id" :value="account.id">
            {{ account.name }}
          </option>
        </select>
      </label>

      <label v-if="isTransfer" class="block">
        <span class="text-sm font-medium text-ink/70">To Account</span>
        <select
          v-model="form.destinationAccountId"
          required
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="" disabled>Select destination</option>
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id"
            :disabled="account.id === form.accountId"
          >
            {{ account.name }}
          </option>
        </select>
        <p v-if="form.destinationAccountId && form.accountId === form.destinationAccountId" class="mt-1 text-xs text-coral">
          Source and destination must be different.
        </p>
      </label>

      <label v-else class="block">
        <span class="text-sm font-medium text-ink/70">Category</span>
        <select
          v-model="form.categoryId"
          required
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="" disabled>Select category</option>
          <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Description</span>
        <input
          v-model="form.description"
          type="text"
          placeholder="What was this for?"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        />
      </label>
    </div>

    <div class="mt-4 flex flex-wrap gap-3">
      <BaseButton type="submit" :disabled="isSubmitDisabled">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
      <BaseButton v-if="transaction" type="button" variant="secondary" @click="emit('cancel')">
        Cancel
      </BaseButton>
    </div>
  </form>
</template>
