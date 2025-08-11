import React from 'react';
import { ProjectCardSkeleton } from './ui/LoadingSkeleton';

// Lazy load the FeaturedProjects component
const FeaturedProjects = React.lazy(() => import('./FeaturedProjects'));

// Fallback component for FeaturedProjects
const FeaturedProjectsFallback: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Loading Flagship AI Solutions...</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-hunter-green-400 to-hunter-green-600 mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
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