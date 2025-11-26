import React from 'react';
import { TechniqueResult, AI_TECHNIQUE } from '../types';
import { TECHNIQUE_CONFIGS } from '../constants';
import { Flame, Beef, Wheat, Droplets, Clock, Brain } from 'lucide-react';
import clsx from 'clsx';

interface AnalysisCardProps {
  result: TechniqueResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result }) => {
  const config = TECHNIQUE_CONFIGS[result.technique];
  const { data, loading, error } = result;

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm animate-pulse h-full min-h-[400px]">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-muted"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-16 bg-muted rounded-lg"></div>
             <div className="h-16 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="bg-destructive/10 rounded-lg p-6 border border-destructive/20 h-full">
         <h4 className="text-destructive font-medium">Analysis Failed</h4>
         <p className="text-destructive/80 text-sm mt-2">{error}</p>
       </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header with Color Coding */}
      <div className="p-1" style={{ backgroundColor: config.color }}></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
           <div>
             <span 
               className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-sm text-white mb-2 inline-block shadow-sm"
               style={{ backgroundColor: config.color }}
             >
               {config.name}
             </span>
             <h3 className="text-xl font-bold text-card-foreground leading-tight">{data.foodName}</h3>
             <p className="text-sm text-muted-foreground mt-1">{data.portionEstimate}</p>
           </div>
           <div className="flex flex-col items-end">
             <div className="flex items-center text-xs font-medium text-muted-foreground" title="Processing Time">
                <Clock className="w-3 h-3 mr-1" />
                {data.processingTimeMs}ms
             </div>
             <div className="flex items-center text-xs font-medium text-primary mt-1" title="Confidence Score">
                <Brain className="w-3 h-3 mr-1" />
                {data.confidenceScore}%
             </div>
           </div>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-secondary/50 p-3 rounded-lg flex items-center space-x-3">
             <div className="bg-card p-2 rounded-full shadow-sm">
                <Flame className="w-4 h-4 text-orange-500" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-medium">Calories</p>
               <p className="text-lg font-bold text-foreground">{data.macros.calories}</p>
             </div>
          </div>
          <div className="bg-secondary/50 p-3 rounded-lg flex items-center space-x-3">
             <div className="bg-card p-2 rounded-full shadow-sm">
                <Beef className="w-4 h-4 text-red-500" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-medium">Protein</p>
               <p className="text-lg font-bold text-foreground">{data.macros.protein}g</p>
             </div>
          </div>
           <div className="bg-secondary/50 p-3 rounded-lg flex items-center space-x-3">
             <div className="bg-card p-2 rounded-full shadow-sm">
                <Wheat className="w-4 h-4 text-yellow-500" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-medium">Carbs</p>
               <p className="text-lg font-bold text-foreground">{data.macros.carbs}g</p>
             </div>
          </div>
           <div className="bg-secondary/50 p-3 rounded-lg flex items-center space-x-3">
             <div className="bg-card p-2 rounded-full shadow-sm">
                <Droplets className="w-4 h-4 text-blue-500" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-medium">Fat</p>
               <p className="text-lg font-bold text-foreground">{data.macros.fat}g</p>
             </div>
          </div>
        </div>

        {/* Reasoning Section */}
        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">AI Reasoning</p>
          <p className="text-sm text-card-foreground leading-relaxed italic font-serif">
            "{data.reasoning}"
          </p>
        </div>

      </div>
    </div>
  );
};