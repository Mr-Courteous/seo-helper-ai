
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Clients from '@/components/Clients';
import Benefits from '@/components/Benefits';
import Chatbot from '@/components/Chatbot';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import FloatingElements from '@/components/FloatingElements';
import LiveSEOAnalyzer from '@/components/LiveSEOAnalyzer';
import AIContentDemo from '@/components/AIContentDemo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingElements />
      <Navbar />
      <main className="flex-grow relative z-10">
        <Hero />
        <Clients />
        {/* <LiveSEOAnalyzer /> */}
        {/* <AIContentDemo /> */}
        <Benefits />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
      <Chatbot />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
