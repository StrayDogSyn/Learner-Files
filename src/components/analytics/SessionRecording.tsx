import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  Share,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Eye,
  MousePointer,
  Keyboard,
  Settings
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';
import { GlassModal } from '../ui/GlassModal';
import { GlassBadge } from '../ui/GlassBadge';

export interface SessionEvent {
  id: string;
  type: 'click' | 'scroll' | 'input' | 'hover' | 'focus' | 'blur' | 'resize' | 'navigation';
  timestamp: number;
  element?: {
    tagName: string;
    id?: string;
    className?: string;
    textContent?: string;
    attributes?: Record<string, string>;
  };
  position?: {
    x: number;
    y: number;
  };
  viewport?: {
    width: number;
    height: number;
  };
  data?: any;
}

export interface SessionRecording {
  id: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in milliseconds
  events: SessionEvent[];
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    url: string;
    referrer?: string;
    device: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
    location?: {
      country: string;
      city: string;
      timezone: string;
    };
  };
  analytics: {
    pageViews: number;
    clicks: number;
    scrollDepth: number;
    timeOnPage: number;
    bounceRate: boolean;
    conversionEvents: string[];
  };
  privacy: {
    consentGiven: boolean;
    dataRetentionDays: number;
    anonymized: boolean;
    ipMasked: boolean;
  };
}

export interface SessionRecordingProps {
  recordings: SessionRecording[];
  onPlayRecording: (recordingId: string) => void;
  onDeleteRecording: (recordingId: string) => void;
  onExportRecording: (recordingId: string, format: 'json' | 'video') => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  className?: string;
}

const DEVICE_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone
};

const EVENT_COLORS = {
  click: 'text-blue-500',
  scroll: 'text-green-500',
  input: 'text-purple-500',
  hover: 'text-yellow-500',
  focus: 'text-orange-500',
  blur: 'text-gray-500',
  resize: 'text-pink-500',
  navigation: 'text-red-500'
};

