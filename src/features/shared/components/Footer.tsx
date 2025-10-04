import React from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/hooks/use-site-content';
import { Facebook, Instagram } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Footer = () => {
  const { content, isLoading } = useSiteContent('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="font-heading text-2xl font-bold mb-4">
            {isLoading ? <Skeleton className="h-8 w-48 mx-auto" /> : content?.company}
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mb-6">
            <motion.a
              href={content?.facebook_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-10 h-10 bg-background/10 rounded-full hover:bg-background/20 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </motion.a>
            <motion.a
              href={content?.instagram_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-10 h-10 bg-background/10 rounded-full hover:bg-background/20 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </motion.a>
          </div>
          
          <div className="text-sm opacity-70">
          © {currentYear} {isLoading ? <Skeleton className="h-4 w-32 inline-block" /> : <span>{content?.company}</span>}. {isLoading ? <Skeleton className="h-4 w-48 inline-block" /> : <span>{content?.rights}</span>}.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;