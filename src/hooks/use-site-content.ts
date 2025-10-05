import { useQuery } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface SiteContent {
  [key: string]: any;
}

const fetchSiteContent = async (supabase: any, section: string): Promise<SiteContent> => {
  const { data: contentData, error: contentError } = await supabase
    .from('site_content')
    .select('element, content')
    .eq('section', section);

  if (contentError) {
    throw new Error(`Error fetching site content for section ${section}: ${contentError.message}`);
  }

  const content = contentData.reduce((acc, item) => {
    acc[item.element] = item.content;
    return acc;
  }, {} as SiteContent);

  const { data: imageData, error: imageError } = await supabase
    .from('images')
    .select('url')
    .eq('section', section)
    .order('id', { ascending: false })
    .limit(1);

  if (imageError) {
    // Log the error but don't throw, as content might still be usable
    console.error(`Error fetching image for section ${section}: ${imageError.message}`);
  }

  if (imageData && imageData.length > 0) {
    content.imageUrl = imageData[0].url;
  }

  return content;
};

export const useSiteContent = (section: string) => {
  const session = useSession();
  const supabase = getSupabaseClient(session?.access_token || '');
  return useQuery<SiteContent, Error>({
    queryKey: ['site_content', section],
    queryFn: () => fetchSiteContent(supabase, section),
  });
};
