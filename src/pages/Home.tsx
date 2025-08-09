import Hero from "@/components/Hero";
import LazyFeaturedProjects from "@/components/LazyFeaturedProjects";
import { motion } from 'framer-motion';
import { TrendingUp, Users, Code, Award, Zap, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen glass-background-main">
      {/* Interactive Hero Section */}
      <Hero />
      
      {/* Featured Projects Section */}
      <LazyFeaturedProjects />
      
      {/* Portfolio Achievements & Metrics Section */}
      <section id="achievements" className="min-h-screen flex items-center justify-center glass-section-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold branding-text font-heading">
                Portfolio Achievements
              </h2>
              <p className="text-xl text-light-smoke max-w-3xl mx-auto leading-relaxed font-body">
                Delivering exceptional results through innovative technology solutions and 
                meticulous attention to performance, accessibility, and user experience.
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                className="glass-card p-8 rounded-xl text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-4">
                  <TrendingUp className="w-12 h-12 text-hunter-green-primary" />
                </div>
                <div className="text-4xl font-bold text-hunter-green-primary mb-2 font-heading">
                  98+
                </div>
                <div className="text-lg font-semibold text-white mb-2">Lighthouse Score</div>
                <div className="text-sm text-light-smoke">
                  Performance, Accessibility, Best Practices &amp; SEO optimization
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-8 rounded-xl text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-4">
                  <Zap className="w-12 h-12 text-metallic-gold" />
                </div>
                <div className="text-4xl font-bold text-metallic-gold mb-2 font-heading">
                  &lt;1.5s
                </div>
                <div className="text-lg font-semibold text-white mb-2">Load Time</div>
                <div className="text-sm text-light-smoke">
                  First Contentful Paint optimized for instant user engagement
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-8 rounded-xl text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-4">
                  <Award className="w-12 h-12 text-emerald-accent" />
                </div>
                <div className="text-4xl font-bold text-emerald-accent mb-2 font-heading">
                  WCAG 2.1
                </div>
                <div className="text-lg font-semibold text-white mb-2">AA Compliant</div>
                <div className="text-sm text-light-smoke">
                  Full accessibility compliance with keyboard navigation support
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-8 rounded-xl text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-4">
                  <Code className="w-12 h-12 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-blue-400 mb-2 font-heading">
                  15+
                </div>
                <div className="text-lg font-semibold text-white mb-2">Technologies</div>
                <div className="text-sm text-light-smoke">
                  React, TypeScript, Vite, Framer Motion, Tailwind CSS &amp; more
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-8 rounded-xl text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-4">
                  <Users className="w-12 h-12 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-purple-400 mb-2 font-heading">
                  95%
                </div>
                <div className="text-lg font-semibold text-white mb-2">User Satisfaction</div>
                <div className="text-sm text-light-smoke">
                  Positive feedback on usability, design, and functionality
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-8 rounded-xl text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-4">
                  <Target className="w-12 h-12 text-red-400" />
                </div>
                <div className="text-4xl font-bold text-red-400 mb-2 font-heading">
                  99.9%
                </div>
                <div className="text-lg font-semibold text-white mb-2">Accuracy</div>
                <div className="text-sm text-light-smoke">
                  Precision in calculations, data processing, and user interactions
                </div>
              </motion.div>
            </div>

            {/* Technical Excellence Highlights */}
            <motion.div
              className="mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center font-heading">
                  Technical Excellence Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-hunter-green-primary rounded-full"></div>
                      <span className="text-light-smoke">Enterprise-grade React 18.3.1 with Concurrent Features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-metallic-gold rounded-full"></div>
                      <span className="text-light-smoke">Advanced TypeScript with strict mode &amp; no any types</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-accent rounded-full"></div>
                      <span className="text-light-smoke">Vite 6.0.1 with optimized build configuration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-light-smoke">Custom glassmorphic design system</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-light-smoke">Framer Motion for 60fps animations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-light-smoke">Code splitting &amp; lazy loading optimization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-light-smoke">Cross-browser compatibility testing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-light-smoke">Comprehensive error handling &amp; user feedback</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center glass-section-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold branding-text font-heading">
              About StrayDog Syndications
            </h2>
            <p className="text-xl text-light-smoke max-w-3xl mx-auto leading-relaxed font-body">
              We are a cutting-edge AI solutions engineering syndicate that bridges the gap between 
              human creativity and artificial intelligence. Our mission is to transform innovative 
              ideas into intelligent, scalable solutions that push the boundaries of what's possible 
              in the digital landscape.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-emerald-accent mb-3 font-heading">Innovation</h3>
                <p className="text-light-smoke font-body">Pioneering new approaches to AI integration and human-computer interaction.</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-metallic-silver mb-3 font-heading">Intelligence</h3>
                <p className="text-light-smoke font-body">Leveraging advanced AI algorithms to create smarter, more intuitive applications.</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-hunter-green mb-3 font-heading">Excellence</h3>
                <p className="text-light-smoke font-body">Delivering high-quality solutions with meticulous attention to detail and performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Demonstrations Preview Section */}
      <section id="demonstrations" className="min-h-screen flex items-center justify-center glass-section-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold branding-text font-heading">
              AI Playground
            </h2>
            <p className="text-xl text-light-smoke max-w-3xl mx-auto leading-relaxed font-body">
              Experience the power of artificial intelligence through our interactive demonstrations. 
              From natural language processing to computer vision, explore the cutting-edge technologies 
              that power our solutions.
            </p>
            <div className="mt-12">
              <button className="glass-button-primary px-8 py-4 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
                Coming Soon - AI Demos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}