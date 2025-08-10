import React, { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Users,
  Code,
  Brain,
  Rocket,
  Star,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'experience' | 'education' | 'achievement';
  title: string;
  organization: string;
  location: string;
  period: {
    start: string;
    end: string;
  };
  description: string;
  highlights: string[];
  technologies?: string[];
  achievements?: string[];
  link?: string;
  color: string;
  gradient: string;
}

const timelineData: TimelineItem[] = [
  {
    id: 'current-role',
    type: 'experience',
    title: 'Senior Full-Stack Developer & AI Specialist',
    organization: 'Freelance / Consulting',
    location: 'Remote',
    period: {
      start: '2023',
      end: 'Present'
    },
    description: 'Leading AI integration projects and full-stack development for various clients, specializing in modern web technologies and machine learning solutions.',
    highlights: [
      'Developed 15+ AI-powered applications',
      'Increased client efficiency by 40% through automation',
      'Built scalable systems serving 100K+ users',
      'Mentored 10+ junior developers'
    ],
    technologies: ['React', 'Node.js', 'Python', 'TensorFlow', 'AWS', 'PostgreSQL'],
    achievements: [
      'Top 1% developer on multiple platforms',
      '98% client satisfaction rate',
      'Featured in tech publications'
    ],
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-blue-500/20'
  },
  {
    id: 'previous-role',
    type: 'experience',
    title: 'Lead Software Engineer',
    organization: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    period: {
      start: '2021',
      end: '2023'
    },
    description: 'Led a team of 8 developers in building enterprise-grade applications and implementing DevOps practices.',
    highlights: [
      'Reduced deployment time by 70%',
      'Implemented microservices architecture',
      'Led digital transformation initiatives',
      'Established coding standards and best practices'
    ],
    technologies: ['React', 'Node.js', 'Docker', 'Kubernetes', 'MongoDB', 'Redis'],
    achievements: [
      'Employee of the Year 2022',
      'Led team to 99.9% uptime',
      'Reduced technical debt by 60%'
    ],
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    id: 'masters-degree',
    type: 'education',
    title: 'Master of Science in Computer Science',
    organization: 'Stanford University',
    location: 'Stanford, CA',
    period: {
      start: '2019',
      end: '2021'
    },
    description: 'Specialized in Artificial Intelligence and Machine Learning with focus on deep learning and neural networks.',
    highlights: [
      'GPA: 3.9/4.0',
      'Research in Computer Vision',
      'Published 3 papers in top-tier conferences',
      'Teaching Assistant for AI courses'
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'CUDA', 'OpenCV', 'Jupyter'],
    achievements: [
      'Dean\'s List for 4 consecutive semesters',
      'Outstanding Graduate Student Award',
      'Best Paper Award at ICML 2021'
    ],
    link: 'https://stanford.edu',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'software-engineer',
    type: 'experience',
    title: 'Software Engineer',
    organization: 'StartupXYZ',
    location: 'Austin, TX',
    period: {
      start: '2018',
      end: '2019'
    },
    description: 'Full-stack development for a fast-growing fintech startup, building scalable web applications and APIs.',
    highlights: [
      'Built core payment processing system',
      'Implemented real-time analytics dashboard',
      'Optimized database queries (50% faster)',
      'Contributed to $2M Series A funding'
    ],
    technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Redis', 'Stripe API'],
    achievements: [
      'Key contributor to product launch',
      'Implemented security best practices',
      'Zero security incidents during tenure'
    ],
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: 'bachelors-degree',
    type: 'education',
    title: 'Bachelor of Science in Software Engineering',
    organization: 'University of Texas at Austin',
    location: 'Austin, TX',
    period: {
      start: '2014',
      end: '2018'
    },
    description: 'Comprehensive study of software engineering principles, algorithms, and system design.',
    highlights: [
      'Magna Cum Laude (GPA: 3.8/4.0)',
      'President of Computer Science Society',
      'Winner of 3 hackathons',
      'Internship at Google (Summer 2017)'
    ],
    technologies: ['Java', 'C++', 'Python', 'JavaScript', 'MySQL', 'Git'],
    achievements: [
      'Outstanding Senior Project Award',
      'ACM Programming Contest Finalist',
      'Google Summer of Code Participant'
    ],
    link: 'https://utexas.edu',
    color: 'text-teal-400',
    gradient: 'from-teal-500/20 to-green-500/20'
  },
  {
    id: 'certification',
    type: 'achievement',
    title: 'AWS Solutions Architect Professional',
    organization: 'Amazon Web Services',
    location: 'Online',
    period: {
      start: '2022',
      end: '2025'
    },
    description: 'Advanced certification demonstrating expertise in designing distributed systems on AWS.',
    highlights: [
      'Top 5% score globally',
      'Expertise in cloud architecture',
      'Advanced security and compliance',
      'Cost optimization strategies'
    ],
    achievements: [
      'Certified Solutions Architect',
      'Cloud Security Specialist',
      'DevOps Professional'
    ],
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  }
];

const TimelineItemComponent: React.FC<{ item: TimelineItem; index: number; isLast: boolean }> = ({ 
  item, 
  index, 
  isLast 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, margin: '-100px' });
  
  const getIcon = () => {
    switch (item.type) {
      case 'experience':
        return <Briefcase className="w-5 h-5" />;
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-start group`}
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-1/2 top-16 w-0.5 h-full bg-gradient-to-b from-white/20 to-transparent transform -translate-x-0.5 z-0" />
      )}

      {/* Content Card */}
      <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className={`
            p-6 rounded-2xl backdrop-blur-xl border border-white/10
            bg-gradient-to-br ${item.gradient}
            shadow-2xl hover:shadow-3xl transition-all duration-500
            hover:border-white/20 cursor-pointer
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white/10 ${item.color}`}>
                {getIcon()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">
                    {item.period.start} - {item.period.end}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">{item.location}</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-white/60" />
            </motion.div>
          </div>

          {/* Title & Organization */}
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <div className="flex items-center justify-between mb-4">
            <p className={`font-semibold ${item.color}`}>{item.organization}</p>
            {item.link && (
              <motion.a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
          </div>

          {/* Description */}
          <p className="text-white/70 mb-4 leading-relaxed">{item.description}</p>

          {/* Highlights */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Key Highlights
            </h4>
            <ul className="space-y-1">
              {item.highlights.slice(0, isExpanded ? item.highlights.length : 2).map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-start text-white/70 text-sm"
                >
                  <div className="w-1 h-1 rounded-full bg-white/50 mt-2 mr-3 flex-shrink-0" />
                  {highlight}
                </motion.li>
              ))}
            </ul>
            {item.highlights.length > 2 && !isExpanded && (
              <p className="text-xs text-white/50 mt-2">Click to see more...</p>
            )}
          </div>

          {/* Technologies */}
          {item.technologies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={isExpanded ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
            >
              <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md text-xs bg-white/10 text-white/70 backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements */}
          {item.achievements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={isExpanded ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </h4>
              <ul className="space-y-1">
                {item.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start text-white/70 text-sm">
                    <Star className="w-3 h-3 mt-1 mr-2 text-yellow-400 flex-shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Timeline Node */}
      <div className="absolute left-1/2 top-8 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`
            w-4 h-4 rounded-full border-4 border-white/20
            bg-gradient-to-r ${item.gradient}
            shadow-lg group-hover:scale-125 transition-transform duration-300
          `}
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.gradient} blur-md opacity-50`} />
        </motion.div>
      </div>

      {/* Empty space for alternating layout */}
      <div className="w-5/12" />
    </motion.div>
  );
};

const TimelineSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900" />
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
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
            <Rocket className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-white/80 text-sm font-medium">Professional Journey</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience &amp;
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Education Timeline
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            A comprehensive journey through my professional experience, educational background, 
            and key achievements that have shaped my expertise in technology and innovation.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="space-y-16">
            {timelineData.map((item, index) => (
              <TimelineItemComponent 
                key={item.id} 
                item={item} 
                index={index} 
                isLast={index === timelineData.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Years Experience', value: '6+', icon: <Briefcase className="w-6 h-6" /> },
            { label: 'Projects Completed', value: '50+', icon: <Code className="w-6 h-6" /> },
            { label: 'Technologies Mastered', value: '25+', icon: <Brain className="w-6 h-6" /> },
            { label: 'Happy Clients', value: '30+', icon: <Users className="w-6 h-6" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.9 + (index * 0.1) }}
              className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="text-blue-400 mb-2 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;