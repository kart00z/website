import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [scrollRotation, setScrollRotation] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollRotation(scrolled * 0.5);

      // Determine active section based on scroll position
      const sections = ['intro', 'vita', 'portfolio', 'contact'];
      const windowHeight = window.innerHeight;
      
      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Theme Toggle - Sun/Moon */}
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? (
            // Moon icon for dark mode
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            // Sun icon for light mode
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
            </svg>
          )}
        </button>

        {/* Glass Navigation */}
        <nav className="glass-nav" data-testid="main-navigation">
          <button
            onClick={() => scrollToSection('intro')}
            className={`nav-link ${activeSection === 'intro' ? 'active' : ''}`}
            data-testid="nav-intro"
          >
            01 INTRO
          </button>
          <button
            onClick={() => scrollToSection('vita')}
            className={`nav-link ${activeSection === 'vita' ? 'active' : ''}`}
            data-testid="nav-vita"
          >
            02 VITA
          </button>
          <button
            onClick={() => scrollToSection('portfolio')}
            className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
            data-testid="nav-portfolio"
          >
            03 PORTFOLIO
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            data-testid="nav-contact"
          >
            04 CONTACT
          </button>
        </nav>

        {/* INTRO Section */}
        <section id="intro" className="section" data-testid="intro-section">
          <div className="content-wrapper">
            <div className="vertical-line"></div>
            <div className="main-content">
              <h1 className="hero-title" data-testid="hero-title">
                <span className="text-intro">i am</span>{' '}
                <span className="name-primary">kartikye</span>{' '}
                <span className="name-secondary">kashyap</span>
              </h1>
              
              <div className="statements" data-testid="intro-statements">
                <p className="statement fade-in-1">
                  i bridge technology and creativity.
                </p>
                <p className="statement fade-in-2">
                  i think the tools we build shape the art we make.
                </p>
                <p className="statement fade-in-3">
                  i think ai can be powerful{' '}
                  <span className="highlight-tool" data-testid="tool-highlight">tool</span>.
                </p>
                <p className="statement fade-in-4">
                  i create without limits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VITA Section */}
        <section id="vita" className="section section-alt" data-testid="vita-section">
          <div className="content-wrapper">
            <div className="vertical-line"></div>
            <div className="main-content">
              <h2 className="section-title" data-testid="vita-title">vita</h2>
              
              <div className="glass-card" data-testid="vita-content">
                <div className="vita-item">
                  <h3 className="vita-heading">Experience & Background</h3>
                  <p className="vita-text">
                    A multidisciplinary creator at the intersection of technology and creativity.
                  </p>
                  <p className="vita-text">
                    Exploring the boundaries of what's possible with AI, design, and development.
                  </p>
                </div>
                
                <div className="vita-item">
                  <h3 className="vita-heading">Philosophy</h3>
                  <p className="vita-text">
                    I believe in creating tools that empower creativity rather than replace it.
                  </p>
                  <p className="vita-text">
                    Every project is an opportunity to push boundaries and challenge conventions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO Section */}
        <section id="portfolio" className="section" data-testid="portfolio-section">
          <div className="content-wrapper">
            <div className="vertical-line"></div>
            <div className="main-content">
              <h2 className="section-title" data-testid="portfolio-title">portfolio</h2>
              
              <div className="glass-card" data-testid="portfolio-content">
                <div className="portfolio-placeholder">
                  <p className="placeholder-text">
                    Portfolio showcase coming soon.
                  </p>
                  <p className="placeholder-subtext">
                    Selected works and projects will be featured here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT Section */}
        <section id="contact" className="section section-alt" data-testid="contact-section">
          <div className="content-wrapper">
            <div className="vertical-line"></div>
            <div className="main-content">
              <h2 className="section-title" data-testid="contact-title">contact</h2>
              
              <div className="glass-card" data-testid="contact-content">
                <p className="contact-intro">
                  Let's create something exceptional together.
                </p>
                
                <div className="contact-links">
                  <a
                    href="mailto:kartikye@example.com"
                    className="contact-link"
                    data-testid="contact-email"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 7 10-7" />
                    </svg>
                    <span>Email</span>
                  </a>
                  
                  <a
                    href="https://www.linkedin.com/in/kartikye-kashyap-35930527b/"
                    className="contact-link"
                    data-testid="contact-linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p className="footer-text">© 2025 Kartikye Kashyap. Creating without limits.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;