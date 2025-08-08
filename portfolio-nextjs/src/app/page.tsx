'use client';

import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { Input } from '@/components/atoms/Input';

function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center space-y-8 max-w-4xl mx-auto">

          
          {/* Main Heading */}
          <div className="space-y-4">
            <Typography 
              variant="h1" 
              gradient 
              glow
              className="animate-fade-in"
            >
              Modern Portfolio
            </Typography>
            <Typography 
              variant="lead" 
              color="secondary"
              className="max-w-2xl mx-auto animate-fade-in-delay-1"
            >
              A cutting-edge showcase built with Next.js 14, TypeScript, and advanced glassmorphism design. 
              Experience the future of web development.
            </Typography>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <Button variant="primary" size="lg">
              View Projects
            </Button>
            <Button variant="accent" size="lg">
              Get In Touch
            </Button>
            <Button variant="outline" size="lg">
              Download Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <Typography variant="h2" gradient>
              Built with Modern Technology
            </Typography>
            <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
              This portfolio showcases the latest in web development, featuring glassmorphism design, 
              atomic component architecture, and cutting-edge performance optimizations.
            </Typography>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Next.js 14',
                description: 'Built with the latest App Router and server components for optimal performance.',
                icon: '⚡'
              },
              {
                title: 'Glassmorphism',
                description: 'Advanced glass effects with backdrop blur and sophisticated visual hierarchy.',
                icon: '✨'
              },
              {
                title: 'TypeScript',
                description: 'Fully typed codebase ensuring reliability and excellent developer experience.',
                icon: '🔒'
              },
              {
                title: 'Atomic Design',
                description: 'Modular component architecture following atomic design principles.',
                icon: '🧩'
              },
              {
                title: 'Dark Mode',
                description: 'Seamless theme switching with system preference detection.',
                icon: '🌙'
              },
              {
                title: 'Responsive',
                description: 'Mobile-first design that looks perfect on every device.',
                icon: '📱'
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-6 space-y-4 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl">{feature.icon}</div>
                <Typography variant="h5" color="accent">
                  {feature.title}
                </Typography>
                <Typography variant="bodySmall" color="secondary">
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-32">
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <Typography variant="h2" gradient>
              Component Showcase
            </Typography>
            <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
              Explore the atomic design components that power this portfolio.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Buttons Showcase */}
            <div className="glass-card p-8 space-y-6">
              <Typography variant="h4" color="accent">
                Button Components
              </Typography>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button loading>Loading</Button>
                </div>
              </div>
            </div>

            {/* Input Showcase */}
            <div className="glass-card p-8 space-y-6">
              <Typography variant="h4" color="accent">
                Input Components
              </Typography>
              <div className="space-y-4">
                <Input 
                  label="Email Address" 
                  placeholder="Enter your email" 
                  type="email"
                />
                <Input 
                  label="Password" 
                  placeholder="Enter your password" 
                  type="password"
                  helperText="Must be at least 8 characters"
                />
                <Input 
                  label="Error State" 
                  placeholder="This field has an error" 
                  error="This field is required"
                />
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
