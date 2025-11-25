
export interface MathProblem {
  num1: number;
  num2: number;
  operation: 'add' | 'sub' | 'mul' | 'div' | 'val' | 'round' | 'frac' | 'geo'; // Expanded operations
  answer: number;
  questionText?: string; // Used for word problems
  isWordProblem: boolean;
  visualType?: string; // Identifier for visuals (e.g., 'cube', 'triangle')
}

export type GameState = 'INTRO' | 'MISSION_SELECT' | 'PLAYING' | 'SUMMARY' | 'DASHBOARD' | 'STUDENT_PROFILE';

export type GameId = 'space' | 'dino' | 'cave' | 'ocean' | 'city';

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
  stats: Record<GameId, GameStats>;
}
