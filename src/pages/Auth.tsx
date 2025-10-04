import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/features/navigation/components/Navbar';
import { motion } from 'framer-motion';
import Footer from '@/features/shared/components/Footer';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: '¡Has iniciado sesión correctamente! Redirigiendo...' });
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <>
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center py-12 pt-32"
            >
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold font-heading text-gradient">Iniciar Sesión</h1>
                        <p className="text-balance text-muted-foreground">
                            Inicia sesión para acceder a tu cuenta
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input 
                            type="password" 
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <Link to="/" className="underline flex items-center justify-center gap-2">
                            <Home className="h-4 w-4"/>
                            Volver al sitio web
                        </Link>
                    </div>
                </div>
            </motion.div>
            <div className="hidden bg-muted lg:block overflow-hidden">
                <motion.img
                src="/images/cheese-with-bread.png"
                alt="Image of cheese with bread"
                width="1920"
                height="1080"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
            </div>
        </div>
        <Footer />
    </>
  );
};

export default Auth;