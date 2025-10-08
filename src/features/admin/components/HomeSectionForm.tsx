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

import ImageInput from './ImageInput';
import { motion } from 'framer-motion';

interface HomeSectionFormProps {
  sectionKey: string;
  sectionTitle: string;
  sectionDescription: string;
  formSchema: z.ZodObject<any, any, any, any>;
  defaultValues: Record<string, any>;
  fields: Array<{ name: string; label: string; type?: string }>;
  imageName?: string;
  currentImageUrl?: string | null;
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

const HomeSectionForm: React.FC<HomeSectionFormProps> = ({
  sectionKey,
  sectionTitle,
  sectionDescription,
  formSchema,
  defaultValues,
  fields,
  imageName,
  currentImageUrl,
}) => {
  const session = useSession();
  const supabase = getSupabaseClient(session?.access_token || '');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const contentMutation = useMutation({
    mutationFn: (updates: Array<{ section: string; element: string; content: string }>) => updateSiteContent(supabase, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content', sectionKey] });
      queryClient.invalidateQueries({ queryKey: ['images', sectionKey] });
    },
  });

  const imageMutation = useMutation({
    mutationFn: async ({ file, name }: { file: File; name: string }) => {
      const imageUrl = await uploadImage(supabase, file, name);
      await updateImageRecord(supabase, name, sectionKey, imageUrl);
      return imageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', sectionKey] });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updates = fields
        .filter(field => values[field.name] !== undefined)
        .map(field => ({ section: sectionKey, element: field.name, content: values[field.name] }));


      if (updates.length > 0) {
        await contentMutation.mutateAsync(updates);
      }

      if (imageName && values.image instanceof File) {
        await imageMutation.mutateAsync({ file: values.image, name: imageName });
      }

      toast({ title: 'Éxito', description: 'Contenido actualizado con éxito.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="h-full flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          {fields.map((field) => (
            <motion.div key={field.name} variants={formVariants} className="flex-grow">
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
          {imageName && (
            <motion.div variants={formVariants}>
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium font-bold">Imagen Actual</FormLabel>
                    <FormControl>
                      <ImageInput
                        currentImageUrl={currentImageUrl}
                        onChange={onChange}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
          <motion.div variants={formVariants}>
            <Button type="submit" className="w-full font-bold text-lg py-6 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full" disabled={contentMutation.isPending || imageMutation.isPending}>
              {(contentMutation.isPending || imageMutation.isPending) ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default HomeSectionForm;