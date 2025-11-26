import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisCard } from './components/AnalysisCard';
import { ComparativeCharts } from './components/Charts';
import { analyzeImageWithGemini } from './services/geminiService';
import { TechniqueResult, AI_TECHNIQUE } from './types';
import { TECHNIQUE_CONFIGS } from './constants';
import { LayoutDashboard, Zap, Activity } from 'lucide-react';

const INITIAL_RESULTS: TechniqueResult[] = [
  { technique: AI_TECHNIQUE.RAPID_SCAN, techniqueName: TECHNIQUE_CONFIGS[AI_TECHNIQUE.RAPID_SCAN].name, techniqueDescription: TECHNIQUE_CONFIGS[AI_TECHNIQUE.RAPID_SCAN].description, data: null, loading: false, error: null },
  { technique: AI_TECHNIQUE.DEEP_ANALYSIS, techniqueName: TECHNIQUE_CONFIGS[AI_TECHNIQUE.DEEP_ANALYSIS].name, techniqueDescription: TECHNIQUE_CONFIGS[AI_TECHNIQUE.DEEP_ANALYSIS].description, data: null, loading: false, error: null },
  { technique: AI_TECHNIQUE.HEALTH_OPTIMIZED, techniqueName: TECHNIQUE_CONFIGS[AI_TECHNIQUE.HEALTH_OPTIMIZED].name, techniqueDescription: TECHNIQUE_CONFIGS[AI_TECHNIQUE.HEALTH_OPTIMIZED].description, data: null, loading: false, error: null },
];

export default function App() {
  const [results, setResults] = useState<TechniqueResult[]>(INITIAL_RESULTS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    if (!base64) {
      setCurrentImage(null);
      setResults(INITIAL_RESULTS);
      return;
    }

    setCurrentImage(base64);
    setIsAnalyzing(true);
    
    // Initialize loading state for all
    setResults(prev => prev.map(r => ({ ...r, loading: true, error: null, data: null })));

    // Fire requests in parallel
    const techniques = Object.values(AI_TECHNIQUE);
    
    const promises = techniques.map(async (tech) => {
      try {
        const data = await analyzeImageWithGemini(base64, tech as AI_TECHNIQUE);
        setResults(prev => prev.map(r => r.technique === tech ? { ...r, data, loading: false } : r));
      } catch (error) {
        setResults(prev => prev.map(r => r.technique === tech ? { ...r, error: (error as Error).message, loading: false } : r));
      }
    });

    await Promise.all(promises);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
               NutriVision AI
             </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
              <Activity className="w-4 h-4 text-chart-5" />
              Gemini 2.5 Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Intro Section */}
        {!currentImage && (
           <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Comparative AI Nutritional Analysis</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a food image to see how three distinct AI prompting strategies—Rapid Scan, Analytical, and Clinical—interpret nutritional content differently.
              </p>
           </div>
        )}

        {/* Input & Comparison Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <ImageUpload onImageSelected={handleImageSelected} isAnalyzing={isAnalyzing} />
            
            {/* Legend / Info about techniques */}
            {currentImage && (
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 hidden lg:block">
                 <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider mb-4">Active Models</h3>
                 <div className="space-y-4">
                    {INITIAL_RESULTS.map((tech) => (
                      <div key={tech.technique} className="flex items-start gap-3">
                         <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: TECHNIQUE_CONFIGS[tech.technique].color }} />
                         <div>
                           <p className="font-semibold text-sm text-card-foreground">{tech.techniqueName}</p>
                           <p className="text-xs text-muted-foreground mt-0.5">{tech.techniqueDescription}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-8">
             {currentImage ? (
                <>
                  {/* Result Cards Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {results.map((result) => (
                      <div key={result.technique} className="h-full">
                        <AnalysisCard result={result} />
                      </div>
                    ))}
                  </div>

                  {/* Comparative Visualizations */}
                  <div className="border-t border-border pt-8">
                     <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                       <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
                       Data Visualization
                     </h2>
                     <ComparativeCharts results={results} />
                  </div>
                </>
             ) : (
               <div className="h-full flex flex-col items-center justify-center p-12 bg-card rounded-lg border border-border text-center shadow-sm">
                  <div className="bg-secondary p-4 rounded-full mb-4">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Ready to Analyze</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    Select an image to run the multi-perspective AI analysis engine.
                  </p>
               </div>
             )}
          </div>

        </div>
      </main>

    </div>
  );
}