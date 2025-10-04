import React from 'react';
import { motion } from 'framer-motion';

interface AdminPageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ title, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-lg shadow-2xl overflow-hidden"
    >
      <div className="p-6 md:p-8 bg-gradient-to-b from-card/70 to-transparent">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-heading font-bold text-primary"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>
      <div className="p-6 md:p-8">
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
          className="flex-grow"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminPageWrapper;
