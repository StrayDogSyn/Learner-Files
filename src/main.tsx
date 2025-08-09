import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./css/accessibility.css";

// Initialize accessibility utilities
import { accessibilityPreferences, screenReader } from "./utils/accessibility";
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
initializeCompatibility();

// Announce page load
screenReader.announce('Portfolio application loaded successfully');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
