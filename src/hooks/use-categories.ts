import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface Category {
  id: number;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const addCategory = async (name: string): Promise<Category> => {
  const { data, error } = await supabase.from('categories').insert({ name }).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
};

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery<Category[]>({ 
    queryKey: ['categories'], 
    queryFn: fetchCategories 
  });

  const addCategoryMutation = useMutation<Category, Error, string>({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation<void, Error, number>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories,
    isLoading,
    error,
    addCategory: addCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isAddingCategory: addCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
};
