import { useReducer, useMemo, useRef } from 'react';
import { GameState, PlayerGameData, ThrowHistory, CheckoutGuide } from '../types/statistics';
import { GameConfig } from '../types/game';

type GameAction =
  | { type: 'ADD_THROW'; playerId: string; throwData: ThrowHistory }
  | { type: 'ADD_LEG_WIN'; playerId: string; darts: number; callback?: (state: GameState) => void }
  | { type: 'ADD_SET_WIN'; playerId: string; callback?: (state: GameState) => void }
  | { type: 'UPDATE_SCORE'; playerId: string; score: number }
  | { type: 'UPDATE_LAST_THROWS'; playerId: string; throws: number[] }
  | { type: 'UPDATE_LEG_DARTS'; playerId: string; darts: number }
  | { type: 'UPDATE_LEG_AVERAGE'; playerId: string; average: number }
  | { type: 'SET_CHECKOUT_GUIDE'; guide: CheckoutGuide | null }
  | { type: 'SET_CURRENT_PLAYER'; index: number }
  | { type: 'RESET_LEG'; startingScore: number }
  | { type: 'NEXT_PLAYER' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState: GameState;
  
  switch (action.type) {
    case 'ADD_THROW': {
      const { playerId, throwData } = action;
      const playerData = state.playerGameData[playerId] || {
        throwHistory: [],
        legsWon: [],
        setsWon: 0,
        playerId: playerId
      };

      const currentLegDarts = (state.currentLegDarts[playerId] || 0) + throwData.dartsUsed;
      const currentScore = state.scores[playerId] - throwData.score;
      const legAverage = currentLegDarts > 0 ? (currentScore * 3) / currentLegDarts : 0;

      return {
        ...state,
        playerGameData: {
          ...state.playerGameData,
          [playerId]: {
            ...playerData,
            throwHistory: [...playerData.throwHistory, {
              ...throwData,
              isCheckout: currentScore === 0,
              doublesAttempted: throwData.doublesAttempted || 0
            }]
          }
        },
        scores: {
          ...state.scores,
          [playerId]: currentScore
        },
        lastThrows: {
          ...state.lastThrows,
          [playerId]: [throwData.score, ...(state.lastThrows[playerId] || [])].slice(0, 3)
        },
        currentLegDarts: {
          ...state.currentLegDarts,
          [playerId]: currentLegDarts
        },
        currentLegAverage: {
          ...state.currentLegAverage,
          [playerId]: legAverage
        }
      };
    }

    case 'ADD_LEG_WIN':
      
      // Hent eksisterende legs won
      const existingLegsWon = state.playerGameData[action.playerId]?.legsWon || [];
      
      // Tilføj ny leg win
      const updatedLegsWon = [...existingLegsWon, action.darts];
      
      // Opret nyt state med opdaterede legs
      newState = {
        ...state,
        playerGameData: {
          ...state.playerGameData,
          [action.playerId]: {
            ...state.playerGameData[action.playerId],
            legsWon: updatedLegsWon
          }
        }
      };
      
      
      // Kald callback hvis den findes
      if (action.callback) {
        action.callback(newState);
      }
      
      return newState;

    case 'ADD_SET_WIN':
      newState = {
        ...state,
        playerGameData: {
          ...state.playerGameData,
          [action.playerId]: {
            ...state.playerGameData[action.playerId],
            setsWon: state.playerGameData[action.playerId].setsWon + 1
          }
        }
      };
      
      // Kald callback hvis den findes
      if (action.callback) {
        action.callback(newState);
      }
      
      return newState;

    case 'UPDATE_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.playerId]: action.score
        }
      };

    case 'UPDATE_LAST_THROWS':
      return {
        ...state,
        lastThrows: {
          ...state.lastThrows,
          [action.playerId]: action.throws
        }
      };

    case 'UPDATE_LEG_DARTS':
      return {
        ...state,
        currentLegDarts: {
          ...state.currentLegDarts,
          [action.playerId]: action.darts
        }
      };

    case 'UPDATE_LEG_AVERAGE':
      return {
        ...state,
        currentLegAverage: {
          ...state.currentLegAverage,
          [action.playerId]: action.average
        }
      };

    case 'SET_CHECKOUT_GUIDE':
      return {
        ...state,
        checkoutGuide: action.guide
      };

    case 'SET_CURRENT_PLAYER':
      return {
        ...state,
        currentPlayerIndex: action.index
      };

    case 'RESET_LEG':
      const resetScores = Object.fromEntries(
        Object.keys(state.scores).map(key => [key, action.startingScore])
      );
      const resetLastThrows = Object.fromEntries(
        Object.keys(state.lastThrows).map(key => [key, []])
      );
      const resetLegDarts = Object.fromEntries(
        Object.keys(state.currentLegDarts).map(key => [key, 0])
      );
      const resetLegAverage = Object.fromEntries(
        Object.keys(state.currentLegAverage).map(key => [key, 0])
      );

      return {
        ...state,
        scores: resetScores,
        lastThrows: resetLastThrows,
        currentLegDarts: resetLegDarts,
        currentLegAverage: resetLegAverage,
        checkoutGuide: null
      };

    case 'NEXT_PLAYER':
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % Object.keys(state.playerGameData).length
      };

    default:
      return state;
  }
};

export const useGameState = (gameConfig: GameConfig) => {
  const hasInitialized = useRef(false);

  const initialState: GameState = useMemo(() => {
    if (hasInitialized.current) {
      return {} as GameState; // Return empty state if already initialized
    }

    const playerEntries = gameConfig.players
      .filter(player => player?.id)
      .map(player => [
        player.id,
        {
          playerId: player.id,
          throwHistory: [],
          legsWon: [],
          setsWon: 0
        }
      ]);

    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }

    const initialScores = Object.fromEntries(
      playerEntries.map(([id]) => [id, gameConfig.startingScore])
    );

    const initialLastThrows = Object.fromEntries(
      playerEntries.map(([id]) => [id, []])
    );

    const initialLegDarts = Object.fromEntries(
      playerEntries.map(([id]) => [id, 0])
    );

    const initialLegAverage = Object.fromEntries(
      playerEntries.map(([id]) => [id, 0])
    );

    return {
      playerGameData: Object.fromEntries(playerEntries),
      currentPlayerIndex: 0,
      scores: initialScores,
      lastThrows: initialLastThrows,
      currentLegDarts: initialLegDarts,
      currentLegAverage: initialLegAverage,
      checkoutGuide: null
    };
  }, [gameConfig]);

  return useReducer(gameReducer, initialState);
}; 