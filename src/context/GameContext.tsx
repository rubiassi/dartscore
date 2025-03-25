import React, { createContext, useContext, useReducer, useState } from 'react';
import { GameState, GameConfig, Player, ThrowData, GameStats } from '../types/game';
import { gameStatsReducer, createInitialState } from '../reducers/gameStatsReducer';

interface GameContextType {
  gameState: GameState;
  gameConfig: GameConfig | null;
  showingStats: boolean;
  setShowingStats: (showing: boolean) => void;
  handleScore: (playerId: string, throwData: ThrowData) => void;
  handleLegWin: (playerId: string, dartsUsed: number) => void;
  handleSetWin: (playerId: string) => void;
  resetLeg: (players: string[], startingScore: number) => void;
  resetGame: (players: Player[], startingScore: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const createInitialGameState = (players: string[], startingScore: number): GameState => ({
  currentPlayerIndex: 0,
  gameStats: createInitialState(players, startingScore),
  playerGameData: Object.fromEntries(
    players.map(id => [id, { throwHistory: [], legsWon: [], setsWon: 0 }])
  ),
  checkoutGuide: null
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showingStats, setShowingStats] = useState(false);
  const [gameState, setGameState] = useState<GameState>(createInitialGameState([], 501));

  const handleScore = (playerId: string, throwData: ThrowData) => {
    setGameState(prevState => ({
      ...prevState,
      gameStats: gameStatsReducer(prevState.gameStats, {
        type: 'UPDATE_THROW',
        playerId,
        throwData
      })
    }));
  };

  const handleLegWin = (playerId: string, dartsUsed: number) => {
    setGameState(prevState => ({
      ...prevState,
      gameStats: gameStatsReducer(prevState.gameStats, {
        type: 'UPDATE_LEG_WIN',
        playerId,
        dartsUsed
      })
    }));
  };

  const handleSetWin = (playerId: string) => {
    setGameState(prevState => ({
      ...prevState,
      gameStats: gameStatsReducer(prevState.gameStats, {
        type: 'UPDATE_SET_WIN',
        playerId
      })
    }));
  };

  const resetLeg = (players: string[], startingScore: number) => {
    setGameState(prevState => ({
      ...prevState,
      gameStats: gameStatsReducer(prevState.gameStats, {
        type: 'RESET_LEG',
        players,
        startingScore
      })
    }));
  };

  const resetGame = (players: Player[], startingScore: number) => {
    setGameState(createInitialGameState(
      players.map(p => p.id),
      startingScore
    ));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        gameConfig,
        showingStats,
        setShowingStats,
        handleScore,
        handleLegWin,
        handleSetWin,
        resetLeg,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 