'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import { CaseStudy, TechnicalChallenge } from '@/data/case-studies';
import {
  ExternalLink,
  Github,
  Calendar,
  Users,
  Briefcase,
  Target,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Quote,
  Play,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Code
} from 'lucide-react';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
}

const MetricCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  delay: number;
}> = ({ label, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Glass config="card" className="p-6 text-center group hover-glow">
      <div className="text-blue-400 mb-3 flex justify-center group-hover:text-blue-300 transition-colors duration-300">
        {icon}
      </div>
      <Typography variant="h5" className="text-white font-bold mb-1">
        {value}
      </Typography>
      <Typography variant="bodySmall" className="text-white/60">
        {label}
      </Typography>
    </Glass>
  </motion.div>
);

const ChallengeCard: React.FC<{
  challenge: TechnicalChallenge;
  delay: number;
}> = ({ challenge, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Glass config="card" className="p-6 group hover-lift">
      <div className="flex items-start gap-4">
        <div className="text-red-400 mt-1 flex-shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <Typography variant="h6" className="text-white font-semibold mb-2">
            Challenge
          </Typography>
          <Typography variant="bodySmall" className="text-white/70 mb-4">
            {challenge.challenge}
          </Typography>
          
          <div className="flex items-start gap-4 mb-4">
            <div className="text-green-400 mt-1 flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <Typography variant="h6" className="text-white font-semibold mb-2">
                Solution
              </Typography>
              <Typography variant="bodySmall" className="text-white/70 mb-4">
                {challenge.solution}
              </Typography>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="text-blue-400 mt-1 flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <Typography variant="h6" className="text-white font-semibold mb-2">
                Impact
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                {challenge.impact}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Glass>
  </motion.div>
);

const ProcessStep: React.FC<{
  step: string;
  index: number;
  delay: number;
}> = ({ step, index, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-4"
  >
    <div className="flex-shrink-0">
      <Glass config="button" className="w-8 h-8 flex items-center justify-center">
        <Typography variant="bodySmall" className="text-blue-400 font-bold">
          {index + 1}
        </Typography>
      </Glass>
    </div>
    <Typography variant="body" className="text-white/80 leading-relaxed">
      {step}
    </Typography>
  </motion.div>
);

const ImageGallery: React.FC<{
  images: string[];
  title: string;
}> = ({ images, title }) => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <Glass config="modal" className="p-6">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={`${title} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentImage ? 'bg-blue-400' : 'bg-white/30'
              }`}
              onClick={() => setCurrentImage(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
            />
          ))}
        </div>
      )}
    </Glass>
  );
};

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({ caseStudy }) => {
  const metrics = Object.entries(caseStudy.metrics).filter(([, value]) => value);
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <Typography variant="h1" className="text-4xl lg:text-6xl font-bold mb-4">
          <span className="text-white">{caseStudy.title.split(' ').slice(0, -1).join(' ')} </span>
          <span className="gradient-text">{caseStudy.title.split(' ').slice(-1)[0]}</span>
        </Typography>
        
        <Typography variant="h5" className="text-blue-400 font-medium mb-6">
          {caseStudy.subtitle}
        </Typography>
        
        <Typography variant="body" className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-8">
          {caseStudy.longDescription}
        </Typography>
        
        {/* Project Info */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span>{caseStudy.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Users className="w-4 h-4" />
            <span>{caseStudy.teamSize}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Briefcase className="w-4 h-4" />
            <span>{caseStudy.role}</span>
          </div>
          {caseStudy.client && (
            <div className="flex items-center gap-2 text-white/60">
              <Award className="w-4 h-4" />
              <span>{caseStudy.client}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {caseStudy.liveUrl && (
            <Button 
              variant="accent" 
              size="lg" 
              className="group"
              onClick={() => window.open(caseStudy.liveUrl, '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Live Project
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          )}
          
          {caseStudy.githubUrl && (
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open(caseStudy.githubUrl, '_blank')}
            >
              <Github className="w-5 h-5 mr-2" />
              View Code
            </Button>
          )}
          
          {caseStudy.videoUrl && (
            <Button variant="ghost" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          )}
        </div>
      </motion.div>
      
      {/* Image Gallery */}
      {caseStudy.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ImageGallery images={caseStudy.images} title={caseStudy.title} />
        </motion.div>
      )}
      
      {/* Metrics */}
      {metrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography variant="h3" className="text-white font-bold text-center mb-8">
            Key Metrics & Results
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map(([key, value], index) => {
              const icons = {
                performanceImprovement: <Zap className="w-6 h-6" />,
                userEngagement: <Users className="w-6 h-6" />,
                loadTime: <TrendingUp className="w-6 h-6" />,
                conversionRate: <Target className="w-6 h-6" />,
                userSatisfaction: <Award className="w-6 h-6" />,
                codeReduction: <Code className="w-6 h-6" />,
                bugReduction: <CheckCircle className="w-6 h-6" />,
                developmentTime: <Calendar className="w-6 h-6" />
              };
              
              const labels = {
                performanceImprovement: 'Performance',
                userEngagement: 'User Engagement',
                loadTime: 'Load Time',
                conversionRate: 'Conversion Rate',
                userSatisfaction: 'User Satisfaction',
                codeReduction: 'Code Efficiency',
                bugReduction: 'Bug Reduction',
                developmentTime: 'Development Time'
              };
              
              return (
                <MetricCard
                  key={key}
                  label={labels[key as keyof typeof labels] || key}
                  value={value}
                  icon={icons[key as keyof typeof icons] || <TrendingUp className="w-6 h-6" />}
                  delay={0.6 + index * 0.1}
                />
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* Problem & Solution */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Glass config="card" className="p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-red-400" />
              <Typography variant="h4" className="text-white font-bold">
                The Problem
              </Typography>
            </div>
            <Typography variant="body" className="text-white/80 leading-relaxed">
              {caseStudy.problem}
            </Typography>
          </Glass>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Glass config="card" className="p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-green-400" />
              <Typography variant="h4" className="text-white font-bold">
                The Solution
              </Typography>
            </div>
            <Typography variant="body" className="text-white/80 leading-relaxed">
              {caseStudy.solution}
            </Typography>
          </Glass>
        </motion.div>
      </div>
      
      {/* Development Process */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Typography variant="h3" className="text-white font-bold text-center mb-8">
          Development Process
        </Typography>
        
        <Glass config="card" className="p-8">
          <div className="space-y-6">
            {caseStudy.process.map((step, index) => (
              <ProcessStep
                key={index}
                step={step}
                index={index}
                delay={1.0 + index * 0.1}
              />
            ))}
          </div>
        </Glass>
      </motion.div>
      
      {/* Technical Challenges */}
      {caseStudy.challenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Typography variant="h3" className="text-white font-bold text-center mb-8">
            Technical Challenges & Solutions
          </Typography>
          
          <div className="space-y-6">
            {caseStudy.challenges.map((challenge, index) => (
              <ChallengeCard
                key={index}
                challenge={challenge}
                delay={1.2 + index * 0.2}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <Typography variant="h3" className="text-white font-bold text-center mb-8">
          Project Results
        </Typography>
        
        <Glass config="card" className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <Typography variant="body" className="text-white/80">
                  {result}
                </Typography>
              </motion.div>
            ))}
          </div>
        </Glass>
      </motion.div>
      
      {/* Testimonial */}
      {caseStudy.testimonial && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Glass config="modal" className="p-8 text-center">
            <Quote className="w-12 h-12 text-blue-400 mx-auto mb-6" />
            
            <Typography variant="h5" className="text-white font-medium mb-6 italic leading-relaxed">
              &ldquo;{caseStudy.testimonial.quote}&rdquo;
            </Typography>
            
            <div className="flex items-center justify-center gap-4">
              <Image
                src={caseStudy.testimonial.avatar}
                alt={caseStudy.testimonial.author}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <Typography variant="h6" className="text-white font-semibold">
                  {caseStudy.testimonial.author}
                </Typography>
                <Typography variant="bodySmall" className="text-white/60">
                  {caseStudy.testimonial.position}, {caseStudy.testimonial.company}
                </Typography>
              </div>
            </div>
          </Glass>
        </motion.div>
      )}
      
      {/* Technologies Used */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <Typography variant="h3" className="text-white font-bold text-center mb-8">
          Technologies Used
        </Typography>
        
        <div className="flex flex-wrap justify-center gap-3">
          {caseStudy.technologies.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Glass config="button" className="px-4 py-2">
                <Typography variant="bodySmall" className="text-white/80 font-medium">
                  {tech}
                </Typography>
              </Glass>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CaseStudyDetail;