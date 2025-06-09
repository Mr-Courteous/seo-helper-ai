import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from 'lucide-react';

// Define the API endpoint and headers
const API_URL = 'https://google-keyword-insight1.p.rapidapi.com/globalkey/';
const RAPIDAPI_HOST = 'google-keyword-insight1.p.rapidapi.com';
const RAPIDAPI_KEY = '6206a2135cmsh07e97125f504849p1da3cbjsn0724b99db56e'; // WARNING: Exposing API keys client-side is NOT recommended for production!

interface KeywordInsight {
  text: string;
  volume: number;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNSPECIFIED';
  competition_index: number;
  low_bid: number;
  high_bid: number;
  trend: number; // Represents the trend over time (e.g., last 12 months)
}

const KeywordInsightFetcher: React.FC = () => {
  // ----------------------------------------------------
  // CHANGED: Initial keyword is now null, so no immediate fetch
  const [keyword, setKeyword] = useState<string | null>(null);
  // CHANGED: Initial input keyword is empty for a clean start
  const [inputKeyword, setInputKeyword] = useState<string>('');
  // ----------------------------------------------------

  const [data, setData] = useState<KeywordInsight[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllResults, setShowAllResults] = useState<boolean>(false);

  const RESULTS_LIMIT = 10; // Number of results to show initially

  const fetchKeywordData = async (currentKeyword: string) => {
    setLoading(true);
    setError(null);
    setData(null); // Clear previous data
    setShowAllResults(false); // Reset expansion state on new search

    try {
      const encodedKeyword = encodeURIComponent(currentKeyword);
      const url = `${API_URL}?keyword=${encodedKeyword}&lang=en`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData && typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const result: KeywordInsight[] = await response.json();

      console.log("API Response (parsed):", result);

      if (result && Array.isArray(result) && result.length > 0) {
        setData(result);
      } else {
        setError("No keyword insights found for this query. Try a different keyword.");
      }

    } catch (err) {
      console.error('Error fetching keyword insight:', err);
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // CHANGED: useEffect now only runs if 'keyword' is NOT null
  useEffect(() => {
    if (keyword) { // Only fetch if keyword is explicitly set (not null)
      fetchKeywordData(keyword);
    }
  }, [keyword]); // Dependency array remains 'keyword'
  // ----------------------------------------------------

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputKeyword.trim()) { // Ensure inputKeyword is not empty
      setKeyword(inputKeyword.trim()); // This will trigger the useEffect
    } else {
      setError("Please enter a keyword to search."); // Provide feedback if input is empty
    }
  };

  const getCompetitionBadgeVariant = (level: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNSPECIFIED') => {
    switch (level) {
      case 'LOW':
        return { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-200' };
      case 'MEDIUM':
        return { variant: 'outline', className: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'HIGH':
        return { variant: 'outline', className: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { variant: 'outline', className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const displayedData = showAllResults ? data : data?.slice(0, RESULTS_LIMIT);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-8 h-8 text-brand-blue" />
            <Badge className="bg-brand-blue text-white">KEYWORD ANALYSER</Badge>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Ontdek je <span className="gradient-text">Volgende Best Keyword</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Voer een onderwerp in en ontvang gedetailleerde inzichten over zoekvolume, concurrentie en trends.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Search className="w-6 h-6 text-brand-blue" />
                Keyword Inzichten
              </CardTitle>
              <CardDescription>
                Ontvang data van Google om je SEO-strategie te optimaliseren.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  type="text"
                  value={inputKeyword}
                  onChange={(e) => setInputKeyword(e.target.value)}
                  placeholder="Bijv. duurzaam leven, online marketing..."
                  className="flex-1 text-lg py-3"
                />
                <Button
                  type="submit"
                  disabled={loading || !inputKeyword.trim()} // Disable if loading or input is empty
                  className="bg-gradient-to-r from-brand-blue to-brand-purple px-8 py-3"
                >
                  {loading ? 'Analyseren...' : 'Zoek Keywords'}
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </form>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="animate-spin w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-6"></div>
                    <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Inzichten worden geladen...</h3>
                  <p className="text-gray-600">Even geduld, we analyseren de data voor je.</p>
                </div>
              )}

              {data && data.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                    <Search className="w-4 h-4" />
                    Resultaten voor "{keyword}"
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Keyword</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Volume</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Concurrentie</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Trend (Laatste 12M)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedData?.map((item, index) => (
                          <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-800">{item.text}</td>
                            <td className="py-3 px-4 text-gray-800">{item.volume.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Badge {...getCompetitionBadgeVariant(item.competition_level)}>
                                {item.competition_level}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 flex items-center gap-1">
                              {item.trend > 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : item.trend < 0 ? (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              ) : (
                                <Info className="w-4 h-4 text-gray-500" />
                              )}
                              <span className={item.trend > 0 ? 'text-green-600' : item.trend < 0 ? 'text-red-600' : 'text-gray-600'}>
                                {item.trend}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {data.length > RESULTS_LIMIT && (
                    <div className="text-center mt-4">
                      <Button
                        onClick={() => setShowAllResults(!showAllResults)}
                        variant="outline"
                        className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
                      >
                        {showAllResults ? (
                          <>
                            Toon Minder <ChevronUp className="ml-2 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Toon Alle ({data.length}) Resultaten <ChevronDown className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Display this message initially when no data, no loading, and no error */}
              {!data && !loading && !error && (
                <p className="text-center text-gray-600 py-8">
                  Typ een keyword in het zoekveld hierboven en klik op 'Zoek Keywords' om te beginnen.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default KeywordInsightFetcher;