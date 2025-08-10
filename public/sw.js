// StrayDog Syndications PWA Service Worker
// Provides offline functionality and caching for the portfolio

const CACHE_NAME = 'straydog-portfolio-v1.0.0';
const STATIC_CACHE = 'straydog-static-v1';
const DYNAMIC_CACHE = 'straydog-dynamic-v1';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logos/stray-gear.png',
  '/css/straydog-glassmorphic.css',
  '/css/modern.css',
  '/css/styles.css',
  // Core application files
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/Home.tsx',
  '/src/pages/Projects.tsx',
  '/src/pages/Portfolio.tsx',
  '/src/pages/Bio.tsx',
  '/src/pages/Contact.tsx'
];

// Dynamic assets that should be cached when accessed
const DYNAMIC_ASSETS = [
  '/src/pages/Dashboard.tsx',
  '/src/pages/Archive.tsx',
  '/src/components