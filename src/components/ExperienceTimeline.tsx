import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Filter,
  Briefcase,
  Code,
  Award
} from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import type { Experience, MediaItem, ExperienceFilters } from '../types/portfolio';

interface ExperienceTimelineProps {
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

interface TimelineEntryProps {
  experience: Experience;
  isExpanded?: boolean;
  onToggle: (id: string) => void;
  index: number;
}

interface MediaViewerProps {
  media: MediaItem;
  onClose: () => void;
}

const experienceTypeIcons = {
  work: Briefcase,
  project: Code,
  achievement: Award
};

const experienceTypeColors = {
  work: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-700',
    dot: 'bg-blue-600'
  },
  project: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-700',
    dot: 'bg-green-600'
  },
  achievement: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-700',
    dot: 'bg-purple-600'
  }
};

const MediaViewer: React.FC<MediaViewerProps> = ({ media, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      variants={animationsEnabled ? backdropVariants : {}}
      initial={animationsEnabled ? 'hidden' : undefined}
      animate={animationsEnabled ? 'visible' : undefined}
      exit={animationsEnabled ? 'exit' : undefined}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        variants={animationsEnabled ? modalVariants : {}}
        initial={animationsEnabled ? 'hidden' : undefined}
        animate={animationsEnabled ? 'visible' : undefined}
        exit={animationsEnabled ? 'exit' : undefined}
        className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {media.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close media viewer"
          >
            ✕
          </button>
        </div>

        {/* Media Content */}
        <div className="relative">
          {media.type === 'image' && (
            <img
              src={media.url}
              alt={media.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}
          
          {media.type === 'video' && (
            <div className="relative">
              <video
                ref={videoRef}
                src={media.url}
                className="w-full h-auto max-h-[70vh]"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-gray-300 transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={handleMuteToggle}
                    className="text-white hover:text-gray-300 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {media.type === 'link' && (
            <div className="p-8 text-center">
              <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This is an external link. Click below to open it.
              </p>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Link
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        {media.description && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">{media.description}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const TimelineEntry: React.FC<TimelineEntryProps> = ({ 
  experience, 
  isExpanded = false, 
  onToggle,
  index
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  
  const Icon = experienceTypeIcons[experience.type];
  const colors = experienceTypeColors[experience.type];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  const getDuration = () => {
    const start = new Date(experience.startDate);
    const end = experience.endDate ? new Date(experience.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      let duration = `${years} year${years !== 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        duration += ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      }
      return duration;
    }
  };

  const entryVariants = {
    hidden: { 
      opacity: 0, 
      x: index % 2 === 0 ? -50 : 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { 
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut"
        }
    }
  };

  const contentVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
          duration: 0.4,
          ease: "easeOut"
        }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={animationsEnabled ? entryVariants : undefined}
      initial={animationsEnabled ? 'hidden' : undefined}
      animate={animationsEnabled && isInView ? 'visible' : undefined}
      className="relative flex items-start gap-6"
    >
      {/* Timeline Dot */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`w-12 h-12 ${colors.dot} rounded-full flex items-center justify-center text-white shadow-lg`}
          whileHover={animationsEnabled ? { scale: 1.1 } : undefined}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <div className="w-0.5 bg-gray-300 dark:bg-gray-600 h-full mt-4"></div>
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          whileHover={animationsEnabled ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : undefined}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div 
            className={`p-6 ${colors.bg} ${colors.text} cursor-pointer`}
            onClick={() => onToggle(experience.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle(experience.id);
              }
            }}
            aria-expanded={isExpanded}
            aria-controls={`experience-${experience.id}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{experience.title}</h3>
                <p className="text-lg opacity-90 mb-2">{experience.company}</p>
                
                <div className="flex items-center gap-4 text-sm opacity-80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                  </span>
                  <span>({getDuration()})</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} border ${colors.border}`}>
                  {experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                id={`experience-${experience.id}`}
                variants={animationsEnabled ? contentVariants : undefined}
                initial={animationsEnabled ? 'hidden' : false}
                animate={animationsEnabled ? 'visible' : false}
                exit={animationsEnabled ? 'hidden' : undefined}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  {experience.technologies.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Gallery */}
                  {experience.media && experience.media.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Media Gallery
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {experience.media.map((media) => (
                          <motion.div
                            key={media.id}
                            className="relative group cursor-pointer"
                            whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedMedia(media)}
                          >
                            {media.type === 'image' && (
                              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img
                                  src={media.url}
                                  alt={media.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                  <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              </div>
                            )}
                            
                            {media.type === 'video' && (
                              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                  muted
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                  <Play className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            )}
                            
                            {media.type === 'link' && (
                              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                                <ExternalLink className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                            
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center truncate">
                              {media.title}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaViewer
            media={selectedMedia}
            onClose={() => setSelectedMedia(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  className = '',
  showFilters = true,
  maxItems
}) => {
  const {
    experiences,
    expandedExperience,
    toggleExperience,
    experienceFilters,
    updateExperienceFilters,
    getFilteredExperiences
  } = usePortfolioStore();

  const [showAllFilters, setShowAllFilters] = useState(false);
  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([]);

  // Get all unique technologies from experiences
  useEffect(() => {
    if (experiences.data) {
      const allTechs = experiences.data.flatMap(exp => exp.technologies);
      const uniqueTechs = Array.from(new Set(allTechs)).sort();
      setAvailableTechnologies(uniqueTechs);
    }
  }, [experiences.data]);

  const filteredExperiences = getFilteredExperiences();
  const displayedExperiences = maxItems 
    ? filteredExperiences.slice(0, maxItems)
    : filteredExperiences;

  const handleTypeFilter = (type: 'work' | 'project' | 'achievement' | undefined) => {
    updateExperienceFilters({ type });
  };

  const handleTechnologyToggle = (tech: string) => {
    const currentTechs = experienceFilters.technologies || [];
    const newTechs = currentTechs.includes(tech)
      ? currentTechs.filter(t => t !== tech)
      : [...currentTechs, tech];
    
    updateExperienceFilters({ technologies: newTechs });
  };

  if (experiences.loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (experiences.error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load experiences</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Experience Timeline
          {displayedExperiences.length > 0 && (
            <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              ({displayedExperiences.length})
            </span>
          )}
        </h2>
        
        {showFilters && (
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-expanded={showAllFilters}
            aria-controls="experience-filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <AnimatePresence>
          {showAllFilters && (
            <motion.div
              id="experience-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {/* Type Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleTypeFilter(undefined)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        experienceFilters.type === undefined
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    {(['work', 'project', 'achievement'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeFilter(type)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          experienceFilters.type === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technology Filter */}
                {availableTechnologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableTechnologies.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => handleTechnologyToggle(tech)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            experienceFilters.technologies?.includes(tech)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Timeline */}
      {displayedExperiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {experiences.data?.length === 0 
              ? 'No experiences available yet.' 
              : 'No experiences match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="relative">
          {displayedExperiences.map((experience, index) => (
            <TimelineEntry
              key={experience.id}
              experience={experience}
              isExpanded={expandedExperience === experience.id}
              onToggle={toggleExperience}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceTimeline;