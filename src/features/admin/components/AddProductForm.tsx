import React from 'react';
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

interface AddProductFormProps {
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

const addProduct = async (product: {
  name: string;
  description: string;
  price: number;
  weight: string;
  category_id: number;
  image_url?: string;
}) => {
  const { data, error } = await supabase.from('products').insert(product).select();
  if (error) throw new Error(error.message);
  return data;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      weight: '',
      category_id: 0,
      image: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl: string | undefined;
    if (values.image instanceof File) {
      try {
        imageUrl = await uploadImage(values.image, values.name);
      } catch (error: any) {
        toast({ title: 'Error al subir imagen', description: error.message, variant: 'destructive' });
        return;
      }
    }

    mutation.mutate({
      name: values.name,
      description: values.description,
      price: values.price,
      weight: values.weight,
      category_id: values.category_id,
      ...(imageUrl && { image_url: imageUrl }),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Queso Fresco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Delicioso queso fresco artesanal..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="120.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso</FormLabel>
              <FormControl>
                <Input placeholder="500g" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={value => field.onChange(Number(value))} value={field.value ? String(field.value) : ''} disabled={isCategoriesLoading}>
                <FormControl>
                  <SelectTrigger>
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
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Imagen del Producto</FormLabel>
              <FormControl>
                <ImageInput onChange={onChange} {...rest} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Añadiendo...' : 'Añadir Producto'}
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;
