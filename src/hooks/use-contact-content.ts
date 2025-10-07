import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface Location {
  id: number;
  name: string;
  address: string;
  hours: string;
}

interface ContactMethod {
  id: number;
  type: string;
  value: string;
  description: string;
}

interface ContactContent {
  locations: Location[];
  contact_methods: ContactMethod[];
  title?: string;
  subtitle?: string;
}

const fetchContactContent = async (): Promise<ContactContent> => {
  const { data, error } = await supabase
    .from('site_content')
    .select('element, content')
    .in('element', ['locations', 'contact_methods', 'contact_title', 'contact_subtitle']);

  if (error) throw new Error(error.message);

  const content = data.reduce((acc, { element, content }) => {
    try {
      if (element === 'locations' || element === 'contact_methods') {
        acc[element] = content ? JSON.parse(content) : [];
      } else {
        acc[element] = content || '';
      }
    } catch (e) {
      console.error(`Failed to parse content for ${element}:`, e);
      if (element === 'locations' || element === 'contact_methods') {
        acc[element] = [];
      } else {
        acc[element] = '';
      }
    }
    return acc;
  }, { locations: [], contact_methods: [], title: '', subtitle: '' });

  // I need to get the title and subtitle from the general catalog section
  const { data: catalogContent, error: catalogError } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'catalog')
    .in('element', ['title', 'subtitle']);
  
  if (catalogError) {
    console.error(catalogError);
  } else {
    if(catalogContent[0]) content.title = catalogContent[0].content;
    if(catalogContent[1]) content.subtitle = catalogContent[1].content;
  }


  return content;
};

export const useContactContent = () => {
  return useQuery<ContactContent, Error>({ 
    queryKey: ['contactContent'], 
    queryFn: fetchContactContent 
  });
};
