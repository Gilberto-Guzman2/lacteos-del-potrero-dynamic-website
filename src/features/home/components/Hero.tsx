import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';
import { useSiteContent } from '@/hooks/use-site-content';
import { useImages } from '@/hooks/use-images';

const Hero = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('hero');
  const { images, isLoading: isImagesLoading } = useImages('hero');

  if (isContentLoading || isImagesLoading) {
    return null; // Or a skeleton loader
  }

  const heroImage = images?.['hero_background'];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden" role="banner">
      {/* Background Image - Optimized */}
      <div className="absolute inset-0">
        {heroImage && (
          <LazyImage
            src={heroImage.url}
            alt={heroImage.alt_text}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            priority={true}
          />
        )}
                  {/* <div className="absolute inset-0 bg-black/60" /> */}
              </div>
              {/* <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" /> */}      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
          <motion.h1 
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            role="heading"
            aria-level={1}
          >
            {content?.title}
          </motion.h1>
          
          <motion.p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            {content?.subtitle}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ver catálogo de productos lácteos artesanales"
            >
              {content?.cta}
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating Elements */}
      
      <motion.div className="absolute bottom-20 right-10 w-12 h-12 bg-accent/20 rounded-full" animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
    </section>
  );
};

export default Hero;