import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/contact.css';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
  preferredContact: string;
}

interface MessageTemplate {
  id: string;
  title: string;
  content: string;
}

interface ConversationHistory {
  id: string;
  date: string;
  subject: string;
  status: 'pending' | 'responded' | 'closed';
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: '',
    preferredContact: 'email'
  });

  const [activeChannel, setActiveChannel] = useState<string>('email');
  const [draftSaved, setDraftSaved] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [faqSuggestions, setFaqSuggestions] = useState<string[]>([]);
  const [previouslyViewedProject, setPreviouslyViewedProject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseTime, setResponseTime] = useState<string>('24 hours');
  
  const chatRef = useRef<HTMLDivElement>(null);

  // Message templates for different inquiry types
  const messageTemplates: Record<string, MessageTemplate> = {
    hiring: {
      id: 'hiring',
      title: 'Hiring/Freelance',
      content: "I'm interested in discussing a project opportunity with you. I've reviewed your portfolio and believe my skills would be a great fit for your needs. Could you tell me more about the project requirements and timeline?"
    },
    collaboration: {
      id: 'collaboration',
      title: 'Collaboration',
      content: "I'd like to collaborate on an exciting project. I'm particularly interested in [specific area] and think we could create something amazing together. What are your thoughts on potential collaboration opportunities?"
    },
    feedback: {
      id: 'feedback',
      title: 'Feedback',
      content: "I wanted to share some feedback about your work. I really enjoyed [specific aspect] and had some thoughts on [improvement area]. Would you be open to discussing this further?"
    },
    general: {
      id: 'general',
      title: 'General Inquiry',
      content: "I have a general question about your services and would appreciate the opportunity to learn more. Could you provide some additional information?"
    }
  };

  // FAQ suggestions based on message content
  const faqDatabase = {
    'project': ['What is your typical project timeline?', 'Do you offer ongoing support?', 'What technologies do you specialize in?'],
    'pricing': ['What are your rates?', 'Do you offer package deals?', 'Is there a minimum project size?'],
    'availability': ['When are you available for new projects?', 'Do you work with international clients?', 'What is your response time?'],
    'portfolio': ['Can you share more examples of your work?', 'Do you have case studies available?', 'What industries do you work with?']
  };

  useEffect(() => {
    // Detect previously viewed project from localStorage or session
    const lastProject = localStorage.getItem('lastViewedProject');
    if (lastProject) {
      setPreviouslyViewedProject(lastProject);
    }

    // Load conversation history from localStorage
    const savedHistory = localStorage.getItem('conversationHistory');
    if (savedHistory) {
      setConversationHistory(JSON.parse(savedHistory));
    }

    // Set response time based on current time
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 9 && hour <= 17) {
      setResponseTime('2-4 hours');
    } else if (hour >= 18 && hour <= 22) {
      setResponseTime('12 hours');
    } else {
      setResponseTime('24 hours');
    }
  }, []);

  // Auto-detect visitor's intent and suggest subject
  const suggestSubject = () => {
    if (previouslyViewedProject) {
      return `Regarding ${previouslyViewedProject}`;
    }
    return '';
  };

  // Load message template based on inquiry type
  const loadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inquiryType = e.target.value;
    if (inquiryType && messageTemplates[inquiryType]) {
      setFormData(prev => ({
        ...prev,
        inquiryType,
        message: messageTemplates[inquiryType].content
      }));
    }
  };

  // Generate FAQ suggestions based on message content
  const generateFaqSuggestions = (message: string) => {
    const suggestions: string[] = [];
    Object.entries(faqDatabase).forEach(([keyword, faqs]) => {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        suggestions.push(...faqs);
      }
    });
    setFaqSuggestions(suggestions.slice(0, 3));
  };

  // Handle message changes and generate FAQ suggestions
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, message: value }));
    generateFaqSuggestions(value);
  };

  // Save draft to localStorage
  const saveDraft = () => {
    localStorage.setItem('contactDraft', JSON.stringify(formData));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  // Load draft from localStorage
  const loadDraft = () => {
    const savedDraft = localStorage.getItem('contactDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  };

  // Multi-channel contact functions
  const openEmailForm = () => setActiveChannel('email');
  const scheduleCall = () => setActiveChannel('calendar');
  const startChat = () => setActiveChannel('chat');
  const openGitHub = () => window.open('https://github.com/StrayDogSyn', '_blank');
  const openLinkedIn = () => window.open('https://www.linkedin.com/in/eric-petross', '_blank');

  // Calendar integration
  const embedCalendar = () => {
    // Cal.com or Calendly embed
    return (
      <div className="calendar-embed">
        <iframe
          src="https://cal.com/straydog/30min"
          width="100%"
          height="600"
          frameBorder="0"
          title="Schedule a meeting"
        />
      </div>
    );
  };

  // Live chat component
  const LiveChat = () => (
    <div className="live-chat" ref={chatRef}>
      <div className="chat-header">
        <h4>💬 Live Chat</h4>
        <p className="text-muted">Response time: {responseTime}</p>
      </div>
      <div className="chat-messages">
        <div className="message bot">
          <p>👋 Hi! I'm here to help. How can I assist you today?</p>
        </div>
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="form-control"
        />
        <button className="btn btn-primary">Send</button>
      </div>
    </div>
  );

  // Smart contact form with enhanced features
  const SmartContactForm = () => (
    <form className="smart-contact-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Your Name *</label>
            <input 
              type="text" 
              className="form-control" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="name"
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Your Email *</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              required 
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="inquiryType" className="form-label">Inquiry Type</label>
        <select 
          className="form-select" 
          id="inquiryType" 
          value={formData.inquiryType}
          onChange={loadTemplate}
        >
          <option value="">Select inquiry type</option>
          <option value="hiring">Hiring/Freelance</option>
          <option value="collaboration">Collaboration</option>
          <option value="feedback">Feedback</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="subject" className="form-label">Subject *</label>
        <input 
          type="text" 
          className="form-control" 
          id="subject" 
          name="subject" 
          value={formData.subject}
          onChange={handleInputChange}
          placeholder={suggestSubject() || "What's this about?"}
          required 
        />
      </div>

      <div className="mb-3">
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea 
          className="form-control" 
          id="message" 
          name="message" 
          rows={6} 
          value={formData.message}
          onChange={handleMessageChange}
          placeholder="Tell me more about your inquiry..."
          required
        ></textarea>
        
        {/* FAQ Suggestions */}
        {faqSuggestions.length > 0 && (
          <div className="faq-suggestions mt-2">
            <small className="text-muted">You might also want to ask about:</small>
            <div className="suggestion-chips">
              {faqSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2 mt-1"
                  onClick={() => setFormData(prev => ({ ...prev, message: prev.message + '\n\n' + suggestion }))}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Preferred Contact Method</label>
        <div className="contact-preferences">
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="radio" 
              name="preferredContact" 
              id="emailPref" 
              value="email"
              checked={formData.preferredContact === 'email'}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="emailPref">Email</label>
          </div>
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="radio" 
              name="preferredContact" 
              id="phonePref" 
              value="phone"
              checked={formData.preferredContact === 'phone'}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="phonePref">Phone</label>
          </div>
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="radio" 
              name="preferredContact" 
              id="videoPref" 
              value="video"
              checked={formData.preferredContact === 'video'}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="videoPref">Video Call</label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-success me-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Sending...
            </>
          ) : (
            <>
              <i className="fa fa-paper-plane me-2"></i>Send Message
            </>
          )}
        </button>
        <button 
          type="button" 
          className="btn btn-outline-secondary me-2"
          onClick={saveDraft}
        >
          <i className="fa fa-save me-2"></i>Save Draft
        </button>
        <button 
          type="button" 
          className="btn btn-outline-info"
          onClick={loadDraft}
        >
          <i className="fa fa-folder-open me-2"></i>Load Draft
        </button>
      </div>

      {draftSaved && (
        <div className="alert alert-success mt-3">
          <i className="fa fa-check me-2"></i>Draft saved successfully!
        </div>
      )}
    </form>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to conversation history
      const newConversation: ConversationHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        subject: formData.subject,
        status: 'pending'
      };
      
      setConversationHistory(prev => [newConversation, ...prev]);
      localStorage.setItem('conversationHistory', JSON.stringify([newConversation, ...conversationHistory]));

      // Auto-acknowledgment
      alert(`Thank you for your message! I'll get back to you within ${responseTime}. You'll receive a confirmation email shortly.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: '',
        preferredContact: 'email'
      });

      // Clear draft
      localStorage.removeItem('contactDraft');
      
    } catch {
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <hgroup className="container-modern text-center fw-bold bg-transparent box-shadow py-2 contact-header-container">
        <img src="./assets/images/two.webp" alt="Background Pattern" className="contact-bg-image contact-bg-header" />
        <canvas id="canvasOne" width="680" height="80" className="my-1 canvas rounded-5"></canvas>
      </hgroup>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark background box-shadow mb-3 contact-nav-container">
        <img src="./assets/images/four.webp" alt="Navigation Background" className="contact-bg-image contact-bg-nav" />
        <div className="container-modern">
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-togg-icon"></span>
          </button>
          
          <a 
            className="navbar-brand d-flex align-items-center" 
            href="https://www.straydog-syndications-llc.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            title="Visit StrayDog Syndications LLC"
          >
            <img 
              className="img-fluid box-shadow rounded-4" 
              src="./assets/logos/stray-gear.png" 
              width="60" 
              height="60"
              alt="StrayDog Logo" 
            />
            <h1 className="h4 ms-3 d-none d-md-inline text-white mb-0">StrayDog Syndications</h1>
          </a>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="fa fa-home fa-lg me-2"></i>Home Page
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/projects">
                  <i className="fa fa-project-diagram fa-lg me-2"></i>Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bio">
                  <i className="fa fa-info-circle fa-lg me-2"></i>About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/contact">
                  <i className="fa fa-mail-bulk fa-lg me-2"></i>Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-modern py-3">
        {/* Header */}
        <header className="text-center mb-4 fade-in contact-main-header">
          <img src="./assets/images/three.webp" alt="Background Pattern" className="contact-bg-image contact-bg-header" />
          <h1 className="display-5 text-white fw-bold mb-2">
            <i className="fa fa-mail-bulk me-2"></i>
            Smart Contact System
          </h1>
          <p className="lead text-white mb-0">Choose your preferred way to connect with me</p>
        </header>
        
        {/* Multi-Channel Contact Options */}
        <section className="section-modern mb-4">
          <div className="card box-shadow fade-in">
            <div className="card-body p-4">
              <h2 className="mb-4 h4 text-center">How would you like to connect?</h2>
              
              <div className="contact-options text-center">
                <button 
                  className={`btn btn-lg m-2 ${activeChannel === 'email' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={openEmailForm}
                >
                  📧 Email
                </button>
                <button 
                  className={`btn btn-lg m-2 ${activeChannel === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={scheduleCall}
                >
                  📅 Schedule Call
                </button>
                <button 
                  className={`btn btn-lg m-2 ${activeChannel === 'chat' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={startChat}
                >
                  💬 Live Chat
                </button>
                <button 
                  className="btn btn-lg m-2 btn-outline-dark"
                  onClick={openGitHub}
                >
                  🐙 GitHub
                </button>
                <button 
                  className="btn btn-lg m-2 btn-outline-info"
                  onClick={openLinkedIn}
                >
                  💼 LinkedIn
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Content Based on Selected Channel */}
        <section className="section-modern mb-4">
          <div className="card box-shadow fade-in">
            <div className="card-body p-4">
              {activeChannel === 'email' && (
                <div>
                  <h3 className="mb-3">📧 Send Me a Message</h3>
                  <SmartContactForm />
                </div>
              )}

              {activeChannel === 'calendar' && (
                <div>
                  <h3 className="mb-3">📅 Schedule a Meeting</h3>
                  <p className="mb-3">Choose a time that works best for you. I'm available for:</p>
                  <ul className="mb-4">
                    <li>📋 Project consultations (30 min)</li>
                    <li>🤝 Collaboration discussions (45 min)</li>
                    <li>💼 Career advice sessions (30 min)</li>
                    <li>🔧 Technical reviews (60 min)</li>
                  </ul>
                  {embedCalendar()}
                </div>
              )}

              {activeChannel === 'chat' && (
                <div>
                  <h3 className="mb-3">💬 Live Chat</h3>
                  <LiveChat />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <section className="section-modern mb-4">
            <div className="card box-shadow fade-in">
              <div className="card-body p-4">
                <h3 className="mb-3">📚 Recent Conversations</h3>
                <div className="conversation-history">
                  {conversationHistory.map(conversation => (
                    <div key={conversation.id} className="conversation-item p-3 border rounded mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{conversation.subject}</strong>
                          <small className="text-muted d-block">{new Date(conversation.date).toLocaleDateString()}</small>
                        </div>
                        <span className={`badge ${conversation.status === 'pending' ? 'bg-warning' : conversation.status === 'responded' ? 'bg-success' : 'bg-secondary'}`}>
                          {conversation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section className="section-modern mb-4">
          <div className="card box-shadow fade-in">
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-6">
                  <h3 className="mb-3">📍 Contact Information</h3>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fa fa-envelope text-success fa-2x"></i>
                    </div>
                    <div>
                      <h4 className="h6 mb-1">Email</h4>
                      <p className="mb-0">straydogsyndicationsllc@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fa fa-map-marker-alt text-success fa-2x"></i>
                    </div>
                    <div>
                      <h4 className="h6 mb-1">Location</h4>
                      <p className="mb-0">Rhode Island, USA</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fa fa-clock text-success fa-2x"></i>
                    </div>
                    <div>
                      <h4 className="h6 mb-1">Response Time</h4>
                      <p className="mb-0">Usually within {responseTime}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6">
                  <h3 className="mb-3">🔗 Quick Links</h3>
                  <div className="quick-links">
                    <a 
                      href="https://www.linkedin.com/in/eric-petross" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-primary btn-lg w-100 mb-2"
                    >
                      <i className="fab fa-linkedin me-2"></i>LinkedIn Profile
                    </a>
                    <a 
                      href="https://github.com/StrayDogSyn" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-dark btn-lg w-100 mb-2"
                    >
                      <i className="fab fa-github me-2"></i>GitHub Portfolio
                    </a>
                    <a 
                      href="https://www.straydog-syndications-llc.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-success btn-lg w-100"
                    >
                      <i className="fa fa-globe me-2"></i>Company Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="container-fluid background text-white py-3 mt-3">
        <div className="container-modern">
          <div className="row">
            <div className="col-md-6 mb-2 mb-md-0">
              <h2 className="h5 mb-3">Navigation</h2>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-white">
                    <i className="fa fa-home me-2"></i>Home
                  </Link>
                </li>
                <li className="mb-2">
                  <a href="./resume/index.html" className="text-white">
                    <i className="fa fa-pen-alt me-2"></i>Resume
                  </a>
                </li>
                <li className="mb-2">
                  <Link to="/projects" className="text-white">
                    <i className="fa fa-code me-2"></i>Projects
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/bio" className="text-white">
                    <i className="fa fa-info-circle me-2"></i>About
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-white">
                    <i className="fa fa-mail-bulk me-2"></i>Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-md-6 text-md-end">
              <a 
                href="https://www.straydog-syndications-llc.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Visit StrayDog Syndications LLC"
              >
                <img 
                  className="img-fluid rounded-circle mb-3 contact-footer-logo" 
                  src="./assets/logos/stray-gear.png" 
                  alt="StrayDog Logo" 
                />
              </a>
              <p className="mb-1">&copy; 2025 StrayDog Syndications LLC.</p>
              <p className="small">
                Powered by <a href="https://thelastmile.org" className="text-white">The Last Mile&trade;</a>
              </p>
              <div className="mt-3 social-icons">
                <a 
                  href="https://www.linkedin.com/in/eric-petross" 
                  className="text-decoration-none" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="LinkedIn Profile"
                >
                  <i className="fab fa-linkedin fa-2x linkedin-color"></i>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61566503975625" 
                  className="text-decoration-none" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Facebook Profile"
                >
                  <i className="fa fa-facebook fa-2x facebook-color"></i>
                </a>
                <a 
                  href="https://github.com/StrayDogSyn" 
                  className="text-decoration-none" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="GitHub Profile"
                >
                  <i className="fab fa-github fa-2x github-color"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;