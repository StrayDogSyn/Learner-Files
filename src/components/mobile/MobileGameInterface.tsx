import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Home,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Trophy,
  Star,
  Zap,
  Heart,
  Shield,
  Target,
  Timer,
  Award,
  TrendingUp,
  Users,
  Share2
} from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

interface GameStats {
  score: number;
  level: number;
  lives: number;
  energy: number;
  time: number;
  multiplier: number;
  achievements: string[];
  highScore: number;
}

interface GameControls {
  up?: () => void;
  down?: () => void;
  left?: () => void;
  right?: () => void;
  action?: () => void;
  jump?: () => void;
  shoot?: () => void;
  pause?: () => void;
  restart?: () => void;
}

interface PowerUp {
  id: string;
  type: 'speed' | 'shield' | 'double-score' | 'extra-life' | 'time-freeze';
  duration: number;
  active: boolean;
  icon: React.ReactNode;
  color: string;
}

interface MobileGameInterfaceProps {
  gameStats: GameStats;
  gameControls: GameControls;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  powerUps?: PowerUp[];
  className?: string;
  showVirtualControls?: boolean;
  controlLayout?: 'dpad' | 'joystick' | 'buttons';
  onPause?: () => void;
  onResume?: () => void;
  onRestart?: () => void;
  onHome?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  vibrationEnabled?: boolean;
  onVibrationToggle?: () => void;
}

const defaultPowerUps: PowerUp[] = [
  {
    id: 'speed',
    type: 'speed',
    duration: 10000,
    active: false,
    icon: <Zap size={16} />,
    color: '#f59e0b'
  },
  {
    id: 'shield',
    type: 'shield',
    duration: 15000,
    active: true,
    icon: <Shield size={16} />,
    color: '#3b82f6'
  },
  {
    id: 'double-score',
    type: 'double-score',
    duration: 20000,
    active: false,
    icon: <Star size={16} />,
    color: '#10b981'
  }
];

