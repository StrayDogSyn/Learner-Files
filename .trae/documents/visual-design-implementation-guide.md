# Visual Design System - Implementation Guide

## 1. Setup and Dependencies

### 1.1 Required Dependencies

```bash
# Core dependencies
npm install framer-motion@11 three@0.158 @react-three/fiber@8.15
npm install lucide-react@0.294 clsx@2.0 tailwind-merge@2.0

# Development dependencies
npm install -D @types/three@0.158 autoprefixer@10.4 postcss@8.4
```

### 1.2 Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0F172A',
          600: '#0c1220',
          700: '#0a0f1a',
          800: '#080d15',
          900: '#060a10',
          950: '#040609',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'particle': 'particle 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
```

## 2. Glassmorphism Implementation

### 2.1 Advanced Glass Effects Hook

```typescript
// src/hooks/useGlassEffect.ts
import { useMemo } from 'react';
import { clsx } from 'clsx';

export interface GlassConfig {
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  opacity?: number;
  border?: boolean;
  borderOpacity?: number;
  gradient?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animation?: 'none' | 'float' | 'pulse' | 'glow' | 'shimmer';
  intensity?: 'subtle' | 'medium' | 'strong';
}

const glassPresets = {
  card: {
    blur: 'lg',
    opacity: 0.1,
    border: true,
    borderOpacity: 0.2,
    gradient: true,
    shadow: 'xl',
    animation: 'none',
    intensity: 'medium'
  },
  modal: {
    blur: '2xl',
    opacity: 0.15,
    border: true,
    borderOpacity: 0.3,
    gradient: true,
    shadow: '2xl',
    animation: 'float',
    intensity: 'strong'
  },
  navigation: {
    blur: 'xl',
    opacity: 0.08,
    border: true,
    borderOpacity: 0.15,
    gradient: false,
    shadow: 'lg',
    animation: 'none',
    intensity: 'subtle'
  },
  button: {
    blur: 'md',
    opacity: 0.12,
    border: true,
    borderOpacity: 0.25,
    gradient: true,
    shadow: 'lg',
    animation: 'glow',
    intensity: 'medium'
  }
} as const;

export const useGlassEffect = (config: GlassConfig | keyof typeof glassPresets) => {
  const glassConfig = typeof config === 'string' ? glassPresets[config] : config;
  
  const classes = useMemo(() => {
    const classNames: string[] = [];
    
    // Backdrop blur
    if (glassConfig.blur) {
      classNames.push(`backdrop-blur-${glassConfig.blur}`);
    }
    
    // Background with opacity
    if (glassConfig.opacity) {
      const opacityValue = Math.round(glassConfig.opacity * 100);
      classNames.push(`bg-white/${opacityValue}`);
    }
    
    // Border
    if (glassConfig.border) {
      classNames.push('border');
      if (glassConfig.borderOpacity) {
        const borderOpacity = Math.round(glassConfig.borderOpacity * 100);
        classNames.push(`border-white/${borderOpacity}`);
      }
    }
    
    // Gradient overlay
    if (glassConfig.gradient) {
      classNames.push('bg-gradient-to-br', 'from-white/10', 'to-white/5');
    }
    
    // Shadow
    if (glassConfig.shadow) {
      classNames.push(`shadow-${glassConfig.shadow}`);
      switch (glassConfig.intensity) {
        case 'subtle':
          classNames.push('shadow-black/10');
          break;
        case 'medium':
          classNames.push('shadow-black/20');
          break;
        case 'strong':
          classNames.push('shadow-black/30');
          break;
      }
    }
    
    // Animations
    if (glassConfig.animation && glassConfig.animation !== 'none') {
      classNames.push('transition-all', 'duration-300');
      
      switch (glassConfig.animation) {
        case 'float':
          classNames.push('animate-float');
          break;
        case 'pulse':
          classNames.push('hover:scale-105');
          break;
        case 'glow':
          classNames.push('animate-glow');
          break;
        case 'shimmer':
          classNames.push('animate-shimmer', 'relative', 'overflow-hidden');
          break;
      }
    }
    
    return clsx(classNames);
  }, [glassConfig]);
  
  const style = useMemo(() => {
    const styles: React.CSSProperties = {};
    
    if (glassConfig.blur) {
      const blurValues = {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px'
      };
      styles.backdropFilter = `blur(${blurValues[glassConfig.blur]})`;
      styles.WebkitBackdropFilter = `blur(${blurValues[glassConfig.blur]})`;
    }
    
    return styles;
  }, [glassConfig]);
  
  return { classes, style };
};
```

### 2.2 Glass Component Implementation

```typescript
// src/components/atoms/Glass/Glass.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGlassEffect, GlassConfig } from '@/hooks/useGlassEffect';
import { clsx } from 'clsx';

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  config?: GlassConfig | keyof typeof glassPresets;
  as?: keyof JSX.IntrinsicElements;
  animate?: boolean;
}

