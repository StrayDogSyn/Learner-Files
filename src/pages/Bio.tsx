import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Bio: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <hgroup className="container-modern text-center fw-bold bg-transparent box-shadow py-3 bio-header">
        <img src="./assets/images/two.webp" alt="Background Pattern" className="bg-image bg-image--header" />
        <canvas id="canvasOne" width="875" height="110" className="my-2 canvas rounded-5"></canvas>
      </hgroup>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark background box-shadow mb-4 bio-nav">
        <img src="./assets/images/four.webp" alt="Navigation Background" className="bg-image bg-image--nav" />
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
                <Link className="nav-link active" to="/bio">
                  <i className="fa fa-info-circle fa-lg me-2"></i>About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  <i className="fa fa-mail-bulk fa-lg me-2"></i>Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-modern py-4">
        {/* Header */}
        <header className="text-center mb-5 fade-in bio-main-header">
          <img src="./assets/images/three.webp" alt="Background Pattern" className="bg-image bg-image--header" />
          <h1 className="display-4 text-white fw-bold mb-3">
            <i className="fa fa-user-astronaut me-2"></i>
            About The Author
          </h1>
          <p className="lead text-white">Learn more about my background, skills and journey</p>
        </header>
        
        {/* Skills Section */}
        <section className="section-modern mb-5">
          <div className="row justify-content-between">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card box-shadow fade-in">
                <div className="card-body text-center">
                  <i className="fab fa-html5 fa-3x mb-3 text-warning"></i>
                  <i className="fab fa-css3-alt fa-3x mb-3 text-info mx-2"></i>
                  <i className="fab fa-bootstrap fa-3x mb-3 text-primary"></i>
                  <h2 className="card-title h4">Web Development Fundamentals</h2>
                  <p className="card-text">
                    As an active alumni of the ever-expanding, <i className="fa fa-quote-left"></i> The Last Mile
                    Program &trade; <i className="fa fa-quote-right"></i>, I have learned the fundamentals of modern web
                    development. Utilizing up-to-date technologies by completing various intensive study technical bootcamps in order to be as current
                    as possible with today's ever changing digital environments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card box-shadow fade-in">
                <div className="card-body text-center">
                  <i className="fab fa-js-square fa-3x mb-3 text-warning"></i>
                  <h2 className="card-title h4">Object Orientated Programming</h2>
                  <p className="card-text">
                    As a fundamental programming language for both server-side &amp; client-side web-based
                    applications, web pages, and object-orientated programming, JavaScript has become one of the most used
                    languages on the web today.<br /> Therefore, a mastery of this language is not only essential, but an
                    excellent gateway into learning the plethora of C-based programming languages available today.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card box-shadow fade-in">
                <div className="card-body text-center">
                  <i className="fab fa-unity fa-3x mb-3 text-success me-2"></i>
                  <i className="fab fa-react fa-3x mb-3 text-info me-2"></i>
                  <i className="fab fa-python fa-3x mb-3 text-primary"></i>
                  <h2 className="card-title h4">Expanding Knowledge Base</h2>
                  <p className="card-text">
                    <i className="fa fa-quote-left"></i> Never stop learning <i className="fa fa-quote-right"></i>
                    ...The best advice ever given in life to a young man. Following this personal credo, my ever-expanding
                    knowledge base continues to grow daily. Working to eventually become a full-stack developer, through learning the fundamentals
                    of the <i className="fa fa-database"></i> M.E.R.N. &amp; M.E.A.N. stacks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Journey Section */}
        <section className="section-modern">
          <div className="card box-shadow fade-in">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4 mb-3 mb-md-0 text-center">
                  <img 
                    src="./assets/images/rubix.jpeg" 
                    alt="A rubix cube" 
                    className="img-fluid rounded-circle box-shadow mb-3 bio-profile-image" 
                  />
                  <figcaption className="text-center mb-3">
                    Programming has become my personal ever-evolving puzzle game...
                  </figcaption>
                  <div className="text-center">
                    <Link to="/projects/knucklebones" className="btn btn-outline-success">
                      <i className="fa fa-dice me-2"></i>Featured Project: Knucklebones
                    </Link>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <h2 className="mb-4">Learning Journey</h2>
                  <p>
                    My journey into web development began with a simple curiosity that quickly evolved into a passion. 
                    All thanks to The Last Mile Program&trade;, I've had the opportunity to explore various aspects of modern development:
                  </p>
                  <ul>
                    <li>Expanding language skills with Typescript and Python</li>
                    <li>Learning new technologies like Unity programming for tablet gaming</li>
                    <li>Exploring the fundamentals of M.E.R.N. &amp; M.E.A.N. stacks</li>
                    <li>Building practical applications that solve real-world problems</li>
                  </ul>
                  <div className="btn-container mt-4">
                    <Link to="/projects" className="btn btn-outline-success">
                      <i className="fa fa-folder-open me-2"></i>View All Projects
                    </Link>
                    <a href="./resume/index.html" className="btn btn-outline-success ms-2">
                      <i className="fa fa-file-alt me-2"></i>View Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container-fluid background text-white py-5 mt-5">
        <div className="container-modern">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="h4 mb-4">Navigation</h2>
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
                  className="img-fluid rounded-circle mb-3 bio-footer-logo" 
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
                  <i className="fab fa-linkedin fa-2x bio-social-linkedin"></i>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61566503975625" 
                  className="text-decoration-none" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Facebook Profile"
                >
                  <i className="fab fa-facebook fa-2x bio-social-facebook"></i>
                </a>
                <a 
                  href="https://github.com/StrayDogSyn" 
                  className="text-decoration-none" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="GitHub Profile"
                >
                  <i className="fab fa-github fa-2x bio-social-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Bio;