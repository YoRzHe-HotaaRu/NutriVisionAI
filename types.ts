export enum AI_TECHNIQUE {
  RAPID_SCAN = 'RAPID_SCAN',
  DEEP_ANALYSIS = 'DEEP_ANALYSIS',
  HEALTH_OPTIMIZED = 'HEALTH_OPTIMIZED'
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalysisResult {
  foodName: string;
  portionEstimate: string;
  macros: MacroNutrients;
  confidenceScore: number; // 0-100
  reasoning: string;
  processingTimeMs: number;
}

export interface TechniqueResult {
  technique: AI_TECHNIQUE;
  techniqueName: string;
  techniqueDescription: string;
  data: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}

export interface ChartDataPoint {
  subject: string;
  A: number;
  B: number;
  C: number;
  fullMark: number;
}
