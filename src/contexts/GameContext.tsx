import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, CreateGameForm } from '../types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

interface GameContextType {
  games: Game[];
  createGame: (gameData: CreateGameForm) => Promise<Game>;
  joinGame: (gameId: string, message?: string) => Promise<void>;
  leaveGame: (gameId: string) => Promise<void>;
  approveRequest: (gameId: string, requestId: string) => Promise<void>;
  rejectRequest: (gameId: string, requestId: string) => Promise<void>;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getGames() as any;
      setGames(response.data?.games || []);
    } catch (error) {
      console.error('Error loading games:', error);
      showError('Failed to Load Games', 'Unable to load games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createGame = async (gameData: CreateGameForm): Promise<Game> => {
    setIsLoading(true);
    try {
      const response = await apiService.createGame(gameData) as any;
      const newGame = response.data?.game;
      setGames(prev => [newGame, ...prev]);
      showSuccess('Game Created!', 'Your game has been created successfully.');
      return newGame;
    } catch (error) {
      console.error('Game creation error:', error);
      showError('Failed to Create Game', 'Unable to create game. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameId: string, message?: string) => {
    setIsLoading(true);
    try {
      if (message) {
        await apiService.requestToJoin(gameId, message);
      } else {
        await apiService.joinGame(gameId);
      }
      // Reload games to get updated data
      await loadGames();
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      await apiService.leaveGame(gameId);
      // Reload games to get updated data
      await loadGames();
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (gameId: string, requestId: string) => {
    setIsLoading(true);
    try {
      await apiService.handleJoinRequest(gameId, requestId, 'approve');
      // Reload games to get updated data
      await loadGames();
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (gameId: string, requestId: string) => {
    setIsLoading(true);
    try {
      await apiService.handleJoinRequest(gameId, requestId, 'reject');
      // Reload games to get updated data
      await loadGames();
    } finally {
      setIsLoading(false);
    }
  };

  const value: GameContextType = {
    games,
    createGame,
    joinGame,
    leaveGame,
    approveRequest,
    rejectRequest,
    isLoading,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};