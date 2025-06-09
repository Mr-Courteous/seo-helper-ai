import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming Button is available
import { Input } from '@/components/ui/input';   // Assuming Input is available
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, XCircle, Loader2, Send } from 'lucide-react'; // Added Send icon for the button

// Define the API endpoint and headers
const API_URL = 'https://seo-meta-description.p.rapidapi.com/seo-meta-description';
const RAPIDAPI_HOST = 'seo-meta-description.p.rapidapi.com';
const RAPIDAPI_KEY = '8545130d9dmsha72607ea7389b3bp1a5b20jsna1c997c934f1'; // WARNING: Highly insecure!

// Define the shape of the API response
interface ApiResponse {
  [key: string]: string; // E.g., "1": "description 1", "2": "description 2"
}

const SeoMetaDescriptionGenerator: React.FC = () => {
  // State for the input fields
  const [inputCompanyName, setInputCompanyName] = useState<string>('');
  const [inputCompanyDescription, setInputCompanyDescription] = useState<string>('');

  // State to store the values that actually trigger the API call
  // Initialized to null or empty so API doesn't fire on first render
  const [submittedCompanyName, setSubmittedCompanyName] = useState<string | null>(null);
  const [submittedCompanyDescription, setSubmittedCompanyDescription] = useState<string | null>(null);

  // State for displaying results, loading, and errors
  const [descriptions, setDescriptions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // No longer loading initially
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if both submittedCompanyName and submittedCompanyDescription are set (not null/empty)
    if (submittedCompanyName && submittedCompanyDescription) {
      const fetchMetaDescriptions = async () => {
        setLoading(true);
        setError(null);
        setDescriptions(null); // Clear previous results

        try {
          const urlParams = new URLSearchParams({
            name: submittedCompanyName,
            description: submittedCompanyDescription,
          }).toString();

          const response = await fetch(`${API_URL}?${urlParams}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': RAPIDAPI_HOST,
              'x-rapidapi-key': RAPIDAPI_KEY,
            },
          });

          if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            try {
              const errorData = await response.json();
              if (errorData && errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData && typeof errorData === 'string') {
                errorMessage = errorData;
              }
            } catch (jsonParseError) {
              console.error("Error parsing API error response:", jsonParseError);
            }
            throw new Error(errorMessage);
          }

          const data: ApiResponse = await response.json();
          console.log("API Response:", data);

          // Convert the object response into an array of descriptions
          const descriptionsArray = Object.values(data);
          setDescriptions(descriptionsArray);

        } catch (err) {
          console.error('Error fetching meta descriptions:', err);
          setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}. Please check your API key or network.`);
        } finally {
          setLoading(false);
        }
      };

      fetchMetaDescriptions();
    }
  }, [submittedCompanyName, submittedCompanyDescription]); // Depend on the submitted values

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior (page reload)
    setError(null); // Clear previous errors

    if (inputCompanyName.trim() && inputCompanyDescription.trim()) {
      // Set the submitted values, which will trigger the useEffect
      setSubmittedCompanyName(inputCompanyName.trim());
      setSubmittedCompanyDescription(inputCompanyDescription.trim());
    } else {
      setError("Please fill in both the company name and description to generate meta descriptions.");
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-brand-blue" />
            <Badge className="bg-brand-blue text-white">AI META BESCHRIJVINGEN</Badge>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Genereer Jouw <span className="gradient-text">Meta Beschrijvingen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Voer de naam en een korte beschrijving van je bedrijf of product in om SEO-geoptimaliseerde meta beschrijvingen te ontvangen.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-blue" />
                Meta Beschrijving Generator
              </CardTitle>
              <CardDescription>
                Laat AI je helpen met pakkende, SEO-vriendelijke beschrijvingen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrijfs-/Productnaam:
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    value={inputCompanyName}
                    onChange={(e) => setInputCompanyName(e.target.value)}
                    placeholder="Bijv. Apple, Samsung, Google"
                    className="w-full text-lg py-3"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Korte Beschrijving:
                  </label>
                  <Input
                    id="companyDescription"
                    type="text"
                    value={inputCompanyDescription}
                    onChange={(e) => setInputCompanyDescription(e.target.value)}
                    placeholder="Bijv. Apple ontwerpt en verkoopt smartphones, computers, tablets en diensten."
                    className="w-full text-lg py-3"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !inputCompanyName.trim() || !inputCompanyDescription.trim()}
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-purple px-8 py-3 text-lg"
                >
                  {loading ? 'Genereren...' : 'Genereer Beschrijvingen'}
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="animate-spin w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-6"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Meta beschrijvingen genereren...</h3>
                  <p className="text-gray-600">Even geduld, AI is bezig met schrijven.</p>
                </div>
              )}

              {descriptions && descriptions.length > 0 && !loading && !error && (
                <div className="space-y-6 animate-fade-in">
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-700">Ingevoerde Gegevens</CardTitle>
                      <CardDescription className="text-md text-gray-900 font-medium">
                        <span className="font-semibold">Naam:</span> "{submittedCompanyName}"<br />
                        <span className="font-semibold">Beschrijving:</span> "{submittedCompanyDescription}"
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-brand-blue" />
                    Gegenereerde Opties
                  </h3>
                  {descriptions.map((desc, index) => (
                    <Card key={index} className="shadow-lg border-0 hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">Optie {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          "{desc}"
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Message when component is first loaded and no search has been performed */}
              {!submittedCompanyName && !submittedCompanyDescription && !loading && !error && (
                <Card className="shadow-xl border-0 p-8 text-center bg-gray-50">
                  <CardContent className="py-12">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700">Voer de details in om te beginnen</p>
                    <p className="text-gray-500 mt-2">
                      Vul de bedrijfs-/productnaam en -beschrijving in en klik op 'Genereer Beschrijvingen'.
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SeoMetaDescriptionGenerator;