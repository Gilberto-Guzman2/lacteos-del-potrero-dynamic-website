import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AboutSectionForm from '../components/AboutSectionForm'; // Reusing for simplicity, rename if needed

const footerSchema = z.object({
  company: z.string().min(1, 'El nombre de la compañía es requerido'),
  rights: z.string().min(1, 'Los derechos de autor son requeridos'),
  facebook_url: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
  instagram_url: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
});

const FooterPage = () => {
  const { content, isLoading } = useSiteContent('footer');

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
      description="Actualiza el contenido y enlaces del pie de página."
    >
      <AboutSectionForm
        sectionKey="footer"
        sectionTitle="Contenido del Pie de Página"
        sectionDescription="Actualiza el nombre de la compañía, derechos de autor y enlaces a redes sociales."
        formSchema={footerSchema}
        defaultValues={{
          company: content?.company || '',
          rights: content?.rights || '',
          facebook_url: content?.facebook_url || '',
          instagram_url: content?.instagram_url || '',
        }}
        fields={[
          { name: 'company', label: 'Nombre de la Compañía' },
          { name: 'rights', label: 'Derechos de Autor' },
          { name: 'facebook_url', label: 'URL de Facebook', type: 'url' },
          { name: 'instagram_url', label: 'URL de Instagram', type: 'url' },
        ]}
      />
    </AdminPageWrapper>
  );
};

export default FooterPage;