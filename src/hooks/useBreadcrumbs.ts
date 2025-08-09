import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export const useBreadcrumbs = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const newBreadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      newBreadcrumbs.push({
        label,
        href: currentPath
      });
    });

    setBreadcrumbs(newBreadcrumbs);
  }, [location.pathname]);

  return breadcrumbs;
};
