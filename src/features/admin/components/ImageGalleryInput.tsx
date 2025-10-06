import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddImageModal from './AddImageModal';

interface ImageGalleryInputProps {
  onImageDelete: (imageName: string) => void;
  onImageUpdate: (imageName: string, file: File) => void;
  onImageAdd: (file: File) => void;
  currentImages?: { name: string; url: string }[];
}

export const ImageGalleryInput = React.forwardRef<HTMLDivElement, ImageGalleryInputProps>(({ onImageDelete, onImageAdd, currentImages = [] }, ref) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveImage = (file: File) => {
    onImageAdd(file);
  };

  return (
    <div ref={ref}>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddModalOpen(true)} type="button" className="font-bold text-lg py-2 px-4 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full"><Plus className="mr-2" />Agregar Imagen</Button>
      </div>
      <AddImageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveImage}
      />
      <AnimatePresence>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((image) => (
            <motion.div
              key={image.name}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <img src={image.url} alt={image.name} className="w-full h-auto rounded-lg" />
              <div className="absolute inset-0 bg-black/50 flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  title="Remove Image"
                  onClick={() => onImageDelete(image.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
});
