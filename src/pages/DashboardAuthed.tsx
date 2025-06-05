import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/components/superbaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import DashboardContent1 from '@/components/AIComponents/DashboardAuthed';

type AuthMode = 'signIn' | 'signUp';

const Authed: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [authMode, setAuthMode] = useState<AuthMode>('signIn');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
                setSession(currentSession);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (authMode === 'signUp') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://google.com', // Uncomment and set your redirect URL
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            // After signOut, session state will automatically be updated to null by the listener
            alert('Signed out successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !session) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-brand-purple" />
                <p className="text-xl font-semibold">Loading authentication state...</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-white via-brand-purple-light/5 to-brand-blue-light/10 text-foreground">      {/* We'll make the Card conditional too, so the DashboardContent can be outside it if preferred */}
            {session ? (
                // If logged in, render the DashboardContent
                <DashboardContent1
                    userEmail={session.user?.email || session.user?.user_metadata?.full_name || 'User'}
                    onSignOut={handleSignOut} // Pass the signOut function as a prop
                />
            ) : (
                // If not logged in, render the Card with the Auth form
                <Card className="w-full max-w-md mx-auto shadow-2xl border border-gray-100 backdrop-blur-sm bg-white/95 animate-fade-in">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                            {authMode === 'signIn' ? 'Sign In' : 'Create Account'}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base mt-2">
                            {authMode === 'signIn'
                                ? 'Enter your credentials or use social login.'
                                : 'Join our community.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                            </div>
                            {error && (
                                <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200">{error}</p>
                            )}
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
                                            onClick={() => setAuthMode('signUp')}
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
                                            onClick={() => setAuthMode('signIn')}
                                            className="p-0 h-auto text-brand-blue hover:text-brand-purple underline-offset-4 hover:underline"
                                        >
                                            Sign In
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </section>
    );
};

export default Authed;