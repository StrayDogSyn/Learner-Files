'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaseStudyGrid, CaseStudyDetail } from '@/components/organisms/CaseStudy';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';

import { CaseStudy } from '@/data/case-studies';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

export default function CaseStudiesPage() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  
  const handleSelectCaseStudy = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
  };
  
  const handleBackToGrid = () => {
    setSelectedCaseStudy(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {selectedCaseStudy ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {/* Back Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-8"
                >
                  <Glass config="card" className="p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        onClick={handleBackToGrid}
                        className="group"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Back to Case Studies
                      </Button>
                      
                      <div className="flex gap-3">
                        {selectedCaseStudy.liveUrl && (
                          <Button
                            variant="accent"
                            size="sm"
                            onClick={() => window.open(selectedCaseStudy.liveUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Live Demo
                          </Button>
                        )}
                        
                        {selectedCaseStudy.githubUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedCaseStudy.githubUrl, '_blank')}
                          >
                            <Github className="w-4 h-4 mr-1" />
                            View Code
                          </Button>
                        )}
                      </div>
                    </div>
                  </Glass>
                </motion.div>
                
                {/* Case Study Detail */}
                <CaseStudyDetail caseStudy={selectedCaseStudy} />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <CaseStudyGrid onSelectCaseStudy={handleSelectCaseStudy} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Metadata is handled in layout.tsx for client components