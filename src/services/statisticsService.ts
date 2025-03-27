import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Firebase data interfaces
interface PlayerGameStats {
  score: number;
  darts: number;
  doubles: number;
  triples: number;
  oneEighties: number;
  oneForties: number;
  tons: number;
  highestScore: number;
  checkout?: number;
  checkoutAttempts: number;
  averagePerDart: number;
  checkoutPercentage: number;
}

interface GameDocument {
  id: string;
  gameType: string;
  players: string[];
  winner: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  playerStats: { [userId: string]: PlayerGameStats };
  completedAt: Timestamp;
}

// Export interfaces
export interface GameStats {
  gameId: string;
  date: Date;
  gameType: string;
  winner: boolean;
  score: number;
  checkout?: number;
  checkoutPercentage: number;
  averagePerDart: number;
}

export interface PlayerStats {
  totalGames: number;
  gamesWon: number;
  winRate: number;
  highestScore: number;
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

export interface TimeStats {
  period: 'day' | 'week' | 'month' | 'year';
  stats: PlayerStats;
}

// Hent spillerstatistik
export const getPlayerStats = async (userId: string): Promise<PlayerStats> => {
  try {
    const statsRef = doc(db, 'playerStats', userId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      return statsDoc.data() as PlayerStats;
    }

    // Hvis der ikke findes statistik, opret en ny med standardværdier
    const defaultStats: PlayerStats = {
      totalGames: 0,
      gamesWon: 0,
      winRate: 0,
      highestScore: 0,
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

    await setDoc(statsRef, defaultStats);
    return defaultStats;
  } catch (error) {
    console.error('Fejl ved hentning af spillerstatistik:', error);
    throw error;
  }
};

// Hent seneste spil
export const getRecentGames = async (userId: string, limitCount: number = 10): Promise<GameStats[]> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(
      gamesRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      gameId: doc.id,
      date: (doc.data().date as Timestamp).toDate()
    })) as GameStats[];
  } catch (error) {
    console.error('Fejl ved hentning af seneste spil:', error);
    throw error;
  }
};

// Hent personlige rekorder
export const getPersonalBests = async (userId: string) => {
  try {
    const bestsRef = doc(db, 'personalBests', userId);
    const bestsDoc = await getDoc(bestsRef);

    if (bestsDoc.exists()) {
      return bestsDoc.data();
    }

    const defaultBests = {
      highestScore: 0,
      bestCheckout: 0,
      bestAverage: 0,
      mostOneEighties: 0
    };

    await setDoc(bestsRef, defaultBests);
    return defaultBests;
  } catch (error) {
    console.error('Fejl ved hentning af personlige rekorder:', error);
    throw error;
  }
};

