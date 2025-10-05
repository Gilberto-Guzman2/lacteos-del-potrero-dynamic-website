import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageInput from './ImageInput';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}

const AddImageModal: React.FC<AddImageModalProps> = ({ isOpen, onClose, onSave }) => {
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
        <DialogHeader>
          <DialogTitle className="font-heading">Agregar Nueva Imagen</DialogTitle>
        </DialogHeader>
        <ImageInput onChange={setFile} />
        <DialogFooter>
          <Button onClick={onClose} variant="outline" type="button">Cancelar</Button>
          <Button onClick={handleSave} disabled={!file} type="button">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageModal;
