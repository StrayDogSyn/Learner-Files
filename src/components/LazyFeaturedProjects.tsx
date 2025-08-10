import React from 'react';
import { SectionSkeleton } from '../utils/lazyLoading.tsx';

// Lazy load the FeaturedProjects component
const FeaturedProjects = React.lazy(() => import('./FeaturedProjects'));

// Fallback component for FeaturedProjects
const FeaturedProjectsFallback: React.FC = () => (
  <SectionSkeleton 
    title="Loading Flagship AI Solutions..." 
    cardCount={4} 
  />
);

// Lazy wrapper for FeaturedProjects
const LazyFeaturedProjects: React.FC = () => {
  return (
    <React.Suspense fallback={<FeaturedProjectsFallback />}>
      <FeaturedProjects />
    </React.Suspense>
  );
};

export default LazyFeaturedProjects;
export { FeaturedProjectsFallback };