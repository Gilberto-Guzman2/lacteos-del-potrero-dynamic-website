import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';
import HomeSectionForm from '../components/HomeSectionForm';
import AdminPageWrapper from '../components/AdminPageWrapper';

const homeSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  ctaText: z.string().min(1, 'El texto del botón CTA es requerido'),
  image: z.any().optional(),
});

const HomePage = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('home');
  const { images: homeImages, isLoading: areImagesLoading } = useImages('home');

  if (isContentLoading || areImagesLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Inicio"
      description="Actualiza el contenido de la sección principal (Hero) de la página de inicio."
    >
      <HomeSectionForm
        sectionKey="home"
        sectionTitle="Sección Principal (Hero)"
        sectionDescription="Actualiza el título, subtítulo, texto del botón CTA y la imagen de fondo."
        formSchema={homeSchema}
        defaultValues={{
          title: content?.title || '',
          subtitle: content?.subtitle || '',
          ctaText: content?.ctaText || '',
        }}
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
          { name: 'ctaText', label: 'Texto del Botón CTA' },
        ]}
        imageName="home_background"
        currentImageUrl={homeImages?.find(img => img.name === 'home_background')?.url || null}
      />
    </AdminPageWrapper>
  );
};

export default HomePage;