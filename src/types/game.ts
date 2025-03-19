export interface Player {
  id: string;
  name: string;
  type: 'human' | 'bot';
  botDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface GameConfig {
  startingScore: number;
  matchFormat: 'firstTo' | 'bestOf';
  sets: number;
  legs: number;
  doubleIn: boolean;
  doubleOut: boolean;
  splitScore: boolean;
  tieBreak: boolean;
}

export interface GameState {
  scores: { [key: string]: number };
  averages: { [key: string]: number };
  lastThrows: { [key: string]: number[] };
  dartsThrown: { [key: string]: number };
  checkoutPercentages: { [key: string]: number };
  setsWon: { [key: string]: number };
  legsWon: { [key: string]: number };
  setAverages: { [key: string]: number };
  legAverages: { [key: string]: number };
  doubleAttempts: { [key: string]: number };
  checkoutThrows: { [key: string]: number };
}

export interface CheckoutGuide {
  score: number;
  combinations: string[];
} 