import { useMemo } from 'react';
import { PlayerGameData, PlayerStats } from '../types/statistics';
import GameStatistics from '../utils/GameStatistics';
import { createSelector } from '../utils/memoization';
import { useStatsCache } from './useStatsCache';

// Default stats objekt
const DEFAULT_STATS: PlayerStats = {
  averages: {
    overall: 0,
    set: 0,
    leg: 0,
    firstNine: 0
  },
  checkouts: {
    percentage: 0,
    successful: 0,
    attempts: 0
  },
  legsWon: {
    nine: 0,
    tenToTwelve: 0,
    thirteenToFifteen: 0,
    sixteenToTwenty: 0,
    twentyOneToTwentyFive: 0,
    twentySixToThirty: 0,
    thirtyPlus: 0
  },
  scoring: {
    oneEighty: 0,
    oneFortyPlus: 0,
    oneHundredPlus: 0,
    sixtyPlus: 0,
    fortyPlus: 0,
    twentyPlus: 0,
    oneToTwenty: 0
  }
};

// Selectors
const selectCurrentLeg = (gameData: PlayerGameData) => {
  if (!gameData?.throwHistory?.length) return [];
  const lastCheckoutIndex = gameData.throwHistory.findIndex(t => t.isCheckout);
  return gameData.throwHistory.slice(lastCheckoutIndex + 1);
};

const selectCurrentSet = (gameData: PlayerGameData) => {
  if (!gameData?.throwHistory?.length) return [];
  const lastSetCheckoutIndex = gameData.throwHistory.findIndex(
    t => t.isCheckout && gameData.setsWon > 0
  );
  return gameData.throwHistory.slice(lastSetCheckoutIndex + 1);
};

// Memoized stats calculator
const calculateStats = createSelector(
  [
    (gameData: PlayerGameData) => gameData,
    selectCurrentLeg,
    selectCurrentSet
  ],
  (gameData: PlayerGameData, currentLeg: PlayerGameData['throwHistory'], currentSet: PlayerGameData['throwHistory']): PlayerStats => {
    if (!gameData?.throwHistory) {
      return DEFAULT_STATS;
    }

    return {
      averages: {
        overall: GameStatistics.calculateOverallAverage(gameData),
        leg: GameStatistics.calculateLegAverage(gameData, currentLeg),
        set: GameStatistics.calculateSetAverage(gameData, currentSet),
        firstNine: GameStatistics.calculateFirstNineAverage(gameData)
      },
      checkouts: {
        percentage: GameStatistics.calculateCheckoutPercentage(gameData),
        successful: GameStatistics.getSuccessfulCheckouts(gameData),
        attempts: GameStatistics.getCheckoutAttempts(gameData)
      },
      legsWon: {
        nine: GameStatistics.getLegsWonByDarts(gameData, 9),
        tenToTwelve: GameStatistics.getLegsWonByDartsRange(gameData, 10, 12),
        thirteenToFifteen: GameStatistics.getLegsWonByDartsRange(gameData, 13, 15),
        sixteenToTwenty: GameStatistics.getLegsWonByDartsRange(gameData, 16, 20),
        twentyOneToTwentyFive: GameStatistics.getLegsWonByDartsRange(gameData, 21, 25),
        twentySixToThirty: GameStatistics.getLegsWonByDartsRange(gameData, 26, 30),
        thirtyPlus: GameStatistics.getLegsWonByDartsOver(gameData, 30)
      },
      scoring: {
        oneEighty: GameStatistics.getScoringCount(gameData, 180),
        oneFortyPlus: GameStatistics.getScoringRangeCount(gameData, 140, 179),
        oneHundredPlus: GameStatistics.getScoringRangeCount(gameData, 100, 139),
        sixtyPlus: GameStatistics.getScoringRangeCount(gameData, 60, 99),
        fortyPlus: GameStatistics.getScoringRangeCount(gameData, 40, 59),
        twentyPlus: GameStatistics.getScoringRangeCount(gameData, 20, 39),
        oneToTwenty: GameStatistics.getScoringRangeCount(gameData, 1, 19)
      }
    };
  }
);

export const useGameStats = (gameData: PlayerGameData | undefined): PlayerStats => {
  const { cacheStats, getCachedStats } = useStatsCache();
  
  return useMemo(() => {
    if (!gameData?.throwHistory) {
      return DEFAULT_STATS;
    }

    const currentLeg = selectCurrentLeg(gameData);
    const currentSet = selectCurrentSet(gameData);

    const stats: PlayerStats = {
      averages: {
        overall: GameStatistics.calculateOverallAverage(gameData),
        set: GameStatistics.calculateSetAverage(gameData, currentSet),
        leg: GameStatistics.calculateLegAverage(gameData, currentLeg),
        firstNine: GameStatistics.calculateFirstNineAverage(gameData)
      },
      checkouts: {
        percentage: GameStatistics.calculateCheckoutPercentage(gameData),
        successful: GameStatistics.getSuccessfulCheckouts(gameData),
        attempts: GameStatistics.getCheckoutAttempts(gameData)
      },
      legsWon: {
        nine: GameStatistics.getLegsWonByDarts(gameData, 9),
        tenToTwelve: GameStatistics.getLegsWonByDartsRange(gameData, 10, 12),
        thirteenToFifteen: GameStatistics.getLegsWonByDartsRange(gameData, 13, 15),
        sixteenToTwenty: GameStatistics.getLegsWonByDartsRange(gameData, 16, 20),
        twentyOneToTwentyFive: GameStatistics.getLegsWonByDartsRange(gameData, 21, 25),
        twentySixToThirty: GameStatistics.getLegsWonByDartsRange(gameData, 26, 30),
        thirtyPlus: GameStatistics.getLegsWonByDartsOver(gameData, 30)
      },
      scoring: {
        oneEighty: GameStatistics.getScoringCount(gameData, 180),
        oneFortyPlus: GameStatistics.getScoringRangeCount(gameData, 140, 179),
        oneHundredPlus: GameStatistics.getScoringRangeCount(gameData, 100, 139),
        sixtyPlus: GameStatistics.getScoringRangeCount(gameData, 60, 99),
        fortyPlus: GameStatistics.getScoringRangeCount(gameData, 40, 59),
        twentyPlus: GameStatistics.getScoringRangeCount(gameData, 20, 39),
        oneToTwenty: GameStatistics.getScoringRangeCount(gameData, 1, 19)
      }
    };

    // Cache de nye stats hvis vi har et playerId
    if (gameData?.playerId) {
      cacheStats(gameData.playerId, stats);
    }

    return stats;
  }, [gameData, cacheStats, getCachedStats]);
}; 