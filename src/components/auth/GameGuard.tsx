import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GamepadIcon, Lock, Star, Trophy, Clock, AlertTriangle } from 'lucide-react';
import { GAME_METADATA, type GameId } from '@/components/games';

interface GameGuardProps {
  children: React.ReactNode;
  gameId: GameId;
  requiresAuth?: boolean;
  requiresPremium?: boolean;
  minLevel?: number;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * GameGuard Component
 * 
 * Protects game routes with various access controls:
 * - Authentication requirements
 * - Premium subscription checks
 * - User level requirements
 * - Game availability checks
 * - Maintenance mode handling
 */
export const GameGuard: React.FC<GameGuardProps> = ({
  children,
  gameId,
  requiresAuth = false,
  requiresPremium = false,
  minLevel = 0,
  fallback,
  redirectTo
}) => {
  const location = useLocation();
  const { 
    user, 
    isAuthenticated, 
    initialized,
    games
  } = useAppStore();

  const gameMetadata = GAME_METADATA[gameId];
  const gameState = games[gameId];

  // Show loading while app is initializing
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  // Check if game exists
  if (!gameMetadata) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <GamepadIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Game Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The requested game "{gameId}" could not be found.
            </p>
          </div>
          
          <Button
            onClick={() => window.location.href = '/games'}
            className="flex items-center gap-2"
          >
            <GamepadIcon className="h-4 w-4" />
            Browse Games
          </Button>
        </Card>
      </div>
    );
  }

  // Check if game is in maintenance mode
  if (gameState?.maintenance) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Under Maintenance
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {gameMetadata.title} is currently under maintenance.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Please check back later.
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/games'}
            className="flex items-center gap-2"
          >
            <GamepadIcon className="h-4 w-4" />
            Other Games
          </Button>
        </Card>
      </div>
    );
  }

  // Check authentication requirement
  if (requiresAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const returnUrl = redirectTo || location.pathname + location.search;
    return (
      <Navigate 
        to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} 
        state={{ from: location, gameId }}
        replace 
      />
    );
  }

  // Check premium requirement
  if (requiresPremium && (!user?.role || user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full">
              <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Premium Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {gameMetadata.title} requires a premium subscription.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Premium Features:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Unlimited game sessions</li>
                <li>• Advanced statistics</li>
                <li>• Custom themes</li>
                <li>• Priority support</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.location.href = '/premium'}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Star className="h-4 w-4" />
                Upgrade to Premium
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/games'}
                className="flex items-center gap-2"
              >
                <GamepadIcon className="h-4 w-4" />
                Free Games
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Check level requirement
  if (minLevel > 0 && user && (user.stats?.skillLevels?.strategy || 0) < minLevel) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Level Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to reach level {minLevel} to play {gameMetadata.title}.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Level:
              </span>
              <Badge variant="secondary">
                Level {user.stats?.skillLevels?.strategy || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Required Level:
              </span>
              <Badge className="bg-blue-600">
                Level {minLevel}
              </Badge>
            </div>
            
            <Button
              onClick={() => window.location.href = '/games?difficulty=beginner'}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Play Beginner Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Check if game has time restrictions
  if (gameState?.timeRestriction && !canPlayAtCurrentTime(gameState.timeRestriction)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Time Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {gameMetadata.title} is only available during specific hours.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Available: {formatTimeRestriction(gameState.timeRestriction)}
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/games'}
            className="flex items-center gap-2"
          >
            <GamepadIcon className="h-4 w-4" />
            Other Games
          </Button>
        </Card>
      </div>
    );
  }

  // All checks passed - render the game
  return <>{children}</>;
};

/**
 * Check if game can be played at current time
 */
function canPlayAtCurrentTime(timeRestriction: {
  startHour: number;
  endHour: number;
  timezone?: string;
}): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (timeRestriction.startHour <= timeRestriction.endHour) {
    return currentHour >= timeRestriction.startHour && currentHour < timeRestriction.endHour;
  } else {
    // Crosses midnight
    return currentHour >= timeRestriction.startHour || currentHour < timeRestriction.endHour;
  }
}

/**
 * Format time restriction for display
 */
function formatTimeRestriction(timeRestriction: {
  startHour: number;
  endHour: number;
  timezone?: string;
}): string {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };
  
  return `${formatHour(timeRestriction.startHour)} - ${formatHour(timeRestriction.endHour)}`;
}

/**
 * Hook for checking game access
 */
export const useGameAccess = (gameId: GameId) => {
  const { user, isAuthenticated, games } = useAppStore();
  const gameMetadata = GAME_METADATA[gameId];
  const gameState = games[gameId];
  
  return {
    canPlay: (
      requiresAuth = false,
      requiresPremium = false,
      minLevel = 0
    ) => {
      if (!gameMetadata) return false;
      if (gameState?.maintenance) return false;
      if (requiresAuth && !isAuthenticated) return false;
      if (requiresPremium && (!user?.role || user.role !== 'admin')) return false;
      if (minLevel > 0 && user && (user.stats?.skillLevels?.strategy || 0) < minLevel) return false;
      if (gameState?.timeRestriction && !canPlayAtCurrentTime(gameState.timeRestriction)) return false;
      
      return true;
    },
    gameMetadata,
    gameState,
    restrictions: {
      maintenance: gameState?.maintenance || false,
      timeRestricted: gameState?.timeRestriction ? !canPlayAtCurrentTime(gameState.timeRestriction) : false,
      requiresAuth: false, // This would come from game metadata
      requiresPremium: false, // This would come from game metadata
      minLevel: 0 // This would come from game metadata
    }
  };
};

/**
 * Higher-order component for protecting game components
 */
export const withGameGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<GameGuardProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <GameGuard {...options}>
      <Component {...props} />
    </GameGuard>
  );
  
  WrappedComponent.displayName = `withGameGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default GameGuard;