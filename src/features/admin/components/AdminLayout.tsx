import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPageProvider } from '../contexts/AdminPageProvider';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/');
    }
  };

  return (
    <AdminPageProvider>
      <div className="min-h-screen flex bg-gradient-dark text-foreground">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-full z-50"
            >
              <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.main
          animate={{ paddingLeft: isMobile ? 0 : (isSidebarOpen ? '18rem' : '0') }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto"
        >
          <div className="h-full">
            <header className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => window.open('/', '_blank')}>
                  <Home className="h-5 w-5 mr-2" /> Ver Sitio
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" /> Cerrar Sesión
                </Button>
              </div>
            </header>
            <Outlet />
          </div>
        </motion.main>
      </div>
    </AdminPageProvider>
  );
};

export default AdminLayout;
