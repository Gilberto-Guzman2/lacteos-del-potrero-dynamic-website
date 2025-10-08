import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import ImageGalleryInput from './ImageGalleryInput';
import ImageGalleryFormField from './ImageGalleryFormField';
import { motion } from 'framer-motion';

interface GenericSectionFormProps {
  sectionKey: string;
  sectionTitle: string;
  sectionDescription: string;
  formSchema: z.ZodObject<any, any, any, any>;
  defaultValues: Record<string, any>;
  fields: Array<{ name: string; label: string; type?: string }>;
  imageGallery?: boolean;
  currentImages?: { url: string; alt_text: string }[];
}

const updateSiteContent = async (supabase: any, updates: Array<{ section: string; element: string; content: string }>) => {
  for (const update of updates) {
    const { data, error } = await supabase
      .from('site_content')
      .upsert(update, { onConflict: 'section,element' })
      .select();
    if (error) throw new Error(error.message);
  }
  return null;
};

const uploadImage = async (supabase: any, file: File, imageName: string) => {
  const { data, error } = await supabase.storage
    .from('website_images')
    .upload(`public/${imageName}`, file, { cacheControl: '3600', upsert: true });
  if (error) throw new Error(error.message);
  const { data: publicUrlData } = supabase.storage.from('website_images').getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

const updateImageRecord = async (supabase: any, name: string, section: string, url: string) => {
  const { data, error } = await supabase
    .from('images')
    .upsert({ name, section, url }, { onConflict: 'name' })
    .select();
  if (error) throw new Error(error.message);
  return data;
};

import { v4 as uuidv4 } from 'uuid';

const addImage = async (supabase: any, section: string, file: File) => {
  if (!section || typeof section !== 'string') {
    throw new Error('Image section is missing or invalid.');
  }
  const fileExtension = file.name.split('.').pop();
  const imageName = `${section}/${uuidv4()}.${fileExtension}`;
  const imageUrl = await uploadImage(supabase, file, imageName);
  await updateImageRecord(supabase, imageName, section, imageUrl);
  return imageUrl;
};

const updateImage = async (supabase: any, imageName: string, file: File) => {
  // Overwrite the existing image in storage
  const imageUrl = await uploadImage(supabase, file, imageName);

  // Update the URL in the database to ensure it's current
  const { error: dbError } = await supabase.from('images').update({ url: imageUrl }).match({ name: imageName });
  if (dbError) throw new Error(dbError.message);

  return null;
};

const deleteImage = async (supabase: any, imageName: string) => {
  const { error: storageError } = await supabase.storage.from('website_images').remove([`public/${imageName}`]);
  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await supabase.from('images').delete().match({ name: imageName });
  if (dbError) throw new Error(dbError.message);

  return null;
};

const GenericSectionForm: React.FC<GenericSectionFormProps> = ({
  sectionKey,
  sectionTitle,
  sectionDescription,
  formSchema,
  defaultValues,
  fields,
  imageGallery,
  currentImages,
}) => {
  const session = useSession();
  const supabase = getSupabaseClient(session?.access_token || '');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const contentMutation = useMutation({
    mutationFn: (updates: Array<{ section: string; element: string; content: string }>) => updateSiteContent(supabase, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content', sectionKey] });
      toast({ title: 'Éxito', description: 'Contenido actualizado con éxito.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const addImageMutation = useMutation({
    mutationFn: (file: File) => addImage(supabase, sectionKey, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', sectionKey] });
      toast({ title: 'Éxito', description: 'Imagen agregada con éxito.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageName: string) => deleteImage(supabase, imageName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', sectionKey] });
      toast({ title: 'Éxito', description: 'Imagen eliminada con éxito.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updates = Object.keys(values).map(key => ({
      section: sectionKey,
      element: key,
      content: values[key]
    }));

    if (updates.length > 0) {
      await contentMutation.mutateAsync(updates);
    }
  };

  const updateImageMutation = useMutation({
    mutationFn: ({ imageName, file }: { imageName: string; file: File }) => updateImage(supabase, imageName, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', sectionKey] });
      toast({ title: 'Éxito', description: 'Imagen actualizada con éxito.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleImageUpdate = (imageName: string, file: File) => {
    updateImageMutation.mutate({ imageName, file });
  };

  const handleImageDelete = (imageName: string) => {
    if (!imageName) {
        toast({ title: 'Error', description: 'Cannot delete image with invalid name.', variant: 'destructive' });
        return;
    }
    deleteImageMutation.mutate(imageName);
  };

  const handleImageAdd = (file: File) => {
    addImageMutation.mutate(file);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="h-full flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          {fields.map((field) => (
            <motion.div key={field.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex-grow">
              <FormField
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-foreground text-sm font-medium font-bold">{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea {...formField} className="bg-background border-border/70 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" />
                      ) : (
                        <Input type={field.type || 'text'} {...formField} className="bg-background border-border/70 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300" />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-4">
            <Button type="submit" className="w-full font-bold text-lg py-6 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full" disabled={contentMutation.isPending}>
              {contentMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </motion.div>
          {imageGallery && (
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-8">
              <ImageGalleryFormField
                form={form}
                name="images"
                label="Galería de Imágenes"
                currentImages={Array.isArray(currentImages) ? currentImages : []}
                onImageDelete={handleImageDelete}
                onImageUpdate={handleImageUpdate}
                onImageAdd={handleImageAdd}
              />
            </motion.div>
          )}
        </form>
      </Form>
    </motion.div>
  );
};

export default GenericSectionForm;
