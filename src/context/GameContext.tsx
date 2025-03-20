import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  showingStats: boolean;
  setShowingStats: (showing: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showingStats, setShowingStats] = useState(false);

  return (
    <GameContext.Provider value={{ showingStats, setShowingStats }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 