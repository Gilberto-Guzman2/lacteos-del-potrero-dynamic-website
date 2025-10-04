import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/hooks/use-site-content';
import { Skeleton } from '@/components/ui/skeleton';

const OrdersSection = () => {
  const { content, isLoading } = useSiteContent('orders_page');

  const handleWhatsAppClick = () => {
    if (content?.whatsapp_link) {
      window.open(content.whatsapp_link, '_blank');
    } else {
      const phoneNumber = "529613211389";
      const message = "Hola, me gustaría hacer un pedido de quesos";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <section id="orders" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div role="heading" aria-level="2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">
            {isLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : content?.title}
          </div>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {isLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : content?.description}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              {isLoading ? <Skeleton className="h-6 w-24" /> : content?.whatsapp_button}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrdersSection;