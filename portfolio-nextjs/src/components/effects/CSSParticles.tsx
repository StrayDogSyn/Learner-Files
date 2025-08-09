'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CSSParticleProps {
  count: number;
  color: string;
  size: [number, number];
  duration: [number, number];
}

interface ParticleData {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export const CSSParticles: React.FC<CSSParticleProps> = ({
  count,
  color,
  size,
  duration
}) => {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: size[0] + Math.random() * (size[1] - size[0]),
      duration: duration[0] + Math.random() * (duration[1] - duration[0]),
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, [count, size, duration]);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
          }}
          animate={{
            y: ["100vh", "-100px"],
            rotate: [0, 360],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Hook to detect WebGL support
export const useWebGLSupport = () => {
  const [isSupported, setIsSupported] = useState(false);
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setIsSupported(!!gl);
  }, []);
  
  return isSupported;
};

// Combined particle component with fallback
interface AdaptiveParticlesProps {
  webglConfig: {
    count: number;
    size: [number, number];
    speed: number;
    color: string;
    opacity: [number, number];
    interactive: boolean;
    physics: {
      gravity: number;
      friction: number;
      attraction: number;
    };
  };
  cssConfig: {
    count: number;
    color: string;
    size: [number, number];
    duration: [number, number];
  };
}

export const AdaptiveParticles: React.FC<AdaptiveParticlesProps> = ({
  webglConfig,
  cssConfig
}) => {
  const webglSupported = useWebGLSupport();
  const [ParticleSystem, setParticleSystem] = useState<React.ComponentType<{ config: typeof webglConfig }> | null>(null);
  
  useEffect(() => {
    if (webglSupported) {
      import('./ParticleSystem').then((module) => {
        setParticleSystem(module.ParticleSystem);
      });
    }
  }, [webglSupported]);
  
  if (webglSupported && ParticleSystem) {
    return <ParticleSystem config={webglConfig} />;
  }
  
  return <CSSParticles {...cssConfig} />;
};