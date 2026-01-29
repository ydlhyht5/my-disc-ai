
export type Language = 'zh' | 'en';

export interface AnalysisReport {
  isPersonalityTest: boolean;
  testType: string;
  overallTitle: string;
  summary: string;
  traits: string[];
  strengths: string[];
  growthAreas: string[];
  interpersonalAdvice: string;
  careerAdvice: string;
}

export type AppState = 'IDLE' | 'ANALYZING' | 'REPORT';
