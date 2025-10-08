import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/use-site-content';
import { Skeleton } from '@/components/ui/skeleton';

const ContactSection = () => {
  const { data: pageContent, isLoading: isPageContentLoading } = useSiteContent('contact_page');
  const { data: content, isLoading: isContentLoading } = useSiteContent('contact');
  const isLoading = isPageContentLoading || isContentLoading;

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phone':
      case 'whatsapp':
        return <Phone className="w-8 h-8 text-primary" />;
      case 'email':
        return <Mail className="w-8 h-8 text-primary" />;
      default:
        return <MapPin className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">
            {isLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : pageContent?.title || 'Contáctanos'}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          {isLoading ? (
            <Skeleton className="h-6 w-3/4 mx-auto" />
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {pageContent?.subtitle || 'Estamos para servirte. Encuéntranos en nuestras sucursales o contáctanos directamente.'}
            </p>
          )}
        </motion.div>

        {/* Store Locations */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {isLoading ? (
            <><Skeleton className="h-48 w-full rounded-xl" /><Skeleton className="h-48 w-full rounded-xl" /></>
          ) : (
            content?.locations && content.locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gradient">{location.name}</h3>
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground">{location.address}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-muted-foreground font-medium">{location.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {isLoading ? (
            <><Skeleton className="h-32 w-full rounded-xl" /><Skeleton className="h-32 w-full rounded-xl" /></>
          ) : (
            content?.contact_methods && content.contact_methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (content.locations?.length || 0 + index) * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getIcon(method.type)}
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gradient">{method.type}</h3>
                <p className="text-muted-foreground">{method.value}</p>
                {method.description && <p className="text-sm text-primary font-medium mt-1">{method.description}</p>}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;