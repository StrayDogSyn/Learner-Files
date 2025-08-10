import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ArrowRight, Star, Calendar, Tag } from 'lucide-react';

interface ResponsiveCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
  date?: string;
  rating?: number;
  href?: string;
  external?: boolean;
  featured?: boolean;
  variant?: 'default' | 'project' | 'blog' | 'testimonial';
  className?: string;
  onClick?: () => void;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  tags = [],
  date,
  rating,
  href,
  external = false,
  featured = false,
  variant = 'default',
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = (event: React.MouseEvent) => {
    if (onClick) {
      event.preventDefault();
      onClick();
    } else if (href) {
      if (external) {
        event.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      linkRef.current?.click();
    }
  };

  const cardClasses = `
    glass-card responsive-card
    ${variant === 'project' ? 'project-card' : ''}
    ${variant === 'blog' ? 'blog-card' : ''}
    ${variant === 'testimonial' ? 'testimonial-card' : ''}
    ${featured ? 'featured-card' : ''}
    ${isHovered || isFocused ? 'card-hover' : ''}
    ${className}
  `;

  const CardContent = () => (
    <>
      {/* Image Section */}
      {imageUrl && (
        <div className="card-image-container relative overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="image-placeholder animate-pulse">
              <div className="w-full h-full bg-gradient-to-br from-charcoal-800 to-charcoal-900 flex items-center justify-center">
                <div className="loading-spinner" aria-hidden="true" />
              </div>
            </div>
          )}
          
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className={`card-image transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="lazy"
            decoding="async"
          />
          
          {imageError && (
            <div className="image-error flex items-center justify-center text-medium-grey">
              <span className="text-sm">Image unavailable</span>
            </div>
          )}
          
          {/* Image Overlay */}
          <div className="image-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3 featured-badge">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-core-hunter-green/90 backdrop-blur-sm">
                <Star size={12} className="text-emerald-accent" aria-hidden="true" />
                <span className="text-xs font-medium text-white">Featured</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="card-content p-fluid-sm space-y-3">
        {/* Header */}
        <div className="card-header">
          <div className="flex items-start justify-between gap-3">
            <h3 className="card-title heading-card text-fluid-lg font-bold leading-tight">
              {title}
            </h3>
            {(href || onClick) && (
              <div className="card-action-icon flex-shrink-0 mt-1">
                {external ? (
                  <ExternalLink 
                    size={18} 
                    className="text-silver-steel transition-colors duration-200" 
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight 
                    size={18} 
                    className="text-silver-steel transition-all duration-200 transform" 
                    aria-hidden="true"
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Meta Information */}
          {(date || rating) && (
            <div className="card-meta flex items-center gap-4 mt-2">
              {date && (
                <div className="flex items-center gap-1 text-medium-grey">
                  <Calendar size={14} aria-hidden="true" />
                  <time className="text-caption" dateTime={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              
              {rating && (
                <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < rating 
                          ? 'text-emerald-accent fill-current' 
                          : 'text-medium-grey'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="sr-only">{rating} out of 5 stars</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="card-description text-fluid-base text-light-grey leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="card-tags">
            <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-pill inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium glass-container-success"
                  role="listitem"
                >
                  <Tag size={10} aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (href || onClick) {
    return (
      <article
        ref={cardRef}
        className={cardClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <a
          ref={linkRef}
          href={href}
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="card-link block w-full h-full focus-visible"
          aria-describedby={`card-desc-${title.replace(/\s+/g, '-').toLowerCase()}`}
          {...(external && {
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `${title} (opens in new tab)`
          })}
        >
          <CardContent />
        </a>
        <div id={`card-desc-${title.replace(/\s+/g, '-').toLowerCase()}`} className="sr-only">
          {description}
        </div>
      </article>
    );
  }

  return (
    <article ref={cardRef} className={cardClasses}>
      <CardContent />
    </article>
  );
};

// Styles component
const ResponsiveCardStyles = () => (
  <style>{`
    .responsive-card {
      position: relative;
      transition: all 0.3s var(--easing-glass);
      transform-origin: center;
      will-change: transform, box-shadow;
    }
    
    .responsive-card:hover,
    .responsive-card.card-hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 8px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .card-link {
      text-decoration: none;
      color: inherit;
      border-radius: inherit;
    }
    
    .card-link:focus-visible {
      outline: 3px solid var(--a11y-focus-ring);
      outline-offset: 4px;
    }
    
    .card-image-container {
      aspect-ratio: 16 / 9;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    
    .image-placeholder,
    .image-error {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--charcoal-600);
      border-top: 2px solid var(--silver-steel);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .card-hover .image-overlay {
      opacity: 1;
    }
    
    .card-hover .card-action-icon svg {
      transform: translateX(4px);
      color: var(--emerald-accent);
    }
    
    .featured-card {
      border: 1px solid var(--core-hunter-green);
      box-shadow: 
        0 0 20px rgba(53, 94, 59, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .featured-badge {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    
    .project-card {
      border-left: 3px solid var(--emerald-accent);
    }
    
    .blog-card {
      border-left: 3px solid var(--silver-steel);
    }
    
    .testimonial-card {
      border-left: 3px solid var(--core-hunter-green);
    }
    
    .tag-pill {
      transition: all 0.2s ease;
    }
    
    .card-hover .tag-pill {
      background: rgba(53, 94, 59, 0.2);
      border-color: var(--core-hunter-green);
      color: var(--emerald-accent);
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(53, 94, 59, 0.5);
      }
      50% {
        box-shadow: 0 0 15px rgba(53, 94, 59, 0.8);
      }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .responsive-card {
        margin-bottom: var(--space-md);
      }
      
      .card-content {
        padding: var(--space-sm);
      }
      
      .card-image-container {
        aspect-ratio: 4 / 3;
      }
      
      .responsive-card:hover {
        transform: translateY(-2px) scale(1.01);
      }
    }
    
    @media (max-width: 480px) {
      .card-header {
        flex-direction: column;
        gap: var(--space-xs);
      }
      
      .card-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-xs);
      }
      
      .card-tags .tag-pill {
        font-size: 0.75rem;
      }
    }
    
    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .responsive-card,
      .card-action-icon svg,
      .image-overlay,
      .tag-pill {
        transition: none;
      }
      
      .responsive-card:hover {
        transform: none;
      }
      
      .loading-spinner {
        animation: none;
      }
      
      .featured-badge {
        animation: none;
      }
    }
    
    @media (forced-colors: active) {
      .responsive-card {
        border: 1px solid CanvasText;
        background: Canvas;
      }
      
      .card-link:focus-visible {
        outline: 3px solid Highlight;
      }
      
      .tag-pill {
        border: 1px solid CanvasText;
        background: ButtonFace;
        color: ButtonText;
      }
    }
    
    /* High contrast mode */
    @media (prefers-contrast: high) {
      .responsive-card {
        border: 2px solid var(--silver-steel);
      }
      
      .card-title {
        color: var(--pure-white);
      }
      
      .card-description {
        color: var(--light-grey);
      }
    }
    
    /* Print styles */
    @media print {
      .responsive-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #000;
      }
      
      .card-action-icon {
        display: none;
      }
    }
  `}</style>
);

export default ResponsiveCard;
export { ResponsiveCardStyles };