export const Glass: React.FC<GlassProps> = ({
  children,
  className,
  config = 'card',
  as: Component = 'div',
  animate = true,
  ...props
}) => {
  const { classes, style } = useGlassEffect(config);
  
  const combinedClassName = clsx(
    classes,
    'rounded-xl',
    className
  );
  
  if (animate) {
    return (
      <motion.div
        className={combinedClassName}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return React.createElement(
    Component,
    {
      className: combinedClassName,
      style,
      ...props
    },
    children
  );
};
```

## 3. Particle System Implementation

### 3.1 WebGL Particle System

```typescript
// src/components/effects/ParticleSystem.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleConfig {
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
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  opacity: number;
  life: number;
}

const ParticleField: React.FC<{ config: ParticleConfig }> = ({ config }) => {
  const meshRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < config.count; i++) {
      newParticles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * config.speed,
          (Math.random() - 0.5) * config.speed,
          (Math.random() - 0.5) * config.speed
        ),
        size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
        opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
        life: Math.random()
      });
    }
    
    setParticles(newParticles);
  }, [config]);
  
  // Mouse interaction
  useEffect(() => {
    if (!config.interactive) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [config.interactive]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const opacities = new Float32Array(particles.length);
    
    particles.forEach((particle, i) => {
      // Apply physics
      particle.velocity.y -= config.physics.gravity * delta;
      particle.velocity.multiplyScalar(config.physics.friction);
      
      // Mouse attraction
      if (config.interactive) {
        const mouseVector = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0);
        const distance = particle.position.distanceTo(mouseVector);
        const attraction = config.physics.attraction / (distance + 1);
        
        particle.velocity.add(
          mouseVector.sub(particle.position).normalize().multiplyScalar(attraction * delta)
        );
      }
      
      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Boundary wrapping
      if (particle.position.x > 10) particle.position.x = -10;
      if (particle.position.x < -10) particle.position.x = 10;
      if (particle.position.y > 10) particle.position.y = -10;
      if (particle.position.y < -10) particle.position.y = 10;
      
      // Update arrays
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      sizes[i] = particle.size;
      opacities[i] = particle.opacity;
    });
    
    meshRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    meshRef.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    meshRef.current.geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
  });
  
  const vertexShader = `
    attribute float size;
    attribute float opacity;
    varying float vOpacity;
    
    void main() {
      vOpacity = opacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const fragmentShader = `
    uniform vec3 color;
    varying float vOpacity;
    
    void main() {
      float distance = length(gl_PointCoord - vec2(0.5));
      if (distance > 0.5) discard;
      
      float alpha = 1.0 - (distance * 2.0);
      gl_FragColor = vec4(color, alpha * vOpacity);
    }
  `;
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          color: { value: new THREE.Color(config.color) }
        }}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const ParticleSystem: React.FC<{ config: ParticleConfig }> = ({ config }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ParticleField config={config} />
      </Canvas>
    </div>
  );
};
```

### 3.2 CSS Particle Fallback

```typescript
// src/components/effects/CSSParticles.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CSSParticleProps {
  count: number;
  color: string;
  size: [number, number];
  duration: [number, number];
}

export const CSSParticles: React.FC<CSSParticleProps> = ({
  count,
  color,
  size,
  duration
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);
  
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
```

## 4. 3D Transform Engine

### 4.1 3D Transform Hook

```typescript
// src/hooks/useTransform3D.ts
import { useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface Transform3DConfig {
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  scale?: number;
  duration?: number;
  easing?: string;
  trigger?: 'hover' | 'scroll' | 'click' | 'always';
}

export const useTransform3D = (config: Transform3DConfig) => {
  const [isActive, setIsActive] = useState(config.trigger === 'always');
  const [ref, inView] = useInView({ threshold: 0.3 });
  
  useEffect(() => {
    if (config.trigger === 'scroll') {
      setIsActive(inView);
    }
  }, [inView, config.trigger]);
  
  const transform3DStyle = {
    perspective: `${config.perspective || 1000}px`,
    transformStyle: 'preserve-3d' as const,
  };
  
  const elementStyle = {
    transform: isActive ? [
      config.rotateX ? `rotateX(${config.rotateX}deg)` : '',
      config.rotateY ? `rotateY(${config.rotateY}deg)` : '',
      config.rotateZ ? `rotateZ(${config.rotateZ}deg)` : '',
      config.translateX ? `translateX(${config.translateX}px)` : '',
      config.translateY ? `translateY(${config.translateY}px)` : '',
      config.translateZ ? `translateZ(${config.translateZ}px)` : '',
      config.scale ? `scale(${config.scale})` : '',
    ].filter(Boolean).join(' ') : 'none',
    transition: `transform ${config.duration || 300}ms ${config.easing || 'ease-out'}`,
    transformOrigin: 'center center',
  };
  
  const handlers = {
    onMouseEnter: () => config.trigger === 'hover' && setIsActive(true),
    onMouseLeave: () => config.trigger === 'hover' && setIsActive(false),
    onClick: () => config.trigger === 'click' && setIsActive(!isActive),
  };
  
  return {
    ref,
    containerStyle: transform3DStyle,
    elementStyle,
    handlers,
    isActive,
  };
};
```

### 4.2 3D Card Component

```typescript
// src/components/molecules/Card3D.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTransform3D } from '@/hooks/useTransform3D';
import { Glass } from '@/components/atoms/Glass';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  flipOnHover?: boolean;
  tiltOnHover?: boolean;
  floatAnimation?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className,
  flipOnHover = false,
  tiltOnHover = true,
  floatAnimation = false
}) => {
  const tiltTransform = useTransform3D({
    perspective: 1000,
    rotateX: tiltOnHover ? 5 : 0,
    rotateY: tiltOnHover ? 10 : 0,
    translateZ: tiltOnHover ? 20 : 0,
    scale: tiltOnHover ? 1.02 : 1,
    duration: 300,
    trigger: 'hover'
  });
  
  const flipTransform = useTransform3D({
    perspective: 1000,
    rotateY: flipOnHover ? 180 : 0,
    duration: 600,
    trigger: 'hover'
  });
  
  const activeTransform = flipOnHover ? flipTransform : tiltTransform;
  
  return (
    <div
      ref={activeTransform.ref}
      style={activeTransform.containerStyle}
      className={className}
    >
      <motion.div
        style={activeTransform.elementStyle}
        {...activeTransform.handlers}
        animate={floatAnimation ? {
          y: [0, -10, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}}
      >
        <Glass config="card" className="h-full">
          {children}
        </Glass>
      </motion.div>
    </div>
  );
};
```

## 5. Micro-Interaction Library

### 5.1 Micro-Interaction Hook

```typescript
// src/hooks/useMicroInteraction.ts
import { useState } from 'react';

interface MicroInteractionConfig {
  trigger: 'hover' | 'focus' | 'click' | 'active';
  effect: 'scale' | 'glow' | 'lift' | 'blur' | 'color' | 'rotate';
  intensity: 'subtle' | 'medium' | 'strong';
  duration: number;
  easing?: string;
}

const effectValues = {
  scale: {
    subtle: 1.02,
    medium: 1.05,
    strong: 1.1
  },
  lift: {
    subtle: -2,
    medium: -5,
    strong: -10
  },
  rotate: {
    subtle: 2,
    medium: 5,
    strong: 10
  },
  glow: {
    subtle: '0 0 10px rgba(59, 130, 246, 0.3)',
    medium: '0 0 20px rgba(59, 130, 246, 0.5)',
    strong: '0 0 30px rgba(59, 130, 246, 0.7)'
  }
};

export const useMicroInteraction = (config: MicroInteractionConfig) => {
  const [isActive, setIsActive] = useState(false);
  
  const getTransform = () => {
    if (!isActive) return 'none';
    
    const transforms: string[] = [];
    
    switch (config.effect) {
      case 'scale':
        transforms.push(`scale(${effectValues.scale[config.intensity]})`);
        break;
      case 'lift':
        transforms.push(`translateY(${effectValues.lift[config.intensity]}px)`);
        break;
      case 'rotate':
        transforms.push(`rotate(${effectValues.rotate[config.intensity]}deg)`);
        break;
    }
    
    return transforms.join(' ');
  };
  
  const getBoxShadow = () => {
    if (!isActive || config.effect !== 'glow') return 'none';
    return effectValues.glow[config.intensity];
  };
  
  const getFilter = () => {
    if (!isActive || config.effect !== 'blur') return 'none';
    const blurValues = { subtle: 2, medium: 4, strong: 8 };
    return `blur(${blurValues[config.intensity]}px)`;
  };
  
  const style = {
    transform: getTransform(),
    boxShadow: getBoxShadow(),
    filter: getFilter(),
    transition: `all ${config.duration}ms ${config.easing || 'ease-out'}`,
  };
  
  const handlers = {
    onMouseEnter: () => config.trigger === 'hover' && setIsActive(true),
    onMouseLeave: () => config.trigger === 'hover' && setIsActive(false),
    onFocus: () => config.trigger === 'focus' && setIsActive(true),
    onBlur: () => config.trigger === 'focus' && setIsActive(false),
    onMouseDown: () => config.trigger === 'active' && setIsActive(true),
    onMouseUp: () => config.trigger === 'active' && setIsActive(false),
    onClick: () => {
      if (config.trigger === 'click') {
        setIsActive(true);
        setTimeout(() => setIsActive(false), config.duration);
      }
    },
  };
  
  return { style, handlers, isActive };
};
```

### 5.2 Interactive Button Component

```typescript
// src/components/atoms/Button/InteractiveButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useMicroInteraction } from '@/hooks/useMicroInteraction';
import { Glass } from '@/components/atoms/Glass';
import { clsx } from 'clsx';

interface InteractiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  loading = false
}) => {
  const hoverInteraction = useMicroInteraction({
    trigger: 'hover',
    effect: 'scale',
    intensity: 'subtle',
    duration: 200
  });
  
  const clickInteraction = useMicroInteraction({
    trigger: 'active',
    effect: 'scale',
    intensity: 'subtle',
    duration: 100
  });
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    secondary: 'bg-gradient-to-r from-navy-500 to-navy-600 text-white',
    ghost: 'bg-transparent text-navy-500 border border-navy-500/20'
  };
  
  const combinedStyle = {
    ...hoverInteraction.style,
    transform: `${hoverInteraction.style.transform} ${clickInteraction.style.transform}`.trim()
  };
  
  return (
    <motion.button
      className={clsx(
        'relative overflow-hidden rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-amber-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={combinedStyle}
      onClick={onClick}
      disabled={disabled || loading}
      {...hoverInteraction.handlers}
      {...clickInteraction.handlers}
      whileTap={{ scale: 0.98 }}
    >
      {variant === 'ghost' ? (
        <Glass config="button" className="absolute inset-0" />
      ) : null}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  );
};
```

## 6. Video Showcase System

### 6.1 Custom Video Player

```typescript
// src/components/video/CustomVideoPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/atoms/Glass';
import { InteractiveButton } from '@/components/atoms/Button';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Settings,
  SkipBack, SkipForward, Download, Share2
} from 'lucide-react';

interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  thumbnail?: string;
}

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  chapters?: VideoChapter[];
  title?: string;
  description?: string;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  poster,
  chapters = [],
  title,
  description
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentChapter, setCurrentChapter] = useState<VideoChapter | null>(null);
  
  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    
    resetTimeout();
    
    return () => clearTimeout(timeout);
  }, [isPlaying]);
  
  // Update current time and chapter
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => {
      setCurrentTime(video.currentTime);
      
      // Find current chapter
      const chapter = chapters.find(ch => 
        video.currentTime >= ch.startTime && 
        video.currentTime < ch.startTime + ch.duration
      );
      setCurrentChapter(chapter || null);
    };
    
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [chapters]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const changeVolume = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (!isFullscreen) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  const jumpToChapter = (chapter: VideoChapter) => {
    handleSeek(chapter.startTime);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="relative group">
      <Glass config="modal" className="overflow-hidden">
        {/* Video Element */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
          
          {/* Play Button Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Chapter Indicator */}
          <AnimatePresence>
            {currentChapter && (
              <motion.div
                className="absolute top-4 left-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Glass config="navigation" className="px-3 py-2">
                  <p className="text-white text-sm font-medium">
                    {currentChapter.title}
                  </p>
                </Glass>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Glass config="navigation" className="p-4 space-y-3">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-500"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <InteractiveButton
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </InteractiveButton>
                      
                      <InteractiveButton variant="ghost" size="sm">
                        <SkipBack className="w-4 h-4" />
                      </InteractiveButton>
                      
                      <InteractiveButton variant="ghost" size="sm">
                        <SkipForward className="w-4 h-4" />
                      </InteractiveButton>
                      
                      <div className="flex items-center gap-2">
                        <InteractiveButton
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </InteractiveButton>
                        
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => changeVolume(Number(e.target.value))}
                          className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <InteractiveButton variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </InteractiveButton>
                      
                      <InteractiveButton variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </InteractiveButton>
                      
                      <InteractiveButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="w-4 h-4" />
                      </InteractiveButton>
                      
                      <InteractiveButton
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="w-4 h-4" />
                      </InteractiveButton>
                    </div>
                  </div>
                </Glass>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Video Info */}
        {(title || description) && (
          <div className="p-6">
            {title && (
              <h3 className="text-xl font-display font-semibold text-white mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-white/80">
                {description}
              </p>
            )}
          </div>
        )}
      </Glass>
      
      {/* Chapter Navigation */}
      {chapters.length > 0 && (
        <div className="mt-4">
          <Glass config="card" className="p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Chapters</h4>
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <motion.button
                  key={chapter.id}
                  className={clsx(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    currentChapter?.id === chapter.id
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-white/80 hover:bg-white/10'
                  )}
                  onClick={() => jumpToChapter(chapter)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{chapter.title}</span>
                    <span className="text-sm opacity-60">
                      {formatTime(chapter.startTime)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Glass>
        </div>
      )}
    </div>
  );
};
```

## 7. Usage Examples

### 7.1 Hero Section with All Effects

