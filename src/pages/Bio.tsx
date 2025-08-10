import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/bio-enhanced.css';
import './Bio.css';

interface Experience {
  year: string;
  title: string;
  description: string;
  achievements: string[];
  company?: string;
  duration?: string;
}

interface Skill {
  name: string;
  proficiency: number;
  category: 'frontend' | 'backend' | 'tools' | 'languages';
  projects: string[];
  certifications?: string[];
  learningProgress?: number;
}

interface CodeWarsStats {
  rank: string;
  honor: number;
  completed: number;
  recentKatas: string[];
}

const Bio: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const [currentLearningGoal, setCurrentLearningGoal] = useState(0);

  const typewriterTexts = [
    "Full-Stack Developer",
    "Problem Solver",
    "Lifelong Learner",
    "Creative Coder"
  ];

  const funFacts = [
    "I can solve a Rubik's cube in under 2 minutes",
    "I once coded for 36 hours straight during a hackathon",
    "My first program was a text-based adventure game",
    "I'm learning to play the guitar while debugging",
    "I have a collection of 50+ programming books"
  ];

  const learningGoals = [
    "Master React 18 and Next.js 14",
    "Learn Rust for systems programming",
    "Build a blockchain project",
    "Contribute to open source",
    "Get AWS Solutions Architect certification"
  ];

  const experiences: Experience[] = [
    {
      year: "2024",
      title: "Full-Stack Developer",
      company: "Freelance & Personal Projects",
      duration: "Present",
      description: "Building modern web applications using React, Node.js, and various modern technologies.",
      achievements: ["Portfolio Website", "E-commerce Platform", "Real-time Chat App"]
    },
    {
      year: "2023",
      title: "Web Development Bootcamp",
      company: "The Last Mile Program",
      duration: "6 months",
      description: "Intensive full-stack development training covering modern web technologies.",
      achievements: ["JavaScript Mastery", "React Fundamentals", "Node.js Backend"]
    },
    {
      year: "2022",
      title: "Programming Fundamentals",
      company: "Self-Study",
      duration: "1 year",
      description: "Started learning programming basics with HTML, CSS, and JavaScript.",
      achievements: ["First Website", "Calculator App", "Basic Games"]
    }
  ];

  const skills: Skill[] = [
    {
      name: "React",
      proficiency: 85,
      category: "frontend",
      projects: ["Portfolio Website", "E-commerce App", "Dashboard"],
      learningProgress: 85
    },
    {
      name: "TypeScript",
      proficiency: 75,
      category: "languages",
      projects: ["Portfolio", "API Integration", "Type-safe Components"],
      learningProgress: 75
    },
    {
      name: "Node.js",
      proficiency: 70,
      category: "backend",
      projects: ["REST APIs", "Authentication", "Database Integration"],
      learningProgress: 70
    },
    {
      name: "Python",
      proficiency: 60,
      category: "languages",
      projects: ["Data Analysis", "Automation Scripts", "Web Scraping"],
      learningProgress: 60
    },
    {
      name: "Unity",
      proficiency: 50,
      category: "tools",
      projects: ["2D Games", "Interactive Experiences", "Prototypes"],
      learningProgress: 50
    }
  ];

  const codewarsStats: CodeWarsStats = {
    rank: "5 kyu",
    honor: 1250,
    completed: 47,
    recentKatas: ["Valid Parentheses", "Two Sum", "Fibonacci Sequence", "Palindrome Checker"]
  };

  const favoriteTools = [
    { name: "VS Code", icon: "💻", description: "My primary code editor" },
    { name: "Git", icon: "📚", description: "Version control mastery" },
    { name: "Chrome DevTools", icon: "🔍", description: "Debugging companion" },
    { name: "Postman", icon: "📮", description: "API testing tool" },
    { name: "Figma", icon: "🎨", description: "Design collaboration" }
  ];

  // Typewriter effect
  useEffect(() => {
    if (isTyping) {
      const currentText = typewriterTexts[currentTextIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= currentText.length) {
          setDisplayText(currentText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    } else {
      const timeout = setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
        setIsTyping(true);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isTyping, currentTextIndex]);

  // Rotate fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFunFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [funFacts.length]);

  // Rotate learning goals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLearningGoal((prev) => (prev + 1) % learningGoals.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [learningGoals.length]);

  const getSkillColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'from-blue-500 to-cyan-500';
      case 'backend': return 'from-green-500 to-emerald-500';
      case 'tools': return 'from-purple-500 to-pink-500';
      case 'languages': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

      {/* Hero Section */}
      <section className="bio-hero py-5 mb-5">
        <div className="container-modern">
          <div className="row align-items-center">
            <div className="col-lg-4 text-center mb-4 mb-lg-0">
              <div className="avatar-container position-relative">
                <img 
                  src="./assets/images/rubix.jpeg" 
                  alt="Profile" 
                  className="rounded-circle img-fluid bio-avatar box-shadow profile-avatar"
                />
                <div className="status-indicator online position-absolute top-0 end-0 bg-success text-white px-3 py-1 rounded-pill">
                  <span className="small">
                    <i className="fa fa-circle me-1"></i>
                    Available for Projects
                  </span>
                </div>
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="bio-content text-center text-lg-start">
                <h1 className="animated-text display-3 text-white fw-bold mb-3">
                  <span className="text-gradient">Eric Petross</span>
                </h1>
                <h2 className="typewriter-text h2 text-light mb-3">
                  {displayText}
                  <span className="cursor-blink">|</span>
                </h2>
                <p className="bio-description lead text-light mb-4">
                  Passionate full-stack developer with a love for creating innovative solutions. 
                  Graduate of The Last Mile Program&trade;, constantly expanding my knowledge 
                  and building projects that make a difference.
                </p>
                
                {/* Fun Fact Rotator */}
                <div className="fun-fact-container glass-container-minimal rounded-pill px-4 py-2 mb-4">
                  <p className="text-warning mb-0">
                    <i className="fa fa-lightbulb me-2"></i>
                    {funFacts[funFactIndex]}
                  </p>
                </div>

                {/* Current Learning Goal */}
                <div className="learning-goal-container glass-container-accent rounded-pill px-4 py-2">
                  <p className="text-info mb-0">
                    <i className="fa fa-graduation-cap me-2"></i>
                    Currently learning: {learningGoals[currentLearningGoal]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="experience-timeline py-5 mb-5">
        <div className="container-modern">
          <h2 className="text-center text-white mb-5">
            <i className="fa fa-road me-2"></i>
            My Journey
          </h2>
          <div className="timeline-container position-relative">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item mb-4" data-year={exp.year}>
                <div className="row align-items-center">
                  <div className="col-md-4 text-center text-md-end">
                    <div className="timeline-year bg-primary text-white rounded-pill px-4 py-2 d-inline-block">
                      <h3 className="h4 mb-0">{exp.year}</h3>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="timeline-content glass-container text-white p-4 rounded-3 box-shadow">
                      <h3 className="h5 text-primary mb-2">{exp.title}</h3>
                      {exp.company && (
                        <p className="text-muted mb-2">
                          <i className="fa fa-building me-2"></i>
                          {exp.company}
                          {exp.duration && <span className="ms-2">• {exp.duration}</span>}
                        </p>
                      )}
                      <p className="mb-3">{exp.description}</p>
                      <div className="achievements">
                        {exp.achievements.map((achievement, idx) => (
                          <span key={idx} className="achievement-badge glass-badge text-success px-3 py-1 rounded-pill me-2 mb-2 d-inline-block">
                            <i className="fa fa-trophy me-1"></i>
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Visualization */}
      <section className="skills-visualization py-5 mb-5">
        <div className="container-modern">
          <h2 className="text-center text-white mb-5">
            <i className="fa fa-code me-2"></i>
            Skills & Expertise
          </h2>
          <div className="row">
            {skills.map((skill, index) => (
              <div key={index} className="col-lg-6 mb-4">
                <div 
                  className="skill-card glass-container p-4 rounded-3 box-shadow h-100"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 text-white mb-0">{skill.name}</h3>
                    <span className={`badge bg-gradient ${getSkillColor(skill.category)}`}>
                      {skill.category}
                    </span>
                  </div>
                  
                  {/* Proficiency Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-light mb-1">
                      <span>Proficiency</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="progress skill-progress-bar">
                      <div 
                        className="progress-bar bg-gradient skill-proficiency-bar" 
                        style={{ 
                          "--progress-width": `${skill.proficiency}%`,
                          "--gradient-start": getSkillColor(skill.category).split(' ')[1],
                          "--gradient-end": getSkillColor(skill.category).split(' ')[3]
                        } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>

                  {/* Learning Progress */}
                  {skill.learningProgress && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between text-light mb-1">
                        <span>Learning Progress</span>
                        <span>{skill.learningProgress}%</span>
                      </div>
                      <div className="progress learning-progress-bar">
                        <div 
                          className="progress-bar bg-info learning-progress-fill" 
                          style={{ "--progress-width": `${skill.learningProgress}%` } as React.CSSProperties}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  <div className="mb-3">
                    <h6 className="text-light mb-2">Related Projects:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {skill.projects.map((project, idx) => (
                        <span key={idx} className="badge glass-badge">
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {skill.certifications && skill.certifications.length > 0 && (
                    <div>
                      <h6 className="text-light mb-2">Certifications:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {skill.certifications.map((cert, idx) => (
                          <span key={idx} className="badge bg-warning text-dark">
                            <i className="fa fa-certificate me-1"></i>
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CodeWars Integration */}
      <section className="codewars-stats py-5 mb-5">
        <div className="container-modern">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card glass-container text-white box-shadow">
                <div className="card-body text-center">
                  <h3 className="card-title h4 mb-4">
                    <i className="fa fa-trophy me-2 text-warning"></i>
                    Coding Challenge Stats
                  </h3>
                  <div className="stats-grid row mb-4">
                    <div className="col-md-4 mb-3">
                      <div className="stat-item glass-container-accent p-3 rounded-3">
                        <h4 className="h5 text-primary mb-1">Rank</h4>
                        <p className="h3 mb-0 text-white">{codewarsStats.rank}</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="stat-item glass-container-success p-3 rounded-3">
                        <h4 className="h5 text-success mb-1">Honor</h4>
                        <p className="h3 mb-0 text-white">{codewarsStats.honor}</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="stat-item glass-container-info p-3 rounded-3">
                        <h4 className="h5 text-info mb-1">Completed</h4>
                        <p className="h3 mb-0 text-white">{codewarsStats.completed}</p>
                      </div>
                    </div>
                  </div>
                  <div className="recent-katas">
                    <h5 className="mb-3">Recent Challenges</h5>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      {codewarsStats.recentKatas.map((kata, index) => (
                        <span key={index} className="badge glass-badge px-3 py-2">
                          {kata}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Touch - Favorite Tools */}
      <section className="favorite-tools py-5 mb-5">
        <div className="container-modern">
          <h2 className="text-center text-white mb-5">
            <i className="fa fa-tools me-2"></i>
            My Favorite Tools
          </h2>
          <div className="row">
            {favoriteTools.map((tool, index) => (
              <div key={index} className="col-md-4 col-lg-2 mb-4">
                <div className="tool-card text-center glass-container p-4 rounded-3 box-shadow h-100">
                  <div className="tool-icon mb-3">
                    <span className="display-6">{tool.icon}</span>
                  </div>
                  <h5 className="text-white mb-2">{tool.name}</h5>
                  <p className="text-muted small mb-0">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5 mb-5">
        <div className="container-modern text-center">
          <div className="glass-container p-5 rounded-3 box-shadow">
            <h2 className="text-white mb-4">Ready to Work Together?</h2>
            <p className="lead text-light mb-4">
              Let's build something amazing together. I'm always excited to take on new challenges 
              and collaborate on innovative projects.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/projects" className="btn btn-primary btn-lg">
                <i className="fa fa-folder-open me-2"></i>
                View My Projects
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">
                <i className="fa fa-envelope me-2"></i>
                Get In Touch
              </Link>
              <a href="./resume/index.html" className="btn btn-outline-info btn-lg">
                <i className="fa fa-file-alt me-2"></i>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

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
              <p className="mb-1">&copy; 2025 <a href="https://www.straydog-syndications-llc.com" target="_blank" rel="noopener noreferrer" title="Visit StrayDog Syndications LLC" className="text-white text-decoration-none">StrayDog Syndications LLC</a>.</p>
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