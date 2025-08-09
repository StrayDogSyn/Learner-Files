'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Glass } from '@/components/atoms/Glass';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Share2,
  Bookmark,
  Clock
} from 'lucide-react';

interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  description?: string;
  thumbnail?: string;
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  chapters: VideoChapter[];
  tags: string[];
  category: 'demo' | 'tutorial' | 'presentation' | 'showcase';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface VideoShowcaseProps {
  videos: VideoData[];
  autoplay?: boolean;
  showChapters?: boolean;
  showControls?: boolean;
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videos,
  autoplay = false,
  showChapters = true,
  showControls = true
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(videos[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [currentChapter, setCurrentChapter] = useState<VideoChapter | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  // Update current time and chapter
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      
      // Find current chapter
      const chapter = selectedVideo.chapters.find(ch => 
        video.currentTime >= ch.startTime && 
        video.currentTime < ch.startTime + ch.duration
      );
      setCurrentChapter(chapter || null);
    };

    video.addEventListener('timeupdate', updateTime);
    return () => video.removeEventListener('timeupdate', updateTime);
  }, [selectedVideo]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      trackEvent({ type: 'custom', element: 'video-play', metadata: { videoId: selectedVideo?.id } });
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      trackEvent({ type: 'custom', element: 'video-pause', metadata: { videoId: selectedVideo?.id } });
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      trackEvent({ type: 'custom', element: 'video-ended', metadata: { videoId: selectedVideo?.id } });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [selectedVideo, trackEvent]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const jumpToChapter = (chapter: VideoChapter) => {
    seekTo(chapter.startTime);
    trackEvent({ 
      type: 'custom', 
      element: 'video-chapter-jump', 
      metadata: { chapterId: chapter.id, videoId: selectedVideo?.id } 
    });
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      demo: 'bg-blue-500/20 text-blue-300',
      tutorial: 'bg-green-500/20 text-green-300',
      presentation: 'bg-purple-500/20 text-purple-300',
      showcase: 'bg-orange-500/20 text-orange-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  const getDifficultyColor = (difficulty?: string) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-300',
      intermediate: 'bg-yellow-500/20 text-yellow-300',
      advanced: 'bg-red-500/20 text-red-300'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  if (!selectedVideo) {
    return (
      <Glass config="card" className="p-8 text-center">
        <Typography variant="h6" className="text-white/70">
          No videos available
        </Typography>
      </Glass>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div ref={containerRef} className="relative group">
        <Glass config="modal" className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              src={selectedVideo.url}
              poster={selectedVideo.thumbnail}
              className="w-full h-full object-cover"
              autoPlay={autoplay}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.volume = volume;
                }
              }}
            />
            
            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="lg"
                  className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </Button>
              </div>
              
              {/* Controls */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="relative h-1 bg-white/20 rounded-full cursor-pointer"
                         onClick={(e) => {
                           const rect = e.currentTarget.getBoundingClientRect();
                           const percent = (e.clientX - rect.left) / rect.width;
                           seekTo(percent * selectedVideo.duration);
                         }}>
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                        style={{ width: `${(currentTime / selectedVideo.duration) * 100}%` }}
                      />
                      
                      {/* Chapter Markers */}
                      {selectedVideo.chapters.map(chapter => (
                        <div
                          key={chapter.id}
                          className="absolute top-0 w-0.5 h-full bg-white/50"
                          style={{ left: `${(chapter.startTime / selectedVideo.duration) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button onClick={togglePlay} variant="ghost" size="sm">
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      
                      <Button onClick={() => seekTo(Math.max(0, currentTime - 10))} variant="ghost" size="sm">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      
                      <Button onClick={() => seekTo(Math.min(selectedVideo.duration, currentTime + 10))} variant="ghost" size="sm">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Button onClick={toggleMute} variant="ghost" size="sm">
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <Typography variant="bodySmall" className="text-white text-xs">
                        {formatTime(currentTime)} / {formatTime(selectedVideo.duration)}
                      </Typography>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setShowSettings(!showSettings)} variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <Button onClick={toggleFullscreen} variant="ghost" size="sm">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Current Chapter Indicator */}
            {currentChapter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-4 left-4"
              >
                <Glass config="card" className="px-3 py-2">
                  <Typography variant="bodySmall" className="text-white font-medium">
                    {currentChapter.title}
                  </Typography>
                </Glass>
              </motion.div>
            )}
            
            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-4 right-4 w-48"
                >
                  <Glass config="modal" className="p-4">
                    <Typography variant="h6" className="text-white font-semibold mb-3">
                      Settings
                    </Typography>
                    
                    <div className="space-y-3">
                      <div>
                        <Typography variant="bodySmall" className="text-white/70 mb-1">
                          Playback Speed
                        </Typography>
                        <select
                          value={playbackRate}
                          onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                          className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      </div>
                      
                      <div>
                        <Typography variant="bodySmall" className="text-white/70 mb-1">
                          Quality
                        </Typography>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value)}
                          className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="auto">Auto</option>
                          <option value="1080p">1080p</option>
                          <option value="720p">720p</option>
                          <option value="480p">480p</option>
                        </select>
                      </div>
                    </div>
                  </Glass>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Glass>
      </div>
      
      {/* Video Info */}
      <Glass config="card" className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded-md ${getCategoryColor(selectedVideo.category)}`}>
                {selectedVideo.category.toUpperCase()}
              </span>
              {selectedVideo.difficulty && (
                <span className={`px-2 py-1 text-xs rounded-md ${getDifficultyColor(selectedVideo.difficulty)}`}>
                  {selectedVideo.difficulty.toUpperCase()}
                </span>
              )}
              <div className="flex items-center gap-1 text-white/70">
                <Clock className="w-3 h-3" />
                <Typography variant="bodySmall" className="text-xs">
                  {formatTime(selectedVideo.duration)}
                </Typography>
              </div>
            </div>
            
            <Typography variant="h5" className="text-white font-bold mb-2">
              {selectedVideo.title}
            </Typography>
            
            <Typography variant="body" className="text-white/80 mb-4">
              {selectedVideo.description}
            </Typography>
            
            <div className="flex flex-wrap gap-2">
              {selectedVideo.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Glass>
      
      {/* Chapters */}
      {showChapters && selectedVideo.chapters.length > 0 && (
        <Glass config="card" className="p-6">
          <Typography variant="h6" className="text-white font-semibold mb-4">
            Chapters
          </Typography>
          
          <div className="space-y-2">
            {selectedVideo.chapters.map(chapter => (
              <motion.div
                key={chapter.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChapter?.id === chapter.id 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => jumpToChapter(chapter)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body" className="text-white font-medium">
                      {chapter.title}
                    </Typography>
                    {chapter.description && (
                      <Typography variant="bodySmall" className="text-white/70 text-sm">
                        {chapter.description}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="bodySmall" className="text-white/70 text-sm">
                    {formatTime(chapter.startTime)}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </Glass>
      )}
      
      {/* Video Playlist */}
      {videos.length > 1 && (
        <Glass config="card" className="p-6">
          <Typography variant="h6" className="text-white font-semibold mb-4">
            More Videos
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.filter(v => v.id !== selectedVideo.id).map(video => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedVideo(video);
                  setCurrentTime(0);
                  trackEvent({ type: 'custom', element: 'video-switch', metadata: { videoId: video.id } });
                }}
              >
                <Glass config="card" className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-1 text-xs bg-black/70 text-white rounded">
                        {formatTime(video.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <Typography variant="body" className="text-white font-medium mb-1 line-clamp-2">
                      {video.title}
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/70 text-sm line-clamp-2">
                      {video.description}
                    </Typography>
                  </div>
                </Glass>
              </motion.div>
            ))}
          </div>
        </Glass>
      )}
    </div>
  );
};

export default VideoShowcase;