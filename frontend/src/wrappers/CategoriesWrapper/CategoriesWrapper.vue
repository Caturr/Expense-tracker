<script setup lang="ts">
import { ref } from 'vue';
import CategoryForm from '@/components/domain/CategoryForm/CategoryForm.vue';
import CategoryList from '@/components/domain/CategoryList/CategoryList.vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import BaseModal from '@/components/ui/BaseModal/BaseModal.vue';
import EmptyState from '@/components/ui/EmptyState/EmptyState.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
import { useCategories } from '@/composables/use-categories';
import type { Category, CategoryFormValues } from '@/types/finance';

const {
  categories,
  editingCategory,
  isLoading,
  isSaving,
  isEmpty,
  error,
  saveCategory,
  removeCategory,
  startEdit,
  cancelEdit,
} = useCategories();
const isCategoryModalOpen = ref(false);

function openCreateModal() {
  cancelEdit();
  isCategoryModalOpen.value = true;
}

function openEditModal(category: Category) {
  startEdit(category);
  isCategoryModalOpen.value = true;
}

async function handleSaveCategory(values: CategoryFormValues) {
  try {
    await saveCategory(values);
    isCategoryModalOpen.value = false;
  } catch {
    // The composable owns the user-facing error message.
  }
}

function closeModal() {
  isCategoryModalOpen.value = false;
  cancelEdit();
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Categories" description="Group transactions for cleaner dashboard and report views.">
      <template #actions>
        <BaseButton icon="plus" @click="openCreateModal">Category</BaseButton>
      </template>
    </PageHeader>

    <p v-if="isLoading" class="text-sm text-ink/60">Loading categories...</p>
    <p v-else-if="error" class="text-sm text-coral">{{ error }}</p>
    <EmptyState
      v-else-if="isEmpty"
      title="No categories yet"
      message="Create categories to organize income and expenses."
    />
    <CategoryList
      v-else
      :categories="categories"
      show-actions
      @edit="openEditModal"
      @delete="removeCategory"
    />

    <BaseModal
      :is-open="isCategoryModalOpen"
      :title="editingCategory ? 'Edit category' : 'Create category'"
      @close="closeModal"
    >
      <p v-if="error && !isLoading" class="mb-4 text-sm text-coral">{{ error }}</p>
      <CategoryForm
        :category="editingCategory"
        :is-submitting="isSaving"
        @submit="handleSaveCategory"
        @cancel="closeModal"
      />
    </BaseModal>
  </div>
</template>
