
export interface AnalysisReport {
  isPersonalityTest: boolean;
  testType: string; // 例如: MBTI, DISC, 九型人格, 大五人格等
  overallTitle: string;
  summary: string;
  traits: string[];
  strengths: string[];
  growthAreas: string[];
  interpersonalAdvice: string;
  careerAdvice: string;
}

export type AppState = 'IDLE' | 'ANALYZING' | 'REPORT';
