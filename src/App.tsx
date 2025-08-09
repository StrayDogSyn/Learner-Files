import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Portfolio from "@/pages/Portfolio";
import Bio from "@/pages/Bio";
import Contact from "@/pages/Contact";
import Navigation from "@/components/Navigation";
import BrandLogo from "@/components/BrandLogo";
import "./css/brand-system.css";
import "./css/hero.css";
import "./css/projects.css";
import "./css/navigation.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-deep-black">
        {/* Brand Banner */}
        <motion.div 
          className="bg-gradient-to-r from-hunter-green/10 via-electric-blue/5 to-ai-purple/10 border-b border-hunter-green/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" showTagline={true} />
              <motion.div 
                className="hidden md:flex items-center gap-4 text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  AI Systems Online
                </span>
                <span>|</span>
                <span>Portfolio v2.0</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <Navigation />
        
        <main className="pt-16 lg:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/bio" element={<Bio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/other" element={<div className="text-center text-xl text-white">Other Page - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
