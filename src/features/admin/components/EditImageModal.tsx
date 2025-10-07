import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageInput from './ImageInput';

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  imageName: string;
}

const EditImageModal: React.FC<EditImageModalProps> = ({ isOpen, onClose, onSave, imageName }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleSave = () => {
    if (file) {
      onSave(file);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background text-foreground">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-6"
        >
          <DialogHeader>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-heading font-bold text-primary"
            >
              Reemplazar Imagen
            </motion.h1>
          </DialogHeader>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <ImageInput onChange={setFile} />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <DialogFooter>
              <Button onClick={onClose} variant="ghost" type="button" className="font-bold text-lg py-2 px-4 transition-all duration-300 rounded-full">Cancelar</Button>
              <Button onClick={handleSave} disabled={!file} type="button" className="font-bold text-lg py-2 px-4 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full">Guardar</Button>
            </DialogFooter>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditImageModal;
