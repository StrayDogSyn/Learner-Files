import React, { useState } from 'react';
import { Grid, List, Star, LayoutGrid, Eye } from 'lucide-react';
import { projects } from '../data/projects';
import { useProjectsWithStats, ProjectWithStats } from '../hooks/useGitHubStats';
import ProjectGallery from './ProjectGallery';
import ProjectCard3D from './ProjectCard3D';
import ProjectModal from './ProjectModal';
import FeaturedProjectSpotlight from './FeaturedProjectSpotlight';

type ViewMode = 'gallery' | 'cards' | 'spotlight';

interface ProjectShowcaseProps {
  className?: string;
  showHeader?: boolean;
  defaultView?: ViewMode;
  maxProjects?: number;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  className = '',
  showHeader = true,
  defaultView = 'gallery',
  maxProjects
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { projectsWithStats, isLoading, hasErrors } = useProjectsWithStats(projects);

  const handleProjectClick = (project: ProjectWithStats) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'gallery':
        return <LayoutGrid className="w-4 h-4" />;
      case 'cards':
        return <Grid className="w-4 h-4" />;
      case 'spotlight':
        return <Star className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  const getViewModeLabel = (mode: ViewMode) => {
    switch (mode) {
      case 'gallery':
        return 'Gallery View';
      case 'cards':
        return '3D Cards';
      case 'spotlight':
        return 'Featured Spotlight';
      default:
        return 'Gallery View';
    }
  };

  const displayProjects = maxProjects 
    ? projectsWithStats.slice(0, maxProjects)
    : projectsWithStats;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Project Showcase
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore my portfolio of innovative projects spanning AI, Web Development, and Tools. 
              Each project represents a unique challenge solved with cutting-edge technologies.
            </p>
          </div>

          {/* View Mode Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-1">
              {(['gallery', 'cards', 'spotlight'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === mode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {getViewModeIcon(mode)}
                  <span className="font-medium">{getViewModeLabel(mode)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {projectsWithStats.length}
              </div>
              <div className="text-gray-300 font-medium">Total Projects</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {projectsWithStats.filter(p => p.featured).length}
              </div>
              <div className="text-gray-300 font-medium">Featured</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {new Set(projectsWithStats.flatMap(p => p.technologies)).size}
              </div>
              <div className="text-gray-300 font-medium">Technologies</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {projectsWithStats.reduce((sum, p) => sum + (p.githubStats?.stars || p.stars || 0), 0)}
              </div>
              <div className="text-gray-300 font-medium">Total Stars</div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasErrors && (
        <div className="mb-6 p-4 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-300">
            <Eye className="w-5 h-5" />
            <span className="font-medium">
              Some GitHub statistics couldn&apos;t be loaded. Displaying cached data where available.
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            <span className="text-white font-medium">Loading GitHub statistics...</span>
          </div>
        </div>
      )}

      {/* Content based on view mode */}
      <div className="relative">
        {viewMode === 'spotlight' && (
          <div className="mb-16">
            <FeaturedProjectSpotlight
              projects={displayProjects}
              onProjectClick={handleProjectClick}
            />
          </div>
        )}

        {viewMode === 'gallery' && (
          <ProjectGallery
            onProjectClick={handleProjectClick}
            maxProjects={maxProjects}
          />
        )}

        {viewMode === 'cards' && (
          <div className="space-y-12">
            {/* Featured Projects First */}
            {displayProjects.filter(p => p.featured).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  Featured Projects
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {displayProjects
                    .filter(project => project.featured)
                    .map((project) => (
                      <ProjectCard3D
                        key={project.id}
                        project={project}
                        onClick={() => handleProjectClick(project)}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* All Projects */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-emerald-400" />
                All Projects
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayProjects.map((project) => (
                  <ProjectCard3D
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!maxProjects && (
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Interested in collaborating?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              I&apos;m always excited to work on innovative projects and explore new technologies. 
              Let&apos;s create something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 font-semibold"
              >
                Get In Touch
              </a>
              <a
                href="https://github.com/straydogsyn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold"
              >
                View GitHub Profile
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectShowcase;