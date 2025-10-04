import { useQuery } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface SiteContent {
  [key: string]: any;
}

const fetchSiteContent = async (supabase: any, section: string): Promise<SiteContent> => {
  const { data, error } = await supabase
    .from('site_content')
    .select('element, content')
    .eq('section', section);

  if (error) {
    throw new Error(`Error fetching site content for section ${section}: ${error.message}`);
  }

  return data.reduce((acc, item) => {
    acc[item.element] = item.content;
    return acc;
  }, {});
};

export const useSiteContent = (section: string) => {
  const session = useSession();
  const supabase = getSupabaseClient(session?.access_token || '');
  return useQuery<SiteContent, Error>({
    queryKey: ['site_content', section],
    queryFn: () => fetchSiteContent(supabase, section),
  });
};
