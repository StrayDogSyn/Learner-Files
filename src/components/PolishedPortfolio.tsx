import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { getOptimizedAnimationSettings, prefersReducedMotion } from '../utils/performanceOptimizations';

// Import all the Phase 8 components
import { GlassContainer, GlassCard, GlassButton, GlassNav, GlassModal, GlassInput, GlassTooltip, GlassBadge } from './GlassmorphicEnhancements';
import { ShimmerContainer, ShimmerText, ShimmerCard, RevealAnimation, StaggeredReveal, TypewriterEffect } from './ShimmerAnimations';
import { AdvancedHover, MetallicButton, FloatingCard, NeonGlow, ParticleHover } from './AdvancedHoverEffects';
import { ParallaxContainer, ParallaxHero, ScrollTriggeredParallax, MouseParallax } from './ParallaxEffects';
import { PageTransition, LoadingTransition, StaggeredEntrance, FlipCardTransition } from './SmoothPageTransitions';

interface PolishedPortfolioProps {
  className?: string;
}

export const PolishedPortfolio: React.FC<PolishedPortfolioProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [animationSettings, setAnimationSettings] = useState(getOptimizedAnimationSettings());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update animation settings based on device performance
    setAnimationSettings(getOptimizedAnimationSettings());
  }, []);

  const projects = [
    {
      id: 1,
      title: 'AI-Powered Analytics Dashboard',
      description: 'Advanced data visualization with machine learning insights',
      tech: ['React', 'TypeScript', 'D