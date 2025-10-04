import { useQuery } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export const useImages = (section: string) => {
  const session = useSession();
  const supabase = getSupabaseClient(session?.access_token || '');
  const { data, isLoading, error } = useQuery({
    queryKey: ['images', section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('images')
        .select('name,url')
        .eq('section', section);

      if (error) {
        throw new Error(error.message);
      }

      const images = data.map(({ name, url, alt_text }) => ({ name, url, alt_text }));

      return images;
    },
  });

  return { images: data, isLoading, error };
};