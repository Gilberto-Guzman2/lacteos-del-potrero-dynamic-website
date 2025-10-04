import { createContext, useContext } from 'react';

interface AdminPageContextType {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  selectedProduct: any | null;
  setSelectedProduct: (product: any | null) => void;
}

export const AdminPageContext = createContext<AdminPageContextType | undefined>(undefined);

export const useAdminPage = () => {
  const context = useContext(AdminPageContext);
  if (!context) {
    throw new Error('useAdminPage must be used within an AdminPageProvider');
  }
  return context;
};
