import React from 'react';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('contact_page');
  const { images, isLoading: isImagesLoading } = useImages('contact_page');

  if (isContentLoading || isImagesLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{content?.title || 'Contáctanos'}</h2>
          <p className="text-lg text-muted-foreground mt-4">{content?.subtitle || '¿Tienes alguna pregunta o quieres hacer un pedido especial?'}</p>
        </div>
        <div className="max-w-lg mx-auto">
          <form className="space-y-4">
            <Input placeholder="Nombre" />
            <Input type="email" placeholder="Correo Electrónico" />
            <Textarea placeholder="Mensaje" />
            <Button type="submit" size="lg" className="w-full">{content?.cta_text || 'Enviar Mensaje'}</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;