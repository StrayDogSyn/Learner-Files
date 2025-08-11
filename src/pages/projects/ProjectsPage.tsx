// Temporary stub for ProjectsPage
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ExternalLink, Github, Star, Eye, Calendar, Code } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'game';
  status: 'completed' | 'in-progress' | 'planned';
  githubUrl?: string;
  liveUrl?: string;
  stars: number;
  views: number;
  createdDate: string;
  featured: boolean;
}

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock projects data
  const projects: Project[] = [
    {
      id: '1',
      title: 'Interactive Portfolio',
      description: 'A modern, responsive portfolio website built with React and TypeScript featuring glassmorphic design and interactive games.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20with%20glassmorphic%20design%20dark%20theme%20purple%20gradients&image_size=landscape_4_3',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      category: 'web',
      status: 'completed',
      githubUrl: 'https://github.com/user/portfolio',
      liveUrl: 'https://portfolio.example.com',
      stars: 42,
      views: 1250,
      createdDate: '2024-01-01',
      featured: true
    },
    {
      id: '2',
      title: 'AI Chat Assistant',
      description: 'An intelligent chatbot powered by machine learning algorithms with natural language processing capabilities.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20interface%20futuristic%20design%20blue%20glowing%20elements&image_size=landscape_4_3',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      category: 'ai',
      status: 'in-progress',
      githubUrl: 'https://github.com/user/ai-chat',
      stars: 28,
      views: 890,
      createdDate: '2023-11-15',
      featured: true
    },
    {
      id: '3',
      title: 'Mobile Task Manager',
      description: 'A cross-platform mobile application for task management with offline sync and collaborative features.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20task%20manager%20app%20interface%20clean%20design%20productivity&image_size=landscape_4_3',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io'],
      category: 'mobile',
      status: 'completed',
      githubUrl: 'https://github.com/user/task-manager',
      stars: 35,
      views: 670,
      createdDate: '2023-09-20',
      featured: false
    },
    {
      id: '4',
      title: 'Game Analytics Dashboard',
      description: 'Real-time analytics dashboard for game developers with player behavior insights and performance metrics.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=analytics%20dashboard%20charts%20graphs%20gaming%20data%20visualization&image_size=landscape_4_3',
      technologies: ['Vue.js', 'D3.js', 'Express.js', 'PostgreSQL'],
      category: 'web',
      status: 'in-progress',
      githubUrl: 'https://github.com/user/game-analytics',
      stars: 19,
      views: 445,
      createdDate: '2023-12-10',
      featured: false
    },
    {
      id: '5',
      title: 'Desktop Code Editor',
      description: 'A lightweight code editor with syntax highlighting, plugin support, and integrated terminal.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=code%20editor%20interface%20dark%20theme%20syntax%20highlighting%20programming&image_size=landscape_4_3',
      technologies: ['Electron', 'TypeScript', 'Monaco Editor', 'Node.js'],
      category: 'desktop',
      status: 'planned',
      stars: 0,
      views: 120,
      createdDate: '2024-01-20',
      featured: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'planned':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web':
        return '🌐';
      case 'mobile':
        return '📱';
      case 'desktop':
        return '💻';
      case 'ai':
        return '🤖';
      case 'game':
        return '🎮';
      default:
        return '📁';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
              <p className="text-gray-300">
                Explore my portfolio of web applications, mobile apps, and innovative solutions.
              </p>
            </div>
            <Link 
              to="/projects/create" 
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </Link>
          </div>
          
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>Featured Projects</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>Featured</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                      </div>
                      <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{project.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{project.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                              <Github className="w-4 h-4 text-gray-300" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-300" />
                            </a>
                          )}
                          <Link 
                            to={`/projects/${project.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="web">Web Applications</option>
              <option value="mobile">Mobile Apps</option>
              <option value="desktop">Desktop Apps</option>
              <option value="ai">AI/ML Projects</option>
              <option value="game">Games</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          
          {/* All Projects Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Code className="w-6 h-6 text-blue-400" />
              <span>All Projects ({filteredProjects.length})</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{project.views}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Github className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="w-full block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or create a new project.</p>
              <Link 
                to="/projects/create" 
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;