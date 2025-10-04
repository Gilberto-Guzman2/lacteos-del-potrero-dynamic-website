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
        .select('name,url,alt_text')
        .eq('section', section);

      if (error) {
        throw new Error(error.message);
      }

      const images = data.reduce((acc, { name, url, alt_text }) => {
        acc[name] = { url, alt_text };
        return acc;
      }, {} as Record<string, { url: string; alt_text: string }>);

      console.log(`Fetched images for section ${section}:`, images); // Added console.log

      return images;
    },
  });

  return { images: data, isLoading, error };
};