import React from 'react';
import { motion } from 'framer-motion';
import { Star, Verified, Quote } from 'lucide-react';
import { UserTestimonial as TestimonialType } from '../../data/testimonials';

interface UserTestimonialProps {
  testimonial: TestimonialType;
  variant?: 'card' | 'compact' | 'featured';
  showProject?: boolean;
  className?: string;
}

interface TestimonialGridProps {
  testimonials: TestimonialType[];
  maxItems?: number;
  variant?: 'card' | 'compact' | 'featured';
  showProject?: boolean;
  className?: string;
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  rating, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  return (
    <div className="flex items-center space-x-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          }`}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">{rating} out of 5 stars</span>
    </div>
  );
};

const UserTestimonial: React.FC<UserTestimonialProps> = ({
  testimonial,
  variant = 'card',
  showProject = false,
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4';
      case 'featured':
        return 'p-6 border-2 border-hunter-green/20';
      default:
        return 'p-5';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`glassmorphic-card ${getVariantClasses()} h-full ${className}`}
    >
      {variant === 'featured' && (
        <div className="flex items-center justify-center mb-4">
          <Quote className="w-8 h-8 text-hunter-green opacity-60" aria-hidden="true" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-charcoal">
              {testimonial.name}
            </h4>
            {testimonial.verified && (
              <Verified 
                className="w-4 h-4 text-blue-500" 
                aria-label="Verified reviewer"
              />
            )}
          </div>
          
          <p className="text-sm text-charcoal opacity-70">
            {testimonial.role}
            {testimonial.company && (
              <span className="text-hunter-green"> @ {testimonial.company}</span>
            )}
          </p>
        </div>
        
        <StarRating rating={testimonial.rating} size={variant === 'compact' ? 'sm' : 'md'} />
      </div>
      
      <blockquote className="text-charcoal mb-4 leading-relaxed">
        "{testimonial.content}"
      </blockquote>
      
      <div className="flex items-center justify-between text-xs text-charcoal opacity-60">
        <time dateTime={testimonial.date}>
          {formatDate(testimonial.date)}
        </time>
        
        {showProject && testimonial.projectId && testimonial.projectId !== 'general' && (
          <span className="px-2 py-1 bg-hunter-green/10 text-hunter-green rounded-full">
            {testimonial.projectId}
          </span>
        )}
      </div>
      
      {testimonial.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {testimonial.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-charcoal/10 text-charcoal rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
};

export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  testimonials,
  maxItems = 6,
  variant = 'card',
  showProject = false,
  className = ''
}) => {
  const displayTestimonials = testimonials.slice(0, maxItems);
  
  if (displayTestimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-charcoal opacity-60">No testimonials available.</p>
      </div>
    );
  }
  
  const getGridClasses = () => {
    switch (variant) {
      case 'compact':
        return 'grid gap-4 md:grid-cols-2 lg:grid-cols-3';
      case 'featured':
        return 'grid gap-6 md:grid-cols-1 lg:grid-cols-2';
      default:
        return 'grid gap-5 md:grid-cols-2 lg:grid-cols-3';
    }
  };
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${getGridClasses()} ${className}`}
      aria-label="User testimonials"
    >
      {displayTestimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <UserTestimonial
            testimonial={testimonial}
            variant={variant}
            showProject={showProject}
          />
        </motion.div>
      ))}
    </motion.section>
  );
};

export const TestimonialStats: React.FC<{ 
  totalReviews: number; 
  averageRating: number;
  className?: string;
}> = ({ totalReviews, averageRating, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glassmorphic-card p-4 text-center ${className}`}
    >
      <div className="flex items-center justify-center space-x-2 mb-2">
        <StarRating rating={Math.round(averageRating)} size="lg" />
        <span className="text-2xl font-bold text-hunter-green">
          {averageRating.toFixed(1)}
        </span>
      </div>
      
      <p className="text-sm text-charcoal opacity-70">
        Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
      </p>
    </motion.div>
  );
};

export default UserTestimonial;