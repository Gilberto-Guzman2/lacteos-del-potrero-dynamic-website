import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';

const Hero = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('home');
  const { images, isLoading: isImagesLoading } = useImages('home');

  const isLoading = isContentLoading || isImagesLoading;
  const heroImage = images?.find(img => img.name === 'home_background');

  if (isLoading) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden" role="banner">
      <div className="absolute inset-0">
        <LazyImage
          src={heroImage?.url || '/images/cheese-with-bread.png'}
          alt={content?.title || 'Imagen de fondo del Hero'}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority={true}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
          <motion.h1 
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
          >
            {content?.title || 'Lorem Ipsum Dolor Sit'}
          </motion.h1>
          
          <motion.p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {content?.subtitle || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </motion.p>
          
          <motion.div>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {content?.ctaText || 'Lorem Ipsum'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;