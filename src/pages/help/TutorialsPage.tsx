// Temporary stub for TutorialsPage
import React from 'react';
import { ArrowLeft, Play, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorialsPage: React.FC = () => {
  const tutorials = [
    {
      title: "Portfolio Navigation",
      description: "Learn how to navigate through the portfolio sections",
      duration: "5 min",
      level: "Beginner"
    },
    {
      title: "Interactive Games",
      description: "Explore the calculator and other interactive features",
      duration: "10 min",
      level: "Beginner"
    },
    {
      title: "Project Showcases",
      description: "Understanding the project presentation format",
      duration: "8 min",
      level: "Intermediate"
    },
    {
      title: "Analytics Dashboard",
      description: "Using the analytics and monitoring features",
      duration: "15 min",
      level: "Advanced"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Tutorials</h1>
          </div>
          
          <p className="text-gray-300 mb-8">
            Step-by-step tutorials to help you make the most of the portfolio features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="glass-card p-6 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
                      <p className="text-gray-300 text-sm">{tutorial.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{tutorial.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Coming Soon</h3>
            <p className="text-gray-300">
              More interactive tutorials and video guides are being developed. 
              Check back soon for additional learning resources!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;