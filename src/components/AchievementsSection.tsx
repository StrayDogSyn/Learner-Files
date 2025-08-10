import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Trophy,
  Star,
  Award,
  Target,
  TrendingUp,
  Users,
  Code,
  Zap,
  Globe,
  Heart,
  Clock,
  DollarSign,
  Briefcase,
  BookOpen,
  Rocket,
  Shield,
  ThumbsUp,
  Coffee,
  GitBranch,
  Database
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  category: string;
  milestone?: string;
  date?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  achievements: string[];
  date: string;
  impact: string;
}

const achievements: Achievement[] = [
  {
    id: 'projects-completed',
    title: 'Projects Completed',
    description: 'Successfully delivered projects across various industries',
    value: 50,
    suffix: '+',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    category: 'Professional',
    milestone: 'Reached 50 completed projects milestone',
    date: '2024'
  },
  {
    id: 'client-satisfaction',
    title: 'Client Satisfaction',
    description: 'Average client satisfaction rating across all projects',
    value: 98,
    suffix: '%',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-pink-500/20',
    category: 'Quality',
    milestone: 'Maintained 98% satisfaction rate',
    date: '2024'
  },
  {
    id: 'years-experience',
    title: 'Years of Experience',
    description: 'Professional software development experience',
    value: 6,
    suffix: '+',
    icon: <Clock className="w-6 h-6" />,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-emerald-500/20',
    category: 'Experience',
    milestone: 'Senior developer milestone achieved',
    date: '2024'
  },
  {
    id: 'technologies-mastered',
    title: 'Technologies Mastered',
    description: 'Programming languages, frameworks, and tools',
    value: 25,
    suffix: '+',
    icon: <Code className="w-6 h-6" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    category: 'Technical',
    milestone: 'Full-stack expertise achieved',
    date: '2023'
  },
  {
    id: 'code-commits',
    title: 'Code Commits',
    description: 'Total commits across all repositories',
    value: 2500,
    suffix: '+',
    icon: <GitBranch className="w-6 h-6" />,
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-red-500/20',
    category: 'Development',
    milestone: 'Consistent daily coding streak',
    date: '2024'
  },
  {
    id: 'users-impacted',
    title: 'Users Impacted',
    description: 'Total users served by applications built',
    value: 100000,
    suffix: '+',
    icon: <Users className="w-6 h-6" />,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    category: 'Impact',
    milestone: 'Reached 100K users milestone',
    date: '2024'
  },
  {
    id: 'performance-improvement',
    title: 'Avg Performance Boost',
    description: 'Average performance improvement in optimized applications',
    value: 65,
    suffix: '%',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    category: 'Optimization',
    milestone: 'Performance optimization expert',
    date: '2023'
  },
  {
    id: 'certifications',
    title: 'Professional Certifications',
    description: 'Industry-recognized certifications and credentials',
    value: 8,
    suffix: '',
    icon: <Award className="w-6 h-6" />,
    color: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    category: 'Credentials',
    milestone: 'AWS Solutions Architect Professional',
    date: '2022'
  }
];

const milestones: Milestone[] = [
  {
    id: 'aws-certification',
    title: 'AWS Solutions Architect Professional',
    description: 'Achieved the highest level AWS certification with top 5% score globally',
    icon: <Shield className="w-8 h-8" />,
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-yellow-500/20',
    achievements: ['Top 5% score globally', 'Advanced cloud architecture expertise', 'Security and compliance mastery'],
    date: 'March 2022',
    impact: 'Enabled enterprise-level cloud solutions for clients'
  },
  {
    id: 'startup-success',
    title: 'Startup Technical Co-Founder',
    description: 'Co-founded a successful AI startup that reached $1M ARR',
    icon: <Rocket className="w-8 h-8" />,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-emerald-500/20',
    achievements: ['$1M ARR achieved', 'Led technical team of 12', 'Successful Series A funding'],
    date: 'June 2023',
    impact: 'Created 25 jobs and revolutionized industry workflows'
  },
  {
    id: 'open-source',
    title: 'Open Source Contributor',
    description: 'Contributed to major open source projects with 10K+ stars',
    icon: <Star className="w-8 h-8" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    achievements: ['10K+ GitHub stars', 'Core contributor to React ecosystem', 'Maintainer of popular libraries'],
    date: 'Ongoing',
    impact: 'Helped thousands of developers worldwide'
  },
  {
    id: 'performance-record',
    title: 'Performance Optimization Record',
    description: 'Achieved 95% performance improvement in legacy system',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    achievements: ['95% performance boost', 'Reduced server costs by 70%', 'Zero downtime migration'],
    date: 'September 2023',
    impact: 'Saved client $500K annually in infrastructure costs'
  }
];

