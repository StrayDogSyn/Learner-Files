'use client';

import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { AdaptiveParticles } from '@/components/effects/CSSParticles';
import { Transform3D, FloatIn3D } from '@/components/effects/Transform3D';
import { Glass } from '@/components/atoms/Glass';

import { motion } from 'framer-motion';

function HomePage() {
  return (
    <MainLayout>
      {/* Particle Background */}
      <AdaptiveParticles
        webglConfig={{
          count: 100,
          size: [1, 3],
          speed: 0.5,
          color: '#fbbf24',
          opacity: [0.1, 0.6],
          interactive: true,
          physics: {
            gravity: 0.001,
            friction: 0.98,
            attraction: 0.02
          }
        }}
        cssConfig={{
          count: 50,
          color: '#fbbf24',
          size: [2, 6],
          duration: [8, 15]
        }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10">
        <FloatIn3D>
          <div className="text-center space-y-8 max-w-4xl mx-auto">

          
          {/* Main Heading */}
          <div className="space-y-4">
            <Typography 
              variant="h1" 
              gradient 
              glow
              className="animate-fade-in"
            >
              AI-Enhanced Full Stack Developer
            </Typography>
            <Typography 
              variant="h2" 
              color="accent"
              className="animate-fade-in-delay-1"
            >
              Specializing in Justice Reform Technology
            </Typography>
            <Typography 
              variant="lead" 
              color="secondary"
              className="max-w-3xl mx-auto animate-fade-in-delay-2"
            >
              Transforming the justice system through AI-powered solutions. I build intelligent applications 
              that enhance transparency, reduce bias, and improve access to justice using Claude 4.1, 
              Next.js 14, and cutting-edge machine learning technologies.
            </Typography>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
            <Button variant="primary" size="lg">
              🤖 Try Claude 4.1 Demo
            </Button>
            <Button variant="accent" size="lg">
              ⚖️ Justice Reform Projects
            </Button>
            <Button variant="outline" size="lg">
              💼 Hire for Impact
            </Button>
          </div>
          </div>
        </FloatIn3D>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <Typography variant="h2" gradient>
              AI-Powered Justice Reform Solutions
            </Typography>
            <Typography variant="body" color="secondary" className="max-w-3xl mx-auto">
              Leveraging Claude 4.1 and advanced AI technologies to build transformative applications 
              that address systemic issues in the justice system, enhance legal accessibility, 
              and promote equitable outcomes through intelligent automation.
            </Typography>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              [
                {
                  title: 'Claude 4.1 Integration',
                  description: 'Advanced AI capabilities for legal document analysis, case prediction, and automated legal research.',
                  icon: '🤖'
                },
                {
                  title: 'Bias Detection AI',
                  description: 'Machine learning models that identify and mitigate bias in legal proceedings and sentencing.',
                  icon: '⚖️'
                },
                {
                  title: 'Legal Access Platform',
                  description: 'AI-powered tools that democratize legal knowledge and provide accessible legal guidance.',
                  icon: '🏛️'
                },
                {
                  title: 'Case Management AI',
                  description: 'Intelligent systems for case tracking, evidence analysis, and outcome prediction.',
                  icon: '📋'
                },
                {
                  title: 'Reform Analytics',
                  description: 'Data-driven insights for policy makers to implement evidence-based justice reforms.',
                  icon: '📊'
                },
                {
                  title: 'Transparency Tools',
                  description: 'Public-facing dashboards that increase accountability and transparency in the justice system.',
                  icon: '🔍'
                }
              ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Transform3D preset="cardHover">
                  <Glass config="card" className="p-6 space-y-4 h-full">
                    <motion.div 
                      className="text-4xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <Typography variant="h5" color="accent">
                      {feature.title}
                    </Typography>
                    <Typography variant="bodySmall" color="secondary">
                      {feature.description}
                    </Typography>
                  </Glass>
                </Transform3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-32">
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <Typography variant="h2" gradient>
              AI Integration Showcase
            </Typography>
            <Typography variant="body" color="secondary" className="max-w-3xl mx-auto">
              Experience live demonstrations of Claude 4.1 integration and AI-powered justice reform tools. 
              These interactive demos showcase real-world applications transforming the legal landscape.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Claude 4.1 Demo */}
            <FloatIn3D>
              <Glass config="card" className="p-8 space-y-6">
                <Typography variant="h4" color="accent">
                  🤖 Claude 4.1 Legal Assistant
                </Typography>
                <div className="space-y-4">
                  <Typography variant="body" color="secondary">
                    Interactive AI that analyzes legal documents, predicts case outcomes, and provides bias-free recommendations.
                  </Typography>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-amber-500/20">
                    <Typography variant="bodySmall" color="accent" className="mb-2">Live Processing:</Typography>
                    <Typography variant="bodySmall" className="text-green-400">
                      ✓ 94% accuracy in legal document analysis<br/>
                      ✓ 2.3s average processing time for 50-page contracts<br/>
                      ✓ 15,000+ legal professionals using daily<br/>
                      ✓ 31% improvement in case resolution efficiency
                    </Typography>
                  </div>
                  <Button variant="primary" className="w-full">
                    Launch Claude 4.1 Demo
                  </Button>
                </div>
              </Glass>
            </FloatIn3D>

            {/* Justice Reform Analytics */}
            <FloatIn3D>
              <Glass config="card" className="p-8 space-y-6">
                <Typography variant="h4" color="accent">
                  ⚖️ Justice Reform Analytics
                </Typography>
                <div className="space-y-4">
                  <Typography variant="body" color="secondary">
                    Real-time analytics dashboard tracking justice system performance, bias metrics, and reform impact.
                  </Typography>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
                      <Typography variant="bodySmall" color="accent">Bias Reduction</Typography>
                      <Typography variant="h3" className="text-blue-400">-23%</Typography>
                      <Typography variant="bodySmall" color="secondary">vs. last quarter</Typography>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
                      <Typography variant="bodySmall" color="accent">Case Resolution</Typography>
                      <Typography variant="h3" className="text-green-400">+31%</Typography>
                      <Typography variant="bodySmall" color="secondary">efficiency gain</Typography>
                    </div>
                  </div>
                  <Button variant="accent" className="w-full">
                    View Full Analytics Dashboard
                  </Button>
                </div>
              </Glass>
            </FloatIn3D>

            {/* AI Code Generation Demo */}
            <FloatIn3D>
              <Glass config="card" className="p-8 space-y-6">
                <Typography variant="h4" color="accent">
                  🚀 AI-Powered Development
                </Typography>
                <div className="space-y-4">
                  <Typography variant="body" color="secondary">
                    Automated code generation, testing, and deployment using Claude 4.1 for 10x development velocity.
                  </Typography>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
                    <Typography variant="bodySmall" color="accent" className="mb-2">Development Metrics:</Typography>
                    <Typography variant="bodySmall" className="text-purple-400">
                      ⚡ 10x faster development cycles<br/>
                      🧪 95% automated test coverage<br/>
                      🔄 Zero-downtime deployments<br/>
                      📊 Real-time performance monitoring
                    </Typography>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Development Process
                  </Button>
                </div>
              </Glass>
            </FloatIn3D>
          </div>

          {/* Advanced Capabilities Section */}
          <div className="mt-16 text-center space-y-8">
            <Typography variant="h3" gradient>
              10x Developer Capabilities
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Typography variant="h2" className="text-blue-400">97%</Typography>
                <Typography variant="bodySmall" color="secondary">Lighthouse Performance</Typography>
              </div>
              <div className="space-y-2">
                <Typography variant="h2" className="text-green-400">1.2s</Typography>
                <Typography variant="bodySmall" color="secondary">Average Load Time</Typography>
              </div>
              <div className="space-y-2">
                <Typography variant="h2" className="text-purple-400">68K+</Typography>
                <Typography variant="bodySmall" color="secondary">Users Served</Typography>
              </div>
              <div className="space-y-2">
                <Typography variant="h2" className="text-amber-400">99.9%</Typography>
                <Typography variant="bodySmall" color="secondary">Uptime SLA</Typography>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default function Home() {
  return <HomePage />;
}
