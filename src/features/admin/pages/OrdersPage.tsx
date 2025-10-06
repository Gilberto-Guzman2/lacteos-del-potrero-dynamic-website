import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AboutSectionForm from '../components/AboutSectionForm'; // Reusing for simplicity, rename if needed

const ordersSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  whatsapp_button: z.string().min(1, 'El texto del botón de WhatsApp es requerido'),
  whatsapp_link: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
});

const OrdersPage = () => {
  const { data: content, isLoading } = useSiteContent('orders_page');

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Pedidos"
      description="Actualiza el contenido de la sección de Pedidos."
    >
      <AboutSectionForm
        sectionKey="orders_page"
        sectionTitle="Contenido de Pedidos"
        sectionDescription="Actualiza el título, subtítulo y el botón de WhatsApp."
        formSchema={ordersSchema}
        defaultValues={{
          title: content?.title || '',
          subtitle: content?.subtitle || '',
          whatsapp_button: content?.whatsapp_button || '',
          whatsapp_link: content?.whatsapp_link || '',
        }}
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
          { name: 'whatsapp_button', label: 'Texto del Botón de WhatsApp' },
          { name: 'whatsapp_link', label: 'Enlace de WhatsApp', type: 'url' },
        ]}
      />
    </AdminPageWrapper>
  );
};

export default OrdersPage;