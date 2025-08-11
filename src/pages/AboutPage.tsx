import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Code, 
  Gamepad2, 
  Zap, 
  Users, 
  Award, 
  Github, 
  Linkedin, 
  Mail,
  ExternalLink,
  Heart
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const technologies = [
    'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript',
    'Tailwind CSS', 'Vite', 'Express', 'MongoDB', 'PostgreSQL',
    'Docker', 'AWS', 'Git', 'REST APIs', 'GraphQL'
  ];

  const projects = [
    {
      name: 'Knucklebones Game',
      description: 'Strategic dice game with AI opponents and multiplayer support',
      tech: ['React', 'TypeScript', 'Game Logic']
    },
    {
      name: 'Quiz Ninja',
      description: 'Interactive quiz platform with dynamic question generation',
      tech: ['React', 'API Integration', 'State Management']
    },
    {
      name: 'Calculator Pro',
      description: 'Advanced calculator with scientific functions and history',
      tech: ['JavaScript', 'CSS', 'Mathematical Operations']
    },
    {
      name: 'CompTIA Trainer',
      description: 'Certification training platform with progress tracking',
      tech: ['React', 'TypeScript', 'Educational Tools']
    }
  ];

  const achievements = [
    {
      title: 'Full-Stack Developer',
      description: 'Proficient in both frontend and backend development',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Game Developer',
      description: 'Created multiple interactive games and simulations',
      icon: <Gamepad2 className="w-6 h-6" />
    },
    {
      title: 'Performance Optimizer',
      description: 'Specialized in application performance and user experience',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Team Collaborator',
      description: 'Experienced in agile development and team leadership',
      icon: <Users className="w-6 h-6" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Code className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Me
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Passionate full-stack developer with a love for creating innovative solutions 
          and engaging user experiences. Specialized in modern web technologies and game development.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Story Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              I started my journey in software development with a curiosity about how things work 
              under the hood. What began as simple scripts evolved into complex applications that 
              solve real-world problems.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              My passion lies in creating intuitive user interfaces and robust backend systems 
              that work seamlessly together. I believe in writing clean, maintainable code and 
              continuously learning new technologies.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              When I'm not coding, you'll find me exploring new frameworks, contributing to 
              open-source projects, or designing the next game that will challenge players' minds.
            </p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-blue-500">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technologies */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-green-500" />
            Technologies &amp; Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Projects */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-500" />
            Featured Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Let's Connect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            I'm always interested in discussing new opportunities, collaborating on projects, 
            or just chatting about technology and development.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fun Fact */}
      <div className="text-center mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Fun Fact:</strong> I've written over 50,000 lines of code this year and 
          consumed approximately 365 cups of coffee in the process! ☕
        </p>
      </div>
    </div>
  );
};

export default AboutPage;