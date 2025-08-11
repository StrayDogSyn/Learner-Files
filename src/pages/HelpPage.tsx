import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  popularity: number;
}

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'games', name: 'Games & Features', count: 6 },
    { id: 'account', name: 'Account & Settings', count: 5 },
    { id: 'technical', name: 'Technical Issues', count: 3 },
    { id: 'billing', name: 'Billing & Payments', count: 2 }
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I get started with the platform?',
      answer: 'Getting started is easy! Simply create an account, verify your email, and you\'ll have access to all our games and features. Check out our quick start guide for a walkthrough of the main features.',
      category: 'getting-started',
      helpful: 45
    },
    {
      id: '2',
      question: 'How do I play Knucklebones?',
      answer: 'Knucklebones is a strategic dice game. Roll dice and place them on your grid to score points. Match numbers in columns to multiply your score, but be careful - your opponent can remove your dice by placing the same number in their corresponding column!',
      category: 'games',
      helpful: 32
    },
    {
      id: '3',
      question: 'Can I change my account settings?',
      answer: 'Yes! Go to Settings in the main menu to update your profile information, notification preferences, privacy settings, and appearance options. Changes are saved automatically.',
      category: 'account',
      helpful: 28
    },
    {
      id: '4',
      question: 'Why is the game running slowly?',
      answer: 'Performance issues can be caused by several factors. Try refreshing the page, clearing your browser cache, or closing other tabs. Make sure you\'re using a supported browser (Chrome, Firefox, Safari, or Edge).',
      category: 'technical',
      helpful: 19
    },
    {
      id: '5',
      question: 'How do I save my game progress?',
      answer: 'Game progress is automatically saved to your account. Make sure you\'re logged in to ensure your scores and achievements are preserved across sessions.',
      category: 'games',
      helpful: 41
    }
  ];

  const articles: SupportArticle[] = [
    {
      id: '1',
      title: 'Complete Guide to Quiz Ninja',
      description: 'Learn all the features and strategies for mastering Quiz Ninja',
      category: 'games',
      readTime: '5 min',
      popularity: 4.8
    },
    {
      id: '2',
      title: 'Setting Up Your Profile',
      description: 'Customize your profile and privacy settings',
      category: 'getting-started',
      readTime: '3 min',
      popularity: 4.6
    },
    {
      id: '3',
      title: 'Troubleshooting Common Issues',
      description: 'Solutions for the most common technical problems',
      category: 'technical',
      readTime: '7 min',
      popularity: 4.4
    },
    {
      id: '4',
      title: 'Calculator Advanced Features',
      description: 'Unlock the full potential of the scientific calculator',
      category: 'games',
      readTime: '4 min',
      popularity: 4.2
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Help Center
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to your questions, learn how to use our features, and get the support you need.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Popular Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {article.popularity}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {faq.answer}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {faq.helpful} people found this helpful
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Us
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  Getting Started Guide
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  Video Tutorials
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  Community Forum
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  Feature Requests
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  Report a Bug
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9 AM - 6 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10 AM - 4 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;