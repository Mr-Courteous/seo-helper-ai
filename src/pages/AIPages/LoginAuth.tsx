import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/components/superbaseClient'; // Adjust path if your supabaseClient is elsewhere
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Extend AuthMode to include 'forgotPassword'
type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';

const Authentication1: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signIn');

  const navigate = useNavigate(); // Initialize useNavigate

  // Listen for auth state changes
  useEffect(() => {
    let mounted = true; // Flag to prevent state updates on unmounted component

    // Function to get initial session and set up listener
    const setupAuthListener = async () => {
      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (mounted) {
        setSession(initialSession);
        setLoading(false);
      }

      // Set up real-time listener for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setLoading(false);
          }
        }
      );

      // Cleanup subscription on unmount
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    };

    setupAuthListener(); // Call the setup function

    // The return of useEffect will be the cleanup function from setupAuthListener
    // This ensures subscription is unsubscribed when component unmounts.
    return () => {
      mounted = false; // Ensure flag is set for any pending async ops
      // Subscription cleanup is handled by setupAuthListener's return
    };

  }, []); // Empty dependency array, runs only once on mount

  // --- NEW: Effect to handle redirection when session changes ---
  useEffect(() => {
    if (session) {
      // If a session exists, redirect to the dashboard
      navigate('/dashboard'); // <-- Redirect to your dashboard route
    }
  }, [session, navigate]); // Reruns when 'session' or 'navigate' changes

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (authMode === 'signUp') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else { // authMode === 'signIn'
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // If sign-in/sign-up is successful, the onAuthStateChange listener
      // will update the session state, which then triggers the redirect useEffect.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:8080/dashboard', // Supabase will redirect HERE after OAuth
        },
      });
      if (error) throw error;
      // Supabase handles the redirect directly for OAuth, so the internal
      // session listener might not be needed for the redirect itself,
      // but it ensures session state is updated consistently.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:8080/update-password',
      });

      if (error) throw error;
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage('Signed out successfully!');
      // After signOut, `session` will become `null`, preventing further redirect
      // from the redirect useEffect, and showing the login form again.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !session && authMode !== 'forgotPassword') {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground
                      bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-brand-purple" />
        <p className="text-xl font-semibold">Loading authentication state...</p>
      </div>
    );
  }

  // If a session exists, you don't even need to render the Card/forms.
  // The useEffect for redirect will handle it.
  if (session) {
    // This case will be very brief as the useEffect will immediately redirect.
    // However, it's good practice to handle it if the redirect is delayed or fails.
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground
                      bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-brand-purple" />
        <p className="text-xl font-semibold">Redirecting to Dashboard...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10 text-foreground">
      <Card className="w-full max-w-md mx-auto shadow-2xl border border-gray-100 backdrop-blur-sm bg-white/95 animate-fade-in">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
            {/* The welcome message is now handled by the DashboardContent or the redirect */}
            {authMode === 'signIn' ? 'Sign In' : authMode === 'signUp' ? 'Create Account' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base mt-2">
            {authMode === 'signIn'
              ? 'Enter your credentials or use social login.'
              : authMode === 'signUp'
                ? 'Join our community.'
                : 'Enter your email to receive a password reset link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* No direct conditional rendering for 'session' here, as we redirect early */}
          <>
            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200 mb-4">{error}</p>
            )}
            {message && !error && (
              <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-md border border-green-200 mb-4">{message}</p>
            )}

            {authMode === 'forgotPassword' ? (
              <form onSubmit={handleForgotPassword} className="grid w-full items-center gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="border-gray-300 focus-visible:ring-brand-purple focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link...
                    </>
                  ) : 'Send Reset Link'}
                </Button>
                <div className="text-center text-sm text-gray-600 mt-4">
                  <Button
                    variant="link"
                    onClick={() => { setAuthMode('signIn'); setError(null); setMessage(null); }}
                    className="p-0 h-auto text-brand-blue hover:text-brand-purple underline-offset-4 hover:underline"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="grid w-full items-center gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="border-gray-300 focus-visible:ring-brand-purple focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="border-gray-300 focus-visible:ring-brand-purple focus-visible:ring-offset-0"
                  />
                  {authMode === 'signUp' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters.
                    </p>
                  )}
                  {authMode === 'signIn' && (
                    <div className="text-right text-sm">
                      <Button
                        variant="link"
                        onClick={() => { setAuthMode('forgotPassword'); setError(null); setMessage(null); }}
                        className="p-0 h-auto text-brand-blue hover:text-brand-purple underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {authMode === 'signIn' ? 'Signing in...' : 'Signing up...'}
                    </>
                  ) : (authMode === 'signIn' ? 'Sign In' : 'Sign Up')}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/95 px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 border-2 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/5 hover:border-brand-purple/50 transition-all duration-300 hover:shadow-lg"
                >
                  {loading && !error ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Sign In with Google
                </Button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  {authMode === 'signIn' ? (
                    <>
                      Don't have an account?{' '}
                      <Button
                        variant="link"
                        onClick={() => { setAuthMode('signUp'); setError(null); setMessage(null); }}
                        className="p-0 h-auto text-brand-blue hover:text-brand-purple underline-offset-4 hover:underline"
                      >
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Button
                        variant="link"
                        onClick={() => { setAuthMode('signIn'); setError(null); setMessage(null); }}
                        className="p-0 h-auto text-brand-blue hover:text-brand-purple underline-offset-4 hover:underline"
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </form>
            )}
          </>
        </CardContent>
      </Card>
    </section>
  );
};

export default Authentication1;