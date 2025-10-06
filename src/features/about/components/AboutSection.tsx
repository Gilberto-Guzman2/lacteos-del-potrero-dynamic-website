import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';

const AboutSection = () => {
  const { content, isLoading: isContentLoading } = useSiteContent('about');
  const { images, isLoading: isImagesLoading } = useImages('about');

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div role="heading" aria-level="2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
              {isContentLoading ? <Skeleton className="h-12 w-1/2" /> : content?.title || 'Sobre Nosotros'}
            </div>
            <div className="w-24 h-1 bg-primary rounded-full" />
            <div className="text-lg text-muted-foreground leading-relaxed">
              {isContentLoading ? <Skeleton className="h-24 w-full" /> : content?.subtitle || 'Una breve historia sobre nuestra pasión por los lácteos.'}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Years of experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Natural</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              {isImagesLoading ? <Skeleton className="w-full h-full" /> : <img 
                src={images?.find(img => img.name === 'about_us_image')?.url || ''}
                alt={content?.title || 'Imagen de la sección sobre nosotros'}
                className="w-full h-full object-cover"
              />}
            </div>
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Mission, Vision, Values Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">Misión</div>
            <div className="text-muted-foreground">{isContentLoading ? <Skeleton className="h-16 w-full" /> : content?.mission}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">Visión</div>
            <div className="text-muted-foreground">{isContentLoading ? <Skeleton className="h-16 w-full" /> : content?.vision}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-6 rounded-xl bg-gradient-card shadow-lg"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div role="heading" aria-level="3" className="font-heading text-xl font-bold mb-3 text-gradient">Valores</div>
            <div className="text-muted-foreground">{isContentLoading ? <Skeleton className="h-16 w-full" /> : content?.values}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;