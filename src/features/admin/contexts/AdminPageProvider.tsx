import React, { useState, ReactNode } from 'react';
import { AdminPageContext } from './AdminPageContext';

interface AdminPageProviderProps {
  children: ReactNode;
}

export const AdminPageProvider: React.FC<AdminPageProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <AdminPageContext.Provider
      value={{
        isDialogOpen,
        setIsDialogOpen,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AdminPageContext.Provider>
  );
};
