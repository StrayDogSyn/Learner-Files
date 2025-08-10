import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Code,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  popular: boolean;
  icon: React.ReactNode;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What technologies do you specialize in for web development?',
    answer: 'I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and Python. For databases, I work with PostgreSQL, MongoDB, and Supabase. I also have extensive experience with cloud platforms like AWS, Vercel, and Docker for deployment and scaling.',
    category: 'technical',
    tags: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    popular: true,
    icon: <Code className="w-5 h-5" />
  },
  {
    id: '2',
    question: 'How do you approach AI integration in web applications?',
    answer: 'I integrate AI capabilities using modern APIs like OpenAI, Anthropic, and Google AI. This includes implementing chatbots, content generation, image processing, and intelligent data analysis. I focus on creating seamless user experiences while ensuring data privacy and optimal performance.',
    category: 'ai',
    tags: ['AI', 'OpenAI', 'Machine Learning', 'APIs'],
    popular: true,
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: '3',
    question: 'What is your typical project timeline and process?',
    answer: 'My process includes: 1) Discovery and planning (1-2 weeks), 2) Design and architecture (1-2 weeks), 3) Development and testing (4-8 weeks), 4) Deployment and optimization (1 week). Timeline varies based on project complexity, but I provide detailed milestones and regular updates throughout.',
    category: 'process',
    tags: ['Timeline', 'Process', 'Planning', 'Development'],
    popular: true,
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: '4',
    question: 'How do you ensure the security of web applications?',
    answer: 'I implement multiple security layers including HTTPS, authentication systems, input validation, SQL injection prevention, XSS protection, and regular security audits. I follow OWASP guidelines and use tools like Helmet.js, rate limiting, and secure session management.',
    category: 'security',
    tags: ['Security', 'HTTPS', 'Authentication', 'OWASP'],
    popular: false,
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: '5',
    question: 'What are your pricing models for different types of projects?',
    answer: 'I offer flexible pricing: Fixed-price for well-defined projects, hourly rates for ongoing work ($75-150/hour based on complexity), and retainer agreements for long-term partnerships. All projects include detailed proposals with clear deliverables and timelines.',
    category: 'pricing',
    tags: ['Pricing', 'Fixed-price', 'Hourly', 'Retainer'],
    popular: true,
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    id: '6',
    question: 'Do you work with teams or prefer solo projects?',
    answer: 'I work both independently and as part of teams. I have experience collaborating with designers, product managers, and other developers using tools like Git, Slack, and project management platforms. I adapt my communication style to fit team dynamics and project requirements.',
    category: 'collaboration',
    tags: ['Teamwork', 'Collaboration', 'Git', 'Communication'],
    popular: false,
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '7',
    question: 'How do you handle project maintenance and updates?',
    answer: 'I provide ongoing maintenance packages including security updates, performance monitoring, bug fixes, and feature enhancements. I also offer training for your team to manage basic updates independently, with documentation and support materials.',
    category: 'maintenance',
    tags: ['Maintenance', 'Updates', 'Support', 'Training'],
    popular: false,
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    id: '8',
    question: 'What makes your development approach unique?',
    answer: 'I focus on creating scalable, maintainable solutions with excellent user experience. My approach combines modern development practices, AI integration capabilities, and business understanding to deliver applications that not only work well but also drive real value for users and businesses.',
    category: 'approach',
    tags: ['Scalability', 'UX', 'Business Value', 'Innovation'],
    popular: true,
    icon: <Star className="w-5 h-5" />
  },
  {
    id: '9',
    question: 'How do you stay updated with the latest technologies?',
    answer: 'I continuously learn through technical blogs, open-source contributions, online courses, and hands-on experimentation. I regularly attend webinars, follow industry leaders, and participate in developer communities to stay current with emerging trends and best practices.',
    category: 'learning',
    tags: ['Learning', 'Technology', 'Open Source', 'Community'],
    popular: false,
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: '10',
    question: 'What support do you provide after project completion?',
    answer: 'I provide 30 days of free support after project delivery, including bug fixes and minor adjustments. Beyond that, I offer various support packages for ongoing maintenance, feature additions, and technical consultation based on your needs.',
    category: 'support',
    tags: ['Support', 'Warranty', 'Maintenance', 'Consultation'],
    popular: false,
    icon: <MessageCircle className="w-5 h-5" />
  }
];

