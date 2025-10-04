import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingCart, FileText, Settings, Phone, MessageSquare, Info, BookOpen, Globe, Menu, X } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/admin', icon: Home, label: 'Tablero' },
  { to: '/admin/home', icon: FileText, label: 'Página de Inicio' },
  { to: '/admin/catalog-page', icon: BookOpen, label: 'Página de Catálogo' },
  { to: '/admin/products', icon: ShoppingCart, label: 'Productos' },
  { to: '/admin/orders-page', icon: ShoppingCart, label: 'Página de Pedidos' },
  { to: '/admin/about-page', icon: Info, label: 'Página de Nosotros' },
  { to: '/admin/faq-page', icon: MessageSquare, label: 'Página de FAQ' },
  { to: '/admin/contact-page', icon: Phone, label: 'Página de Contacto' },
  { to: '/admin/footer', icon: Settings, label: 'Pie de Página' },
];

const SidebarContent = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 shadow-lg">
            <LazyImage 
              src="/images/logotype.png" 
              alt="Logo de Lácteos Artesanales - COITA" 
              className="w-full h-full object-cover"
              width={64}
              height={64}
              priority={true}
            />
          </div>
          <h2 className="text-2xl font-heading font-bold text-coita">Administrador</h2>
        </motion.div>

      </div>
      <motion.nav 
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        className="flex-grow overflow-y-auto space-y-2 -mr-2 pr-2"
      >
        {navLinks.map(({ to, icon: Icon, label }) => (
          <motion.div key={to} variants={variants}>
            <NavLink
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${isActive
                  ? 'gradient-coita text-white shadow-lg scale-105'
                  : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>
    </div>
  );
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <aside className="w-72 bg-card/50 backdrop-blur-lg border-r border-border/50 h-screen overflow-y-auto">
      <SidebarContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </aside>
  );
};

export default Sidebar;