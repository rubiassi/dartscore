import { memoize } from './memoization';
import { PlayerGameData, ThrowHistory } from '../types/statistics';

// Hjælpefunktioner til at reducere gentagne beregninger
const calculateTotals = (throws: ThrowHistory[]) => {
  return throws.reduce(
    (acc, t) => ({
      score: acc.score + t.score,
      darts: acc.darts + t.dartsUsed
    }),
    { score: 0, darts: 0 }
  );
};

// Base implementations
const calculateOverallAverageImpl = (gameData: PlayerGameData): number => {
  if (!gameData?.throwHistory?.length) return 0;
  const { score, darts } = calculateTotals(gameData.throwHistory);
  return darts > 0 ? (score * 3) / darts : 0;
};

const calculateLegAverageImpl = (gameData: PlayerGameData, currentLeg: ThrowHistory[]): number => {
  if (!currentLeg?.length) return 0;
  const { score, darts } = calculateTotals(currentLeg);
  return darts > 0 ? (score * 3) / darts : 0;
};

const calculateSetAverageImpl = (gameData: PlayerGameData, currentSet: ThrowHistory[]): number => {
  if (!currentSet?.length) return 0;
  const { score, darts } = calculateTotals(currentSet);
  return darts > 0 ? (score * 3) / darts : 0;
};

const calculateFirstNineAverageImpl = (gameData: PlayerGameData): number => {
  if (!gameData?.throwHistory?.length) return 0;
  const firstNine = gameData.throwHistory.slice(0, 3);
  const { score, darts } = calculateTotals(firstNine);
  return darts > 0 ? (score * 3) / darts : 0;
};

// Optimeret checkout beregning
const calculateCheckoutStats = (gameData: PlayerGameData) => {
  if (!gameData?.throwHistory?.length) return { successful: 0, attempts: 0 };
  
  return gameData.throwHistory.reduce((acc, t) => {
    if (t.isCheckout && t.score > 0) {
      return {
        successful: acc.successful + 1,
        attempts: acc.attempts + Math.max(1, t.doublesAttempted)
      };
    }
    return {
      successful: acc.successful,
      attempts: acc.attempts + t.doublesAttempted
    };
  }, { successful: 0, attempts: 0 });
};

const calculateCheckoutPercentageImpl = (gameData: PlayerGameData): number => {
  const stats = calculateCheckoutStats(gameData);
  return stats.attempts > 0 ? (stats.successful / stats.attempts) * 100 : 0;
};

const getSuccessfulCheckoutsImpl = (gameData: PlayerGameData): number => {
  return calculateCheckoutStats(gameData).successful;
};

const getCheckoutAttemptsImpl = (gameData: PlayerGameData): number => {
  return calculateCheckoutStats(gameData).attempts;
};

// Optimeret legs won beregning
const calculateLegsWonStats = memoize((gameData: PlayerGameData) => {
  if (!gameData?.legsWon?.length) return new Map<number, number>();
  
  return gameData.legsWon.reduce((acc, darts) => {
    acc.set(darts, (acc.get(darts) || 0) + 1);
    return acc;
  }, new Map<number, number>());
});

const getLegsWonByDartsImpl = (gameData: PlayerGameData, darts: number): number => {
  const stats = calculateLegsWonStats(gameData);
  return stats.get(darts) || 0;
};

const getLegsWonByDartsRangeImpl = (gameData: PlayerGameData, min: number, max: number): number => {
  const stats = calculateLegsWonStats(gameData);
  return Array.from(stats.entries())
    .filter(([darts]) => darts >= min && darts <= max)
    .reduce((sum, [_, count]) => sum + count, 0);
};

const getLegsWonByDartsOverImpl = (gameData: PlayerGameData, darts: number): number => {
  const stats = calculateLegsWonStats(gameData);
  return Array.from(stats.entries())
    .filter(([d]) => d > darts)
    .reduce((sum, [_, count]) => sum + count, 0);
};

// Optimeret scoring beregning
const calculateScoringStats = memoize((gameData: PlayerGameData) => {
  if (!gameData?.throwHistory?.length) return new Map<number, number>();
  
  return gameData.throwHistory.reduce((acc, t) => {
    acc.set(t.score, (acc.get(t.score) || 0) + 1);
    return acc;
  }, new Map<number, number>());
});

const getScoringCountImpl = (gameData: PlayerGameData, score: number): number => {
  const stats = calculateScoringStats(gameData);
  return stats.get(score) || 0;
};

const getScoringRangeCountImpl = (gameData: PlayerGameData, min: number, max: number): number => {
  const stats = calculateScoringStats(gameData);
  return Array.from(stats.entries())
    .filter(([score]) => score >= min && score <= max)
    .reduce((sum, [_, count]) => sum + count, 0);
};

const calculateTotalDartsThrownImpl = (gameData: PlayerGameData): number => {
  if (!gameData?.throwHistory?.length) return 0;
  return gameData.throwHistory.reduce((sum, t) => sum + t.dartsUsed, 0);
};

const calculateHighestFinishImpl = (gameData: PlayerGameData): number => {
  if (!gameData?.throwHistory?.length) return 0;
  return Math.max(
    0,
    ...gameData.throwHistory
      .filter(t => t.isCheckout && t.score > 0)
      .map(t => t.score)
  );
};

// Memoized exports
export const calculateOverallAverage = memoize(calculateOverallAverageImpl);
export const calculateLegAverage = memoize(calculateLegAverageImpl);
export const calculateSetAverage = memoize(calculateSetAverageImpl);
export const calculateFirstNineAverage = memoize(calculateFirstNineAverageImpl);
export const calculateCheckoutPercentage = memoize(calculateCheckoutPercentageImpl);
export const getSuccessfulCheckouts = memoize(getSuccessfulCheckoutsImpl);
export const getCheckoutAttempts = memoize(getCheckoutAttemptsImpl);
export const getLegsWonByDarts = memoize(getLegsWonByDartsImpl);
export const getLegsWonByDartsRange = memoize(getLegsWonByDartsRangeImpl);
export const getLegsWonByDartsOver = memoize(getLegsWonByDartsOverImpl);
export const getScoringCount = memoize(getScoringCountImpl);
export const getScoringRangeCount = memoize(getScoringRangeCountImpl);
export const calculateTotalDartsThrown = memoize(calculateTotalDartsThrownImpl);
export const calculateHighestFinish = memoize(calculateHighestFinishImpl);

export default {
  calculateOverallAverage,
  calculateLegAverage,
  calculateSetAverage,
  calculateFirstNineAverage,
  calculateCheckoutPercentage,
  getSuccessfulCheckouts,
  getCheckoutAttempts,
  getLegsWonByDarts,
  getLegsWonByDartsRange,
  getLegsWonByDartsOver,
  getScoringCount,
  getScoringRangeCount,
  calculateTotalDartsThrown,
  calculateHighestFinish
}; 