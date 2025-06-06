// src/components/DashboardContent.jsx
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/components/superbaseClient'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

import LiveSEOAnalyzer from '../LiveSEOAnalyzer';
import AIContentDemo from '../AIContentDemo';
import Hero from '../Hero';
import Clients from '../Clients';
import FloatingElements from '../FloatingElements';
import Navbar from '../Navbar';
import Pricing from '../Pricing';
import Pricing2 from '../Pricing2';
import KeywordInsightFetcher from './KeywordFetcher';
import RandomDashboard from './UserDashboard';

// Type definition for props (if you're using TypeScript)
// type DashboardContent1Props = {
//   // userEmail will now be derived from session internally,
//   // but can still be passed as a prop if desired for flexibility.
//   // onSignOut is no longer needed as a prop, since it's handled internally.
//   // loading is no longer needed as a prop, since it's handled internally.
// };

const DashboardContent1 = () => { // No longer accepts userEmail, onSignOut, loading as props
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // State for sign-out loading
  const navigate = useNavigate(); // Initialize navigate

  // Effect to manage session and user email
  useEffect(() => {
    let mounted = true; // Flag to prevent state updates on unmounted component

    const getAndSetSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setUserEmail(session.user?.email || session.user?.user_metadata?.full_name || 'User');
        } else {
          // If no session, redirect to login page
          navigate('/');
        }
      }
    };

    getAndSetSession(); // Call immediately on mount

    // Listen for auth state changes to keep session updated
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          if (currentSession) {
            setUserEmail(currentSession.user?.email || currentSession.user?.user_metadata?.full_name || 'User');
          } else {
            // User logged out, redirect to login page
            setUserEmail(null);
            navigate('/');
          }
          setLoading(false); // Reset loading state after any auth state change (like sign-out completion)
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]); // navigate is a stable function, but included for good practice

  // Function to handle signing out
  const handleSignOut = async () => {
    setLoading(true); // Set loading state to true immediately
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        // You might want to display an error message to the user
      } else {
        console.log('Signed out successfully!');
        // The onAuthStateChange listener will detect the session change
        // and handle the redirection to the login page.
      }
    } catch (err: any) {
      console.error('Unexpected error during sign out:', err.message);
    } finally {
      // setLoading(false) is handled by the onAuthStateChange listener when session becomes null
    }
  };

  // Optional: Show a loading screen while fetching session initially
  if (userEmail === null && loading === false) { // This condition means we're waiting for initial session check
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground
                      bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-brand-purple" />
        <p className="text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  // Render dashboard content only if userEmail is available
  if (userEmail === null) {
    // This case might be briefly hit if getAndSetSession is still running
    // or if navigation hasn't completed yet after a logout.
    // The initial loading spinner above should cover most of this.
    return null;
  }

  return (
    <div className="text-center space-y-6 p-8 bg-card rounded-lg shadow-md border border-gray-100">

      <FloatingElements />

      <Navbar />

      <h2 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard!</h2>

      <p className="text-lg text-muted-foreground">
        You are logged in as: <span className="font-semibold text-brand-blue">{userEmail}</span>
      </p>

      {/* Sign Out Button */}
      <Button
        onClick={handleSignOut} // Now calls the internal handleSignOut
        size="lg"
        disabled={loading} // Disabled when loading state is true
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {loading ? ( // Conditionally render content based on loading state
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing out...
          </>
        ) : (
          'Sign Out'
        )}
      </Button>

      {/* <Hero />
      <Clients />
      <LiveSEOAnalyzer />
      <AIContentDemo />
      <KeywordInsightFetcher />  */}
      <RandomDashboard />
      {/* <Pricing /> */}
      <Pricing2 />


      {/* Second Sign Out Button (identical logic) */}
      <Button
        onClick={handleSignOut} // Now calls the internal handleSignOut
        size="lg"
        disabled={loading} // Disabled when loading state is true
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing out...
          </>
        ) : (
          'Sign Out'
        )}
      </Button>
    </div>
  );
};

export default DashboardContent1;