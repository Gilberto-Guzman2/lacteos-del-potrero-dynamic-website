
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return session ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
