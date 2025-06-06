// src/components/ProtectedRoute.jsx (or .tsx)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if different
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        setLoading(false);
        if (!session) {
          navigate('/login'); // Redirect to your login page
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setLoading(false);
          if (!currentSession) {
            navigate('/dashboard'); // Redirect to your login page
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground
                      bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-brand-purple" />
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return session ? <>{children}</> : null;
};

export default ProtectedRoute;