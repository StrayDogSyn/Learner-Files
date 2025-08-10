import React, { ReactNode, HTMLAttributes, useRef, useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface HoverEffectProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  effect?: 'glow' | 'lift' | 'tilt' | 'magnetic' | 'ripple' | 'morph' | 'hologram';
  intensity?: 'subtle' | 'medium' | 'strong';
  color?: 'blue' | 'purple' | 'pink' | 'gold' | 'silver' | 'rainbow';
  disabled?: boolean;
}

export const AdvancedHover: React.FC<HoverEffectProps> = ({
  children,
  effect = 'glow',
  intensity = 'medium',
  color = 'blue',
  disabled = false,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current || disabled) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const getColorClasses = () => {
    const colors = {
      blue: 'shadow-blue-500/50 border-blue-500/30',
      purple: 'shadow-purple-500/50 border-purple-500/30',
      pink: 'shadow-pink-500/50 border-pink-500/30',
      gold: 'shadow-yellow-500/50 border-yellow-500/30',
      silver: 'shadow-gray-400/50 border-gray-400/30',
      rainbow: 'shadow-pink-500/30 border-transparent'
    };
    return colors[color];
  };

  const getIntensityClasses = () => {
    const intensities = {
      subtle: 'hover:shadow-lg hover:scale-102',
      medium: 'hover:shadow-xl hover:scale-105',
      strong: 'hover:shadow-2xl hover:scale-110'
    };
    return intensities[intensity];
  };

  const getEffectClasses = () => {
    switch (effect) {
      case 'glow':
        return cn(
          'transition-all duration-300 ease-out',
          'hover:shadow-2xl',
          getColorClasses(),
          getIntensityClasses()
        );
      case 'lift':
        return cn(
          'transition-all duration-300 ease-out',
          'hover:-translate-y-2 hover:shadow-xl',
          getColorClasses()
        );
      case 'tilt':
        return cn(
          'transition-all duration-300 ease-out transform-gpu',
          'hover:rotate-2 hover:scale-105',
          getColorClasses()
        );
      case 'magnetic':
        return cn(
          'transition-all duration-200 ease-out transform-gpu',
          getColorClasses()
        );
      case 'ripple':
        return cn(
          'relative overflow-hidden transition-all duration-300',
          getColorClasses()
        );
      case 'morph':
        return cn(
          'transition-all duration-500 ease-out transform-gpu',
          'hover:rounded-3xl hover:scale-105',
          getColorClasses()
        );
      case 'hologram':
        return cn(
          'relative transition-all duration-300',
          'hover:shadow-2xl',
          color === 'rainbow' && 'hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-blue-500/10'
        );
      default:
        return getEffectClasses();
    }
  };

  const getMagneticStyle = () => {
    if (effect !== 'magnetic' || !isHovered || disabled) return {};
    
    const strength = intensity === 'subtle' ? 5 : intensity === 'medium' ? 10 : 15;
    const centerX = elementRef.current?.offsetWidth ? elementRef.current.offsetWidth / 2 : 0;
    const centerY = elementRef.current?.offsetHeight ? elementRef.current.offsetHeight / 2 : 0;
    
    const deltaX = (mousePosition.x - centerX) / centerX;
    const deltaY = (mousePosition.y - centerY) / centerY;
    
    return {
      transform: `translate(${deltaX * strength}px, ${deltaY * strength}px) scale(1.05)`
    };
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        getEffectClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={getMagneticStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {effect === 'ripple' && isHovered && (
        <div
          className="absolute inset-0 bg-white/20 rounded-full animate-ping"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100
          }}
        />
      )}
      
      {effect === 'hologram' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface MetallicButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'gold' | 'silver' | 'copper' | 'platinum';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export const MetallicButton: React.FC<MetallicButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  const variants = {
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 shadow-yellow-500/25',
    silver: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 hover:from-gray-400 hover:via-gray-500 hover:to-gray-600 shadow-gray-400/25',
    copper: 'bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 hover:from-orange-500 hover:via-red-500 hover:to-orange-600 shadow-orange-500/25',
    platinum: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray