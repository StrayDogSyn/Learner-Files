'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Glass } from '@/components/atoms/Glass';
import { cn } from '@/lib/utils';

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  thumbnail?: string;
}

interface VideoShowcaseProps {
  src: string;
  poster?: string;
  title: string;
  description?: string;
  chapters?: Chapter[];
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  src,
  poster,
  title,
  description,
  chapters = [],
  autoPlay = false,
  loop = false,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [showChapters, setShowChapters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);
  
  useEffect(() => {
    if (chapters.length > 0) {
      const chapter = chapters.find(
        (ch) => currentTime >= ch.startTime && currentTime < ch.startTime + ch.duration
      );
      setCurrentChapter(chapter || null);
    }
  }, [currentTime, chapters]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
  };
  
  const jumpToChapter = (chapter: Chapter) => {
    seekTo(chapter.startTime);
    setShowChapters(false);
  };
  
  const skipForward = () => {
    seekTo(Math.min(currentTime + 10, duration));
  };
  
  const skipBackward = () => {
    seekTo(Math.max(currentTime - 10, 0));
  };
  
  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    
    if (!isFullscreen) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className={cn('relative group', className)}>
      <motion.div
        className="relative overflow-hidden rounded-xl bg-navy-900"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          className="w-full h-auto"
          onClick={togglePlay}
        />
        
        {/* Video Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        
        {/* Play/Pause Button */}
        <AnimatePresence>
          {(!isPlaying || showControls) && (
            <motion.button
              className="absolute inset-0 flex items-center justify-center"
              onClick={togglePlay}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Glass config="button" className="p-4">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </Glass>
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Controls Bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Glass config="navigation" className="p-4 space-y-3">
                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                      style={{ width: `${progressPercentage}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  
                  {/* Chapter Markers */}
                  {chapters.map((chapter) => {
                    const position = (chapter.startTime / duration) * 100;
                    return (
                      <button
                        key={chapter.id}
                        className="absolute top-0 w-2 h-1 bg-amber-400 rounded-full transform -translate-x-1/2 hover:scale-150 transition-transform"
                        style={{ left: `${position}%` }}
                        onClick={() => jumpToChapter(chapter)}
                        title={chapter.title}
                      />
                    );
                  })}
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={skipBackward}
                      className="p-2 text-white hover:text-amber-400 transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="p-2 text-white hover:text-amber-400 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={skipForward}
                      className="p-2 text-white hover:text-amber-400 transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="p-2 text-white hover:text-amber-400 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {chapters.length > 0 && (
                      <button
                        onClick={() => setShowChapters(!showChapters)}
                        className="px-3 py-1 text-white hover:text-amber-400 transition-colors text-sm"
                      >
                        Chapters
                      </button>
                    )}
                    
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 text-white hover:text-amber-400 transition-colors"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Current Chapter Indicator */}
        <AnimatePresence>
          {currentChapter && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Glass config="card" className="px-3 py-2">
                <span className="text-white text-sm font-medium">
                  {currentChapter.title}
                </span>
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Video Info */}
      <div className="mt-4">
        <h3 className="text-xl font-bold text-navy-100 mb-2">{title}</h3>
        {description && (
          <p className="text-navy-300 text-sm leading-relaxed">{description}</p>
        )}
      </div>
      
      {/* Chapters Panel */}
      <AnimatePresence>
        {showChapters && chapters.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Glass config="modal" className="p-4">
              <h4 className="text-lg font-semibold text-navy-100 mb-3">Chapters</h4>
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => jumpToChapter(chapter)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-colors',
                      'hover:bg-white/10',
                      currentChapter?.id === chapter.id && 'bg-amber-500/20'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-navy-100 font-medium">{chapter.title}</span>
                      <span className="text-navy-300 text-sm">
                        {formatTime(chapter.startTime)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};