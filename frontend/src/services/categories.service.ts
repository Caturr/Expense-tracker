import { apiClient } from './api-client';
import type { Category, CategoryFormValues, TransactionType } from '@/types/finance';

interface BackendCategory {
  id: string;
  name: string;
  type: TransactionType;
  color?: string | null;
}

function mapCategory(category: BackendCategory): Category {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    color: category.color ?? undefined,
  };
}

export async function getCategories() {
  const categories = await apiClient.get<BackendCategory[]>('/categories');

  return categories.map(mapCategory);
}

export function createCategory(values: CategoryFormValues) {
  return apiClient.post<BackendCategory>('/categories', values);
}

export function updateCategory(id: string, values: CategoryFormValues) {
  return apiClient.patch<BackendCategory>(`/categories/${id}`, values);
}

export function deleteCategory(id: string) {
  return apiClient.delete<BackendCategory>(`/categories/${id}`);
}
