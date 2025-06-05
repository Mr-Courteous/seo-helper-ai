
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { toast } from '@/hooks/use-toast';
import Chatbot from '@/components/Chatbot';
import { supabase } from '@/integrations/supabase/client';

const DashboardLayout1 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(true);
      setUser(session.user);
      
      // Check subscription status
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error("Error checking subscription:", error);
        } else if (data) {
          setSubscription(data);
          
          // Show a toast on successful checkout
          const params = new URLSearchParams(window.location.search);
          if (params.get('checkout_success') === 'true') {
            toast({
              title: "Checkout successful!",
              description: "Your subscription has been activated.",
            });
            
            // Remove query parameter
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error invoking check-subscription:", error);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUser(session.user);
        
        // Check subscription status after login
        try {
          const { data } = await supabase.functions.invoke('check-subscription');
          if (data) {
            setSubscription(data);
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setSubscription(null);
        navigate('/login');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Navigation is already handled in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader 
              user={user} 
              subscription={subscription}
              onSignOut={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }}
            />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
          <Chatbot />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout1;
