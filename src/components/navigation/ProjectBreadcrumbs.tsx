import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface ProjectBreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

const ProjectBreadcrumbs: React.FC<ProjectBreadcrumbsProps> = ({ 
  customItems, 
  className = '' 
}) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: isLast
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glassmorphic-card p-3 mb-6 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={item.path} className="flex items-center">
              {index === 0 && (
                <Home 
                  className="w-4 h-4 mr-1 text-hunter-green" 
                  aria-hidden="true"
                />
              )}
              
              {isLast ? (
                <span 
                  className="text-hunter-green font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="text-charcoal hover:text-hunter-green transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-hunter-green focus:ring-opacity-50 rounded px-1"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </Link>
                  <ChevronRight 
                    className="w-4 h-4 mx-2 text-charcoal opacity-60" 
                    aria-hidden="true"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
};

export default ProjectBreadcrumbs;