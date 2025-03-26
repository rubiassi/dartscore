export type PlayerType = 'guest' | 'user' | 'bot' | 'friend' | 'login';
export type MatchFormat = 'first' | 'best';
export type InMode = 'straight' | 'double' | 'triple';
export type OutMode = 'straight' | 'double' | 'master';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  score: number;
  botDifficulty?: string;
  avatar?: string;
}

export interface GameConfig {
  players: Player[];
  gameType: number;
  startingScore: number;
  matchFormat: MatchFormat;
  sets: number;
  legs: number;
  legsPerSet: number;
  inMode: InMode;
  outMode: OutMode;
  isTraining: boolean;
  scoreAnnouncer: boolean;
  randomStart: boolean;
  showCheckout: boolean;
  useDoubles: boolean;
  formatType: 'legs' | 'sets';
  formatCount: number;
}

export interface PlayerGameData {
  throwHistory: ThrowData[];
  legsWon: number[];
  setsWon: number;
}

export interface ThrowData {
  score: number;
  dartsUsed: number;
  doublesAttempted: number;
  isCheckout: boolean;
}

export interface CheckoutGuide {
  score: number;
  combinations: string[];
}

export interface GameStats {
  scores: { [key: string]: number };
  averages: { [key: string]: number };
  lastThrows: { [key: string]: number[] };
  dartsThrown: { [key: string]: number };
  checkoutPercentages: { [key: string]: number };
  setsWon: { [key: string]: number };
  legsWon: { [key: string]: number };
  currentLegDarts: { [key: string]: number };
  currentLegAverage: { [key: string]: number };
}

export interface GameState {
  currentPlayerIndex: number;
  gameStats: GameStats;
  playerGameData: { [key: string]: PlayerGameData };
  checkoutGuide: CheckoutGuide | null;
}

export interface DoubleOutOption {
  rest: number;
  points: number;
  darts: number;
  checkdarts: number[];
} 