import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    // Initialize canvas animation if needed
    const canvas = document.getElementById('canvasOne') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Add canvas animation logic here if needed
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // You can add email sending logic or API calls here
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
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
            <span className="navbar-toggler-icon"></span>
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
            Contact Information
          </h1>
          <p className="lead text-white mb-0">Let's connect! Here's how you can reach me</p>
        </header>
        
        {/* Contact Section */}
        <section className="section-modern mb-4">
          <div className="card box-shadow fade-in">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-lg-6">
                  <h2 className="mb-3 h4">Get In Touch</h2>
                  <p>I'm always interested in discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fa fa-envelope text-success fa-2x"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1">Email</h3>
                      <p className="mb-0">straydogsyndicationsllc@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fa fa-map-marker-alt text-success fa-2x"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1">Location</h3>
                      <p className="mb-0">Rhode Island, USA</p>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <h3 className="h6 mt-3 mb-2">Connect on Social Media</h3>
                  <div className="contact-social-links">
                    <a 
                      href="https://www.linkedin.com/in/eric-petross" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="LinkedIn Profile"
                      className="d-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                    >
                      <i className="fab fa-linkedin linkedin-color me-2"></i>
                      <span>LinkedIn</span>
                    </a>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61566503975625" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Facebook Profile"
                      className="d-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                    >
                      <i className="fab fa-facebook facebook-color me-2"></i>
                      <span>Facebook</span>
                    </a>
                    <a 
                      href="https://github.com/StrayDogSyn" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="GitHub Profile"
                      className="d-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                    >
                      <i className="fab fa-github github-color me-2"></i>
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="col-lg-6 mt-3 mt-lg-0">
                  <h2 className="mb-3 h4">Send Me a Message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Your Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Your Message</label>
                      <textarea 
                        className="form-control" 
                        id="message" 
                        name="message" 
                        rows={5} 
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-success">
                      <i className="fa fa-paper-plane me-2"></i>Send Message
                    </button>
                  </form>
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
                  <i className="fab fa-facebook fa-2x facebook-color"></i>
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