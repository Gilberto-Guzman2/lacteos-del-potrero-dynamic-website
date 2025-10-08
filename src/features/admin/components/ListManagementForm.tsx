import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ListManagementFormProps {
  sectionKey: string;
  elementKey: string;
  sectionTitle: string;
  sectionDescription: string;
  itemSchema: z.ZodObject<any, any, any, any>;
  defaultValues: any[];
  formFields: Array<{ name: string; label: string; type?: string }>;
  itemSingularName: string;
}

const updateContent = async (supabase: any, section: string, element: string, content: any[]) => {
  const { error } = await supabase
    .from('site_content')
    .upsert({ section, element, content: JSON.stringify(content) }, { onConflict: 'section,element' });
  if (error) throw new Error(error.message);
};

const ListManagementForm: React.FC<ListManagementFormProps> = ({
  sectionKey,
  elementKey,
  sectionTitle,
  sectionDescription,
  itemSchema,
  defaultValues,
  formFields,
  itemSingularName,
}) => {
  const session = useSession();
  const supabase = getSupabaseClient(session?.access_token || '');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);

  const mutation = useMutation({
    mutationFn: (content: any[]) => updateContent(supabase, sectionKey, elementKey, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content', sectionKey] });
      toast({ title: 'Éxito', description: `Contenido de ${sectionTitle.toLowerCase()} actualizado.` });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const openDialog = (item: any | null) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (itemToDelete: any) => {
    const updatedList = defaultValues.filter(item => item.id !== itemToDelete.id);
    mutation.mutate(updatedList);
  };

  const handleSave = (newItemData: any) => {
    let updatedList;
    if (newItemData.id) { // Editing existing item
      updatedList = defaultValues.map(item => item.id === newItemData.id ? newItemData : item);
    } else { // Adding new item
      updatedList = [...defaultValues, { ...newItemData, id: Date.now() }];
    }
    mutation.mutate(updatedList);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <Card className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-heading font-bold text-primary">{sectionTitle}</CardTitle>
              <CardDescription>{sectionDescription}</CardDescription>
            </div>
            <Button onClick={() => openDialog(null)} className="gap-2 font-bold text-lg py-2 px-4 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir {itemSingularName}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {defaultValues.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/50 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div>
                    {formFields.map(field => (
                      <p key={field.name} className="text-sm text-muted-foreground">
                        <span className="font-semibold text-base text-foreground">{field.label}: </span>
                        {item[field.name]}
                      </p>
                    ))}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog(item)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <ItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        itemSchema={itemSchema}
        formFields={formFields}
        itemSingularName={itemSingularName}
        isSaving={mutation.isPending}
      />
    </Dialog>
  );
};

// Dialog sub-component
interface ItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item: any | null;
  itemSchema: z.ZodObject<any, any, any, any>;
  formFields: Array<{ name: string; label: string; type?: string }>;
  itemSingularName: string;
  isSaving: boolean;
}

const ItemDialog: React.FC<ItemDialogProps> = ({ isOpen, onClose, onSave, item, itemSchema, formFields, itemSingularName, isSaving }) => {
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: item || {},
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset(item);
      } else {
        form.reset(formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
      }
    }
  }, [item, isOpen, form, formFields]);

  const onSubmit = (values: z.infer<typeof itemSchema>) => {
    onSave({ ...item, ...values });
  };

  return (
    <DialogContent className="bg-background text-foreground">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-6"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-gradient">
            {item ? 'Editar' : 'Añadir'} {itemSingularName}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {formFields.map(field => (
              <motion.div key={field.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          type={field.type || 'text'}
                          {...formField}
                          className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all mt-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="pt-6">
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving} className="font-bold text-lg py-2 px-4 transition-all duration-300 rounded-full">Cancelar</Button>
                <Button type="submit" className="font-bold text-lg py-2 px-4 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </DialogContent>
  );
};

export default ListManagementForm;
