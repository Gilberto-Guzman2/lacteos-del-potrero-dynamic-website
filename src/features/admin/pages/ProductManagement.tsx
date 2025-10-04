import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAdminPage } from '../hooks/use-admin-page';
import { useCategories } from '@/hooks/use-categories';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Product {
    id: number;
    name: string;
    description: string;
    category_id: number;
    price: number;
    weight: string;
    image_url: string;
    categories: { name: string };
}

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*, categories(name)').order('id');
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
  const { isAddDialogOpen, setIsAddDialogOpen, isEditDialogOpen, setIsEditDialogOpen, selectedProduct, setSelectedProduct } = useAdminPage();
  const { categories, isLoading: isCategoriesLoading, addCategory, deleteCategory, isAddingCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const handleProductAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setIsAddDialogOpen(false);
  };

  const handleProductUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setIsEditDialogOpen(false);
  };

  const handleAddCategory = async () => {
    try {
      await addCategory(newCategoryName);
      setNewCategoryName('');
      toast({ title: 'Éxito', description: '¡Categoría añadida con éxito!' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      toast({ title: 'Éxito', description: '¡Categoría eliminada con éxito!' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  return (
    <Tabs defaultValue="products" className="space-y-4">
      <TabsList>
        <TabsTrigger value="products">Productos</TabsTrigger>
        <TabsTrigger value="categories">Categorías</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-heading text-gradient">Gestión de Productos</CardTitle>
              <CardDescription>Añade, edita o elimina productos de tu catálogo.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><PlusCircle className="h-5 w-5"/> Añadir Producto</Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl text-gradient">Añadir un Nuevo Producto</DialogTitle>
                </DialogHeader>
                <AddProductForm onSuccess={handleProductAdded} />
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
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell><Badge variant="outline">{product.categories?.name || 'N/A'}</Badge></TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.weight}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedProduct(null); setIsEditDialogOpen(isOpen);}}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setSelectedProduct(product)}><Edit className="h-4 w-4"/></Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card">
                              <DialogHeader>
                                <DialogTitle className="font-heading text-2xl text-gradient">Editar Producto</DialogTitle>
                              </DialogHeader>
                              {selectedProduct && <EditProductForm product={selectedProduct} onSuccess={handleProductUpdated} />}
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
      </TabsContent>

      <TabsContent value="categories">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-gradient">Gestión de Categorías</CardTitle>
            <CardDescription>Añade o elimina categorías para tus productos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Input
                placeholder="Nombre de la nueva categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-grow bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all"
              />
              <Button onClick={handleAddCategory} disabled={!newCategoryName || isAddingCategory}>
                {isAddingCategory ? 'Añadiendo...' : 'Añadir Categoría'}
              </Button>
            </div>
            {isCategoriesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {categories?.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg shadow-sm">
                    <span className="font-medium text-sm">{category.name}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading text-2xl">¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>Se eliminará la categoría. Los productos de esta categoría no se eliminarán.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProductManagement;