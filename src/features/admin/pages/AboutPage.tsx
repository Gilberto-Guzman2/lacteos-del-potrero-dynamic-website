import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';
import AboutSectionForm from '../components/AboutSectionForm';
import AdminPageWrapper from '../components/AdminPageWrapper';

const mainSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  image: z.any().optional(),
});

const missionSchema = z.object({
  mission: z.string().min(1, 'La descripción de la misión es requerida'),
});

const visionSchema = z.object({
  vision: z.string().min(1, 'La descripción de la visión es requerida'),
});

const valuesSchema = z.object({
  values: z.string().min(1, 'La descripción de los valores es requerida'),
});

const AboutPage = () => {
  const { content, isLoading: isContentLoading } = useSiteContent('about');
  const { images: aboutImages, isLoading: areImagesLoading } = useImages('about');

  if (isContentLoading || areImagesLoading) {
    return (
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
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
      <AboutSectionForm
        sectionKey="about"
        sectionTitle="Sección Principal"
        sectionDescription="Actualiza el título, la descripción y la imagen de la sección."
        formSchema={mainSchema}
        defaultValues={{
          title: content?.title || '',
          description: content?.description || '',
        }}
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'description', label: 'Descripción', type: 'textarea' },
        ]}
        imageName="about_us_image"
        currentImageUrl={aboutImages?.about_us_image?.url || null}
      />

      <AboutSectionForm
        sectionKey="about"
        sectionTitle="Nuestra Misión"
        sectionDescription="Actualiza la descripción de la misión."
        formSchema={missionSchema}
        defaultValues={{ mission: content?.mission || '' }}
        fields={[{ name: 'mission', label: 'Descripción de la Misión', type: 'textarea' }]}
      />

      <AboutSectionForm
        sectionKey="about"
        sectionTitle="Nuestra Visión"
        sectionDescription="Actualiza la descripción de la visión."
        formSchema={visionSchema}
        defaultValues={{ vision: content?.vision || '' }}
        fields={[{ name: 'vision', label: 'Descripción de la Visión', type: 'textarea' }]}
      />

      <AboutSectionForm
        sectionKey="about"
        sectionTitle="Nuestros Valores"
        sectionDescription="Actualiza la descripción de los valores."
        formSchema={valuesSchema}
        defaultValues={{ values: content?.values || '' }}
        fields={[{ name: 'values', label: 'Descripción de los Valores', type: 'textarea' }]}
      />
    </AdminPageWrapper>
  );
};

export default AboutPage;