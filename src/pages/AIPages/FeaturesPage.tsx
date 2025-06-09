// src/components/MyProtectedPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/components/superbaseClient'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import Chatbot from '@/components/Chatbot';
import Clients from '@/components/Clients';
import LiveSEOAnalyzer from '@/components/LiveSEOAnalyzer';
import AIContentDemo from '@/components/AIContentDemo';
import KeywordInsightFetcher from '@/components/AIComponents/KeywordFetcher';
import FloatingElements from '@/components/FloatingElements';
import Navbar from '@/components/Navbar';
import SeoMetaDescriptionDisplay from '../../components/AIComponents/Description';

// You can import any components you want to display on this specific page
// For example:
// import SomeFeatureComponent from './SomeFeatureComponent';
// import AnalyticsChart from './AnalyticsChart';

const SeoHelper: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // State for internal operations like sign-out
    const navigate = useNavigate(); // Initialize navigate for redirection

    // Effect to manage session and user authentication
    useEffect(() => {
        let mounted = true; // Flag to prevent state updates on unmounted component

        const getAndSetSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) {
                if (session) {
                    // If a session exists, set the user's email
                    setUserEmail(session.user?.email || session.user?.user_metadata?.full_name || 'User');
                } else {
                    // If no session, redirect to the login page
                    navigate('/'); // Assuming your login page is at the root '/'
                }
            }
        };

        getAndSetSession(); // Call immediately on component mount

        // Listen for auth state changes to keep session updated and handle redirects
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
                if (mounted) {
                    if (currentSession) {
                        setUserEmail(currentSession.user?.email || currentSession.user?.user_metadata?.full_name || 'User');
                    } else {
                        // User logged out or session expired, redirect to login page
                        setUserEmail(null);
                        navigate('/'); // Redirect to the login page
                    }
                    setLoading(false); // Reset loading state after any auth state change
                }
            }
        );

        // Cleanup subscription on unmount to prevent memory leaks
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [navigate]); // `Maps` is a stable function, but including it is good practice for `useEffect` dependencies

    // Function to handle signing out from this page
    const handleSignOut = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out from MyProtectedPage:', error.message);
                // Display an error message to the user if needed
            } else {
                console.log('Signed out successfully from MyProtectedPage!');
                // The onAuthStateChange listener will handle the redirection
            }
        } catch (err: any) {
            console.error('Unexpected error during sign out from MyProtectedPage:', err.message);
        } finally {
            // Loading state will be reset by onAuthStateChange listener
        }
    };

    // Show a loading screen while authentication status is being determined
    if (userEmail === null && !loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-foreground bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-brand-purple" />
                <p className="text-xl font-semibold">Loading protected content...</p>
            </div>
        );
    }

    // If after checks, userEmail is still null, it means the user is not logged in.
    // The navigate('/') should have already triggered, so returning null is a fallback.
    if (userEmail === null) {
        return null; // Or a simple redirect message if navigate takes a moment
    }

    // Render the protected content once the user is logged in
    return (
        <div className="min-h-screen w-screen bg-gray-50">

            <FloatingElements />

            <Navbar />
            <p className="text-lg text-muted-foreground">
                 <span className="font-semibold text-brand-blue"> Welcome:{userEmail}</span>
            </p>


            <Clients />
            <LiveSEOAnalyzer />
            <AIContentDemo />
            <KeywordInsightFetcher />
            <SeoMetaDescriptionDisplay />

            {/* Sign Out Button for this page */}
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

            <Chatbot />
        </div>
    );
};

export default SeoHelper;