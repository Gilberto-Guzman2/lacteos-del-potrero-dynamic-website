import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LazyImage from '@/components/LazyImage';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useImages } from '@/hooks/use-images';
import { Skeleton } from '@/components/ui/skeleton';

const ProductImageGallery = () => {
  const { images: galleryImages, isLoading, error } = useImages('catalog');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error loading images.</div>;
  }

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {galleryImages && galleryImages.length > 0 ? (
          galleryImages.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <LazyImage
                    src={image.url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    width={400}
                    height={400}
                  />
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[70vh]">
                {selectedImage && (
                  <div className="relative w-full h-full rounded-md overflow-hidden">
                    <LazyImage
                      src={selectedImage}
                      alt="Enlarged product image"
                      className="object-contain w-full h-full"
                      width={1200}
                      height={1200}
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={`placeholder-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="aspect-square rounded-lg overflow-hidden shadow-lg"
            >
              <LazyImage
                src={'/images/cheese-with-bread.png'}
                alt="Placeholder Image"
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ProductImageGallery;