// Temporary stub for GameDetailsPage
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Trophy, Clock, Users, Star, Share2 } from 'lucide-react';

interface GameDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  maxPlayers: number;
  rating: number;
  totalRatings: number;
  image: string;
  features: string[];
  instructions: string[];
  tips: string[];
}

interface GameStats {
  totalPlays: number;
  averageScore: number;
  completionRate: number;
  topScore: number;
}

const GameDetailsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock game details based on gameId
        const mockDetails: GameDetails = {
          id: gameId || 'calculator',
          title: gameId === 'calculator' ? 'Advanced Calculator' : 
                 gameId === 'quizninja' ? 'Quiz Ninja' :
                 gameId === 'countdown' ? 'Countdown Challenge' :
                 gameId === 'knucklebones' ? 'Knucklebones' :
                 gameId === 'rockpaperscissors' ? 'Rock Paper Scissors' :
                 'Unknown Game',
          description: 'An engaging and challenging game that tests your skills and provides hours of entertainment.',
          longDescription: 'This game combines strategy, skill, and quick thinking to create an immersive gaming experience. Perfect for players of all skill levels, it offers multiple difficulty settings and various game modes to keep you engaged.',
          category: 'Strategy',
          difficulty: 'Medium',
          estimatedTime: '5-15 minutes',
          maxPlayers: 1,
          rating: 4.7,
          totalRatings: 1234,
          image: `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`${gameId} game interface modern design`)}&image_size=landscape_4_3`,
          features: [
            'Multiple difficulty levels',
            'Real-time scoring',
            'Achievement system',
            'Leaderboards',
            'Responsive design',
            'Offline play support'
          ],
          instructions: [
            'Click the play button to start the game',
            'Follow the on-screen prompts',
            'Use keyboard or mouse controls as indicated',
            'Complete objectives to earn points',
            'Check your score on the leaderboard'
          ],
          tips: [
            'Practice regularly to improve your skills',
            'Pay attention to time limits',
            'Use hints sparingly for better scores',
            'Try different strategies',
            'Challenge friends to beat your score'
          ]
        };
        
        const mockStats: GameStats = {
          totalPlays: 15678,
          averageScore: 8542,
          completionRate: 78.5,
          topScore: 25890
        };
        
        setGameDetails(mockDetails);
        setGameStats(mockStats);
      } catch (error) {
        console.error('Error loading game details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameDetails();
  }, [gameId]);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // In a real app, this would send the rating to the backend
    console.log(`User rated game ${rating} stars`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gameDetails?.title,
        text: gameDetails?.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-center">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (!gameDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
          <p className="text-gray-300 mb-6">The requested game could not be found.</p>
          <Link 
            to="/games" 
            className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Games</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/games"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game Header */}
            <div className="glass-card p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{gameDetails.title}</h1>
                  <p className="text-xl text-gray-300">{gameDetails.description}</p>
                </div>
                <Link
                  to={`/play/${gameDetails.id}`}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Play Now</span>
                </Link>
              </div>
              
              <img 
                src={gameDetails.image} 
                alt={gameDetails.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <p className="text-gray-300 leading-relaxed">{gameDetails.longDescription}</p>
            </div>

            {/* Features */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Game Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How to Play</h2>
              <ol className="space-y-3">
                {gameDetails.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-300">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Pro Tips</h2>
              <div className="space-y-3">
                {gameDetails.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <span className="text-gray-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Info */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Game Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{gameDetails.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Difficulty</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    gameDetails.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    gameDetails.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {gameDetails.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Est. Time</span>
                  <span className="text-white flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {gameDetails.estimatedTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Max Players</span>
                  <span className="text-white flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {gameDetails.maxPlayers}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Rating</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">{gameDetails.rating}</div>
                <div className="flex items-center justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(gameDetails.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-400 text-sm">{gameDetails.totalRatings} ratings</div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <p className="text-gray-400 text-sm mb-3">Rate this game:</p>
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className={`w-6 h-6 transition-colors ${
                        star <= userRating 
                          ? 'text-yellow-400' 
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Stats */}
            {gameStats && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Plays</span>
                    <span className="text-white">{gameStats.totalPlays.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg. Score</span>
                    <span className="text-white">{gameStats.averageScore.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-white">{gameStats.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Top Score</span>
                    <span className="text-white flex items-center">
                      <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                      {gameStats.topScore.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;