import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Updated icons for specific functions and navigation
import { LayoutDashboard, FileText, Search, PenTool, Store, DollarSign, ArrowRight } from 'lucide-react'; 

// Define a type for the function of the button
interface RandomDashboardProps {
  onNavigateToFeatures: () => void; // Function to call when "Go to Features" button is clicked
}

const RandomDashboard: React.FC<RandomDashboardProps> = ({ onNavigateToFeatures }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LayoutDashboard className="w-8 h-8 text-brand-blue" />
            <Badge className="bg-brand-blue text-white">JOUW DASHBOARD OVERZICHT</Badge>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Welkom bij je <span className="gradient-text">Overzichtspaneel</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Een snelle blik op je belangrijkste tools en statistieken.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: SEO Reports Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                SEO Rapporten
              </CardTitle>
              <span className="text-xs text-gray-500">Laatste 30 dagen</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">5 Nieuwe Rapporten</div>
              <p className="text-xs text-gray-500 mt-1">Bekijk je prestatie-overzichten</p>
            </CardContent>
          </Card>

          {/* Card 2: Keyword Generation Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-blue" />
                Keyword Generatie
              </CardTitle>
              <span className="text-xs text-gray-500">Deze maand</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">120 Nieuwe Keywords</div>
              <p className="text-xs text-gray-500 mt-1">Ontdek nieuwe zoektermen</p>
            </CardContent>
          </Card>

          {/* Card 3: Blog Post Generation Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PenTool className="w-4 h-4 text-brand-blue" />
                Blog Post Generatie
              </CardTitle>
              <span className="text-xs text-gray-500">Deze maand</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">8 Concepten Gemaakt</div>
              <p className="text-xs text-gray-500 mt-1">Creëer geoptimaliseerde content</p>
            </CardContent>
          </Card>

          {/* Card 4: GMB Posts Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-blue" />
                GMB Posts
              </CardTitle>
              <span className="text-xs text-gray-500">Deze week</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">3 Posts Gepland</div>
              <p className="text-xs text-gray-500 mt-1">Beheer je Google Mijn Bedrijf</p>
            </CardContent>
          </Card>

          {/* Card 5: Payments Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-blue" />
                Betalingen
              </CardTitle>
              <span className="text-xs text-gray-500">Volgende factuur: 2025-07-01</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">€ 59.99</div>
              <p className="text-xs text-gray-500 mt-1">Beheer je abonnement</p>
            </CardContent>
          </Card>

          {/* Main Call-to-Action Card */}
          <Card className="shadow-xl border-0 col-span-1 md:col-span-3 lg:col-span-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white p-6 flex flex-col items-center justify-center text-center">
            <CardTitle className="text-3xl font-bold mb-3">
              Klaar om te beginnen?
            </CardTitle>
            <CardDescription className="text-lg mb-6 text-white/90">
              Ga naar de functionaliteitspagina om al je SEO-taken uit te voeren.
            </CardDescription>
            <Button
              onClick={onNavigateToFeatures}
              className="bg-white text-brand-blue hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Ga naar Functies
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RandomDashboard;