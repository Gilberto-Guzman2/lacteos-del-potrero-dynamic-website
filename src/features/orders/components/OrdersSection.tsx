import React from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/hooks/use-site-content';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';

const OrdersSection = () => {
  const { data: content, isLoading } = useSiteContent('orders_page');

  return (
    <section id="orders" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
              <Skeleton className="h-6 w-full mx-auto mb-8" />
              <Skeleton className="h-12 w-48 mx-auto" />
            </>
          ) : (
            <>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">{content?.title || 'Lorem Ipsum'}</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
              <p className="text-lg text-muted-foreground mb-8">{content?.subtitle || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
              <a href={content?.whatsapp_link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 font-bold text-lg py-6 px-8 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full">
                  <FaWhatsapp className="h-6 w-6" />
                  {content?.whatsapp_button || 'Lorem Ipsum'}
                </Button>
              </a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default OrdersSection;