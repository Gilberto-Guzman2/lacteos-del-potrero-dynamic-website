import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteContent } from '@/hooks/use-site-content';
import { useFaqs } from '@/hooks/use-faqs';
import { Skeleton } from '@/components/ui/skeleton';

const FAQSection = () => {
  const { content, isLoading: isContentLoading } = useSiteContent('faq_page');
  const { faqs, isLoading: isFaqsLoading } = useFaqs();

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div role="heading" aria-level="2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">
            {isContentLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : content?.title}
          </div>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isContentLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : content?.subtitle}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {isFaqsLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg px-6 border shadow-sm">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    <Skeleton className="h-6 w-full" />
                  </AccordionTrigger>
                </AccordionItem>
              ))
            ) : (
              faqs?.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card rounded-lg px-6 border shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;