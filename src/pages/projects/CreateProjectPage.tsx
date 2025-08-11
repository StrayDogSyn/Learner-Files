// Temporary stub for CreateProjectPage
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Plus, X, Github, ExternalLink } from 'lucide-react';

interface ProjectFormData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  status: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  image: string;
}

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    category: 'web',
    status: 'planned',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    image: ''
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'web', label: 'Web Application' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'desktop', label: 'Desktop App' },
    { value: 'ai', label: 'AI/ML Project' },
    { value: 'game', label: 'Game' }
  ];

  const statuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating project:', formData);
      
      // Navigate to projects page or the new project detail page
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateImageUrl = () => {
    if (formData.title) {
      const prompt = encodeURIComponent(`${formData.title} ${formData.category} project interface modern design`);
      const imageUrl = `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_4_3`;
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/projects" 
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Projects</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white">Create New Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project title"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your project (1-2 sentences)"
              />
            </div>
            
            <div className="mt-6">
              <label htmlFor="longDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description including features, challenges, and learnings..."
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Featured Project</span>
                </label>
              </div>
            </div>
            
            {/* Technologies */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a technology (e.g., React, TypeScript)"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links and Media */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Links &amp; Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  <Github className="w-4 h-4 inline mr-1" />
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/repository"
                />
              </div>
              
              <div>
                <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  <ExternalLink className="w-4 h-4 inline mr-1" />
                  Live Demo URL
                </label>
                <input
                  type="url"
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-project.com"
                />
              </div>
            </div>
            
            {/* Project Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Project Image URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={generateImageUrl}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Generate</span>
                </button>
              </div>
              {formData.image && (
                <div className="mt-4">
                  <img 
                    src={formData.image} 
                    alt="Project preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <Link 
              to="/projects"
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Creating...' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;