import React from 'react';
import * as z from 'zod';
import { useSiteContent } from '@/hooks/use-site-content';
import { useFaqs } from '@/hooks/use-faqs';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AddFAQForm from '../components/AddFAQForm';
import EditFAQForm from '../components/EditFAQForm';
import { useToast } from '@/hooks/use-toast';
import AboutSectionForm from '../components/AboutSectionForm'; // Reusing for simplicity, rename if needed

const faqPageSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
});

const FAQPage = () => {
  const { content, isLoading: isContentLoading } = useSiteContent('faq_page');
  const { faqs, isLoading: isFaqsLoading, addFaq, updateFaq, deleteFaq } = useFaqs();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedFaq, setSelectedFaq] = React.useState(null);

  const handleAddFaqSuccess = () => {
    setIsAddDialogOpen(false);
    toast({ title: 'Éxito', description: 'Pregunta frecuente añadida con éxito.' });
  };

  const handleEditFaqSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedFaq(null);
    toast({ title: 'Éxito', description: 'Pregunta frecuente actualizada con éxito.' });
  };

  const handleDeleteFaq = async (id: number) => {
    try {
      await deleteFaq(id);
      toast({ title: 'Éxito', description: 'Pregunta frecuente eliminada con éxito.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (isContentLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <AdminPageWrapper
      title="Editar Página de Preguntas Frecuentes"
      description="Actualiza el contenido de la sección de Preguntas Frecuentes y gestiona las FAQs."
    >
      <AboutSectionForm
        sectionKey="faq_page"
        sectionTitle="Contenido de la Página de FAQ"
        sectionDescription="Actualiza el título y subtítulo de la sección de Preguntas Frecuentes."
        formSchema={faqPageSchema}
        defaultValues={{
          title: content?.title || '',
          subtitle: content?.subtitle || '',
        }}
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
        ]}
      />

      <Card className="border-none shadow-lg mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading text-gradient">Gestión de FAQs</CardTitle>
            <CardDescription>Añade, edita o elimina preguntas frecuentes.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><PlusCircle className="h-5 w-5"/> Añadir FAQ</Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl text-gradient">Añadir Nueva Pregunta Frecuente</DialogTitle>
              </DialogHeader>
              <AddFAQForm onSuccess={handleAddFaqSuccess} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isFaqsLoading ? (
            <div className="space-y-2 mt-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto mt-4 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pregunta</TableHead>
                    <TableHead>Respuesta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs?.map((faq: any) => (
                    <TableRow key={faq.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{faq.question}</TableCell>
                      <TableCell className="text-muted-foreground line-clamp-2">{faq.answer}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog open={isEditDialogOpen && selectedFaq?.id === faq.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedFaq(null); setIsEditDialogOpen(isOpen);}}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setSelectedFaq(faq)}><Edit className="h-4 w-4"/></Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card">
                            <DialogHeader>
                              <DialogTitle className="font-heading text-2xl text-gradient">Editar Pregunta Frecuente</DialogTitle>
                            </DialogHeader>
                            {selectedFaq && <EditFAQForm faq={selectedFaq} onSuccess={handleEditFaqSuccess} />}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-heading text-2xl">¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará la pregunta frecuente.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteFaq(faq.id)}>Continuar</AlertDialogAction>
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
    </AdminPageWrapper>
  );
};

export default FAQPage;