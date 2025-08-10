import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  Star,
  Medal,
  Crown,
  Target,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import {
  Tournament,
  TournamentMatch,
  TournamentParticipant,
  Player,
  TournamentSettings,
  LeaderboardEntry,
  RankingSystem
} from '../../types/knucklebones';

interface TournamentSystemProps {
  onTournamentStart: (tournament: Tournament) => void;
  onMatchComplete: (match: TournamentMatch) => void;
  players: Player[];
  className?: string;
}

interface TournamentCreatorProps {
  onCreateTournament: (settings: TournamentSettings) => void;
  availablePlayers: Player[];
  onClose: () => void;
}

interface BracketViewProps {
  tournament: Tournament;
  onMatchSelect: (match: TournamentMatch) => void;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  rankingSystem: RankingSystem;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

const TournamentCreator: React.FC<TournamentCreatorProps> = ({
  onCreateTournament,
  availablePlayers,
  onClose
}) => {
  const [settings, setSettings] = useState<Partial<TournamentSettings>>({
    name: '',
    type: 'single-elimination',
    maxPlayers: 8,
    entryFee: 0,
    prizePool: 0,
    gameSettings: {
      roundLimit: 10,
      timeLimit: 300,
      diceCount: 2
    },
    registrationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
  });

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSettings = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!settings.name?.trim()) {
      newErrors.name = 'Tournament name is required';
    }

    if (selectedPlayers.length < 2) {
      newErrors.players = 'At least 2 players are required';
    }

