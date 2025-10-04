
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageFile extends File {
  preview: string;
}

interface ImageGalleryInputProps {
  onChange: (files: ImageFile[]) => void;
  currentImages?: { url: string; alt_text: string }[];
}

const ImageGalleryInput: React.FC<ImageGalleryInputProps> = ({ onChange, currentImages = [] }) => {
  const [files, setFiles] = useState<ImageFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    onChange([...files, ...newFiles]);
  }, [files, onChange]);

  const removeFile = (fileToRemove: ImageFile) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionar imágenes</p>
      </div>
      <AnimatePresence>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <motion.div
              key={`current-${index}`}
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <img src={image.url} alt={image.alt_text} className="w-full h-auto rounded-lg" />
            </motion.div>
          ))}
          {files.map((file, index) => (
            <motion.div
              key={`new-${index}`}
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <img src={file.preview} alt="Preview" className="w-full h-auto rounded-lg" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ImageGalleryInput;
