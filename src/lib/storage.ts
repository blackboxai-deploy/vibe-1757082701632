import { UserPreferences, PersonalPhrase, ProgressData } from '@/types';

// Default user preferences
const defaultPreferences: UserPreferences = {
  voiceSettings: {
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: undefined
  },
  complexityLevel: 'basic',
  fontSize: 'medium',
  highContrast: false,
  categories: ['basic-needs', 'emotions', 'actions', 'people', 'places']
};

// Local storage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'aphasia_user_preferences',
  PERSONAL_PHRASES: 'aphasia_personal_phrases',
  PROGRESS_DATA: 'aphasia_progress_data',
  THERAPY_SESSIONS: 'aphasia_therapy_sessions'
};

export class StorageService {
  
  // User Preferences
  static getUserPreferences(): UserPreferences {
    if (typeof window === 'undefined') return defaultPreferences;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
    return defaultPreferences;
  }

  static saveUserPreferences(preferences: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  // Personal Phrases
  static getPersonalPhrases(): PersonalPhrase[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERSONAL_PHRASES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading personal phrases:', error);
    }
    return [];
  }

  static savePersonalPhrase(phrase: PersonalPhrase): void {
    if (typeof window === 'undefined') return;
    
    try {
      const phrases = this.getPersonalPhrases();
      const existingIndex = phrases.findIndex(p => p.id === phrase.id);
      
      if (existingIndex >= 0) {
        phrases[existingIndex] = phrase;
      } else {
        phrases.push(phrase);
      }
      
      localStorage.setItem(STORAGE_KEYS.PERSONAL_PHRASES, JSON.stringify(phrases));
    } catch (error) {
      console.error('Error saving personal phrase:', error);
    }
  }

  static deletePersonalPhrase(phraseId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const phrases = this.getPersonalPhrases();
      const filtered = phrases.filter(p => p.id !== phraseId);
      localStorage.setItem(STORAGE_KEYS.PERSONAL_PHRASES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting personal phrase:', error);
    }
  }

  // Progress Data
  static getProgressData(): ProgressData {
    if (typeof window === 'undefined') {
      return {
        totalSessions: 0,
        averageScore: 0,
        mostUsedSymbols: [],
        improvementTrend: [],
        weeklyUsage: [0, 0, 0, 0, 0, 0, 0]
      };
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS_DATA);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
    
    return {
      totalSessions: 0,
      averageScore: 0,
      mostUsedSymbols: [],
      improvementTrend: [],
      weeklyUsage: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  static saveProgressData(data: Partial<ProgressData>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const current = this.getProgressData();
      const updated = { ...current, ...data };
      localStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  }

  // Utility functions
  static incrementSymbolUsage(symbolId: string): void {
    // Track symbol usage for analytics
    const key = `symbol_usage_${symbolId}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (current + 1).toString());
  }

  static getSymbolUsage(symbolId: string): number {
    const key = `symbol_usage_${symbolId}`;
    return parseInt(localStorage.getItem(key) || '0');
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear symbol usage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('symbol_usage_')) {
        localStorage.removeItem(key);
      }
    }
  }
}

// Convenience exports
export const getUserPreferences = () => StorageService.getUserPreferences();
export const saveUserPreferences = (prefs: Partial<UserPreferences>) => StorageService.saveUserPreferences(prefs);
export const getPersonalPhrases = () => StorageService.getPersonalPhrases();
export const savePersonalPhrase = (phrase: PersonalPhrase) => StorageService.savePersonalPhrase(phrase);
export const getProgressData = () => StorageService.getProgressData();