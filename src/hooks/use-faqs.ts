import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useFaqs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('question,answer');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return { faqs: data, isLoading, error };
};