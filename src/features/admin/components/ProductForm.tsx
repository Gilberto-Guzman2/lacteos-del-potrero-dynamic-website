import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import ImageInput from './ImageInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '../types/Product';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo'),
  weight: z.string().min(1, 'El peso es requerido'),
  image: z.instanceof(FileList).optional(),
});

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...product,
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setLoading(true);
    try {
      let imageUrl = product?.image_url;

      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0];
        const filePath = `products/${Date.now()}_${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('website_images')
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('website_images').getPublicUrl(filePath);
        imageUrl = publicUrl;

        if (product?.image_url) {
            const oldImagePath = product.image_url.split('/').pop();
            if (oldImagePath) {
                await supabase.storage.from('website_images').remove([`products/${oldImagePath}`]);
            }
        }
      }

      const { name, description, price, weight } = values;
      const productData = { name, description, price, weight, image_url: imageUrl };

      if (product?.id) {
        const { error } = await supabase.from('products').update(productData).match({ id: product.id });
        if (error) throw error;
        toast({ title: 'Éxito', description: '¡Producto actualizado con éxito!' });
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast({ title: 'Éxito', description: '¡Producto añadido con éxito!' });
      }

      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
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
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-heading text-gradient text-lg">Nombre</FormLabel>
                        <FormControl>
                        <Input placeholder="Queso Oaxaca" {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-heading text-gradient text-lg">Precio</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="120.50" {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-heading text-gradient text-lg">Peso</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all">
                                    <SelectValue placeholder="Selecciona un peso" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="250g">250g</SelectItem>
                                <SelectItem value="500g">500g</SelectItem>
                                <SelectItem value="1kg">1kg</SelectItem>
                                <SelectItem value="2kg">2kg</SelectItem>
                                <SelectItem value="3kg">3kg</SelectItem>
                                <SelectItem value="4kg">4kg</SelectItem>
                                <SelectItem value="5kg">5kg</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </motion.div>
        </div>

        <motion.div variants={itemVariants}>
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="font-heading text-gradient text-lg">Descripción</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Delicioso queso oaxaca..." {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, ...field } }) => (
              <ImageInput
                onFileChange={onChange}
                imagePreviewUrl={product?.image_url || null}
                isUploading={loading}
                {...field}
              />
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
            {loading ? (product ? 'Actualizando Producto...' : 'Añadiendo Producto...') : (product ? 'Actualizar Producto' : 'Añadir Producto')}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default ProductForm;
