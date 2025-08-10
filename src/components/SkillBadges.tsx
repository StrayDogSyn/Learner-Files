import React from 'react';
import { motion } from 'framer-motion';

interface SkillBadge {
  name: string;
  icon: string;
  color: string;
  category: 'frontend' | 'backend' | 'ai' | 'tools';
}

const skillBadges: SkillBadge[] = [
  // Frontend
  { name: 'React', icon: '⚛️', color: '#61DAFB', category: 'frontend' },
  { name: 'TypeScript', icon: '📘', color: '#3178C6', category: 'frontend' },
  { name: 'Vue.js', icon: '💚', color: '#4FC08D', category: 'frontend' },
  { name: 'Tailwind', icon: '🎨', color: '#06B6D4', category: 'frontend' },
  { name: 'Three.js', icon: '🎲', color: '#000000', category: 'frontend' },
  
  // Backend
  { name: 'Node.js', icon: '🟢', color: '#339933', category: 'backend' },
  { name: 'Python', icon: '🐍', color: '#3776AB', category: 'backend' },
  { name: 'Express', icon: '🚀', color: '#000000', category: 'backend' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791', category: 'backend' },
  { name: 'MongoDB', icon: '🍃', color: '#47A248', category: 'backend' },
  
  // AI/ML
  { name: 'OpenAI', icon: '🧠', color: '#50C878', category: 'ai' },
  { name: 'TensorFlow', icon: '🔥', color: '#FF6F00', category: 'ai' },
  { name: 'PyTorch', icon: '⚡', color: '#EE4C2C', category: 'ai' },
  { name: 'Hugging Face', icon: '🤗', color: '#FFD21E', category: 'ai' },
  { name: 'LangChain', icon: '🔗', color: '#50C878', category: 'ai' },
  
  // Tools
  { name: 'Docker', icon: '🐳', color: '#2496ED', category: 'tools' },
  { name: 'Git', icon: '📝', color: '#F05032', category: 'tools' },
  { name: 'AWS', icon: '☁️', color: '#FF9900', category: 'tools' },
  { name: 'Vercel', icon: '▲', color: '#000000', category: 'tools' },
  { name: 'Supabase', icon: '⚡', color: '#3ECF8E', category: 'tools' },
];

const categoryColors = {
  frontend: 'rgba(97, 218, 251, 0.2)',
  backend: 'rgba(51, 153, 51, 0.2)',
  ai: 'rgba(80, 200, 120, 0.2)',
  tools: 'rgba(255, 153, 0, 0.2)'
};

const SkillBadges: React.FC = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      {/* Rotating skill badges */}
      <motion.div
        className="flex gap-4 absolute whitespace-nowrap"
        animate={{
          x: [0, -2000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Duplicate the array to create seamless loop */}
        {[...skillBadges, ...skillBadges, ...skillBadges].map((skill, index) => (
          <motion.div
            key={`${skill.name}-${index}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${categoryColors[skill.category]}, rgba(255, 255, 255, 0.1))`,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${skill.color}40`,
              boxShadow: `0 4px 15px ${skill.color}20`
            }}
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              boxShadow: `0 8px 25px ${skill.color}40`
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">{skill.icon}</span>
            <span 
              className="text-sm font-medium whitespace-nowrap"
              style={{ color: skill.color }}
            >
              {skill.name}
            </span>
            
            {/* Skill category indicator */}
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-charcoal-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-charcoal-black to-transparent z-10 pointer-events-none" />
      
      {/* Category legend */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4 text-xs text-medium-grey">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#61DAFB' }} />
          <span>Frontend</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#339933' }} />
          <span>Backend</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#50C878' }} />
          <span>AI/ML</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF9900' }} />
          <span>Tools</span>
        </div>
      </div>
    </div>
  );
};

export default SkillBadges;