// Opdater statistik efter et spil
export const updatePlayerStats = async (
  userId: string,
  gameData: {
    winner: boolean;
    score: number;
    checkout?: number;
    checkoutAttempts: number;
    averagePerDart: number;
    scores: {
      oneEighty: number;
      oneFortyPlus: number;
      oneHundredPlus: number;
      sixtyPlus: number;
      fortyPlus: number;
      twentyPlus: number;
      oneToTwenty: number;
    };
    legDarts: number;
  }
) => {
  try {
    const statsRef = doc(db, 'playerStats', userId);
    const statsDoc = await getDoc(statsRef);
    const currentStats = statsDoc.exists() ? statsDoc.data() as PlayerStats : await getPlayerStats(userId);

    // Opdater statistik
    const updatedStats: PlayerStats = {
      ...currentStats,
      totalGames: currentStats.totalGames + 1,
      gamesWon: currentStats.gamesWon + (gameData.winner ? 1 : 0),
      winRate: ((currentStats.gamesWon + (gameData.winner ? 1 : 0)) / (currentStats.totalGames + 1)) * 100,
      highestScore: Math.max(currentStats.highestScore, gameData.score),
      averages: {
        overall: (currentStats.averages.overall * currentStats.totalGames + gameData.averagePerDart) / (currentStats.totalGames + 1),
        set: currentStats.averages.set, // Opdater dette baseret på sæt data
        leg: (currentStats.averages.leg * currentStats.totalGames + gameData.averagePerDart) / (currentStats.totalGames + 1),
        firstNine: currentStats.averages.firstNine // Opdater dette baseret på first 9 data
      },
      checkouts: {
        successful: currentStats.checkouts.successful + (gameData.checkout ? 1 : 0),
        attempts: currentStats.checkouts.attempts + gameData.checkoutAttempts,
        percentage: ((currentStats.checkouts.successful + (gameData.checkout ? 1 : 0)) / 
                    (currentStats.checkouts.attempts + gameData.checkoutAttempts)) * 100
      },
      scoring: {
        oneEighty: currentStats.scoring.oneEighty + gameData.scores.oneEighty,
        oneFortyPlus: currentStats.scoring.oneFortyPlus + gameData.scores.oneFortyPlus,
        oneHundredPlus: currentStats.scoring.oneHundredPlus + gameData.scores.oneHundredPlus,
        sixtyPlus: currentStats.scoring.sixtyPlus + gameData.scores.sixtyPlus,
        fortyPlus: currentStats.scoring.fortyPlus + gameData.scores.fortyPlus,
        twentyPlus: currentStats.scoring.twentyPlus + gameData.scores.twentyPlus,
        oneToTwenty: currentStats.scoring.oneToTwenty + gameData.scores.oneToTwenty
      },
      legsWon: {
        ...currentStats.legsWon,
        // Opdater legs won baseret på antal darts brugt
        nine: currentStats.legsWon.nine + (gameData.legDarts <= 9 ? 1 : 0),
        tenToTwelve: currentStats.legsWon.tenToTwelve + (gameData.legDarts > 9 && gameData.legDarts <= 12 ? 1 : 0),
        thirteenToFifteen: currentStats.legsWon.thirteenToFifteen + (gameData.legDarts > 12 && gameData.legDarts <= 15 ? 1 : 0),
        sixteenToTwenty: currentStats.legsWon.sixteenToTwenty + (gameData.legDarts > 15 && gameData.legDarts <= 20 ? 1 : 0),
        twentyOneToTwentyFive: currentStats.legsWon.twentyOneToTwentyFive + (gameData.legDarts > 20 && gameData.legDarts <= 25 ? 1 : 0),
        twentySixToThirty: currentStats.legsWon.twentySixToThirty + (gameData.legDarts > 25 && gameData.legDarts <= 30 ? 1 : 0),
        thirtyPlus: currentStats.legsWon.thirtyPlus + (gameData.legDarts > 30 ? 1 : 0)
      }
    };

    await setDoc(statsRef, updatedStats);

    // Opdater personlige rekorder hvis nødvendigt
    const bestsRef = doc(db, 'personalBests', userId);
    const bestsDoc = await getDoc(bestsRef);
    const currentBests = bestsDoc.exists() ? bestsDoc.data() : await getPersonalBests(userId);

    const updatedBests = {
      ...currentBests,
      highestScore: Math.max(currentBests.highestScore, gameData.score),
      bestCheckout: Math.max(currentBests.bestCheckout, gameData.checkout || 0),
      bestAverage: Math.max(currentBests.bestAverage, gameData.averagePerDart),
      mostOneEighties: Math.max(currentBests.mostOneEighties, gameData.scores.oneEighty)
    };

    await setDoc(bestsRef, updatedBests);

    return updatedStats;
  } catch (error) {
    console.error('Fejl ved opdatering af statistik:', error);
    throw error;
  }
};

// Gem et nyt spil
export const saveGame = async (userId: string, gameData: Omit<GameStats, 'gameId'>) => {
  try {
    const gamesRef = collection(db, 'games');
    const newGame = {
      ...gameData,
      userId,
      date: Timestamp.now()
    };

    const docRef = await addDoc(gamesRef, newGame);
    return docRef.id;
  } catch (error) {
    console.error('Fejl ved gemning af spil:', error);
    throw error;
  }
};

// Hent statistik for en bestemt periode
export const getTimeStats = async (
  userId: string,
  period: 'day' | 'week' | 'month' | 'year'
): Promise<TimeStats> => {
  const gamesRef = collection(db, 'games');
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  const q = query(
    gamesRef,
    where('players', 'array-contains', userId),
    where('status', '==', 'completed'),
    where('completedAt', '>=', Timestamp.fromDate(startDate)),
    where('completedAt', '<=', Timestamp.fromDate(now))
  );

  const snapshot = await getDocs(q);
  // Genbruger logikken fra getPlayerStats
  // ... implementering følger samme mønster som getPlayerStats

  return {
    period,
    stats: await processGames(snapshot.docs)
  };
};

// Hjælpefunktion til at processere spil
const processGames = async (games: DocumentData[]): Promise<PlayerStats> => {
  // Implementation similar to getPlayerStats
  // ... implementering følger samme mønster som i getPlayerStats
  return {} as PlayerStats; // Placeholder
}; 