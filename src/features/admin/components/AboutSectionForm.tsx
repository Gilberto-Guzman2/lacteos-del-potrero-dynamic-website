import React from 'react';
import * as z from 'zod';
import GenericSectionForm from './GenericSectionForm';

interface AboutSectionFormProps {
  sectionKey: string;
  sectionTitle: string;
  sectionDescription: string;
  formSchema: z.ZodObject<any, any, any, any>;
  defaultValues: Record<string, any>;
  fields: Array<{ name: string; label: string; type?: string }>;
  imageName?: string;
  currentImageUrl?: string | null;
}

const AboutSectionForm: React.FC<AboutSectionFormProps> = (props) => {
  return <GenericSectionForm {...props} />;
};

export default AboutSectionForm;
