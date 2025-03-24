import { useReducer, useMemo } from 'react';
import { GameState, PlayerGameData, ThrowHistory, CheckoutGuide } from '../types/statistics';
import { GameConfig } from '../types/game';

type GameAction =
  | { type: 'ADD_THROW'; playerId: string; throwData: ThrowHistory }
  | { type: 'ADD_LEG_WIN'; playerId: string; darts: number }
  | { type: 'ADD_SET_WIN'; playerId: string }
  | { type: 'UPDATE_SCORE'; playerId: string; score: number }
  | { type: 'UPDATE_LAST_THROWS'; playerId: string; throws: number[] }
  | { type: 'UPDATE_LEG_DARTS'; playerId: string; darts: number }
  | { type: 'UPDATE_LEG_AVERAGE'; playerId: string; average: number }
  | { type: 'SET_CHECKOUT_GUIDE'; guide: CheckoutGuide | null }
  | { type: 'SET_CURRENT_PLAYER'; index: number }
  | { type: 'RESET_LEG'; startingScore: number };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_THROW':
      return {
        ...state,
        playerGameData: {
          ...state.playerGameData,
          [action.playerId]: {
            ...state.playerGameData[action.playerId],
            throwHistory: [
              ...state.playerGameData[action.playerId].throwHistory,
              action.throwData
            ]
          }
        }
      };

    case 'ADD_LEG_WIN':
      return {
        ...state,
        playerGameData: {
          ...state.playerGameData,
          [action.playerId]: {
            ...state.playerGameData[action.playerId],
            legsWon: [
              ...state.playerGameData[action.playerId].legsWon,
              action.darts
            ]
          }
        }
      };

    case 'ADD_SET_WIN':
      return {
        ...state,
        playerGameData: {
          ...state.playerGameData,
          [action.playerId]: {
            ...state.playerGameData[action.playerId],
            setsWon: state.playerGameData[action.playerId].setsWon + 1
          }
        }
      };

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

    default:
      return state;
  }
};

export const useGameState = (gameConfig: GameConfig) => {
  const initialState: GameState = useMemo(() => {
    const playerEntries = gameConfig.players
      .filter(player => player?.id)
      .map(player => [
        player.id,
        {
          throwHistory: [],
          legsWon: [],
          setsWon: 0
        }
      ]);

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