import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/use-site-content';
import { Skeleton } from '@/components/ui/skeleton';

const ContactSection = () => {
  const { data: content, isLoading } = useSiteContent('contact_page');

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
            {isLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : content?.title || 'Lorem Ipsum'}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : content?.subtitle || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </p>
        </motion.div>

        {/* Store Locations */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.tuxtla_title || 'Lorem Ipsum'}</h3>
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-full" /> : content?.tuxtla_address || 'Lorem ipsum dolor sit amet'}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-muted-foreground font-medium">{isLoading ? <Skeleton className="h-4 w-1/2" /> : content?.tuxtla_hours || 'Lorem ipsum dolor'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.ocozocoautla_title || 'Lorem Ipsum'}</h3>
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-full" /> : content?.ocozocoautla_address || 'Lorem ipsum dolor sit amet'}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-muted-foreground font-medium">{isLoading ? <Skeleton className="h-4 w-1/2" /> : content?.ocozocoautla_hours || 'Lorem ipsum dolor'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.phone_title || 'Lorem Ipsum'}</h3>
            <p className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-full" /> : content?.phone_number || 'Lorem Ipsum'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.email_title || 'Lorem Ipsum'}</h3>
            <p className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-full" /> : content?.email_address || 'lorem@ipsum.com'}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