export const SessionRecording: React.FC<SessionRecordingProps> = ({
  recordings,
  onPlayRecording,
  onDeleteRecording,
  onExportRecording,
  onStartRecording,
  onStopRecording,
  isRecording,
  className = ''
}) => {
  const [selectedRecording, setSelectedRecording] = useState<SessionRecording | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [filter, setFilter] = useState({
    device: 'all',
    dateRange: 'all',
    duration: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'events'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort recordings
  const filteredRecordings = useMemo(() => {
    let filtered = recordings.filter(recording => {
      // Device filter
      if (filter.device !== 'all' && recording.metadata.device !== filter.device) {
        return false;
      }

      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesUrl = recording.metadata.url.toLowerCase().includes(searchLower);
        const matchesUserAgent = recording.metadata.userAgent.toLowerCase().includes(searchLower);
        const matchesLocation = recording.metadata.location?.city.toLowerCase().includes(searchLower) ||
                               recording.metadata.location?.country.toLowerCase().includes(searchLower);
        
        if (!matchesUrl && !matchesUserAgent && !matchesLocation) {
          return false;
        }
      }

      // Date range filter
      if (filter.dateRange !== 'all') {
        const now = new Date();
        const recordingDate = new Date(recording.startTime);
        const daysDiff = (now.getTime() - recordingDate.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (filter.dateRange) {
          case 'today':
            if (daysDiff > 1) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
        }
      }

      // Duration filter
      if (filter.duration !== 'all') {
        const durationMinutes = recording.duration / (1000 * 60);
        
        switch (filter.duration) {
          case 'short':
            if (durationMinutes > 2) return false;
            break;
          case 'medium':
            if (durationMinutes <= 2 || durationMinutes > 10) return false;
            break;
          case 'long':
            if (durationMinutes <= 10) return false;
            break;
        }
      }

      return true;
    });

    // Sort recordings
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'events':
          comparison = a.events.length - b.events.length;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [recordings, filter, sortBy, sortOrder]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalRecordings = recordings.length;
    const totalDuration = recordings.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = totalRecordings > 0 ? totalDuration / totalRecordings : 0;
    const totalEvents = recordings.reduce((sum, r) => sum + r.events.length, 0);
    const avgEvents = totalRecordings > 0 ? totalEvents / totalRecordings : 0;
    
    const deviceBreakdown = recordings.reduce((acc, r) => {
      acc[r.metadata.device] = (acc[r.metadata.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bounceRate = recordings.length > 0 
      ? recordings.filter(r => r.analytics.bounceRate).length / recordings.length
      : 0;

    return {
      totalRecordings,
      totalDuration,
      avgDuration,
      totalEvents,
      avgEvents,
      deviceBreakdown,
      bounceRate
    };
  }, [recordings]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDeviceIcon = (device: string) => {
    const Icon = DEVICE_ICONS[device as keyof typeof DEVICE_ICONS] || Monitor;
    return <Icon className="w-4 h-4" />;
  };

  const getBrowserFromUserAgent = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSFromUserAgent = (userAgent: string) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Session Recording
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Record and analyze user interactions for UX optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isRecording ? (
              <GlassButton
                onClick={onStopRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </GlassButton>
            ) : (
              <GlassButton
                onClick={onStartRecording}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </GlassButton>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {statistics.totalRecordings}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Sessions
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {formatDuration(statistics.avgDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Avg Duration
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {Math.round(statistics.avgEvents)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Avg Events
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {statistics.deviceBreakdown.desktop || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Desktop
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-500">
              {statistics.deviceBreakdown.mobile || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Mobile
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {(statistics.bounceRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Bounce Rate
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <GlassInput
              placeholder="Search sessions..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
          </div>

          <select
            value={filter.device}
            onChange={(e) => setFilter(prev => ({ ...prev, device: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <option value="all">All Devices</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>

          <select
            value={filter.dateRange}
            onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <select
            value={filter.duration}
            onChange={(e) => setFilter(prev => ({ ...prev, duration: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <option value="all">All Durations</option>
            <option value="short">Short (&lt; 2min)</option>
            <option value="medium">Medium (2-10min)</option>
            <option value="long">Long (&gt; 10min)</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <option value="date">Date</option>
              <option value="duration">Duration</option>
              <option value="events">Events</option>
            </select>
            <GlassButton
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              size="sm"
              variant="outline"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Recordings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRecordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(recording.metadata.device)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {recording.metadata.device.charAt(0).toUpperCase() + recording.metadata.device.slice(1)} Session
                        </span>
                      </div>
                      
                      <GlassBadge variant="outline">
                        {formatDuration(recording.duration)}
                      </GlassBadge>
                      
                      <GlassBadge variant="outline">
                        {recording.events.length} events
                      </GlassBadge>
                      
                      {recording.analytics.bounceRate && (
                        <GlassBadge variant="warning">
                          Bounced
                        </GlassBadge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Started
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(recording.startTime).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Browser
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getBrowserFromUserAgent(recording.metadata.userAgent)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          OS
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getOSFromUserAgent(recording.metadata.userAgent)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Location
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {recording.metadata.location ? 
                            `${recording.metadata.location.city}, ${recording.metadata.location.country}` : 
                            'Unknown'
                          }
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <span className="font-medium">URL:</span> {recording.metadata.url}
                    </div>

                    {/* Event Summary */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(
                        recording.events.reduce((acc, event) => {
                          acc[event.type] = (acc[event.type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => (
                        <span
                          key={type}
                          className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ${EVENT_COLORS[type as keyof typeof EVENT_COLORS]}`}
                        >
                          {count} {type}s
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <GlassButton
                      onClick={() => {
                        setSelectedRecording(recording);
                        setShowPlayer(true);
                        onPlayRecording(recording.id);
                      }}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Play className="w-4 h-4" />
                    </GlassButton>

                    <GlassButton
                      onClick={() => onExportRecording(recording.id, 'json')}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4" />
                    </GlassButton>

                    <GlassButton
                      onClick={() => onDeleteRecording(recording.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Square className="w-4 h-4" />
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRecordings.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recordings found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start recording user sessions to analyze behavior and optimize UX.
            </p>
            <GlassButton
              onClick={onStartRecording}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start First Recording
            </GlassButton>
          </GlassCard>
        )}
      </div>

      {/* Session Player Modal */}
      {selectedRecording && (
        <SessionPlayer
          recording={selectedRecording}
          isOpen={showPlayer}
          onClose={() => {
            setShowPlayer(false);
            setSelectedRecording(null);
          }}
        />
      )}
    </div>
  );
};

// Session Player Component
const SessionPlayer: React.FC<{
  recording: SessionRecording;
  isOpen: boolean;
  onClose: () => void;
}> = ({ recording, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showEvents, setShowEvents] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + (100 * playbackSpeed);
        if (next >= recording.duration) {
          setIsPlaying(false);
          return recording.duration;
        }
        return next;
      });
    }, 100);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentEvents = recording.events.filter(
    event => event.timestamp <= currentTime
  );

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Replay"
      size="full"
    >
      <div className="h-full flex flex-col">
        {/* Player Controls */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <GlassButton
                onClick={isPlaying ? handlePause : handlePlay}
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </GlassButton>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                {formatTime(currentTime)} / {formatTime(recording.duration)}
              </div>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <GlassButton
                onClick={() => setShowEvents(!showEvents)}
                size="sm"
                variant={showEvents ? 'default' : 'outline'}
              >
                Events
              </GlassButton>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / recording.duration) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={recording.duration}
              value={currentTime}
              onChange={(e) => handleSeek(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Main Viewport */}
          <div className="flex-1 bg-white dark:bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Monitor className="w-16 h-16 mx-auto mb-4" />
                <p>Session replay visualization would appear here</p>
                <p className="text-sm mt-2">
                  Viewport: {recording.metadata.viewport.width} × {recording.metadata.viewport.height}
                </p>
              </div>
            </div>
          </div>

          {/* Events Panel */}
          {showEvents && (
            <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Events ({currentEvents.length})
                </h3>
                <div className="space-y-2">
                  {currentEvents.slice(-20).map((event, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${EVENT_COLORS[event.type]}`}>
                          {event.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(event.timestamp)}
                        </span>
                      </div>
                      {event.element && (
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {event.element.tagName}
                          {event.element.id && `#${event.element.id}`}
                          {event.element.className && `.${event.element.className.split(' ')[0]}`}
                        </div>
                      )}
                      {event.position && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ({event.position.x}, {event.position.y})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassModal>
  );
};

export default SessionRecording;