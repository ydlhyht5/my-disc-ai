
export interface DiscResult {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface AnalysisReport {
  isDiscImage: boolean;
  overallTitle: string;
  summary: string;
  traits: string[];
  strengths: string[];
  growthAreas: string[];
  interpersonalAdvice: string;
  careerAdvice: string;
}

export type AppState = 'IDLE' | 'ANALYZING' | 'REPORT';
