import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AboutSectionForm from '../components/AboutSectionForm'; // Reusing for simplicity, rename if needed

const contactSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  tuxtla_title: z.string().min(1, 'El título de la sucursal de Tuxtla es requerido'),
  tuxtla_address: z.string().min(1, 'La dirección de la sucursal de Tuxtla es requerida'),
  tuxtla_hours: z.string().min(1, 'El horario de la sucursal de Tuxtla es requerido'),
  ocozocoautla_title: z.string().min(1, 'El título de la sucursal de Ocozocoautla es requerido'),
  ocozocoautla_address: z.string().min(1, 'La dirección de la sucursal de Ocozocoautla es requerida'),
  ocozocoautla_hours: z.string().min(1, 'El horario de la sucursal de Ocozocoautla es requerido'),
  phone_title: z.string().min(1, 'El título del teléfono es requerido'),
  phone_number: z.string().min(1, 'El número de teléfono es requerido'),
  email_title: z.string().min(1, 'El título del correo electrónico es requerido'),
  email_address: z.string().email('Debe ser un correo electrónico válido').min(1, 'El correo electrónico es requerido'),
});

const ContactPage = () => {
  const { content, isLoading } = useSiteContent('contact_page');

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Contacto"
      description="Actualiza el contenido de la sección de Contacto."
    >
      <AboutSectionForm
        sectionKey="contact_page"
        sectionTitle="Contenido de Contacto"
        sectionDescription="Actualiza el título, subtítulo, información de sucursales y datos de contacto."
        formSchema={contactSchema}
        defaultValues={{
          title: content?.title || '',
          subtitle: content?.subtitle || '',
          tuxtla_title: content?.tuxtla_title || '',
          tuxtla_address: content?.tuxtla_address || '',
          tuxtla_hours: content?.tuxtla_hours || '',
          ocozocoautla_title: content?.ocozocoautla_title || '',
          ocozocoautla_address: content?.ocozocoautla_address || '',
          ocozocoautla_hours: content?.ocozocoautla_hours || '',
          phone_title: content?.phone_title || '',
          phone_number: content?.phone_number || '',
          email_title: content?.email_title || '',
          email_address: content?.email_address || '',
        }}
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
          { name: 'tuxtla_title', label: 'Título Sucursal Tuxtla' },
          { name: 'tuxtla_address', label: 'Dirección Sucursal Tuxtla', type: 'textarea' },
          { name: 'tuxtla_hours', label: 'Horario Sucursal Tuxtla' },
          { name: 'ocozocoautla_title', label: 'Título Sucursal Ocozocoautla' },
          { name: 'ocozocoautla_address', label: 'Dirección Sucursal Ocozocoautla', type: 'textarea' },
          { name: 'ocozocoautla_hours', label: 'Horario Sucursal Ocozocoautla' },
          { name: 'phone_title', label: 'Título Teléfono' },
          { name: 'phone_number', label: 'Número de Teléfono' },
          { name: 'email_title', label: 'Título Correo Electrónico' },
          { name: 'email_address', label: 'Correo Electrónico' },
        ]}
      />
    </AdminPageWrapper>
  );
};

export default ContactPage;