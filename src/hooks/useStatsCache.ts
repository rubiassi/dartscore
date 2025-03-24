import { useCallback } from 'react';
import { PlayerGameData, PlayerStats } from '../types/statistics';
import cache from '../utils/cache';

// Hjælpefunktion til at generere cache keys
const generateCacheKey = (playerId: string, statType: string): string => {
  return `player_${playerId}_${statType}`;
};

export const useStatsCache = () => {
  // Cache statistikker
  const cacheStats = useCallback((playerId: string, stats: PlayerStats): void => {
    cache.set(generateCacheKey(playerId, 'stats'), stats);
  }, []);

  // Hent cachede statistikker
  const getCachedStats = useCallback((playerId: string): PlayerStats | undefined => {
    return cache.get(generateCacheKey(playerId, 'stats'));
  }, []);

  // Cache game data
  const cacheGameData = useCallback((playerId: string, gameData: PlayerGameData): void => {
    cache.set(generateCacheKey(playerId, 'gameData'), gameData);
  }, []);

  // Hent cached game data
  const getCachedGameData = useCallback((playerId: string): PlayerGameData | undefined => {
    return cache.get(generateCacheKey(playerId, 'gameData'));
  }, []);

  // Ryd cache for en spiller
  const clearPlayerCache = useCallback((playerId: string): void => {
    cache.delete(generateCacheKey(playerId, 'stats'));
    cache.delete(generateCacheKey(playerId, 'gameData'));
  }, []);

  // Ryd al cache
  const clearAllCache = useCallback((): void => {
    cache.clear();
  }, []);

  return {
    cacheStats,
    getCachedStats,
    cacheGameData,
    getCachedGameData,
    clearPlayerCache,
    clearAllCache
  };
}; 