import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ProductForm from '../components/ProductForm';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAdminPage } from '../hooks/use-admin-page';
import { Product } from '../types/Product';

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error) throw new Error(error.message);
  return data;
};

const deleteProduct = async ({ id, image_url }: { id: number; image_url: string }) => {
  if (image_url) {
    const bucketName = 'website_images';
    const pathStartIndex = image_url.indexOf(bucketName + '/') + bucketName.length + 1;
    const imagePath = image_url.substring(pathStartIndex);
    if (imagePath) {
        const { error: deleteImageError } = await supabase.storage.from(bucketName).remove([imagePath]);
        if (deleteImageError) console.error('Error deleting image:', deleteImageError);
    }
  }
  const { error } = await supabase.from('products').delete().match({ id });
  if (error) throw new Error(error.message);
};

const ProductManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDialogOpen, setIsDialogOpen, selectedProduct, setSelectedProduct } = useAdminPage();

  const { data: products, isLoading, error } = useQuery<Product[]>({ queryKey: ['admin-products'], queryFn: fetchProducts });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Éxito', description: '¡Producto eliminado con éxito!' });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    },
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setIsDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <Card className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-heading font-bold text-primary">Gestión de Productos</CardTitle>
              <CardDescription>Añade, edita o elimina productos de tu catálogo.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedProduct(null)} className="gap-2 font-bold text-lg py-2 px-4 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full"><PlusCircle className="h-5 w-5"/> Añadir Producto</Button>
              </DialogTrigger>
              <DialogContent className="bg-card sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl text-gradient">{selectedProduct ? 'Editar Producto' : 'Añadir un Nuevo Producto'}</DialogTitle>
                </DialogHeader>
                <ProductForm onSuccess={handleSuccess} product={selectedProduct} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-2 mt-4">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            )}
            {error && <div className="text-destructive bg-destructive/20 p-4 rounded-lg mt-4">Error: {error.message}</div>}
            {products && (
              <div className="overflow-x-auto mt-4 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.weight}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog open={isDialogOpen && selectedProduct?.id === product.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedProduct(null); setIsDialogOpen(isOpen);}}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => {setSelectedProduct(product); setIsDialogOpen(true);}}><Edit className="h-4 w-4"/></Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card">
                              <DialogHeader>
                                <DialogTitle className="font-heading text-2xl text-gradient">Editar Producto</DialogTitle>
                              </DialogHeader>
                              {selectedProduct && <ProductForm product={selectedProduct} onSuccess={handleSuccess} />}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-heading text-2xl">¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará el producto y su imagen.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate({ id: product.id, image_url: product.image_url })}>
                                  Continuar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
    </motion.div>
  );
};

export default ProductManagement;