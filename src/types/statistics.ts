import { Player } from './game';

export interface ThrowHistory {
  score: number;
  dartsUsed: number;
  doublesAttempted: number;
  isCheckout: boolean;
}

export interface PlayerGameData {
  playerId: string;
  throwHistory: ThrowHistory[];
  legsWon: number[];
  setsWon: number;
}

export interface PlayerStats {
  averages: {
    overall: number;
    set: number;
    leg: number;
    firstNine: number;
  };
  checkouts: {
    percentage: number;
    successful: number;
    attempts: number;
  };
  legsWon: {
    nine: number;
    tenToTwelve: number;
    thirteenToFifteen: number;
    sixteenToTwenty: number;
    twentyOneToTwentyFive: number;
    twentySixToThirty: number;
    thirtyPlus: number;
  };
  scoring: {
    oneEighty: number;
    oneFortyPlus: number;
    oneHundredPlus: number;
    sixtyPlus: number;
    fortyPlus: number;
    twentyPlus: number;
    oneToTwenty: number;
  };
}

export interface GameState {
  playerGameData: { [key: string]: PlayerGameData };
  currentPlayerIndex: number;
  scores: { [key: string]: number };
  lastThrows: { [key: string]: number[] };
  currentLegDarts: { [key: string]: number };
  currentLegAverage: { [key: string]: number };
  checkoutGuide: CheckoutGuide | null;
}

export interface CheckoutGuide {
  score: number;
  combinations: string[];
} 