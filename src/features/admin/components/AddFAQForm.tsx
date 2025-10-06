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

interface AddFAQFormProps {
  onSuccess: () => void;
}

const addFaq = async (newFaq: { question: string; answer: string }) => {
  const { data, error } = await supabase.from('faqs').insert(newFaq).select();
  if (error) throw new Error(error.message);
  return data;
};

const AddFAQForm: React.FC<AddFAQFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  const mutation = useMutation({
    mutationFn: addFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
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
            {mutation.isPending ? 'Añadiendo...' : 'Añadir Pregunta Frecuente'}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default AddFAQForm;
