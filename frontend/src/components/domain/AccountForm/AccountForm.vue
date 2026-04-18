<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import type { Account, AccountFormValues, AccountType } from '@/types/finance';

const props = defineProps<{
  account?: Account | null;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [values: AccountFormValues];
  cancel: [];
}>();

const form = reactive({
  name: '',
  type: 'CASH' as AccountType,
  balance: '',
});

function getRawBalance(value: string) {
  return Number(value.replace(/\D/g, ''));
}

function formatBalance(value: string | number) {
  const rawValue = String(value).replace(/\D/g, '');

  if (!rawValue) {
    return '';
  }

  return new Intl.NumberFormat('id-ID').format(Number(rawValue));
}

const submitLabel = computed(() => (props.account ? 'Update account' : 'Create account'));
const isSubmitDisabled = computed(
  () => props.isSubmitting || !form.name.trim() || getRawBalance(form.balance) < 0,
);

watch(
  () => props.account,
  (account) => {
    form.name = account?.name ?? '';
    form.type = account?.type ?? 'CASH';
    form.balance = formatBalance(account?.balance ?? 0);
  },
  { immediate: true },
);

function handleBalanceInput(event: Event) {
  const input = event.target as HTMLInputElement;
  form.balance = formatBalance(input.value);
}

function handleSubmit() {
  if (isSubmitDisabled.value) {
    return;
  }

  emit('submit', {
    name: form.name.trim(),
    type: form.type,
    balance: getRawBalance(form.balance),
  });
}
</script>

<template>
  <form class="rounded-lg border border-ink/10 bg-white p-4 shadow-soft sm:p-5" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label class="block">
        <span class="text-sm font-medium text-ink/70">Name</span>
        <input
          v-model="form.name"
          required
          type="text"
          placeholder="Main Bank"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Type</span>
        <select
          v-model="form.type"
          required
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="CASH">Cash</option>
          <option value="BANK">Bank</option>
          <option value="EWALLET">E-Wallet</option>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="OTHER">Other</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Balance</span>
        <input
          :value="form.balance"
          required
          inputmode="numeric"
          type="text"
          placeholder="0"
          class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm"
          @input="handleBalanceInput"
        />
      </label>
    </div>

    <div class="mt-4 flex flex-wrap gap-3">
      <BaseButton type="submit" :disabled="isSubmitDisabled">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
      <BaseButton v-if="account" type="button" variant="secondary" @click="emit('cancel')">
        Cancel
      </BaseButton>
    </div>
  </form>
</template>
