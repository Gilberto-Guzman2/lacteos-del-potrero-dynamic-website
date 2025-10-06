import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

export const useFaqs = () => {
  const queryClient = useQueryClient();

  const { data: faqs, isLoading, error } = useQuery<Faq[]>({ 
    queryKey: ['faqs'], 
    queryFn: async () => {
      const { data, error } = await supabase.from('faqs').select('*');
      if (error) throw new Error(error.message);
      return data;
    }
  });

  const addFaqMutation = useMutation<Faq, Error, { question: string; answer: string }>({ 
    mutationFn: async (newFaq) => {
      const { data, error } = await supabase.from('faqs').insert(newFaq).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const updateFaqMutation = useMutation<Faq, Error, Faq>({ 
    mutationFn: async (updatedFaq) => {
      const { data, error } = await supabase.from('faqs').update(updatedFaq).eq('id', updatedFaq.id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const deleteFaqMutation = useMutation<void, Error, number>({ 
    mutationFn: async (id) => {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  return {
    faqs,
    isLoading,
    error,
    addFaq: addFaqMutation.mutateAsync,
    updateFaq: updateFaqMutation.mutateAsync,
    deleteFaq: deleteFaqMutation.mutateAsync,
  };
};