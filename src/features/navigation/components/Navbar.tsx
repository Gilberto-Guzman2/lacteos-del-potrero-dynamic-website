
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LazyImage from '@/components/LazyImage';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.lang = 'es';
  }, []);

  const navItems = [
    { key: 'nav.home', href: '/#home', label: 'Inicio' },
    { key: 'nav.catalog', href: '/#catalog', label: 'Catálogo' },
    { key: 'nav.orders', href: '/#orders', label: 'Pedidos' },
    { key: 'nav.about', href: '/#about', label: 'Nosotros' },
    { key: 'nav.faq', href: '/#faq', label: 'FAQ' },
    { key: 'nav.contact', href: '/#contact', label: 'Contacto' },
  ];

  const handleSmoothScroll = (href: string) => {
    const path = href.startsWith('/') ? href : `/${href}`;
    const [pathname, hash] = path.split('#');

    if (window.location.pathname !== pathname && pathname !== '') {
      window.location.href = path;
    } else {
      const targetId = hash;
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    
    // Close mobile menu if open
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg">
                <LazyImage 
                  src="/images/logotype.png" 
                  alt="Logo de Lácteos Artesanales - COITA" 
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                  priority={true}
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                onClick={() => handleSmoothScroll(item.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 px-3 py-2 rounded-md"
                role="menuitem"
                aria-label={`Ir a sección ${item.label.toLowerCase()}`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Theme & Language Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <Link to="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0"
                aria-label="Admin Login"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          id="mobile-menu"
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden"
          role="menu"
          aria-labelledby="mobile-menu-button"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleSmoothScroll(item.href)}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary transition-colors cursor-pointer focus:outline-none focus:bg-muted rounded-md"
                role="menuitem"
                aria-label={`Ir a sección ${item.label.toLowerCase()}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
