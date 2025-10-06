import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import ImageInput from './ImageInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/use-categories';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.preprocess(
    (val) => Number(val), 
    z.number().min(0.01, 'El precio debe ser mayor que 0')
  ),
  weight: z.string().min(1, 'El peso es requerido'),
  category_id: z.preprocess(
    (val) => Number(val), 
    z.number().min(1, 'La categoría es requerida')
  ),
  image: z.any().optional(),
});

interface EditProductFormProps {
  product: any;
  onSuccess: () => void;
}

const uploadImage = async (file: File, productName: string) => {
  const fileName = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const { data, error } = await supabase.storage
    .from('website_images')
    .upload(`products/${fileName}`, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  const { data: publicUrlData } = supabase.storage.from('website_images').getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

const updateProduct = async (updatedProduct: {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  category_id: number;
  image_url?: string;
}) => {
  const { data, error } = await supabase.from('products').update(updatedProduct).eq('id', updatedProduct.id).select();
  if (error) throw new Error(error.message);
  return data;
};

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
      category_id: product.category_id,
      image: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl: string | undefined = product.image_url;
    if (values.image instanceof File) {
      try {
        imageUrl = await uploadImage(values.image, values.name);
      } catch (error: any) {
        toast({ title: 'Error al subir imagen', description: error.message, variant: 'destructive' });
        return;
      }
    }

    mutation.mutate({
      id: product.id,
      name: values.name,
      description: values.description,
      price: values.price,
      weight: values.weight,
      category_id: values.category_id,
      image_url: imageUrl,
    });
  };

  return (
    <Form {...form}>
      <motion.form
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Nombre del Producto</FormLabel>
                <FormControl>
                  <Input placeholder="Queso Fresco" {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Delicioso queso fresco artesanal..." {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Precio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="120.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Peso</FormLabel>
                <FormControl>
                  <Input placeholder="500g" {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Categoría</FormLabel>
                <Select onValueChange={value => field.onChange(Number(value))} value={field.value ? String(field.value) : ''} disabled={isCategoriesLoading}>
                  <FormControl>
                    <SelectTrigger className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel className="font-heading text-gradient text-lg">Imagen del Producto</FormLabel>
                <FormControl>
                  <ImageInput onChange={onChange} currentImageUrl={product.image_url} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <Button type="submit" className="w-full font-bold text-lg py-6 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default EditProductForm;