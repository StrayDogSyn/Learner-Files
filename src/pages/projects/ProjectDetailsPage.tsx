// Temporary stub for ProjectDetailsPage
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Star, Eye, Calendar, Code, Users, Download, Share2 } from 'lucide-react';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock project data - in real app, this would be fetched based on ID
  const project = {
    id: '1',
    title: 'Interactive Portfolio',
    description: 'A modern, responsive portfolio website built with React and TypeScript featuring glassmorphic design and interactive games.',
    longDescription: `This portfolio project showcases modern web development techniques with a focus on user experience and visual appeal. The application features a glassmorphic design system, interactive games, and comprehensive analytics tracking.

Key features include:
• Responsive design that works across all devices
• Interactive mini-games built with React
• Real-time analytics and user behavior tracking
• Modern glassmorphic UI with smooth animations
• TypeScript for type safety and better development experience
• Optimized performance with Vite build system

The project demonstrates proficiency in modern React patterns, state management, and creating engaging user interfaces.`,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20with%20glassmorphic%20design%20dark%20theme%20purple%20gradients&image_size=landscape_16_9',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router', 'Framer Motion'],
    category: 'web',
    status: 'completed',
    githubUrl: 'https://github.com/user/portfolio',
    liveUrl: 'https://portfolio.example.com',
    stars: 42,
    views: 1250,
    downloads: 89,
    createdDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    featured: true,
    screenshots: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=portfolio%20homepage%20glassmorphic%20design%20hero%20section&image_size=landscape_4_3',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=portfolio%20projects%20grid%20layout%20cards&image_size=landscape_4_3',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=portfolio%20games%20section%20interactive%20elements&image_size=landscape_4_3',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=portfolio%20contact%20form%20glassmorphic%20style&image_size=landscape_4_3'
    ],
    features: [
      'Responsive Design',
      'Interactive Games',
      'Analytics Dashboard',
      'Contact Form',
      'Project Showcase',
      'Performance Optimized',
      'SEO Friendly',
      'Accessibility Compliant'
    ],
    challenges: [
      'Implementing smooth glassmorphic effects while maintaining performance',
      'Creating engaging interactive games within the portfolio context',
      'Optimizing bundle size while including rich animations',
      'Ensuring cross-browser compatibility for modern CSS features'
    ],
    learnings: [
      'Advanced CSS techniques for glassmorphic design',
      'React performance optimization strategies',
      'TypeScript best practices for large applications',
      'Modern build tools and deployment workflows'
    ]
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/projects" 
          className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </Link>

        <div className="glass-card overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
                    <p className="text-gray-200 text-lg">{project.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                      >
                        <Github className="w-6 h-6 text-white" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-6 h-6 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{project.stars}</div>
                <div className="text-sm text-gray-400">Stars</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{project.views}</div>
                <div className="text-sm text-gray-400">Views</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Download className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{project.downloads}</div>
                <div className="text-sm text-gray-400">Downloads</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{new Date(project.createdDate).getFullYear()}</div>
                <div className="text-sm text-gray-400">Created</div>
              </div>
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
                <div className="prose prose-invert max-w-none">
                  {project.longDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Status */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Project Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Technologies */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white capitalize">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{project.createdDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">{project.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      <Star className="w-4 h-4" />
                      <span>Star Project</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <Link 
                      to={`/projects/${project.id}/edit`}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      <span>Edit Project</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.screenshots.map((screenshot, index) => (
                  <div key={index} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img 
                      src={screenshot} 
                      alt={`Screenshot ${index + 1}`}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Features, Challenges, Learnings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Key Features</span>
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Code className="w-5 h-5 text-red-400" />
                  <span>Challenges</span>
                </h3>
                <ul className="space-y-2">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="text-gray-300 flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span>Key Learnings</span>
                </h3>
                <ul className="space-y-2">
                  {project.learnings.map((learning, index) => (
                    <li key={index} className="text-gray-300 flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;