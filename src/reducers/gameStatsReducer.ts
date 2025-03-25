import { GameStats, ThrowData, Player } from '../types/game';

type GameStatsAction =
  | { type: 'UPDATE_SCORE'; playerId: string; score: number }
  | { type: 'UPDATE_THROW'; playerId: string; throwData: ThrowData }
  | { type: 'UPDATE_LEG_WIN'; playerId: string; dartsUsed: number }
  | { type: 'UPDATE_SET_WIN'; playerId: string }
  | { type: 'RESET_LEG'; players: string[]; startingScore: number }
  | { type: 'RESET_GAME'; players: Player[]; startingScore: number };

export const createInitialState = (players: string[], startingScore: number): GameStats => ({
  scores: Object.fromEntries(players.map(p => [p, startingScore])),
  averages: Object.fromEntries(players.map(p => [p, 0])),
  lastThrows: Object.fromEntries(players.map(p => [p, []])),
  dartsThrown: Object.fromEntries(players.map(p => [p, 0])),
  checkoutPercentages: Object.fromEntries(players.map(p => [p, 0])),
  setsWon: Object.fromEntries(players.map(p => [p, 0])),
  legsWon: Object.fromEntries(players.map(p => [p, 0])),
  currentLegDarts: Object.fromEntries(players.map(p => [p, 0])),
  currentLegAverage: Object.fromEntries(players.map(p => [p, 0]))
});

const calculateAverage = (score: number, darts: number): number => 
  darts > 0 ? (score / darts) * 3 : 0;

export const gameStatsReducer = (state: GameStats, action: GameStatsAction): GameStats => {
  switch (action.type) {
    case 'UPDATE_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.playerId]: action.score
        }
      };

    case 'UPDATE_THROW': {
      const { playerId, throwData } = action;
      const newLastThrows = [
        throwData.score,
        ...(state.lastThrows[playerId] || [])
      ].slice(0, 3);

      const newDartsThrown = state.dartsThrown[playerId] + throwData.dartsUsed;
      const newCurrentLegDarts = state.currentLegDarts[playerId] + throwData.dartsUsed;

      return {
        ...state,
        lastThrows: {
          ...state.lastThrows,
          [playerId]: newLastThrows
        },
        dartsThrown: {
          ...state.dartsThrown,
          [playerId]: newDartsThrown
        },
        currentLegDarts: {
          ...state.currentLegDarts,
          [playerId]: newCurrentLegDarts
        },
        currentLegAverage: {
          ...state.currentLegAverage,
          [playerId]: calculateAverage(
            state.scores[playerId],
            newCurrentLegDarts
          )
        }
      };
    }

    case 'UPDATE_LEG_WIN':
      return {
        ...state,
        legsWon: {
          ...state.legsWon,
          [action.playerId]: state.legsWon[action.playerId] + 1
        }
      };

    case 'UPDATE_SET_WIN':
      return {
        ...state,
        setsWon: {
          ...state.setsWon,
          [action.playerId]: state.setsWon[action.playerId] + 1
        }
      };

    case 'RESET_LEG':
      return {
        ...state,
        scores: Object.fromEntries(action.players.map(p => [p, action.startingScore])),
        lastThrows: Object.fromEntries(action.players.map(p => [p, []])),
        currentLegDarts: Object.fromEntries(action.players.map(p => [p, 0])),
        currentLegAverage: Object.fromEntries(action.players.map(p => [p, 0]))
      };

    case 'RESET_GAME':
      return createInitialState(
        action.players.map(p => p.id),
        action.startingScore
      );

    default:
      return state;
  }
}; 