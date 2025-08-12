import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./css/responsive-utilities.css";
import "./css/accessibility.css";
import "./css/animations.css";

// Initialize accessibility utilities
import { announceToScreenReader } from "./utils/accessibility";
import { initializeCompatibility } from './utils/crossBrowserCompatibility';

// Add skip link to document
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Initialize accessibility utilities
// Preferences are automatically loaded in the constructor

// Initialize cross-browser compatibility
// Temporarily disabled to debug React.Children error
// initializeCompatibility();

// Announce page load
announceToScreenReader('Portfolio application loaded successfully');

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify user
                console.log('[PWA] New content available, please refresh.');
                
                // Optional: Show update notification
                if (window.confirm('New version available! Refresh to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
} else {
  console.log('[PWA] Service Worker not supported in this browser');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
