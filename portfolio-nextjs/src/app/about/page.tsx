'use client';

import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { EnhancedAbout } from '@/components/organisms/About/EnhancedAbout';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Glass } from '@/components/atoms/Glass';
import { Brain, Scale, Code2, Zap, Users, Target } from 'lucide-react';

const AboutPage = () => {
  const achievements = [
    {
      icon: Brain,
      title: "Claude 4.1 Integration Expert",
      description: "Pioneering AI-enhanced development workflows with 300% productivity gains",
      metric: "300% faster development"
    },
    {
      icon: Scale,
      title: "Justice Reform Technology",
      description: "Building AI systems that reduce bias and improve legal accessibility",
      metric: "40% bias reduction achieved"
    },
    {
      icon: Code2,
      title: "10x Developer Capabilities",
      description: "Leveraging AI to deliver enterprise-grade solutions at unprecedented speed",
      metric: "95+ Lighthouse scores"
    },
    {
      icon: Zap,
      title: "AI-Powered Innovation",
      description: "Creating intelligent systems that transform traditional workflows",
      metric: "50+ AI integrations"
    },
    {
      icon: Users,
      title: "Social Impact Focus",
      description: "Technology solutions that create meaningful change in justice systems",
      metric: "10,000+ users served"
    },
    {
      icon: Target,
      title: "Performance Excellence",
      description: "Delivering sub-1.5s load times and 99.9% uptime across all projects",
      metric: "99.9% uptime SLA"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen py-20">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h1" 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-amber-400 bg-clip-text text-transparent"
          >
            AI-Enhanced Full Stack Developer
          </Typography>
          <Typography 
            variant="h2" 
            className="text-2xl md:text-3xl text-blue-400 mb-8 font-semibold"
          >
            Specializing in Justice Reform Technology
          </Typography>
          <Typography 
            variant="body" 
            className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed"
          >
            Combining cutting-edge AI capabilities with deep technical expertise to build 
            transformative solutions for justice reform. I leverage Claude 4.1 and advanced 
            AI systems to create technology that reduces bias, improves accessibility, and 
            drives meaningful change in legal systems.
          </Typography>
        </motion.section>

        {/* Achievements Grid */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography 
            variant="h2" 
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            Core Expertise & Impact
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Glass className="p-6 h-full hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">
                          {achievement.metric}
                        </div>
                      </div>
                    </div>
                    <Typography variant="h3" className="text-xl font-semibold text-white mb-3">
                      {achievement.title}
                    </Typography>
                    <Typography variant="body" className="text-white/70">
                      {achievement.description}
                    </Typography>
                  </Glass>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Enhanced About Component */}
        <EnhancedAbout />

        {/* Mission Statement */}
        <motion.section 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Glass className="p-12 max-w-4xl mx-auto">
            <Typography 
              variant="h2" 
              className="text-3xl font-bold mb-6 text-white"
            >
              Mission: Technology for Justice
            </Typography>
            <Typography 
              variant="body" 
              className="text-xl text-white/80 leading-relaxed mb-6"
            >
              I believe technology should serve humanity&apos;s highest ideals. By combining 
              AI-enhanced development capabilities with a focus on justice reform, I create 
              solutions that don&apos;t just work—they make the world more fair, accessible, and just.
            </Typography>
            <Typography 
              variant="body" 
              className="text-lg text-blue-400 font-semibold"
            >
              &quot;Building the future where AI and human values align to create meaningful change.&quot;
            </Typography>
          </Glass>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default AboutPage;