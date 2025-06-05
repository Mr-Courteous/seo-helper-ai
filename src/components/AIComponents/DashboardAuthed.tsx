// src/components/DashboardContent.jsx (or wherever you prefer)
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you use Shadcn Button
import { Loader2 } from 'lucide-react'; // Import Loader2 for the spinner

import LiveSEOAnalyzer from '../LiveSEOAnalyzer';
import AIContentDemo from '../AIContentDemo';
import Hero from '../Hero';
import Clients from '../Clients';
import FloatingElements from '../FloatingElements';
import Navbar from '../Navbar';
import Pricing from '../Pricing';

// Add 'loading' to the props interface if you're using TypeScript
// type DashboardContent1Props = {
//   userEmail: string;
//   onSignOut: () => void;
//   loading: boolean; // Add this prop
// };

const DashboardContent1 = ({ userEmail, onSignOut, loading }) => { // Accept the loading prop
  return (
    <div className="text-center space-y-6 p-8 bg-card rounded-lg shadow-md border border-gray-100">

      <FloatingElements />

      <Navbar />

      <h2 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard!</h2>

      <p className="text-lg text-muted-foreground">
        You are logged in as: <span className="font-semibold text-brand-blue">{userEmail}</span>
      </p>

      {/* First Sign Out Button */}
      <Button
        onClick={onSignOut}
        size="lg"
        disabled={loading} // Disable button when loading
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {loading ? ( // Conditionally render content based on loading
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing out...
          </>
        ) : (
          'Sign Out'
        )}
      </Button>

      <Hero />
      <Clients />
      <LiveSEOAnalyzer />
      <AIContentDemo />
      <Pricing />

      {/* Second Sign Out Button (assuming you want both to show loading) */}
      <Button
        onClick={onSignOut}
        size="lg"
        disabled={loading} // Disable button when loading
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {loading ? ( // Conditionally render content based on loading
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