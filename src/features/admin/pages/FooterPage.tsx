import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AboutSectionForm from '../components/AboutSectionForm'; // Reusing for simplicity, rename if needed

const footerSchema = z.object({
  facebook_url: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
  instagram_url: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
});

const FooterPage = () => {
  const { data: content, isLoading } = useSiteContent('footer');

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Pie de Página"
      description="Actualiza los enlaces a redes sociales del pie de página."
    >
      <AboutSectionForm
        sectionKey="footer"
        sectionTitle="Redes Sociales"
        sectionDescription="Actualiza los enlaces a Facebook e Instagram."
        formSchema={footerSchema}
        defaultValues={{
          facebook_url: content?.facebook_url || '',
          instagram_url: content?.instagram_url || '',
        }}
        fields={[
          { name: 'facebook_url', label: 'URL de Facebook', type: 'url' },
          { name: 'instagram_url', label: 'URL de Instagram', type: 'url' },
        ]}
      />
    </AdminPageWrapper>
  );
};

export default FooterPage;