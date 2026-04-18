import { computed, onMounted, ref } from 'vue';
import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  getCategories,
  updateCategory as updateCategoryRequest,
} from '@/services/categories.service';
import { useFinanceStore } from '@/stores/finance.store';
import type { Category, CategoryFormValues } from '@/types/finance';

export function useCategories() {
  const financeStore = useFinanceStore();
  const editingCategory = ref<Category | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  const categories = computed(() => financeStore.categories);
  const isEmpty = computed(() => !isLoading.value && categories.value.length === 0);

  async function refreshCategories() {
    isLoading.value = true;
    error.value = null;

    try {
      financeStore.setCategories(await getCategories());
    } catch {
      error.value = 'Unable to load categories.';
    } finally {
      isLoading.value = false;
    }
  }

  async function saveCategory(values: CategoryFormValues) {
    isSaving.value = true;
    error.value = null;

    try {
      if (editingCategory.value) {
        await updateCategoryRequest(editingCategory.value.id, values);
      } else {
        await createCategoryRequest(values);
      }

      editingCategory.value = null;
      await refreshCategories();
    } catch {
      error.value = 'Unable to save category.';
      throw new Error(error.value);
    } finally {
      isSaving.value = false;
    }
  }

  async function removeCategory(category: Category) {
    isSaving.value = true;
    error.value = null;

    try {
      await deleteCategoryRequest(category.id);
      if (editingCategory.value?.id === category.id) {
        editingCategory.value = null;
      }
      await refreshCategories();
    } catch {
      error.value = 'Unable to delete category. It may already be used by transactions or budgets.';
    } finally {
      isSaving.value = false;
    }
  }

  function startEdit(category: Category) {
    editingCategory.value = category;
  }

  function cancelEdit() {
    editingCategory.value = null;
  }

  onMounted(() => {
    void refreshCategories();
  });

  return {
    categories,
    editingCategory,
    isLoading,
    isSaving,
    isEmpty,
    error,
    refreshCategories,
    saveCategory,
    removeCategory,
    startEdit,
    cancelEdit,
  };
}