```typescript
// src/components/organisms/Hero/AdvancedHero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ParticleSystem } from '@/components/effects/ParticleSystem';
import { Glass } from '@/components/atoms/Glass';
import { Card3D } from '@/components/molecules/Card3D';
import { InteractiveButton } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';

export const AdvancedHero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <ParticleSystem
        config={{
          count: 100,
          size: [2, 6],
          speed: 0.5,
          color: '#3B82F6',
          opacity: [0.3, 0.8],
          interactive: true,
          physics: {
            gravity: 0.1,
            friction: 0.95,
            attraction: 0.3
          }
        }}
      />
      
      {/* Glassmorphism Navigation */}
      <Glass
        config="navigation"
        className="fixed top-0 left-0 right-0 z-50 p-4"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Typography variant="h3" className="gradient-text">
            Portfolio
          </Typography>
          <div className="flex gap-4">
            <InteractiveButton variant="ghost">About</InteractiveButton>
            <InteractiveButton variant="ghost">Projects</InteractiveButton>
            <InteractiveButton variant="primary">Contact</InteractiveButton>
          </div>
        </nav>
      </Glass>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography
            variant="h1"
            className="gradient-text mb-6"
          >
            Cutting-Edge Developer
          </Typography>
          
          <Typography
            variant="body1"
            className="text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Creating industry-leading web experiences with advanced glassmorphism,
            3D transforms, and interactive particle systems.
          </Typography>
          
          <div className="flex gap-4 justify-center">
            <InteractiveButton variant="primary" size="lg">
              View Projects
            </InteractiveButton>
            <InteractiveButton variant="ghost" size="lg">
              Download Resume
            </InteractiveButton>
          </div>
        </motion.div>
        
        {/* Floating 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {['Frontend', 'Backend', 'AI/ML'].map((skill, index) => (
            <Card3D
              key={skill}
              tiltOnHover
              floatAnimation
              className="h-32"
            >
              <motion.div
                className="h-full flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Typography variant="h3" className="text-white">
                  {skill}
                </Typography>
              </motion.div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 7.2 Project Grid with Flip Cards

```typescript
// src/components/organisms/ProjectGrid/InteractiveProjectGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card3D } from '@/components/molecules/Card3D';
import { Glass } from '@/components/atoms/Glass';
import { Typography } from '@/components/atoms/Typography';
import { InteractiveButton } from '@/components/atoms/Button';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface InteractiveProjectGridProps {
  projects: Project[];
}

export const InteractiveProjectGrid: React.FC<InteractiveProjectGridProps> = ({
  projects
}) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h2" className="gradient-text mb-4">
            Featured Projects
          </Typography>
          <Typography variant="body1" className="text-white/80 max-w-2xl mx-auto">
            Explore my latest work featuring cutting-edge technologies and innovative solutions.
          </Typography>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card3D flipOnHover className="h-96 group">
                {/* Front Side */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  <Typography variant="h3" className="text-white mb-2">
                    {project.title}
                  </Typography>
                  
                  <Typography variant="body2" className="text-white/80 flex-1">
                    {project.description}
                  </Typography>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Back Side */}
                <div className="absolute inset-0 p-6 flex flex-col justify-center items-center transform rotateY-180">
                  <Glass config="modal" className="w-full h-full flex flex-col justify-center items-center p-6">
                    <Typography variant="h3" className="text-white mb-4 text-center">
                      {project.title}
                    </Typography>
                    
                    <Typography variant="body2" className="text-white/80 text-center mb-6">
                      {project.description}
                    </Typography>
                    
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <InteractiveButton variant="primary" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </InteractiveButton>
                      )}
                      {project.githubUrl && (
                        <InteractiveButton variant="ghost" size="sm">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </InteractiveButton>
                      )}
                    </div>
                  </Glass>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

This implementation guide provides a comprehensive foundation for creating a cutting-edge visual design system with all the requested advanced features. Each component is modular, performant, and follows modern React best practices while delivering stunning visual effects.