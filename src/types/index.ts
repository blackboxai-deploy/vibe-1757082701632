export interface Symbol {
  id: string;
  text: string;
  category: string;
  imageUrl: string;
  pronunciation?: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  symbols: Symbol[];
}

export interface SentenceElement {
  id: string;
  symbol: Symbol;
  position: number;
}

export interface Sentence {
  id: string;
  elements: SentenceElement[];
  text: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  createdAt: Date;
}

export interface PersonalPhrase {
  id: string;
  text: string;
  category: string;
  frequency: number;
  lastUsed: Date;
}

export interface UserPreferences {
  voiceSettings: {
    rate: number;
    pitch: number;
    volume: number;
    voice?: string;
  };
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  categories: string[];
}

export interface TherapySession {
  id: string;
  type: 'symbol_recognition' | 'sentence_building' | 'free_communication';
  duration: number;
  score: number;
  completedAt: Date;
  exercises: TherapyExercise[];
}

export interface TherapyExercise {
  id: string;
  type: string;
  prompt: string;
  userResponse: string;
  correct: boolean;
  timeSpent: number;
}

export interface ProgressData {
  totalSessions: number;
  averageScore: number;
  mostUsedSymbols: Symbol[];
  improvementTrend: number[];
  weeklyUsage: number[];
}