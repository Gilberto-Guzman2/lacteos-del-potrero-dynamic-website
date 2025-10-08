import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import ImageInput from './ImageInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  image: z.instanceof(FileList).refine(files => files.length > 0, 'La imagen es requerida'),
  alt_text: z.string().min(1, 'El texto alternativo es requerido'),
});

interface AddImageFormProps {
  onSuccess: () => void;
}

const AddImageForm: React.FC<AddImageFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alt_text: '',
    },
  });

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setImagePreviewUrl(URL.createObjectURL(file));
      form.setValue('image', files);
    } else {
      setImagePreviewUrl(null);
      form.setValue('image', null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    try {
      const imageFile = values.image[0];
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `gallery/${uuidv4()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('website_images')
        .upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('website_images').getPublicUrl(fileName);

      await supabase.from('images').insert({
        name: fileName,
        section: 'gallery',
        url: publicUrl,
        alt_text: values.alt_text,
      });

      queryClient.invalidateQueries({ queryKey: ['images', 'gallery'] });
      toast({ title: 'Éxito', description: '¡Imagen añadida con éxito!' });
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error adding image:", error);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Form {...form}>
      <motion.form 
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6 p-4"
      >
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, ...field } }) => (
              <ImageInput
                onFileChange={onChange}
                imagePreviewUrl={imagePreviewUrl}
                isUploading={isUploading}
                {...field}
              />
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="alt_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Texto Alternativo</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción de la imagen" {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" disabled={isUploading} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
            {isUploading ? 'Añadiendo Imagen...' : 'Añadir Imagen'}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default AddImageForm;