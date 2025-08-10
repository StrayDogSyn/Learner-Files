import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube,
  ExternalLink,
  Heart,
  Code,
  Zap,
  Shield,
  Globe,
  Clock
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

interface ComprehensiveFooterProps {
  className?: string;
  showNewsletter?: boolean;
  companyName?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const ComprehensiveFooter: React.FC<ComprehensiveFooterProps> = ({
  className = '',
  showNewsletter = true,
  companyName = 'SOLO Portfolio',
  tagline = 'Crafting Digital Excellence',
  address = '123 Innovation Street, Tech City, TC 12345',
  phone = '+1 (555) 123-4567',
  email = 'hello@soloportfolio.com'
}) => {
  const footerSections: FooterSection[] = [
    {
      title: 'Services',
      links: [
        { label: 'Web Development', href: '/services#web-development' },
        { label: 'Mobile Apps', href: '/services#mobile-apps' },
        { label: 'UI/UX Design', href: '/services#ui-ux-design' },
        { label: 'Consulting', href: '/services#consulting' },
        { label: 'Maintenance', href: '/services#maintenance' }
      ]
    },
    {
      title: 'Portfolio',
      links: [
        { label: 'Recent Projects', href: '/portfolio' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Client Testimonials', href: '/testimonials' },
        { label: 'Process', href: '/process' },
        { label: 'Technologies', href: '/technologies' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs', external: true },
        { label: 'API Reference', href: '/api', external: true },
        { label: 'Support Center', href: '/support' },
        { label: 'Status Page', href: '/status', external: true },
        { label: 'Changelog', href: '/changelog' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' },
        { label: 'Accessibility', href: '/accessibility' }
      ]
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      platform: 'GitHub',
      href: 'https://github.com/yourusername',
      icon: <Github className="w-5 h-5" />,
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      platform: 'LinkedIn',
      href: 'https://linkedin.com/in/yourusername',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'hover:text-blue-600'
    },
    {
      platform: 'Twitter',
      href: 'https://twitter.com/yourusername',
      icon: <Twitter className="w-5 h-5" />,
      color: 'hover:text-blue-400'
    },
    {
      platform: 'Instagram',
      href: 'https://instagram.com/yourusername',
      icon: <Instagram className="w-5 h-5" />,
      color: 'hover:text-pink-600'
    },
    {
      platform: 'YouTube',
      href: 'https://youtube.com/@yourusername',
      icon: <Youtube className="w-5 h-5" />,
      color: 'hover:text-red-600'
    }
  ];

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-b border-gray-700 py-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Stay Updated
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Get the latest updates on new projects, technologies, and insights delivered to your inbox.
                </p>
                <div className="max-w-md mx-auto flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-l-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-r-lg font-semibold transition-all duration-200"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{companyName}</h3>
                <p className="text-gray-300 mb-4">{tagline}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Passionate about creating exceptional digital experiences that drive business growth and user satisfaction. Let's build something amazing together.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-3 text-blue-400" />
                  <span className="text-sm">{address}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3 text-green-400" />
                  <a href={`tel:${phone}`} className="text-sm hover:text-white transition-colors">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3 text-purple-400" />
                  <a href={`mailto:${email}`} className="text-sm hover:text-white transition-colors">
                    {email}
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Follow Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-gray-400 transition-all duration-200 ${social.color}`}
                      aria-label={`Follow on ${social.platform}`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div key={section.title} variants={itemVariants} className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <motion.a
                        href={link.href}
                        target={link.external ? '_blank' : '_self'}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        whileHover={{ x: 4 }}
                        className="text-gray-400 hover:text-white text-sm transition-all duration-200 flex items-center group"
                      >
                        {link.label}
                        {link.external && (
                          <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-700 py-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center text-gray-400 text-sm">
                <span>&copy; {currentYear} {companyName}. All rights reserved.</span>
              </div>

              {/* Made with love */}
              <div className="flex items-center text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" />
                <span>and</span>
                <Code className="w-4 h-4 mx-1 text-blue-400" />
                <span>by SOLO</span>
              </div>

              {/* Additional Info */}
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-blue-400" />
                  <span>Global</span>
                </div>
              </div>
            </div>

            {/* Additional Legal Links */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex flex-wrap justify-center md:justify-start items-center space-x-6 text-xs text-gray-500">
                <a href="/sitemap.xml" className="hover:text-gray-300 transition-colors">
                  Sitemap
                </a>
                <a href="/robots.txt" className="hover:text-gray-300 transition-colors">
                  Robots
                </a>
                <a href="/security" className="hover:text-gray-300 transition-colors">
                  Security
                </a>
                <a href="/compliance" className="hover:text-gray-300 transition-colors">
                  Compliance
                </a>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
    </footer>
  );
};

export default ComprehensiveFooter;