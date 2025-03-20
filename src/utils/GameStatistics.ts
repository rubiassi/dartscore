// Interfaces
interface ThrowHistory {
  score: number;
  dartsUsed: number;
  doublesAttempted: number;
  isCheckout: boolean;
}

interface PlayerGameData {
  throwHistory: ThrowHistory[];
  legsWon: number[];  // Array af antal darts brugt til at vinde hver leg
  setsWon: number;
}

// Statistikberegninger
export const calculateOverallAverage = (gameData: PlayerGameData): number => {
  const totalScore = gameData.throwHistory.reduce((sum, t) => sum + t.score, 0);
  const totalDarts = gameData.throwHistory.reduce((sum, t) => sum + t.dartsUsed, 0);
  return totalDarts > 0 ? (totalScore * 3) / totalDarts : 0;
};

export const calculateLegAverage = (gameData: PlayerGameData, currentLeg: ThrowHistory[]): number => {
  const totalScore = currentLeg.reduce((sum, t) => sum + t.score, 0);
  const totalDarts = currentLeg.reduce((sum, t) => sum + t.dartsUsed, 0);
  return totalDarts > 0 ? (totalScore * 3) / totalDarts : 0;
};

export const calculateSetAverage = (gameData: PlayerGameData, currentSet: ThrowHistory[]): number => {
  const totalScore = currentSet.reduce((sum, t) => sum + t.score, 0);
  const totalDarts = currentSet.reduce((sum, t) => sum + t.dartsUsed, 0);
  return totalDarts > 0 ? (totalScore * 3) / totalDarts : 0;
};

export const calculateFirstNineAverage = (gameData: PlayerGameData): number => {
  const firstNine = gameData.throwHistory.slice(0, 3);
  const totalScore = firstNine.reduce((sum, t) => sum + t.score, 0);
  const totalDarts = firstNine.reduce((sum, t) => sum + t.dartsUsed, 0);
  return totalDarts > 0 ? (totalScore * 3) / totalDarts : 0;
};

export const calculateCheckoutPercentage = (gameData: PlayerGameData): number => {
  // Tæl antal succesfulde checkouts (hits)
  const successfulCheckouts = gameData.throwHistory.filter(t => t.isCheckout && t.score > 0).length;
  
  // Tæl total antal double-forsøg (både fra checkouts og ikke-checkouts)
  const totalAttempts = gameData.throwHistory.reduce((sum, t) => {
    // Hvis det er en succesfuld checkout, tæl mindst 1 attempt
    if (t.isCheckout && t.score > 0) {
      return sum + Math.max(1, t.doublesAttempted);
    }
    // For alle andre kast, tæl doublesAttempted
    return sum + t.doublesAttempted;
  }, 0);

  return totalAttempts > 0 ? (successfulCheckouts / totalAttempts) * 100 : 0;
};

export const getSuccessfulCheckouts = (gameData: PlayerGameData): number => {
  return gameData.throwHistory.filter(t => t.isCheckout && t.score > 0).length;
};

export const getCheckoutAttempts = (gameData: PlayerGameData): number => {
  // Tæl total antal double-forsøg (både fra checkouts og ikke-checkouts)
  return gameData.throwHistory.reduce((sum, t) => {
    // Hvis det er en succesfuld checkout, tæl mindst 1 attempt
    if (t.isCheckout && t.score > 0) {
      return sum + Math.max(1, t.doublesAttempted);
    }
    // For alle andre kast, tæl doublesAttempted
    return sum + t.doublesAttempted;
  }, 0);
};

export const getLegsWonByDarts = (gameData: PlayerGameData, darts: number): number => {
  return gameData.legsWon.filter(d => d === darts).length;
};

export const getLegsWonByDartsRange = (gameData: PlayerGameData, min: number, max: number): number => {
  return gameData.legsWon.filter(d => d >= min && d <= max).length;
};

export const getLegsWonByDartsOver = (gameData: PlayerGameData, darts: number): number => {
  return gameData.legsWon.filter(d => d > darts).length;
};

export const getScoringCount = (gameData: PlayerGameData, score: number): number => {
  return gameData.throwHistory.filter(t => t.score === score).length;
};

export const getScoringRangeCount = (gameData: PlayerGameData, min: number, max: number): number => {
  return gameData.throwHistory.filter(t => t.score >= min && t.score <= max).length;
};

// Beregn total antal darts brugt i hele spillet
export const calculateTotalDartsThrown = (gameData: PlayerGameData): number => {
  return gameData.throwHistory.reduce((sum, t) => sum + t.dartsUsed, 0);
};

// Find højeste checkout score
export const calculateHighestFinish = (gameData: PlayerGameData): number => {
  const checkoutScores = gameData.throwHistory
    .filter(t => t.isCheckout && t.score > 0)
    .map(t => t.score);
  
  // Hvis der er checkouts, returner den højeste, ellers 0
  return checkoutScores.length > 0 ? Math.max(...checkoutScores) : 0;
};

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