export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  botDifficulty?: string;
  avatar?: string;
}

export type PlayerType = 'login' | 'guest' | 'bot' | 'friend';

export interface GameConfig {
  // Spillere
  players: Player[];
  
  // Spil indstillinger
  startingScore: number;
  matchFormat: 'first' | 'best';
  sets: number;
  legs: number;
  startingIn: 'straight' | 'double' | 'triple';
  outMode: 'double' | 'master' | 'straight';
  legsPerSet: number;
  
  // Spil muligheder
  isTraining: boolean;
  scoreAnnouncer: boolean;
  randomStart: boolean;
  
  // Checkout muligheder
  showCheckout: boolean;
  useDoubles: boolean;
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