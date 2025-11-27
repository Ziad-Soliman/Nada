
export interface MathProblem {
  num1: number;
  num2: number;
  operation: 'add' | 'sub' | 'mul' | 'div' | 'val' | 'round' | 'frac' | 'geo' | 'time';
  answer: number | string;
  questionText?: string;
  isWordProblem: boolean;
  visualType?: string;
}

export type GameState = 'INTRO' | 'MISSION_SELECT' | 'PLAYING' | 'SUMMARY' | 'DASHBOARD' | 'STUDENT_PROFILE';

export type GameId = 'space' | 'dino' | 'cave' | 'ocean' | 'city' | 'time';

export type ClassId = '3A' | '3B' | '3C';

export interface CharacterConfig {
  suitColor: 'blue' | 'red' | 'green' | 'orange' | 'purple';
  helmetStyle: 'classic' | 'tech' | 'speed';
  badge: 'star' | 'bolt' | 'heart' | 'planet';
}

export interface GameStats {
  highScore: number;
  timesPlayed: number;
  totalScore: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export interface PlayerState {
  id: string; // unique ID based on name+class
  firstName: string;
  lastName: string;
  classId: ClassId;
  character: CharacterConfig;
  score: number; // Current session score
  streak: number; // Current session streak
  hasShield: boolean;
  hintsUsed: number;
  history: {
    questionIndex: number;
    correct: boolean;
    points: number;
  }[];
  stats: Record<GameId, GameStats>;
  lastPlayed: string; // ISO Date string
}

export interface NotionStudent {
  id: string; // Notion Page ID
  firstName: string;
  lastName: string;
  classId: string;
  totalScore: number;
  lastPlayed: string;
  rank: string;
  character: CharacterConfig;
}

export interface StudentDatabase {
  [id: string]: PlayerState;
}