const AnimatedCounter: React.FC<{ value: number; suffix: string; duration?: number }> = ({ 
  value, 
  suffix, 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
      const startTime = Date.now();
      const startValue = 0;
      
      const updateCount = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(value);
        }
      };
      
      requestAnimationFrame(updateCount);
    }
  }, [isInView, value, duration, isVisible]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement; index: number }> = ({ achievement, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        p-6 rounded-2xl backdrop-blur-xl border border-white/10
        bg-gradient-to-br ${achievement.gradient}
        shadow-lg hover:shadow-2xl transition-all duration-500
        hover:border-white/20 hover:-translate-y-2 hover:scale-105
      `}>
        {/* Icon & Category */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/10 ${achievement.color} group-hover:scale-110 transition-transform duration-300`}>
            {achievement.icon}
          </div>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {achievement.category}
          </span>
        </div>

        {/* Value */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-white mb-2">
            <AnimatedCounter value={achievement.value} suffix={achievement.suffix} />
          </div>
          <h3 className="text-lg font-semibold text-white/90">{achievement.title}</h3>
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm text-center mb-4 leading-relaxed">
          {achievement.description}
        </p>

        {/* Milestone */}
        {achievement.milestone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center mb-2">
                <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-xs font-semibold text-white/80">Milestone</span>
              </div>
              <p className="text-xs text-white/60">{achievement.milestone}</p>
              {achievement.date && (
                <p className="text-xs text-white/50 mt-1">{achievement.date}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Floating Elements */}
        <motion.div
          animate={isHovered ? { y: -5, rotate: 10, scale: 1.1 } : { y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 opacity-20"
        >
          <Star className="w-5 h-5 text-white" />
        </motion.div>

        {/* Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${achievement.gradient}
          blur-xl transition-opacity duration-500 -z-10
        `} />
      </div>
    </motion.div>
  );
};

const MilestoneCard: React.FC<{ milestone: Milestone; index: number }> = ({ milestone, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative"
    >
      <div className={`
        p-8 rounded-2xl backdrop-blur-xl border border-white/10
        bg-gradient-to-br ${milestone.gradient}
        shadow-xl hover:shadow-2xl transition-all duration-500
        hover:border-white/20 cursor-pointer
      `}
      onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-xl bg-white/10 ${milestone.color}`}>
              {milestone.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{milestone.title}</h3>
              <p className="text-white/60 text-sm">{milestone.date}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrendingUp className="w-5 h-5 text-white/60" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-white/80 mb-6 leading-relaxed">
          {milestone.description}
        </p>

        {/* Achievements */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center">
            <Award className="w-4 h-4 mr-2 text-yellow-400" />
            Key Achievements
          </h4>
          <ul className="space-y-2">
            {milestone.achievements.slice(0, isExpanded ? milestone.achievements.length : 2).map((achievement, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="flex items-start text-white/70 text-sm"
              >
                <ThumbsUp className="w-3 h-3 mt-1 mr-3 text-green-400 flex-shrink-0" />
                {achievement}
              </motion.li>
            ))}
          </ul>
          {milestone.achievements.length > 2 && !isExpanded && (
            <p className="text-xs text-white/50 mt-2">Click to see more...</p>
          )}
        </div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isExpanded ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-400" />
              Impact
            </h4>
            <p className="text-white/70 text-sm">{milestone.impact}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AchievementsSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-yellow-900/20 to-slate-900" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-red-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">Achievements &amp; Milestones</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proven Track Record of
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Excellence &amp; Impact
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Measurable results and significant milestones that demonstrate my commitment to 
            delivering exceptional value and driving meaningful impact.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold text-white mb-8 flex items-center"
          >
            <Target className="w-6 h-6 mr-3 text-blue-400" />
            Key Metrics &amp; Achievements
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl font-bold text-white mb-8 flex items-center"
          >
            <Rocket className="w-6 h-6 mr-3 text-purple-400" />
            Major Milestones &amp; Recognition
          </motion.h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Achieve Great Results Together?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              These achievements represent just the beginning. Let's work together to create 
              something extraordinary for your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-8 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-yellow-500 to-orange-500
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-300
                "
              >
                Start Your Project
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-8 py-3 rounded-xl font-semibold
                  bg-white/10 hover:bg-white/20 text-white
                  border border-white/20 hover:border-white/30
                  backdrop-blur-sm transition-all duration-300
                "
              >
                View Case Studies
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;