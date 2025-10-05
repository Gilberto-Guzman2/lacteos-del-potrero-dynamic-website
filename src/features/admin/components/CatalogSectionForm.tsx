import React from 'react';
import * as z from 'zod';
import GenericSectionForm from './GenericSectionForm';

interface CatalogSectionFormProps {
  sectionKey: string;
  sectionTitle: string;
  sectionDescription: string;
  formSchema: z.ZodObject<any, any, any, any>;
  defaultValues: Record<string, any>;
  fields: Array<{ name: string; label: string; type?: string }>;
  currentImages?: { url: string; alt_text: string }[];
}

const CatalogSectionForm: React.FC<CatalogSectionFormProps> = (props) => {
  return <GenericSectionForm {...props} imageGallery />;
};

export default CatalogSectionForm;