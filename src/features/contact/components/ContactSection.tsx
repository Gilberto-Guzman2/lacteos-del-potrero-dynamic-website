import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/use-site-content';
import { Skeleton } from '@/components/ui/skeleton';

const ContactSection = () => {
  const { content, isLoading } = useSiteContent('contact_page');

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div role="heading" aria-level="2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">
            {isLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : content?.title}
          </div>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : content?.subtitle}
          </div>
        </motion.div>

        {/* Store Locations */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.tuxtla_title}</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-full" /> : content?.tuxtla_address}</div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-muted-foreground font-medium">{isLoading ? <Skeleton className="h-4 w-1/2 mx-auto" /> : content?.tuxtla_hours}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-card shadow-lg border border-border"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.ocozocoautla_title}</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-full" /> : content?.ocozocoautla_address}</div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-muted-foreground font-medium">{isLoading ? <Skeleton className="h-4 w-1/2 mx-auto" /> : content?.ocozocoautla_hours}</div>
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
            <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.phone_title}</div>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: isLoading ? '<skeleton class="h-4 w-full"></skeleton>' : content?.phone_number || '' }}></div>
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
            <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">{isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : content?.email_title}</div>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: isLoading ? '<skeleton class="h-4 w-full"></skeleton>' : content?.email_address || '' }}></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;