    if (settings.type === 'single-elimination' && selectedPlayers.length > 0) {
      const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(selectedPlayers.length)));
      if (selectedPlayers.length !== powerOfTwo) {
        newErrors.players = `Single elimination requires a power of 2 players (2, 4, 8, 16, etc.). Current: ${selectedPlayers.length}`;
      }
    }

    if (settings.startTime && settings.startTime <= new Date()) {
      newErrors.startTime = 'Start time must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [settings, selectedPlayers]);

  const handleCreateTournament = useCallback(() => {
    if (validateSettings()) {
      // Convert selectedPlayers to TournamentParticipant objects
      const participants: TournamentParticipant[] = selectedPlayers.map((playerId, index) => ({
        id: `participant_${index}`,
        playerId,
        playerName: `Player ${index + 1}`,
        seed: index + 1,
        currentRound: 1,
        isEliminated: false,
        wins: 0,
        losses: 0
      }));

      const tournamentSettings: TournamentSettings = {
        ...settings,
        participants,
        name: settings.name || 'New Tournament',
        type: settings.type || 'single-elimination',
        maxParticipants: settings.maxParticipants || 8,
        maxPlayers: settings.maxPlayers || 8,
        format: settings.format || 'best-of-1',
        timeLimit: settings.timeLimit || 300,
        isPrivate: settings.isPrivate || false
      };

      onCreateTournament(tournamentSettings);
    }
  }, [settings, selectedPlayers, validateSettings, onCreateTournament]);

  const togglePlayerSelection = useCallback((playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Create Tournament
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tournament Name
              </label>
              <input
                type="text"
                value={settings.name || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter tournament name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="tournament-type" className="block text-sm font-medium text-white/80 mb-2">
                Tournament Type
              </label>
              <select
                id="tournament-type"
                value={settings.type || 'single_elimination'}
                onChange={(e) => setSettings(prev => ({ ...prev, type: e.target.value as 'single-elimination' | 'double-elimination' | 'round-robin' }))}
                aria-label="Select tournament type"
                title="Choose tournament format"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="single_elimination">Single Elimination</option>
                <option value="double_elimination">Double Elimination</option>
                <option value="round_robin">Round Robin</option>
                <option value="swiss">Swiss System</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="max-players" className="block text-sm font-medium text-white/80 mb-2">
                  Max Players
                </label>
                <input
                  id="max-players"
                  type="number"
                  min="2"
                  max="64"
                  value={settings.maxPlayers || 8}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                  aria-label="Set maximum number of players"
                  title="Maximum players allowed in tournament"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="entry-fee" className="block text-sm font-medium text-white/80 mb-2">
                  Entry Fee
                </label>
                <input
                  id="entry-fee"
                  type="number"
                  min="0"
                  value={settings.entryFee || 0}
                  onChange={(e) => setSettings(prev => ({ ...prev, entryFee: parseInt(e.target.value) }))}
                  aria-label="Set tournament entry fee"
                  title="Entry fee for tournament participation"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Game Settings</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="round-limit" className="block text-sm font-medium text-white/80 mb-2">
                  Round Limit
                </label>
                <input
                  id="round-limit"
                  type="number"
                  min="5"
                  max="20"
                  value={settings.gameSettings?.roundLimit || 10}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    gameSettings: {
                      roundLimit: parseInt(e.target.value),
                      timeLimit: prev.gameSettings?.timeLimit || 300,
                      diceCount: prev.gameSettings?.diceCount || 2
                    }
                  }))}
                  aria-label="Set round limit for games"
                  title="Maximum number of rounds per game"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="time-limit" className="block text-sm font-medium text-white/80 mb-2">
                  Time Limit (s)
                </label>
                <input
                  id="time-limit"
                  type="number"
                  min="60"
                  max="600"
                  value={settings.gameSettings?.timeLimit || 300}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    gameSettings: {
                      roundLimit: prev.gameSettings?.roundLimit || 10,
                      timeLimit: parseInt(e.target.value),
                      diceCount: prev.gameSettings?.diceCount || 2
                    }
                  }))}
                  aria-label="Set time limit for games in seconds"
                  title="Time limit per game in seconds"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="dice-count" className="block text-sm font-medium text-white/80 mb-2">
                  Dice Count
                </label>
                <input
                  id="dice-count"
                  type="number"
                  min="1"
                  max="6"
                  value={settings.gameSettings?.diceCount || 2}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    gameSettings: {
                      roundLimit: prev.gameSettings?.roundLimit || 10,
                      timeLimit: prev.gameSettings?.timeLimit || 300,
                      diceCount: parseInt(e.target.value)
                    }
                  }))}
                  aria-label="Set number of dice per turn"
                  title="Number of dice rolled per turn"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Player Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Players ({selectedPlayers.length}/{settings.maxPlayers})
            </h3>
            
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {availablePlayers.map(player => (
                <motion.button
                  key={player.id}
                  onClick={() => togglePlayerSelection(player.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedPlayers.includes(player.id)
                      ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                      : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedPlayers.includes(player.id) && selectedPlayers.length >= (settings.maxPlayers || 8)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedPlayers.includes(player.id) ? 'bg-blue-400' : 'bg-white/30'
                    }`} />
                    <span className="text-sm font-medium">{player.name}</span>
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {player.type === 'ai' ? '🤖 AI' : '👤 Human'}
                  </div>
                </motion.button>
              ))}
            </div>
            
            {errors.players && <p className="text-red-400 text-sm">{errors.players}</p>}
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="registration-deadline" className="block text-sm font-medium text-white/80 mb-2">
                  Registration Deadline
                </label>
                <input
                  id="registration-deadline"
                  type="datetime-local"
                  value={settings.registrationDeadline?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, registrationDeadline: new Date(e.target.value) }))}
                  aria-label="Set registration deadline date and time"
                  title="Deadline for tournament registration"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-white/80 mb-2">
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="datetime-local"
                  value={settings.startTime?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, startTime: new Date(e.target.value) }))}
                  aria-label="Set tournament start date and time"
                  title="Tournament start date and time"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTournament}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Create Tournament
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BracketView: React.FC<BracketViewProps> = ({ tournament, onMatchSelect }) => {
  const bracket = useMemo(() => {
    if (!tournament.bracket) return null;
    return tournament.bracket;
  }, [tournament.bracket]);

  const renderMatch = useCallback((match: TournamentMatch, roundIndex: number, matchIndex: number) => {
    const isCompleted = match.status === 'completed';
    const isActive = match.status === 'active';
    const winner = match.winner;

    return (
      <motion.div
        key={match.id}
        className={`p-3 rounded-lg border cursor-pointer transition-all ${
          isCompleted
            ? 'bg-green-500/20 border-green-400'
            : isActive
            ? 'bg-blue-500/20 border-blue-400 animate-pulse'
            : 'bg-white/10 border-white/20 hover:bg-white/20'
        }`}
        onClick={() => onMatchSelect(match)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: roundIndex * 0.1 + matchIndex * 0.05 }}
      >
        <div className="text-xs text-white/60 mb-2">
          {match.round} - Match {matchIndex + 1}
        </div>
        
        <div className="space-y-2">
          {match.participants.map((participantId, index) => {
            const isWinner = winner === participantId;
            return (
              <div
                key={participantId}
                className={`flex items-center justify-between p-2 rounded ${
                  isWinner
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-white/5 text-white/80'
                }`}
              >
                <span className="text-sm font-medium">
                  {isWinner && <Crown className="w-4 h-4 inline mr-1" />}
                  Player {participantId}
                </span>
                {match.scores && (
                  <span className="text-sm font-bold">
                    {match.scores[participantId] || 0}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {match.scheduledTime && (
          <div className="text-xs text-white/50 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {match.scheduledTime.toLocaleTimeString()}
          </div>
        )}
      </motion.div>
    );
  }, [onMatchSelect]);

  if (!bracket) {
    return (
      <div className="text-center text-white/60 py-8">
        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Tournament bracket will be generated when tournament starts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bracket.rounds.map((round, roundIndex) => (
        <div key={round.name} className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            {round.name}
            <span className="text-sm text-white/60">({round.matches.length} matches)</span>
          </h3>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {round.matches.map((match, matchIndex) => 
              renderMatch(match, roundIndex, matchIndex)
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, rankingSystem, timeframe }) => {
  const [sortBy, setSortBy] = useState<'rank' | 'rating' | 'wins' | 'winRate'>('rank');
  const [filterType, setFilterType] = useState<'all' | 'human' | 'ai'>('all');

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries;
    
    if (filterType !== 'all') {
      filtered = entries.filter(entry => 
        filterType === 'human' ? entry.playerType === 'human' : entry.playerType === 'ai'
      );
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.rank - b.rank;
        case 'rating':
          return b.rating - a.rating;
        case 'wins':
          return b.wins - a.wins;
        case 'winRate':
          return b.winRate - a.winRate;
        default:
          return a.rank - b.rank;
      }
    });
  }, [entries, sortBy, filterType]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-white/60">#{rank}</span>;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return 'text-purple-400';
    if (rating >= 1800) return 'text-blue-400';
    if (rating >= 1600) return 'text-green-400';
    if (rating >= 1400) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rank' | 'rating' | 'wins' | 'winRate')}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Sort leaderboard by"
            title="Sort leaderboard by"
          >
            <option value="rank">Sort by Rank</option>
            <option value="rating">Sort by Rating</option>
            <option value="wins">Sort by Wins</option>
            <option value="winRate">Sort by Win Rate</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'human' | 'ai')}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Filter player type"
            title="Filter player type"
          >
            <option value="all">All Players</option>
            <option value="human">Human Only</option>
            <option value="ai">AI Only</option>
          </select>
        </div>
        
        <div className="text-sm text-white/60">
          {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Rankings
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {filteredAndSortedEntries.map((entry, index) => (
          <motion.div
            key={entry.playerId}
            className={`p-4 rounded-lg border transition-all ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/30'
                : 'bg-white/5 border-white/20 hover:bg-white/10'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {entry.playerName}
                      {entry.playerType === 'ai' && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">AI</span>}
                      {entry.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                    </div>
                    <div className="text-sm text-white/60">
                      {entry.title || 'Novice Player'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className={`font-bold ${getRatingColor(entry.rating)}`}>
                    {entry.rating}
                  </div>
                  <div className="text-white/50">Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-green-400">
                    {entry.wins}
                  </div>
                  <div className="text-white/50">Wins</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-blue-400">
                    {(entry.winRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-white/50">Win Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-purple-400">
                    {entry.streak > 0 ? `+${entry.streak}` : entry.streak}
                  </div>
                  <div className="text-white/50">Streak</div>
                </div>
                
                {entry.ratingChange !== 0 && (
                  <div className="text-center">
                    <div className={`font-bold flex items-center gap-1 ${
                      entry.ratingChange > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.ratingChange > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4 rotate-180" />
                      )}
                      {Math.abs(entry.ratingChange)}
                    </div>
                    <div className="text-white/50">Change</div>
                  </div>
                )}
              </div>
            </div>
            
            {entry.achievements && entry.achievements.length > 0 && (
              <div className="mt-3 flex gap-2">
                {entry.achievements.slice(0, 3).map((achievement, i) => (
                  <div
                    key={i}
                    className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    {achievement}
                  </div>
                ))}
                {entry.achievements.length > 3 && (
                  <div className="text-xs text-white/50 px-2 py-1">
                    +{entry.achievements.length - 3} more
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {filteredAndSortedEntries.length === 0 && (
        <div className="text-center text-white/60 py-8">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No players found for the selected criteria</p>
        </div>
      )}
    </div>
  );
};

const TournamentSystem: React.FC<TournamentSystemProps> = ({
  onTournamentStart,
  onMatchComplete,
  players,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'bracket' | 'leaderboard'>('tournaments');
  const [showCreator, setShowCreator] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');

  // Mock leaderboard data
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: 'leaderboard_1',
      playerId: '1',
      playerName: 'Alice Champion',
      playerType: 'human',
      rank: 1,
      rating: 2150,
      wins: 45,
      losses: 12,
      winRate: 0.789,
      totalGames: 57,
      currentStreak: 8,
      bestStreak: 12,
      averageScore: 85.6,
      totalScore: 4879,
      streak: 8,
      ratingChange: 25,
      title: 'Grandmaster',
      isOnline: true,
      achievements: ['Tournament Winner', 'Perfect Game', 'Speed Demon'],
      lastActiveDate: new Date()
    },
    {
      id: 'leaderboard_2',
      playerId: '2',
      playerName: 'Bob Strategic',
      playerType: 'human',
      rank: 2,
      rating: 1980,
      wins: 38,
      losses: 15,
      winRate: 0.717,
      totalGames: 53,
      currentStreak: -2,
      bestStreak: 9,
      averageScore: 78.2,
      totalScore: 4145,
      streak: -2,
      ratingChange: -15,
      title: 'Expert',
      isOnline: false,
      achievements: ['Strategist', 'Comeback King'],
      lastActiveDate: new Date()
    },
    {
      id: 'leaderboard_3',
      playerId: '3',
      playerName: 'AI Overlord',
      playerType: 'ai',
      rank: 3,
      rating: 1875,
      wins: 42,
      losses: 18,
      winRate: 0.700,
      totalGames: 60,
      currentStreak: 3,
      bestStreak: 15,
      averageScore: 82.1,
      totalScore: 4926,
      streak: 3,
      ratingChange: 10,
      title: 'Advanced AI',
      isOnline: true,
      achievements: ['Machine Learning', 'Perfect Logic', 'Speed Calculator'],
      lastActiveDate: new Date()
    }
  ];

  const mockRankingSystem: RankingSystem = {
    type: 'elo',
    name: 'ELO Rating',
    baseRating: 1200,
    kFactor: 32
  };

  const handleCreateTournament = useCallback((settings: TournamentSettings) => {
    const tournament: Tournament = {
      ...settings,
      id: Date.now().toString(),
      name: settings.name || 'New Tournament',
      description: settings.description || '',
      type: settings.type || 'single-elimination',
      status: 'registration',
      participants: settings.participants || [],
      brackets: [],
      bracket: undefined,
      prizes: [
        {
          position: 1,
          title: "First Place",
          description: "Winner",
          value: settings.prizePool ? settings.prizePool * 0.5 : 0
        },
        {
          position: 2,
          title: "Second Place",
          description: "Runner-up",
          value: settings.prizePool ? settings.prizePool * 0.3 : 0
        },
        {
          position: 3,
          title: "Third Place",
          description: "Third place",
          value: settings.prizePool ? settings.prizePool * 0.2 : 0
        }
      ],
      rules: {
        gameMode: {
          id: 'classic',
          name: 'Classic',
          description: 'Standard Knucklebones game',
          difficulty: 'medium',
          features: ['standard-scoring']
        },
        bestOf: 1,
        timeLimit: settings.timeLimit || 300,
        advancementCriteria: 'win'
      },
      startDate: settings.startTime || new Date(),
      maxPlayers: settings.maxPlayers || 8
    };
    
    setTournaments(prev => [...prev, tournament]);
    setSelectedTournament(tournament);
    setShowCreator(false);
    setActiveTab('bracket');
    
    onTournamentStart(tournament);
  }, [onTournamentStart]);

  const handleMatchSelect = useCallback((match: TournamentMatch) => {
    console.log('Selected match:', match);
    // Handle match selection (e.g., show match details, start match, etc.)
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Tournament System
        </h2>
        
        <button
          onClick={() => setShowCreator(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Create Tournament
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {[
          { id: 'tournaments', label: 'Tournaments', icon: Trophy },
          { id: 'bracket', label: 'Bracket', icon: Target },
          { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'tournaments' | 'bracket' | 'leaderboard')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tournaments' && (
          <motion.div
            key="tournaments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {tournaments.length === 0 ? (
              <div className="text-center text-white/60 py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Tournaments Yet</h3>
                <p className="mb-6">Create your first tournament to get started!</p>
                <button
                  onClick={() => setShowCreator(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Create Tournament
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.map(tournament => (
                  <motion.div
                    key={tournament.id}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedTournament(tournament);
                      setActiveTab('bracket');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{tournament.name}</h3>
                      <div className={`px-2 py-1 rounded text-xs ${
                        tournament.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : tournament.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {tournament.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {tournament.participants.length}/{tournament.maxPlayers} players
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {tournament.startTime?.toLocaleDateString()}
                      </div>
                      {tournament.prizePool && tournament.prizePool > 0 && (
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          ${tournament.prizePool} prize pool
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'bracket' && (
          <motion.div
            key="bracket"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {selectedTournament ? (
              <BracketView
                tournament={selectedTournament}
                onMatchSelect={handleMatchSelect}
              />
            ) : (
              <div className="text-center text-white/60 py-12">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Tournament Selected</h3>
                <p>Select a tournament to view its bracket</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Leaderboard
              entries={mockLeaderboard}
              rankingSystem={mockRankingSystem}
              timeframe={leaderboardTimeframe}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tournament Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <TournamentCreator
            onCreateTournament={handleCreateTournament}
            availablePlayers={players}
            onClose={() => setShowCreator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentSystem;

// Hook for tournament management
export const useTournamentSystem = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);

  const createTournament = useCallback((settings: TournamentSettings) => {
    const tournament: Tournament = {
      ...settings,
      id: Date.now().toString(),
      name: settings.name || 'New Tournament',
      description: settings.description || '',
      type: settings.type || 'single-elimination',
      status: 'registration',
      participants: settings.participants || [],
      brackets: [],
      bracket: undefined,
      prizes: [
        {
          position: 1,
          title: "First Place",
          description: "Winner",
          value: settings.prizePool ? settings.prizePool * 0.5 : 0
        },
        {
          position: 2,
          title: "Second Place",
          description: "Runner-up",
          value: settings.prizePool ? settings.prizePool * 0.3 : 0
        },
        {
          position: 3,
          title: "Third Place",
          description: "Third place",
          value: settings.prizePool ? settings.prizePool * 0.2 : 0
        }
      ],
      rules: {
        gameMode: {
          id: 'classic',
          name: 'Classic',
          description: 'Standard Knucklebones game',
          difficulty: 'medium',
          features: ['standard-scoring']
        },
        bestOf: 1,
        timeLimit: settings.timeLimit || 300,
        advancementCriteria: 'win'
      },
      startDate: settings.startTime || new Date(),
      maxPlayers: settings.maxPlayers || 8
    };
    
    setTournaments(prev => [...prev, tournament]);
    return tournament;
  }, []);

  const startTournament = useCallback((tournamentId: string) => {
    setTournaments(prev => 
      prev.map(t => 
        t.id === tournamentId 
          ? { ...t, status: 'active' as const }
          : t
      )
    );
  }, []);

  const completeTournament = useCallback((tournamentId: string, results: { winnerId: string; finalScore: number }) => {
    setTournaments(prev => 
      prev.map(t => 
        t.id === tournamentId 
          ? { ...t, status: 'completed' as const, results }
          : t
      )
    );
  }, []);

  return {
    tournaments,
    activeTournament,
    createTournament,
    startTournament,
    completeTournament,
    setActiveTournament
  };
};