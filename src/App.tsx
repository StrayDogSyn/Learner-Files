import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { initializeFontLoading } from "@/utils/fontLoading";
// import { initializePWA } from "@/utils/pwa";
// import { performanceMonitor } from "@/utils/performance";
// import { ErrorBoundary } from "@/components/ErrorBoundary";
// import { initializeAnalytics, trackEvent } from "@/utils/analytics";
// import { MetaTagManager } from "@/utils/metaTags";
// import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import ChatbotWidget from "@/components/ChatbotWidget";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Portfolio from "@/pages/Portfolio";
import Bio from "@/pages/Bio";
import Contact from "@/pages/Contact";
import Navigation from "@/components/Navigation";
import BrandLogo from "@/components/BrandLogo";
import InteractivePortfolio from "@/components/InteractivePortfolio";
import ContentSections from "@/components/ContentSections";
import { PolishedPortfolio } from "@/components/PolishedPortfolio";
// Flagship Applications
import Calculator from "@/projects/Calculator";
import QuizNinja from "@/projects/QuizNinja";
import Countdown from "@/projects/Countdown";
import Knucklebones from "@/projects/Knucklebones";
import CompTIA from "@/projects/CompTIA";
import "./css/glassmorphic-design-system.css";
import "./css/brand-system.css";
import "./css/hero.css";
import "./css/projects.css";
import "./css/navigation.css";
import "./styles/theme-transitions.css";
import "./styles/animations.css";
import "./styles/accessibility.css";
import "./styles/performance-optimizations.css";

export default function App() {
  useEffect(() => {
    // Initialize optimized font loading
    initializeFontLoading();
    
    // Initialize PWA functionality
    // initializePWA();
    
    // Initialize performance monitoring (already initialized globally)
    // performanceMonitor is already running
    
    // Initialize Google Analytics
    // initializeAnalytics();
    
    // Initialize meta tags
    // const metaManager = new MetaTagManager();
    // metaManager.setDefaultTags({
    //   title: 'SOLO Portfolio - Performance Optimized',
    //   description: 'Professional portfolio showcasing advanced web development skills and interactive experiences.',
    //   keywords: 'portfolio, web development, react, typescript, performance optimization',
    //   author: 'SOLO Developer',
    //   ogTitle: 'SOLO Portfolio - Performance Optimized',
    //   ogDescription: 'Professional portfolio showcasing advanced web development skills and interactive experiences.',
    //   ogImage: '/images/og-image.jpg',
    //   twitterCard: 'summary_large_image',
    //   twitterTitle: 'SOLO Portfolio - Performance Optimized',
    //   twitterDescription: 'Professional portfolio showcasing advanced web development skills and interactive experiences.',
    //   twitterImage: '/images/twitter-image.jpg'
    // });
    
    // Track app initialization
    // trackEvent('app_initialized', {
    //   timestamp: Date.now(),
    //   user_agent: navigator.userAgent,
    //   screen_resolution: `${window.screen.width}x${window.screen.height}`,
    //   viewport_size: `${window.innerWidth}x${window.innerHeight}`
    // });
  }, []);

  return (
    // <ErrorBoundary>
    //   <AccessibilityProvider>
        <Router>
        <div className="min-h-screen glass-background-main">
          {/* Brand Banner */}
          <motion.div 
          className="glass-brand-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" showTagline={true} variant="straydog" />
              <motion.div 
                className="hidden md:flex items-center gap-4 text-xs text-medium-grey"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-accent rounded-full animate-pulse"></div>
                  AI Systems Online
                </span>
                <span className="text-gunmetal">|</span>
                <span>Portfolio v3.0</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <Navigation />
        
        <main id="main-content" className="pt-16 lg:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/bio" element={<Bio />} />
            <Route path="/contact" element={<Contact />} />
            {/* Flagship Applications Routes */}
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/quiz-ninja" element={<QuizNinja />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/knucklebones" element={<Knucklebones />} />
            <Route path="/comptia-trainer" element={<CompTIA />} />
            <Route path="/interactive" element={<InteractivePortfolio />} />
            <Route path="/content-sections" element={<ContentSections />} />
            <Route path="/polished" element={<PolishedPortfolio />} />
            <Route path="/other" element={<div className="text-center text-xl text-white">Other Page - Coming Soon</div>} />
          </Routes>
        </main>
        
        {/* Advanced Features */}
        <ChatbotWidget />
        </div>
      </Router>
    //   </AccessibilityProvider>
    // </ErrorBoundary>
  );
}
