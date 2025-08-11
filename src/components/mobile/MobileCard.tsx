import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreVertical, Share2, Heart, Bookmark } from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  tags?: string[];
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  children?: React.ReactNode;
  expandable?: boolean;
  favoritable?: boolean;
  shareable?: boolean;
  bookmarkable?: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({
  title,
  subtitle,
  description,
  image,
  tags = [],
  actions = [],
  onSwipeLeft,
  onSwipeRight,
  onTap,
  onLongPress,
  className = '',
  children,
  expandable = false,
  favoritable = false,
  shareable = false,
  bookmarkable = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle swipe gestures
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => {
    if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft();
    } else if (direction === 'right' && onSwipeRight) {
      onSwipeRight();
    }
  };

  // Handle pan gesture for card dragging
  const handlePan = (delta: { x: number; y: number }, velocity: { x: number; y: number }) => {
    setDragOffset(delta.x);
    setIsDragging(Math.abs(delta.x) > 10);
  };

  // Handle tap gesture
  const handleTap = () => {
    if (onTap) {
      onTap();
    } else if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  // Handle long press
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      setShowActions(!showActions);
    }
  };

  // Handle favorite toggle
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // Handle bookmark toggle
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Handle share
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Reset drag state when not dragging
  useEffect(() => {
    if (!isDragging) {
      setDragOffset(0);
    }
  }, [isDragging]);

  return (
    <TouchGestureHandler
      onSwipe={handleSwipe}
      onTap={handleTap}
      onLongPress={handleLongPress}
      onPan={handlePan}
      className={`mobile-card-container ${className}`}
    >
      <motion.div
        ref={cardRef}
        className="mobile-card"
        style={{
          transform: `translateX(${dragOffset}px)`,
        }}
        animate={{
          scale: isDragging ? 0.98 : 1,
          rotateY: dragOffset * 0.1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Card Header */}
        <div className="mobile-card-header">
          {image && (
            <div className="mobile-card-image">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Actions */}
              <div className="mobile-card-overlay">
                {favoritable && (
                  <button
                    onClick={handleFavorite}
                    className={`mobile-action-btn ${isFavorited ? 'active' : ''}`}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                )}
                
                {bookmarkable && (
                  <button
                    onClick={handleBookmark}
                    className={`mobile-action-btn ${isBookmarked ? 'active' : ''}`}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                )}
                
                {shareable && (
                  <button
                    onClick={handleShare}
                    className="mobile-action-btn"
                    aria-label="Share"
                  >
                    <Share2 size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="mobile-card-title-section">
            <h3 className="mobile-card-title">{title}</h3>
            {subtitle && (
              <p className="mobile-card-subtitle">{subtitle}</p>
            )}
            
            <button
              onClick={() => setShowActions(!showActions)}
              className="mobile-card-menu"
              aria-label="More options"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="mobile-card-content">
          <p className={`mobile-card-description ${isExpanded ? 'expanded' : ''}`}>
            {description}
          </p>
          
          {expandable && description.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mobile-expand-btn"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          
          {tags.length > 0 && (
            <div className="mobile-card-tags">
              {tags.map((tag, index) => (
                <span key={index} className="mobile-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {children && (
            <div className="mobile-card-children">
              {children}
            </div>
          )}
        </div>

        {/* Card Actions */}
        <AnimatePresence>
          {(showActions || actions.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-card-actions"
            >
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`mobile-action-button ${action.variant || 'secondary'}`}
                >
                  {action.icon && (
                    <span className="mobile-action-icon">
                      {action.icon}
                    </span>
                  )}
                  {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe Indicators */}
        {(onSwipeLeft || onSwipeRight) && (
          <div className="mobile-swipe-indicators">
            {onSwipeLeft && (
              <div className="swipe-indicator left">
                <ChevronLeft size={24} />
              </div>
            )}
            {onSwipeRight && (
              <div className="swipe-indicator right">
                <ChevronRight size={24} />
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Styles */}
      <style>{`
        .mobile-card-container {
          position: relative;
          width: 100%;
          margin-bottom: 1rem;
        }
        
        .mobile-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .mobile-card:active {
          transform: scale(0.98);
        }
        
        .mobile-card-header {
          position: relative;
        }
        
        .mobile-card-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        
        .mobile-card-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
        }
        
        .mobile-action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .mobile-action-btn:hover,
        .mobile-action-btn:focus {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }
        
        .mobile-action-btn.active {
          background: rgba(239, 68, 68, 0.8);
          color: white;
        }
        
        .mobile-card-title-section {
          padding: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        
        .mobile-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0;
          flex: 1;
          line-height: 1.4;
        }
        
        .mobile-card-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
          margin: 4px 0 0 0;
        }
        
        .mobile-card-menu {
          background: none;
          border: none;
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .mobile-card-menu:hover,
        .mobile-card-menu:focus {
          background: rgba(0, 0, 0, 0.1);
          color: var(--text-primary, #1f2937);
        }
        
        .mobile-card-content {
          padding: 0 16px 16px;
        }
        
        .mobile-card-description {
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--text-secondary, #6b7280);
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .mobile-card-description.expanded {
          -webkit-line-clamp: unset;
          display: block;
        }
        
        .mobile-expand-btn {
          background: none;
          border: none;
          color: var(--accent-color, #3b82f6);
          font-size: 0.875rem;
          cursor: pointer;
          padding: 0;
          margin-bottom: 12px;
          font-weight: 500;
        }
        
        .mobile-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .mobile-tag {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-color, #3b82f6);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .mobile-card-children {
          margin-top: 12px;
        }
        
        .mobile-card-actions {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .mobile-action-button {
          flex: 1;
          min-width: 80px;
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .mobile-action-button.primary {
          background: var(--accent-color, #3b82f6);
          color: white;
        }
        
        .mobile-action-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary, #1f2937);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-action-button.ghost {
          background: transparent;
          color: var(--accent-color, #3b82f6);
        }
        
        .mobile-action-button:hover,
        .mobile-action-button:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .mobile-action-icon {
          display: flex;
          align-items: center;
        }
        
        .mobile-swipe-indicators {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .mobile-card:hover .mobile-swipe-indicators {
          opacity: 0.6;
        }
        
        .swipe-indicator {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .mobile-card,
          .mobile-action-btn,
          .mobile-action-button {
            transition: none;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-card-title {
            font-size: 1.125rem;
          }
          
          .mobile-card-image {
            height: 160px;
          }
          
          .mobile-action-button {
            min-width: 70px;
            padding: 8px 12px;
            font-size: 0.8rem;
          }
        }
        
        @media (forced-colors: active) {
          .mobile-card {
            background: Canvas;
            border: 1px solid CanvasText;
          }
          
          .mobile-action-btn,
          .mobile-action-button {
            background: ButtonFace;
            color: ButtonText;
            border: 1px solid ButtonText;
          }
        }
      `}</style>
    </TouchGestureHandler>
  );
};

export default MobileCard;
export type { MobileCardProps };