import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Globe, Search, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LiveSEOAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const validateUrl = (inputUrl: string) => {
    console.log('Validating URL:', inputUrl);
    try {
      const urlObj = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      console.log('URL validated successfully:', urlObj.href);
      return urlObj.href;
    } catch (error) {
      console.error('URL validation failed:', error);
      return null;
    }
  }; 

  const analyzePageSpeed = async (validatedUrl: string) => {
    // Use the updated Google PageSpeed Insights API key
    const API_KEY = 'AIzaSyDLEbqqWb2uxio1yoyARx-PzrvbzbGvCpg';
    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(validatedUrl)}&key=${API_KEY}&strategy=desktop&category=performance&category=accessibility&category=best-practices&category=seo`;

    console.log('Making PageSpeed API request to:', endpoint);
    console.log('API Key being used:', API_KEY);

    try {
      const response = await fetch(endpoint);
      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('PageSpeed API Response:', data);
      return data;
    } catch (error) {
      console.error('PageSpeed API Error:', error);
      throw error;
    }
  };

  const extractSEOData = (pageSpeedData: any, validatedUrl: string) => {
    const lighthouse = pageSpeedData.lighthouseResult;
    const audits = lighthouse.audits;
    
    // Calculate overall SEO score
    const seoScore = Math.round((lighthouse.categories.seo?.score || 0) * 100);
    const performanceScore = Math.round((lighthouse.categories.performance?.score || 0) * 100);
    const accessibilityScore = Math.round((lighthouse.categories.accessibility?.score || 0) * 100);
    const bestPracticesScore = Math.round((lighthouse.categories['best-practices']?.score || 0) * 100);

    // Extract SEO issues
    const issues = [];
    
    if (audits['meta-description']?.score !== 1) {
      issues.push({
        type: 'warning',
        text: audits['meta-description']?.displayValue || 'Meta description ontbreekt of is niet optimaal',
        impact: 'Hoog'
      });
    }

    if (audits['document-title']?.score !== 1) {
      issues.push({
        type: 'critical',
        text: 'Title tag ontbreekt of is niet optimaal',
        impact: 'Hoog'
      });
    }

    if (audits['image-alt']?.score !== 1) {
      issues.push({
        type: 'warning',
        text: `${audits['image-alt']?.details?.items?.length || 0} afbeeldingen missen alt tekst`,
        impact: 'Gemiddeld'
      });
    }

    if (audits['heading-order']?.score !== 1) {
      issues.push({
        type: 'info',
        text: 'Heading structuur kan worden verbeterd',
        impact: 'Laag'
      });
    }

    if (audits['link-text']?.score !== 1) {
      issues.push({
        type: 'info',
        text: 'Link teksten kunnen beschrijvender zijn',
        impact: 'Laag'
      });
    }

    // Generate recommendations based on failed audits
    const recommendations = [];
    
    if (audits['meta-description']?.score !== 1) {
      recommendations.push('Voeg een unieke meta description toe (150-160 karakters)');
    }
    
    if (audits['document-title']?.score !== 1) {
      recommendations.push('Optimaliseer je title tag (50-60 karakters)');
    }
    
    if (audits['image-alt']?.score !== 1) {
      recommendations.push('Voeg beschrijvende alt teksten toe aan alle afbeeldingen');
    }
    
    if (performanceScore < 90) {
      recommendations.push('Verbeter je pagina snelheid voor betere SEO');
    }
    
    if (audits['heading-order']?.score !== 1) {
      recommendations.push('Gebruik een logische heading structuur (H1, H2, H3)');
    }

    if (recommendations.length === 0) {
      recommendations.push('Je website scoort goed! Monitor regelmatig voor verdere optimalisaties');
    }

    return {
      overallScore: Math.round((seoScore + performanceScore + accessibilityScore + bestPracticesScore) / 4),
      issues,
      metrics: {
        seoScore,
        performanceScore,
        accessibilityScore,
        bestPracticesScore,
        pageSpeed: performanceScore
      },
      recommendations,
      loadTime: audits['speed-index']?.displayValue || 'Onbekend',
      pageSize: audits['total-byte-weight']?.displayValue || 'Onbekend'
    };
  };

  const handleAnalyze = async () => {
    console.log('Starting analysis for URL:', url);
    
    if (!url) {
      console.log('No URL provided');
      return;
    }
    
    const validatedUrl = validateUrl(url);
    if (!validatedUrl) {
      console.log('URL validation failed');
      toast({
        title: "Ongeldige URL",
        description: "Voer een geldige website URL in (bijv. example.com)",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      console.log('Starting PageSpeed analysis for:', validatedUrl);
      const pageSpeedData = await analyzePageSpeed(validatedUrl);
      console.log('PageSpeed data received:', pageSpeedData);
      
      const analysisData = extractSEOData(pageSpeedData, validatedUrl);
      console.log('Extracted analysis data:', analysisData);
      
      setAnalysisResult(analysisData);
      
      toast({
        title: "Analyse voltooid!",
        description: `Je website scoort ${analysisData.overallScore}/100`,
        variant: "success"
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analyse mislukt",
        description: `Er ging iets mis bij het analyseren van je website: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-brand-purple" />
            <Badge className="bg-brand-purple text-white">GRATIS TOOL</Badge>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Live SEO Analyzer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Voer je website URL in en krijg binnen 30 seconden een complete SEO-analyse
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Globe className="w-6 h-6 text-brand-purple" />
                Website SEO Check
              </CardTitle>
              <CardDescription>
                Ontdek direct wat er verbeterd kan worden aan je SEO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="https://jouwwebsite.nl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 text-lg py-3"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !url}
                  className="bg-gradient-to-r from-brand-purple to-brand-blue px-8 py-3"
                >
                  {isAnalyzing ? 'Analyseren...' : 'Analyseer Nu'}
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {isAnalyzing && (
                <div className="text-center py-8">
                  <div className="animate-spin w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">We analyseren je website...</p>
                  <p className="text-sm text-gray-500 mt-2">Dit kan tot 30 seconden duren</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6 animate-fade-in">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 rounded-xl">
                    <h3 className="text-2xl font-bold mb-2">SEO Score</h3>
                    <div className={`text-6xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                      {analysisResult.overallScore}/100
                    </div>
                    <Progress value={analysisResult.overallScore} className="mt-4 h-3" />
                  </div>

                  {/* Metrics */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">SEO Score</span>
                        <span className={`font-bold ${getScoreColor(analysisResult.metrics.seoScore)}`}>
                          {analysisResult.metrics.seoScore}%
                        </span>
                      </div>
                      <Progress value={analysisResult.metrics.seoScore} className="h-2" />
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Performance</span>
                        <span className={`font-bold ${getScoreColor(analysisResult.metrics.performanceScore)}`}>
                          {analysisResult.metrics.performanceScore}%
                        </span>
                      </div>
                      <Progress value={analysisResult.metrics.performanceScore} className="h-2" />
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Accessibility</span>
                        <span className={`font-bold ${getScoreColor(analysisResult.metrics.accessibilityScore)}`}>
                          {analysisResult.metrics.accessibilityScore}%
                        </span>
                      </div>
                      <Progress value={analysisResult.metrics.accessibilityScore} className="h-2" />
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Best Practices</span>
                        <span className={`font-bold ${getScoreColor(analysisResult.metrics.bestPracticesScore)}`}>
                          {analysisResult.metrics.bestPracticesScore}%
                        </span>
                      </div>
                      <Progress value={analysisResult.metrics.bestPracticesScore} className="h-2" />
                    </div>
                  </div>

                  {/* Issues */}
                  {analysisResult.issues.length > 0 && (
                    <div>
                      <h4 className="text-xl font-bold mb-4">Gevonden Problemen</h4>
                      <div className="space-y-3">
                        {analysisResult.issues.map((issue: any, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <p className="font-medium">{issue.text}</p>
                              <Badge variant="outline" className="mt-1">
                                Impact: {issue.impact}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-xl font-bold mb-4">Aanbevelingen</h4>
                    <div className="space-y-2">
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <h5 className="font-semibold mb-2">Laadtijd</h5>
                      <p className="text-2xl font-bold text-blue-600">{analysisResult.loadTime}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <h5 className="font-semibold mb-2">Pagina Grootte</h5>
                      <p className="text-2xl font-bold text-purple-600">{analysisResult.pageSize}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center p-6 bg-gradient-to-r from-brand-purple to-brand-blue rounded-xl text-white">
                    <h4 className="text-xl font-bold mb-2">Wil je deze problemen automatisch laten oplossen?</h4>
                    <p className="mb-4">SEOHelper.ai kan al deze verbeterpunten voor je implementeren</p>
                    <Button className="bg-white text-brand-purple hover:bg-white/90">
                      Start Nu Gratis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveSEOAnalyzer;
