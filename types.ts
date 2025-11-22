export interface MathProblem {
  num1: number;
  num2: number;
  operation: 'add' | 'sub';
  answer: number;
  questionText?: string; // Used for word problems
  isWordProblem: boolean;
}

export type GameState = 'INTRO' | 'PLAYING' | 'SUMMARY' | 'DASHBOARD';

export interface CharacterConfig {
  suitColor: 'blue' | 'red' | 'green' | 'orange' | 'purple';
  helmetStyle: 'classic' | 'tech' | 'speed';
  badge: 'star' | 'bolt' | 'heart' | 'planet';
}

export interface PlayerState {
  name: string;
  character: CharacterConfig;
  score: number;
  streak: number;
  hasShield: boolean;
  hintsUsed: number;
  history: {
    questionIndex: number;
    correct: boolean;
    points: number;
  }[];
}