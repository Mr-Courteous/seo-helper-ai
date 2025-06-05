// src/components/DashboardContent.jsx (or wherever you prefer)
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you use Shadcn Button
import LiveSEOAnalyzer from '../LiveSEOAnalyzer';
import AIContentDemo from '../AIContentDemo';
import Hero from '../Hero';
import Clients from '../Clients';
import FloatingElements from '../FloatingElements';
import Navbar from '../Navbar';

const DashboardContent1 = ({ userEmail, onSignOut }) => {
  return (
    <div className="text-center space-y-6 p-8 bg-card rounded-lg shadow-md border border-gray-100">

      <FloatingElements />  
         
      <Navbar />

      <h2 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard!</h2>

      <p className="text-lg text-muted-foreground">
        You are logged in as: <span className="font-semibold text-brand-blue">{userEmail}</span>
      </p>
      <Button
        onClick={onSignOut}
        size="lg"
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Sign Out
      </Button>



      <Hero />
      <Clients />
      <LiveSEOAnalyzer />
      <AIContentDemo />

      <Button
        onClick={onSignOut}
        size="lg"
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default DashboardContent1;