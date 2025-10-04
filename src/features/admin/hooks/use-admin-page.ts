import { useContext } from 'react';
import { AdminPageContext } from '../contexts/AdminPageContext';

export const useAdminPage = () => {
  const context = useContext(AdminPageContext);
  if (!context) {
    throw new Error('useAdminPage must be used within an AdminPageProvider');
  }
  return context;
};
