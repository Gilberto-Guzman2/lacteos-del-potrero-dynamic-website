import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ImageGalleryInput } from './ImageGalleryInput';

const ImageGalleryFormField = ({ form, name, label, currentImages, onImageDelete, onImageUpdate, onImageAdd }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">{label}</FormLabel>
          <FormControl>
            <ImageGalleryInput
              {...field}
              currentImages={currentImages}
              onImageDelete={onImageDelete}
              onImageUpdate={onImageUpdate}
              onImageAdd={onImageAdd}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageGalleryFormField;
