import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, XCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
}

const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  ({ onChange, currentImageUrl, ...props }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = useCallback((file: File | undefined) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange(file);
      } else {
        setPreviewUrl(null);
        onChange(null);
      }
    }, [onChange]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(event.target.files?.[0]);
    }, [handleFileSelect]);

    const handleClearImage = useCallback(() => {
      handleFileSelect(undefined);
      if (ref && 'current' in ref && ref.current) {
        ref.current.value = '';
      }
    }, [handleFileSelect, ref]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); // This is necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      handleFileSelect(file);
    };

    return (
      <div 
        className={`space-y-2 transition-all duration-300 ${
          isDragging ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        <div 
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/20 bg-muted/50 hover:bg-muted'
          }`}>
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/70 hover:bg-background shadow-md"
                onClick={handleClearImage}
              >
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="font-semibold text-foreground">Arrastra y suelta una imagen aquí</p>
              <p className="text-sm text-muted-foreground">o haz clic para seleccionar un archivo</p>
            </div>
          )}
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

ImageInput.displayName = 'ImageInput';

export default ImageInput;
