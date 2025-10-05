import React from 'react';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const OrdersSection = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('orders_page');
  const { images, isLoading: isImagesLoading } = useImages('orders_page');

  if (isContentLoading || isImagesLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <section id="orders" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{content?.title || 'Pedidos y Entregas'}</h2>
          <p className="text-lg text-muted-foreground mb-8">{content?.description || 'Información sobre cómo realizar pedidos y nuestras políticas de entrega.'}</p>
          <Button size="lg">{content?.cta_text || 'Hacer un Pedido'}</Button>
        </div>
      </div>
    </section>
  );
};

export default OrdersSection;