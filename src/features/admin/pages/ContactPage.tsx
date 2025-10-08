
import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageWrapper from '../components/AdminPageWrapper';
import ListManagementForm from '../components/ListManagementForm';

import AboutSectionForm from '../components/AboutSectionForm';

const contactPageSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
});

const locationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  hours: z.string().min(1, "El horario es requerido"),
});

const contactMethodSchema = z.object({
  type: z.string().min(1, "El tipo es requerido"),
  value: z.string().min(1, "El valor es requerido"),
  description: z.string().optional(),
});

const ContactPage = () => {
  const { data: pageContent, isLoading: isContentLoading } = useSiteContent('contact_page');
  const { data: content, isLoading: isListContentLoading } = useSiteContent('contact');

  if (isContentLoading || isListContentLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Contacto"
      description="Añade, edita o elimina dinámicamente las sucursales y métodos de contacto."
    >
      <div className="space-y-8">
        <AboutSectionForm
          sectionKey="contact_page"
          sectionTitle="Contenido de la Página de Contacto"
          sectionDescription="Actualiza el título y subtítulo de la sección de Contacto."
          formSchema={contactPageSchema}
          defaultValues={{
            title: pageContent?.title || '',
            subtitle: pageContent?.subtitle || '',
          }}
          fields={[
            { name: 'title', label: 'Título' },
            { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
          ]}
        />

        <ListManagementForm
          sectionKey="contact"
          elementKey="locations"
          sectionTitle="Sucursales"
          sectionDescription="Gestiona las direcciones y horarios de tus sucursales."
          itemSchema={locationSchema}
          defaultValues={content?.locations || []}
          formFields={[
            { name: 'name', label: 'Nombre de la Sucursal' },
            { name: 'address', label: 'Dirección' },
            { name: 'hours', label: 'Horario' },
          ]}
          itemSingularName="Sucursal"
        />
        <ListManagementForm
          sectionKey="contact"
          elementKey="contact_methods"
          sectionTitle="Información de Contacto"
          sectionDescription="Gestiona los métodos de contacto como teléfonos y correos."
          itemSchema={contactMethodSchema}
          defaultValues={content?.contact_methods || []}
          formFields={[
            { name: 'type', label: 'Tipo' },
            { name: 'value', label: 'Valor' },
            { name: 'description', label: 'Descripción' },
          ]}
          itemSingularName="Método de Contacto"
        />
      </div>
    </AdminPageWrapper>
  );
};

export default ContactPage;
