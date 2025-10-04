import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageFile extends File {
  preview: string;
}

interface ImageGalleryInputProps {
  onChange: (files: ImageFile[]) => void;
  onImageDelete: (imageName: string) => void;
  onImageUpdate: (imageName: string, file: File) => void;
  currentImages?: { name: string; url: string }[];
}

const ImageGalleryInput = React.forwardRef<HTMLDivElement, ImageGalleryInputProps>(({ onChange, onImageDelete, onImageUpdate, currentImages = [] }, ref) => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFiles([]);
  }, [currentImages]);

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

  const handleImageUpdate = (imageName: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          onImageUpdate(imageName, file);
        }
      };
      fileInputRef.current.click();
    }
  };

  return (
    <div ref={ref}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionar imágenes</p>
      </div>
      <AnimatePresence>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <motion.div
              key={`current-${index}`}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <img src={image.url} alt={image.name} className="w-full h-auto rounded-lg" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={() => handleImageUpdate(image.name)}
                >
                  <Edit className="h-4 w-4 text-gray-800" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onImageDelete(image.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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
});

export default ImageGalleryInput;