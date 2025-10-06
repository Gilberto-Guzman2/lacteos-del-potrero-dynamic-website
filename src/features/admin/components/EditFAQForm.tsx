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

const formSchema = z.object({
  question: z.string().min(1, 'La pregunta es requerida'),
  answer: z.string().min(1, 'La respuesta es requerida'),
});

interface EditFAQFormProps {
  faq: any;
  onSuccess: () => void;
}

const updateFaq = async (updatedFaq: { id: number; question: string; answer: string }) => {
  const { data, error } = await supabase.from('faqs').update(updatedFaq).eq('id', updatedFaq.id).select();
  if (error) throw new Error(error.message);
  return data;
};

const EditFAQForm: React.FC<EditFAQFormProps> = ({ faq, onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: faq.question,
      answer: faq.answer,
    },
  });

  const mutation = useMutation({
    mutationFn: updateFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate({ id: faq.id, ...values });
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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm font-medium font-bold">Pregunta</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm font-medium font-bold">Respuesta</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-muted/50 border-0 focus:ring-2 focus:ring-primary transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <Button type="submit" className="w-full font-bold text-lg py-3 gradient-coita text-white hover:opacity-90 transition-all duration-300 shadow-lg rounded-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default EditFAQForm;
