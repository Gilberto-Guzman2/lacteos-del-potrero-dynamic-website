import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminPageContext } from './AdminPageContext';

interface AdminPageProviderProps {
  children: ReactNode;
}

export const AdminPageProvider: React.FC<AdminPageProviderProps> = ({ children }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <AdminPageContext.Provider
      value={{
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AdminPageContext.Provider>
  );
};
