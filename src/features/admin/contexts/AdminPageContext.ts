import { createContext, useContext } from 'react';
import { Product } from '../types/Product';

interface AdminPageContextType {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export const AdminPageContext = createContext<AdminPageContextType | undefined>(undefined);

export const useAdminPage = () => {
  const context = useContext(AdminPageContext);
  if (!context) {
    throw new Error('useAdminPage must be used within an AdminPageProvider');
  }
  return context;
};
