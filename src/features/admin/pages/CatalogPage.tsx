import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';
import CatalogSectionForm from '../components/CatalogSectionForm';
import AdminPageWrapper from '../components/AdminPageWrapper';

const catalogSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  images: z.array(z.any()).optional(),
});

const CatalogPage = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('catalog');
  const { data: images, isLoading: areImagesLoading } = useImages('catalog');

  if (isContentLoading || areImagesLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Catálogo"
      description="Actualiza el contenido de la página de catálogo."
    >
      <CatalogSectionForm
        sectionKey="catalog"
        sectionTitle="Sección de Catálogo"
        sectionDescription="Actualiza el título y el subtítulo de la página de catálogo."
        formSchema={catalogSchema}
        defaultValues={{
          title: content?.title || '',
          subtitle: content?.subtitle || '',
        }}
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
        ]}
        currentImages={images || []}
      />
    </AdminPageWrapper>
  );
};

export default CatalogPage;