const categories: FAQCategory[] = [
  { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-4 h-4" />, color: 'text-white', count: faqData.length },
  { id: 'technical', name: 'Technical', icon: <Code className="w-4 h-4" />, color: 'text-blue-400', count: faqData.filter(f => f.category === 'technical').length },
  { id: 'ai', name: 'AI Integration', icon: <Zap className="w-4 h-4" />, color: 'text-purple-400', count: faqData.filter(f => f.category === 'ai').length },
  { id: 'process', name: 'Process', icon: <Clock className="w-4 h-4" />, color: 'text-green-400', count: faqData.filter(f => f.category === 'process').length },
  { id: 'pricing', name: 'Pricing', icon: <DollarSign className="w-4 h-4" />, color: 'text-yellow-400', count: faqData.filter(f => f.category === 'pricing').length },
  { id: 'support', name: 'Support', icon: <MessageCircle className="w-4 h-4" />, color: 'text-indigo-400', count: faqData.filter(f => f.category === 'support').length }
];

const FAQAccordionItem: React.FC<{ 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void; 
  index: number; 
}> = ({ item, isOpen, onToggle, index }) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="
        rounded-2xl backdrop-blur-xl border border-white/10
        bg-gradient-to-br from-white/5 to-white/10
        hover:border-white/20 transition-all duration-300
        overflow-hidden
      ">
        {/* Question Header */}
        <motion.button
          onClick={onToggle}
          className="
            w-full p-6 text-left flex items-center justify-between
            hover:bg-white/5 transition-all duration-300
            focus:outline-none focus:bg-white/5
          "
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center space-x-4 flex-1">
            {/* Icon */}
            <div className={`
              p-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5
              border border-white/20 text-white/80
              group-hover:border-white/30 transition-all duration-300
            `}>
              {item.icon}
            </div>
            
            {/* Question Text */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                  {item.question}
                </h3>
                {item.popular && (
                  <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md text-xs bg-white/10 text-white/60 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Toggle Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 p-2 rounded-xl bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white transition-all duration-300"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Answer Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="pl-16">
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="
                      p-4 rounded-xl bg-white/5 border border-white/10
                      backdrop-blur-sm
                    "
                  >
                    <p className="text-white/80 leading-relaxed">
                      {item.answer}
                    </p>
                    
                    {/* All Tags */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs bg-white/10 text-white/60 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-white/5 to-transparent
          blur-xl transition-opacity duration-500 -z-10
        `} />
      </div>
    </motion.div>
  );
};

const CategoryFilter: React.FC<{ 
  categories: FAQCategory[]; 
  activeCategory: string; 
  onCategoryChange: (category: string) => void; 
}> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
            transition-all duration-300 backdrop-blur-sm border
            ${
              activeCategory === category.id
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15 hover:text-white'
            }
          `}
        >
          <span className={category.color}>{category.icon}</span>
          <span>{category.name}</span>
          <span className="text-xs opacity-70">({category.count})</span>
        </motion.button>
      ))}
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = filteredFAQs.filter(item => item.popular);
  const regularFAQs = filteredFAQs.filter(item => !item.popular);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
            <HelpCircle className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-white/80 text-sm font-medium">Got Questions?</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about my services, process, and approach. 
            Can't find what you're looking for? Feel free to reach out directly.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6 max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3 rounded-xl
                bg-white/10 backdrop-blur-sm border border-white/20
                text-white placeholder-white/60
                focus:outline-none focus:border-white/40 focus:bg-white/15
                transition-all duration-300
              "
            />
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Popular Questions */}
        {popularFAQs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Popular Questions
            </h3>
            <div className="space-y-4">
              {popularFAQs.map((item, index) => (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Questions */}
        {regularFAQs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Info className="w-6 h-6 mr-3 text-blue-400" />
              All Questions
            </h3>
            <div className="space-y-4">
              {regularFAQs.map((item, index) => (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  index={index + popularFAQs.length}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">No questions found</h3>
            <p className="text-white/50">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Don't hesitate to reach out! I'm always happy to discuss your project requirements 
              and answer any specific questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  inline-flex items-center px-8 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-purple-500 to-indigo-500
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-300
                "
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  inline-flex items-center px-8 py-3 rounded-xl font-semibold
                  bg-white/10 hover:bg-white/20 text-white
                  border border-white/20 hover:border-white/30
                  backdrop-blur-sm transition-all duration-300
                "
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;