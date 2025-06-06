
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PricingPage from "./pages/PricingPage";
import DemoPage from "./pages/DemoPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage"; 
import WhiteLabelPage from "./pages/Dashboard/WhiteLabelPage";
import ExitIntentPopup from "./components/ExitIntentPopup";
// import Authentication from "./pages/AIPages/DashboardAuthed";
// New pages
import BlogPage from "./pages/BlogPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import GuidesPage from "./pages/GuidesPage";
import APIDocumentationPage from "./pages/APIDocumentationPage";
import CommunityPage from "./pages/CommunityPage";
import AboutUsPage from "./pages/AboutUsPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

// Dashboard
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AnalyzerPage from "./pages/Dashboard/AnalyzerPage";
import KeywordResearchPage from "./pages/Dashboard/KeywordResearchPage";
import RankTrackingPage from "./pages/Dashboard/RankTrackingPage";
import ContentToolsPage from "./pages/Dashboard/ContentToolsPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";
import DashboardLayout1 from "./components/AIComponents/Dashboard";
import DashboardContent1 from "./components/AIComponents/DashboardAuthed";
import Authentication1 from "./pages/AIPages/LoginAuth";
import ProtectedRoute from "./components/AIComponents/ProtectedRoute";
import SeoHelper from "./pages/AIPages/FeaturesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ExitIntentPopup />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          {/* <Route path="/pricing" element={<PricingPage />} /> */}
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* <Route path="/login" element={<Auth />} /> */}

          <Route path="/dashboard" element={<DashboardContent1 />} />
          <Route path="/login" element={<Authentication1 />} />
          <Route path="/seo-helper" element={<SeoHelper />} />


          



          {/* <Route path="/loginAI" element={<AuthPage />} /> */}
          <Route path="/ad-campagne" element={<LandingPage />} />
          
          {/* New content pages */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/api-documentation" element={<APIDocumentationPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          
          {/* Dashboard Routes */}
          {/* <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analyzer" element={<AnalyzerPage />} />
            <Route path="keywords" element={<KeywordResearchPage />} />
            <Route path="rank-tracking" element={<RankTrackingPage />} />
            <Route path="content" element={<ContentToolsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<div>Coming Soon</div>} />
          </Route> */}

          <Route
          path="/pricing" // This is the URL for your Pricing Page
          element={
            <ProtectedRoute>
              <PricingPage /> {/* Your PricingPage component is now protected */}
            </ProtectedRoute>
          }
        />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/dashboard/white-label" element={<WhiteLabelPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
