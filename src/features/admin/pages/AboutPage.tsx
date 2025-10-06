import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';
import AboutSectionForm from '../components/AboutSectionForm';
import AboutSectionWithImageForm from '../components/AboutSectionWithImageForm';
import AdminPageWrapper from '../components/AdminPageWrapper';

const mainSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  image: z.any().optional(),
});

const philosophySchema = z.object({
  mission: z.string().min(1, 'La descripción de la misión es requerida'),
  vision: z.string().min(1, 'La descripción de la visión es requerida'),
  values: z.string().min(1, 'La descripción de los valores es requerida'),
});

const AboutPage = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('about');
  const { images: aboutImages, isLoading: areImagesLoading } = useImages('about');

  if (isContentLoading || areImagesLoading) {
    return (
      <div className="space-y-8">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Nosotros"
      description="Actualiza el contenido de la sección de Nosotros."
    >
      <div className="space-y-8">
        <AboutSectionWithImageForm
          sectionKey="about"
          sectionTitle="Sección Principal"
          sectionDescription="Actualiza el título, subtítulo y la imagen de la sección."
          formSchema={mainSchema}
          defaultValues={{
            title: content?.title || '',
            subtitle: content?.subtitle || '',
          }}
          fields={[
            { name: 'title', label: 'Título' },
            { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
          ]}
          imageName="about_us_image"
          currentImageUrl={aboutImages?.find(img => img.name === 'about_us_image')?.url || null}
        />

        <AboutSectionForm
          sectionKey="about"
          sectionTitle="Filosofía de la Empresa"
          sectionDescription="Actualiza la misión, visión y valores de la empresa."
          formSchema={philosophySchema}
          defaultValues={{
            mission: content?.mission || '',
            vision: content?.vision || '',
            values: content?.values || '',
          }}
          fields={[
            { name: 'mission', label: 'Nuestra Misión', type: 'textarea' },
            { name: 'vision', label: 'Nuestra Visión', type: 'textarea' },
            { name: 'values', label: 'Nuestros Valores', type: 'textarea' },
          ]}
        />
      </div>
    </AdminPageWrapper>
  );
};

export default AboutPage;