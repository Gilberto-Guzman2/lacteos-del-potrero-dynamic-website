import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Languages, User, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const fetchDashboardStats = async () => {
  const { count: productCount, error: productError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productError) {
    console.error('Error fetching product count from Supabase:', productError.message);
    throw new Error(productError.message);
  }

  return { productCount };
};

const StatCard = ({ title, value, icon, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-gradient-card border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-3xl font-bold font-heading text-foreground">{value}</div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const Admin = () => {
  const [userEmail, setUserEmail] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserEmail(user.email || '');
        }
    }
    getUser();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold font-heading text-gradient mb-2"
        >
          ¡Bienvenido, Administrador!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Aquí tienes un resumen del contenido de tu sitio web, {userEmail}.
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Productos" 
          value={data?.productCount} 
          icon={<ShoppingCart className="h-5 w-5 text-primary" />} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Usuarios Activos" 
          value="1" 
          icon={<User className="h-5 w-5 text-primary" />} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Actividad del Sitio" 
          value="Alta" 
          icon={<Activity className="h-5 w-5 text-primary" />} 
          isLoading={isLoading} 
        />
      </div>

      {/* Add more sections here, for example, recent orders, popular products, etc. */}
    </div>
  );
};

export default Admin;
