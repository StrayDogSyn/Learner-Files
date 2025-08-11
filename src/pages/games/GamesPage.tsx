import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Link } from 'react-router-dom';

/**
 * GamesPage Component
 * Overview of all available games
 */
const GamesPage: React.FC = () => {
  const games = [
    { id: 'knucklebones', name: 'Knucklebones', description: 'Strategic dice game' },
    { id: 'calculator', name: 'Calculator', description: 'Advanced calculator tool' },
    { id: 'quiz-ninja', name: 'Quiz Ninja', description: 'Test your knowledge' },
    { id: 'countdown', name: 'Countdown', description: 'Timer and countdown utility' },
    { id: 'rock-paper-scissors', name: 'Rock Paper Scissors', description: 'Classic game' },
    { id: 'comptia', name: 'CompTIA', description: 'IT certification practice' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Games</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our collection of interactive games and tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{game.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {game.description}
              </p>
              <Link
                to={`/games/${game.id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;