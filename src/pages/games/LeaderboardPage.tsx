// Temporary stub for LeaderboardPage
import React, { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Filter, Search } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  rank: number;
  game: string;
  completionTime?: string;
  achievements: number;
  lastPlayed: string;
}

const LeaderboardPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      username: 'GameMaster2024',
      score: 15420,
      rank: 1,
      game: 'Calculator Challenge',
      completionTime: '2:34',
      achievements: 12,
      lastPlayed: '2024-01-15'
    },
    {
      id: '2',
      username: 'QuizNinja',
      score: 14890,
      rank: 2,
      game: 'Quiz Ninja',
      completionTime: '3:12',
      achievements: 10,
      lastPlayed: '2024-01-14'
    },
    {
      id: '3',
      username: 'CountdownKing',
      score: 13750,
      rank: 3,
      game: 'Countdown',
      completionTime: '1:58',
      achievements: 8,
      lastPlayed: '2024-01-13'
    },
    {
      id: '4',
      username: 'RockPaperPro',
      score: 12340,
      rank: 4,
      game: 'Rock Paper Scissors',
      achievements: 7,
      lastPlayed: '2024-01-12'
    },
    {
      id: '5',
      username: 'KnuckleMaster',
      score: 11890,
      rank: 5,
      game: 'Knucklebones',
      achievements: 9,
      lastPlayed: '2024-01-11'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      default:
        return 'from-white/5 to-white/10 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          </div>
          
          <p className="text-gray-300 mb-8">
            Compete with players worldwide and climb the ranks in our interactive games.
          </p>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Games</option>
              <option value="calculator">Calculator Challenge</option>
              <option value="quiz">Quiz Ninja</option>
              <option value="countdown">Countdown</option>
              <option value="rps">Rock Paper Scissors</option>
              <option value="knucklebones">Knucklebones</option>
            </select>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all-time">All Time</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="today">Today</option>
            </select>
          </div>
          
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {leaderboardData.slice(0, 3).map((entry, index) => (
              <div key={entry.id} className={`glass-card p-6 bg-gradient-to-br ${getRankColor(entry.rank)} border`}>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {entry.username.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{entry.username}</h3>
                  <div className="text-2xl font-bold text-blue-400 mb-2">{entry.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-300 mb-2">{entry.game}</div>
                  {entry.completionTime && (
                    <div className="text-sm text-gray-400">Time: {entry.completionTime}</div>
                  )}
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">{entry.achievements}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Full Leaderboard */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Full Rankings</span>
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Game</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Achievements</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Played</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {leaderboardData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {entry.username.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{entry.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-blue-400">{entry.score.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.game}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.completionTime || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">{entry.achievements}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.lastPlayed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing 1 to 5 of 1,247 players
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors">
                2
              </button>
              <button className="px-3 py-1 bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors">
                3
              </button>
              <button className="px-3 py-1 bg-white/10 text-gray-300 rounded hover:bg-white/20 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;