const MobileGameInterface: React.FC<MobileGameInterfaceProps> = ({
  gameStats,
  gameControls,
  isPlaying,
  isPaused,
  isGameOver,
  powerUps = defaultPowerUps,
  className = '',
  showVirtualControls = true,
  controlLayout = 'dpad',
  onPause,
  onResume,
  onRestart,
  onHome,
  onSettings,
  onShare,
  soundEnabled = true,
  onSoundToggle,
  fullscreen = false,
  onFullscreenToggle,
  vibrationEnabled = true,
  onVibrationToggle
}) => {
  const [touchControls, setTouchControls] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    action: false
  });
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showGameOverMenu, setShowGameOverMenu] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isDraggingJoystick, setIsDraggingJoystick] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  
  const joystickRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const vibrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle game over state
  useEffect(() => {
    if (isGameOver) {
      setShowGameOverMenu(true);
      triggerVibration([200, 100, 200]);
    } else {
      setShowGameOverMenu(false);
    }
  }, [isGameOver]);

  // Handle pause state
  useEffect(() => {
    if (isPaused && !isGameOver) {
      setShowPauseMenu(true);
    } else {
      setShowPauseMenu(false);
    }
  }, [isPaused, isGameOver]);

  // Vibration helper
  const triggerVibration = useCallback((pattern: number | number[]) => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [vibrationEnabled]);

  // Handle touch control press
  const handleControlPress = useCallback((control: keyof typeof touchControls) => {
    setTouchControls(prev => ({ ...prev, [control]: true }));
    triggerVibration(50);
    
    // Execute game control
    switch (control) {
      case 'up':
        gameControls.up?.();
        break;
      case 'down':
        gameControls.down?.();
        break;
      case 'left':
        gameControls.left?.();
        break;
      case 'right':
        gameControls.right?.();
        break;
      case 'action':
        gameControls.action?.();
        break;
    }
  }, [gameControls, triggerVibration]);

  // Handle touch control release
  const handleControlRelease = useCallback((control: keyof typeof touchControls) => {
    setTouchControls(prev => ({ ...prev, [control]: false }));
  }, []);

  // Handle joystick movement
  const handleJoystickMove = useCallback((event: any, info: PanInfo) => {
    if (!joystickRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxDistance = Math.min(centerX, centerY) - 20;
    
    const deltaX = info.offset.x;
    const deltaY = info.offset.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance <= maxDistance) {
      setJoystickPosition({ x: deltaX, y: deltaY });
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      setJoystickPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      });
    }
    
    // Convert to directional controls
    const threshold = maxDistance * 0.3;
    const newControls = {
      up: deltaY < -threshold,
      down: deltaY > threshold,
      left: deltaX < -threshold,
      right: deltaX > threshold,
      action: false
    };
    
    // Execute controls if changed
    Object.entries(newControls).forEach(([key, value]) => {
      if (value && !touchControls[key as keyof typeof touchControls]) {
        handleControlPress(key as keyof typeof touchControls);
      } else if (!value && touchControls[key as keyof typeof touchControls]) {
        handleControlRelease(key as keyof typeof touchControls);
      }
    });
  }, [touchControls, handleControlPress, handleControlRelease]);

  // Handle joystick release
  const handleJoystickEnd = useCallback(() => {
    setJoystickPosition({ x: 0, y: 0 });
    setIsDraggingJoystick(false);
    
    // Release all directional controls
    Object.keys(touchControls).forEach(key => {
      if (key !== 'action') {
        handleControlRelease(key as keyof typeof touchControls);
      }
    });
  }, [touchControls, handleControlRelease]);

  // Handle swipe gestures
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    switch (direction) {
      case 'up':
        gameControls.jump?.();
        break;
      case 'down':
        gameControls.action?.();
        break;
      case 'left':
        gameControls.left?.();
        break;
      case 'right':
        gameControls.right?.();
        break;
    }
    triggerVibration(30);
  }, [gameControls, triggerVibration]);

  // Handle tap gesture
  const handleTap = useCallback(() => {
    if (isGameOver) {
      onRestart?.();
    } else if (isPaused) {
      onResume?.();
    } else {
      gameControls.action?.();
    }
    triggerVibration(25);
  }, [isGameOver, isPaused, onRestart, onResume, gameControls, triggerVibration]);

  // Handle double tap
  const handleDoubleTap = useCallback(() => {
    gameControls.shoot?.();
    setComboCount(prev => prev + 1);
    setShowCombo(true);
    triggerVibration([50, 50, 50]);
    
    setTimeout(() => setShowCombo(false), 1000);
  }, [gameControls, triggerVibration]);

  // Handle long press
  const handleLongPress = useCallback(() => {
    if (isPlaying && !isPaused) {
      onPause?.();
    }
    triggerVibration(100);
  }, [isPlaying, isPaused, onPause, triggerVibration]);

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format score
  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  // Render D-Pad controls
  const renderDPadControls = () => (
    <div className="dpad-container">
      <div className="dpad">
        <button
          className={`dpad-btn dpad-up ${touchControls.up ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('up')}
          onTouchEnd={() => handleControlRelease('up')}
          onMouseDown={() => handleControlPress('up')}
          onMouseUp={() => handleControlRelease('up')}
        >
          ▲
        </button>
        <div className="dpad-middle">
          <button
            className={`dpad-btn dpad-left ${touchControls.left ? 'active' : ''}`}
            onTouchStart={() => handleControlPress('left')}
            onTouchEnd={() => handleControlRelease('left')}
            onMouseDown={() => handleControlPress('left')}
            onMouseUp={() => handleControlRelease('left')}
          >
            ◀
          </button>
          <div className="dpad-center" />
          <button
            className={`dpad-btn dpad-right ${touchControls.right ? 'active' : ''}`}
            onTouchStart={() => handleControlPress('right')}
            onTouchEnd={() => handleControlRelease('right')}
            onMouseDown={() => handleControlPress('right')}
            onMouseUp={() => handleControlRelease('right')}
          >
            ▶
          </button>
        </div>
        <button
          className={`dpad-btn dpad-down ${touchControls.down ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('down')}
          onTouchEnd={() => handleControlRelease('down')}
          onMouseDown={() => handleControlPress('down')}
          onMouseUp={() => handleControlRelease('down')}
        >
          ▼
        </button>
      </div>
      
      <div className="action-buttons">
        <button
          className={`action-btn primary ${touchControls.action ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('action')}
          onTouchEnd={() => handleControlRelease('action')}
          onMouseDown={() => handleControlPress('action')}
          onMouseUp={() => handleControlRelease('action')}
        >
          A
        </button>
        <button
          className="action-btn secondary"
          onTouchStart={() => gameControls.jump?.()}
          onTouchEnd={() => triggerVibration(30)}
        >
          B
        </button>
      </div>
    </div>
  );

  // Render joystick controls
  const renderJoystickControls = () => (
    <div className="joystick-container">
      <div className="joystick-area" ref={joystickRef}>
        <motion.div
          className="joystick-base"
          drag
          dragConstraints={joystickRef}
          dragElastic={0}
          onDrag={handleJoystickMove}
          onDragStart={() => setIsDraggingJoystick(true)}
          onDragEnd={handleJoystickEnd}
          animate={{
            x: joystickPosition.x,
            y: joystickPosition.y
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="joystick-knob" />
        </motion.div>
      </div>
      
      <div className="action-buttons">
        <button
          className={`action-btn primary ${touchControls.action ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('action')}
          onTouchEnd={() => handleControlRelease('action')}
        >
          <Target size={20} />
        </button>
        <button
          className="action-btn secondary"
          onTouchStart={() => gameControls.jump?.()}
        >
          <Zap size={20} />
        </button>
      </div>
    </div>
  );

  // Render button controls
  const renderButtonControls = () => (
    <div className="button-controls">
      <div className="movement-buttons">
        <button
          className={`move-btn ${touchControls.up ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('up')}
          onTouchEnd={() => handleControlRelease('up')}
        >
          ↑
        </button>
        <div className="horizontal-buttons">
          <button
            className={`move-btn ${touchControls.left ? 'active' : ''}`}
            onTouchStart={() => handleControlPress('left')}
            onTouchEnd={() => handleControlRelease('left')}
          >
            ←
          </button>
          <button
            className={`move-btn ${touchControls.right ? 'active' : ''}`}
            onTouchStart={() => handleControlPress('right')}
            onTouchEnd={() => handleControlRelease('right')}
          >
            →
          </button>
        </div>
        <button
          className={`move-btn ${touchControls.down ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('down')}
          onTouchEnd={() => handleControlRelease('down')}
        >
          ↓
        </button>
      </div>
      
      <div className="action-buttons">
        <button
          className={`action-btn primary ${touchControls.action ? 'active' : ''}`}
          onTouchStart={() => handleControlPress('action')}
          onTouchEnd={() => handleControlRelease('action')}
        >
          Fire
        </button>
        <button
          className="action-btn secondary"
          onTouchStart={() => gameControls.jump?.()}
        >
          Jump
        </button>
      </div>
    </div>
  );

  return (
    <TouchGestureHandler
      onSwipe={handleSwipe}
      onTap={handleTap}
      onDoubleTap={handleDoubleTap}
      onLongPress={handleLongPress}
      className={`mobile-game-interface ${className} ${fullscreen ? 'fullscreen' : ''}`}
    >
      <div className="game-container" ref={gameAreaRef}>
        {/* Game HUD */}
        <div className="game-hud">
          {/* Top HUD */}
          <div className="hud-top">
            <div className="hud-left">
              <div className="stat-item">
                <Trophy size={16} />
                <span>{formatScore(gameStats.score)}</span>
              </div>
              <div className="stat-item">
                <Star size={16} />
                <span>Lv.{gameStats.level}</span>
              </div>
            </div>
            
            <div className="hud-center">
              <div className="stat-item time">
                <Timer size={16} />
                <span>{formatTime(gameStats.time)}</span>
              </div>
            </div>
            
            <div className="hud-right">
              <button
                onClick={onSoundToggle}
                className="hud-btn"
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={() => isPaused ? onResume?.() : onPause?.()}
                className="hud-btn"
                aria-label={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </div>
          </div>
          
          {/* Health and Energy Bars */}
          <div className="hud-bars">
            <div className="health-bar">
              <div className="bar-label">
                <Heart size={14} />
                <span>{gameStats.lives}</span>
              </div>
              <div className="bar">
                <div 
                  className="bar-fill health" 
                  style={{ width: `${(gameStats.lives / 3) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="energy-bar">
              <div className="bar-label">
                <Zap size={14} />
                <span>{gameStats.energy}%</span>
              </div>
              <div className="bar">
                <div 
                  className="bar-fill energy" 
                  style={{ width: `${gameStats.energy}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Power-ups */}
          {powerUps.length > 0 && (
            <div className="powerups">
              {powerUps.filter(p => p.active).map(powerUp => (
                <motion.div
                  key={powerUp.id}
                  className="powerup-item"
                  style={{ borderColor: powerUp.color }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <div className="powerup-icon" style={{ color: powerUp.color }}>
                    {powerUp.icon}
                  </div>
                  <div className="powerup-timer">
                    <div 
                      className="timer-fill"
                      style={{ 
                        backgroundColor: powerUp.color,
                        animation: `countdown ${powerUp.duration}ms linear forwards`
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="game-area">
          {/* Combo Display */}
          <AnimatePresence>
            {showCombo && comboCount > 1 && (
              <motion.div
                className="combo-display"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <span className="combo-text">COMBO</span>
                <span className="combo-count">×{comboCount}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Multiplier Display */}
          {gameStats.multiplier > 1 && (
            <div className="multiplier-display">
              <TrendingUp size={16} />
              <span>×{gameStats.multiplier}</span>
            </div>
          )}
        </div>

        {/* Virtual Controls */}
        {showVirtualControls && !isPaused && !isGameOver && (
          <div className="virtual-controls">
            {controlLayout === 'dpad' && renderDPadControls()}
            {controlLayout === 'joystick' && renderJoystickControls()}
            {controlLayout === 'buttons' && renderButtonControls()}
          </div>
        )}

        {/* Pause Menu */}
        <AnimatePresence>
          {showPauseMenu && (
            <motion.div
              className="game-menu pause-menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="menu-content">
                <h3>Game Paused</h3>
                <div className="menu-buttons">
                  <button onClick={onResume} className="menu-btn primary">
                    <Play size={20} />
                    Resume
                  </button>
                  <button onClick={onRestart} className="menu-btn">
                    <RotateCcw size={20} />
                    Restart
                  </button>
                  <button onClick={onSettings} className="menu-btn">
                    <Settings size={20} />
                    Settings
                  </button>
                  <button onClick={onHome} className="menu-btn">
                    <Home size={20} />
                    Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Menu */}
        <AnimatePresence>
          {showGameOverMenu && (
            <motion.div
              className="game-menu game-over-menu"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="menu-content">
                <h3>Game Over</h3>
                <div className="final-stats">
                  <div className="stat">
                    <span className="label">Final Score</span>
                    <span className="value">{formatScore(gameStats.score)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">High Score</span>
                    <span className="value">{formatScore(gameStats.highScore)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Level Reached</span>
                    <span className="value">{gameStats.level}</span>
                  </div>
                </div>
                
                {gameStats.score > gameStats.highScore && (
                  <div className="new-record">
                    <Award size={24} />
                    <span>New High Score!</span>
                  </div>
                )}
                
                <div className="menu-buttons">
                  <button onClick={onRestart} className="menu-btn primary">
                    <RotateCcw size={20} />
                    Play Again
                  </button>
                  <button onClick={onShare} className="menu-btn">
                    <Share2 size={20} />
                    Share Score
                  </button>
                  <button onClick={onHome} className="menu-btn">
                    <Home size={20} />
                    Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Styles */}
      <style>{`
        .mobile-game-interface {
          width: 100%;
          height: 100vh;
          position: relative;
          background: #000;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        
        .mobile-game-interface.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }
        
        .game-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .game-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 12px;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
        }
        
        .hud-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .hud-left,
        .hud-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .hud-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 4px 8px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .stat-item.time {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }
        
        .hud-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hud-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .hud-bars {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .health-bar,
        .energy-bar {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .bar-label {
          display: flex;
          align-items: center;
          gap: 2px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 40px;
        }
        
        .bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .bar-fill.health {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }
        
        .bar-fill.energy {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }
        
        .powerups {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        
        .powerup-item {
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid;
          border-radius: 8px;
          padding: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .powerup-icon {
          position: relative;
          z-index: 2;
        }
        
        .powerup-timer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0 0 6px 6px;
          overflow: hidden;
        }
        
        .timer-fill {
          height: 100%;
          width: 100%;
          transform-origin: left;
        }
        
        @keyframes countdown {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        
        .game-area {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .combo-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          z-index: 50;
        }
        
        .combo-text {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
        
        .combo-count {
          display: block;
          font-size: 2rem;
          font-weight: 900;
          color: #f59e0b;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
        
        .multiplier-display {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 6px 10px;
          color: #10b981;
          font-weight: 700;
          font-size: 1.125rem;
        }
        
        .virtual-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);
        }
        
        .dpad-container,
        .joystick-container,
        .button-controls {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        
        .dpad {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 2px;
          width: 120px;
          height: 120px;
        }
        
        .dpad-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        
        .dpad-btn:active,
        .dpad-btn.active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0.95);
        }
        
        .dpad-up {
          grid-column: 2;
          grid-row: 1;
        }
        
        .dpad-middle {
          grid-column: 1 / 4;
          grid-row: 2;
          display: flex;
          align-items: center;
        }
        
        .dpad-left {
          flex: 1;
        }
        
        .dpad-center {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          margin: 0 2px;
        }
        
        .dpad-right {
          flex: 1;
        }
        
        .dpad-down {
          grid-column: 2;
          grid-row: 3;
        }
        
        .joystick-area {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .joystick-base {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .joystick-knob {
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .action-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        
        .action-btn:active,
        .action-btn.active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0.95);
        }
        
        .action-btn.primary {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }
        
        .action-btn.primary:active,
        .action-btn.primary.active {
          background: rgba(59, 130, 246, 0.5);
        }
        
        .button-controls {
          align-items: center;
        }
        
        .movement-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .horizontal-buttons {
          display: flex;
          gap: 40px;
        }
        
        .move-btn {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        
        .move-btn:active,
        .move-btn.active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0.95);
        }
        
        .game-menu {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }
        
        .menu-content {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          max-width: 300px;
          width: 90%;
        }
        
        .menu-content h3 {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 20px 0;
        }
        
        .final-stats {
          margin-bottom: 20px;
        }
        
        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat:last-child {
          border-bottom: none;
        }
        
        .stat .label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }
        
        .stat .value {
          color: white;
          font-weight: 700;
        }
        
        .new-record {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #10b981;
          font-weight: 700;
        }
        
        .menu-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .menu-btn.primary {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }
        
        .menu-btn.primary:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
          .game-hud {
            padding: 8px;
          }
          
          .virtual-controls {
            padding: 16px;
          }
          
          .dpad {
            width: 100px;
            height: 100px;
          }
          
          .joystick-area {
            width: 100px;
            height: 100px;
          }
          
          .action-btn {
            width: 50px;
            height: 50px;
          }
        }
        
        /* Landscape orientation */
        @media (orientation: landscape) and (max-height: 500px) {
          .game-hud {
            padding: 6px;
          }
          
          .hud-bars {
            margin-bottom: 4px;
          }
          
          .virtual-controls {
            padding: 12px;
          }
          
          .dpad,
          .joystick-area {
            width: 80px;
            height: 80px;
          }
          
          .action-btn {
            width: 45px;
            height: 45px;
          }
        }
        
        /* Touch device optimizations */
        @media (pointer: coarse) {
          .dpad-btn,
          .action-btn,
          .move-btn,
          .hud-btn {
            min-width: 44px;
            min-height: 44px;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .dpad-btn,
          .action-btn,
          .move-btn,
          .bar-fill,
          .timer-fill {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </TouchGestureHandler>
  );
};

export default MobileGameInterface;
export type { MobileGameInterfaceProps, GameStats, GameControls, PowerUp };