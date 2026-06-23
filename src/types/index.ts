export interface ParsedResume {
  text: string;
  sections: ResumeSection[];
  rawText: string;
}

export interface ResumeSection {
  name: string;
  content: string;
  weight: number;
}

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  structure: number;
  projects: number;
  skills: number;
  readability: number;
  experienceQuality: number;
  formatting: number;
}

export interface RecruiterScore {
  overall: number;
  clarity: number;
  professionalism: number;
  relevance: number;
  conciseness: number;
}

export interface KeywordAnalysis {
  matched: KeywordMatch[];
  missing: KeywordMatch[];
  partial: KeywordMatch[];
  industryKeywords: KeywordMatch[];
}

export interface KeywordMatch {
  word: string;
  percentage: number;
  category?: string;
}

export interface SectionAnalysis {
  name: string;
  weight: number;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface BulletImprovement {
  original: string;
  improved: string;
  explanation: string;
}

export interface ProjectImprovement {
  original: string;
  improved: string;
  techStack: string[];
  impact: string;
}

export interface ImprovementSuggestion {
  category: 'content' | 'grammar' | 'structure';
  title: string;
  description: string;
  section?: string;
}

export interface RewrittenResume {
  header: string;
  summary: string;
  experience: string[];
  projects: string[];
  skills: string[];
  education: string;
  certifications: string[];
}

export interface LaTeXOutput {
  code: string;
}

export interface HeatmapEntry {
  section: string;
  score: number;
  label: string;
}

export interface AnalysisResult {
  atsScore: ATSScore;
  recruiterScore: RecruiterScore;
  keywordAnalysis: KeywordAnalysis;
  sectionAnalysis: SectionAnalysis[];
  improvements: ImprovementSuggestion[];
  bulletImprovements: BulletImprovement[];
  projectImprovements: ProjectImprovement[];
  rewrittenResume: string;
  latexCode: string;
  atsSimulator: string;
  heatmap: HeatmapEntry[];
  parsedResume: ParsedResume;
  isImageResume?: boolean;
}

export type ScoreTier = 'excellent' | 'good' | 'needs-work';

export function getScoreTier(score: number): { tier: ScoreTier; label: string; color: string } {
  if (score >= 80) return { tier: 'excellent', label: 'Excellent', color: '#10B981' };
  if (score >= 60) return { tier: 'good', label: 'Good', color: '#F59E0B' };
  return { tier: 'needs-work', label: 'Needs Work', color: '#EF4444' };
}

export const SECTION_WEIGHTS: Record<string, number> = {
  'Header/Contact': 5,
  'Professional Summary': 10,
  'Work Experience': 25,
  'Education': 10,
  'Skills': 20,
  'Projects': 15,
  'Certifications': 5,
  'Formatting': 10,
};

export const SCORING_WEIGHTS = {
  keywordMatch: 0.35,
  structure: 0.15,
  projects: 0.15,
  skills: 0.10,
  readability: 0.10,
  experienceQuality: 0.10,
  formatting: 0.05,
};
