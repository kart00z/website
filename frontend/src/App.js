import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [scrollRotation, setScrollRotation] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');
  const [theme, setTheme] = useState('dark');

  // Video playback with tighter sync - using requestAnimationFrame for smoother sync
  useEffect(() => {
    let animationId;
    
    const syncAllVideos = () => {
      document.querySelectorAll('.gallery-card').forEach(card => {
        const main = card.querySelector('.gallery-video-main');
        const reflect = card.querySelector('.gallery-video-reflect');
        
        if (main && reflect) {
          // Only sync if drift is noticeable (>0.1 seconds)
          if (Math.abs(main.currentTime - reflect.currentTime) > 0.1) {
            reflect.currentTime = main.currentTime;
          }
          // Ensure both are playing
          if (main.paused) main.play().catch(() => {});
          if (reflect.paused) reflect.play().catch(() => {});
        }
      });
      // Check sync every ~500ms using RAF for smoother timing
      animationId = setTimeout(() => requestAnimationFrame(syncAllVideos), 500);
    };

    // Start sync after initial load
    const startTimeout = setTimeout(() => {
      syncAllVideos();
    }, 300);
    
    // Also sync on user interaction (helps mobile browsers)
    const handleInteraction = () => syncAllVideos();
    document.addEventListener('click', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(animationId);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollRotation(scrolled * 0.5);

      // Determine active section based on scroll position
      const sections = ['intro', 'portfolio', 'vita', 'contact'];
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
    // Smooth one-direction carousel rotation
    const rotateGallery = () => {
      const cards = document.querySelectorAll('.gallery-card');
      if (cards.length === 0) return;
      
      cards.forEach(card => {
        const currentPos = parseInt(card.dataset.position || card.dataset.index);
        // Move to next position (circular, one direction)
        const nextPos = (currentPos + 1) % cards.length;
        card.dataset.position = nextPos;
        
        // Update classes
        card.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4', 'active');
        card.classList.add(`pos-${nextPos}`);
        
        // Center card (position 2) is active
        if (nextPos === 2) {
          card.classList.add('active');
        }
      });
    };

    // Initialize positions
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach((card, index) => {
      card.dataset.position = index;
      card.classList.add(`pos-${index}`);
      if (index === 2) {
        card.classList.add('active');
      }
    });

    const interval = setInterval(rotateGallery, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // iOS Safari requires direct style manipulation - CSS variables don't always work
    const root = document.documentElement;
    const body = document.body;
    
    // Set attributes
    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    
    // Toggle classes
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    body.classList.remove('dark', 'light');
    body.classList.add(theme);
    
    // Direct style manipulation for iOS Safari
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--text-tertiary', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.02)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--glass-hover-bg', 'rgba(0, 0, 0, 0.04)');
      root.style.setProperty('--glass-hover-border', 'rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--glow-color', 'rgba(0, 0, 0, 0.05)');
    } else {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--text-tertiary', 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.02)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-hover-bg', 'rgba(255, 255, 255, 0.04)');
      root.style.setProperty('--glass-hover-border', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--glow-color', 'rgba(255, 255, 255, 0.1)');
    }
  }, [theme]);

  const toggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Theme styles for iOS Safari compatibility (inline styles as fallback)
  const themeStyles = {
    background: theme === 'dark' ? '#000000' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  };

  return (
    <BrowserRouter>
      <div className="App" style={themeStyles} data-theme={theme}>
        {/* Theme Toggle - Sun/Moon */}
        <button 
          type="button"
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? (
            // Moon icon for dark mode
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              style={{ transform: `rotate(${scrollRotation}deg)` }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            // Sun icon for light mode
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              style={{ transform: `rotate(${scrollRotation}deg)` }}
            >
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
            onClick={() => scrollToSection('portfolio')}
            className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
            data-testid="nav-portfolio"
          >
            02 PORTFOLIO
          </button>
          <button
            onClick={() => scrollToSection('vita')}
            className={`nav-link ${activeSection === 'vita' ? 'active' : ''}`}
            data-testid="nav-vita"
          >
            03 VITA
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
        <section id="intro" className="section intro-section" data-testid="intro-section">
          <div className="intro-layout">
            {/* Left: Text Content */}
            <div className="intro-text-content">
              <div className="vertical-line"></div>
              <div className="intro-text-inner">
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

            {/* Right: Video Gallery */}
            <div className="gallery-container" data-testid="video-gallery">
              <div className="gallery-stage">
                {[
                  "https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/luskimt2_copy_3F55AC6B-5FBA-409A-BEA5-D4925190E716.MOV",
                  "https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/wjml9oab_copy_FE7C6C77-06D3-4BBB-A7F1-05114D95309A.MOV",
                  "https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/wfu9u7ya_copy_654B0D2E-9F53-480A-A6AA-B05D56963BD9.MOV",
                  "https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/xxf7gddq_copy_67AB9974-530F-4871-830C-C0108EFD6DEA.mov",
                  "https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/imquazrs_copy_093AB1A6-6CFB-4EDD-8180-3FF7CF4904D0.MOV"
                ].map((src, index) => (
                  <div key={index} className={`gallery-card gallery-card-${index}`} data-index={index}>
                    <div className="card-main">
                      <video autoPlay loop muted playsInline preload="auto" className="gallery-video-main" src={src} />
                    </div>
                    <div className="card-reflect">
                      <video autoPlay loop muted playsInline preload="auto" className="gallery-video-reflect" src={src} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO Section - Moved Up */}
        <section id="portfolio" className="section" data-testid="portfolio-section">
          <div className="content-wrapper">
            <div className="vertical-line"></div>
            <div className="main-content">
              <h2 className="section-title" data-testid="portfolio-title">portfolio</h2>
              
              <div className="portfolio-grid">
                {/* Featured: GEN:48 Award Winner */}
                <a 
                  href="https://runwayml.com/gen48?film=infinity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="portfolio-item portfolio-featured" 
                  data-testid="portfolio-featured"
                >
                  <div className="portfolio-featured-wrapper">
                    <div className="portfolio-image-wrapper">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/m8evkh55_EgxieYPDJCs.webp"
                        alt="∞ - Runway GEN:48 Aleph Edition People's Choice Winner"
                        className="portfolio-image"
                      />
                    </div>
                  </div>
                  <div className="portfolio-featured-info">
                    <h3 className="portfolio-featured-title">∞</h3>
                    <p className="portfolio-featured-subtitle">Runway GEN:48 Aleph Edition</p>
                    <div className="portfolio-featured-stats">
                      <span className="stat-item">3000+ Submissions</span>
                      <span className="stat-divider">|</span>
                      <span className="stat-item">32 Finalists</span>
                      <span className="stat-divider">|</span>
                      <span className="stat-item">48-Hour AI Filmmaking Challenge</span>
                    </div>
                    <p className="portfolio-featured-description">
                      Created using Runway's Aleph generative video technology in just 48 hours. 
                      This film explores the boundaries of AI-assisted storytelling and visual art.
                    </p>
                  </div>
                </a>

                <div className="portfolio-item" data-testid="portfolio-item-2">
                  <div className="portfolio-video-wrapper">
                    <video 
                      className="portfolio-video"
                      style={{ filter: 'none', WebkitFilter: 'none', opacity: 1 }}
                      controls
                      loop
                      preload="metadata"
                      src="https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/luskimt2_copy_3F55AC6B-5FBA-409A-BEA5-D4925190E716.MOV"
                    />
                  </div>
                  <div className="portfolio-info">
                    <h3 className="portfolio-project-title">Creative Work</h3>
                    <p className="portfolio-project-role">AI Video Art</p>
                  </div>
                </div>

                <div className="portfolio-item" data-testid="portfolio-item-3">
                  <div className="portfolio-video-wrapper">
                    <video 
                      className="portfolio-video"
                      style={{ filter: 'none', WebkitFilter: 'none', opacity: 1 }}
                      controls
                      loop
                      preload="metadata"
                      src="https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/wjml9oab_copy_FE7C6C77-06D3-4BBB-A7F1-05114D95309A.MOV"
                    />
                  </div>
                  <div className="portfolio-info">
                    <h3 className="portfolio-project-title">Visual Exploration</h3>
                    <p className="portfolio-project-role">Experimental Media</p>
                  </div>
                </div>

                <div className="portfolio-item" data-testid="portfolio-item-4">
                  <div className="portfolio-video-wrapper">
                    <video 
                      className="portfolio-video"
                      style={{ filter: 'none', WebkitFilter: 'none', opacity: 1 }}
                      controls
                      loop
                      preload="metadata"
                      src="https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/wfu9u7ya_copy_654B0D2E-9F53-480A-A6AA-B05D56963BD9.MOV"
                    />
                  </div>
                  <div className="portfolio-info">
                    <h3 className="portfolio-project-title">Motion Design</h3>
                    <p className="portfolio-project-role">Digital Art</p>
                  </div>
                </div>

                <div className="portfolio-item" data-testid="portfolio-item-5">
                  <div className="portfolio-video-wrapper">
                    <video 
                      className="portfolio-video"
                      style={{ filter: 'none', WebkitFilter: 'none', opacity: 1 }}
                      controls
                      loop
                      preload="metadata"
                      src="https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/xxf7gddq_copy_67AB9974-530F-4871-830C-C0108EFD6DEA.mov"
                    />
                  </div>
                  <div className="portfolio-info">
                    <h3 className="portfolio-project-title">Generative Art</h3>
                    <p className="portfolio-project-role">Computational Media</p>
                  </div>
                </div>

                <div className="portfolio-item" data-testid="portfolio-item-6">
                  <div className="portfolio-video-wrapper">
                    <video 
                      className="portfolio-video"
                      style={{ filter: 'none', WebkitFilter: 'none', opacity: 1 }}
                      controls
                      loop
                      preload="metadata"
                      src="https://customer-assets.emergentagent.com/job_f89c7579-45ce-4797-86a4-864b9c1026f7/artifacts/imquazrs_copy_093AB1A6-6CFB-4EDD-8180-3FF7CF4904D0.MOV"
                    />
                  </div>
                  <div className="portfolio-info">
                    <h3 className="portfolio-project-title">Immersive Experience</h3>
                    <p className="portfolio-project-role">Interactive Media</p>
                  </div>
                </div>

                <div className="portfolio-item portfolio-placeholder-item" data-testid="portfolio-placeholder">
                  <div className="portfolio-placeholder-content">
                    <p className="portfolio-placeholder-text">More projects coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VITA Section - Moved Down */}
        <section id="vita" className="section section-alt" style={{ background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5' }} data-testid="vita-section">
          <div className="content-wrapper">
            <div className="vertical-line"></div>
            <div className="main-content">
              <h2 className="section-title" data-testid="vita-title">vita</h2>
              
              <div className="glass-card" data-testid="vita-content">
                {/* About */}
                <div className="vita-item">
                  <h3 className="vita-heading">About</h3>
                  <p className="vita-text">
                    Computer Science graduate from the University of Victoria specializing in AI/ML development and creative technology.
                    I bridge technology and creativity through innovative solutions, combining AI-powered workflows with 3D design to push creative boundaries.
                  </p>
                </div>

                {/* Recognition */}
                <div className="vita-item">
                  <h3 className="vita-heading">Recognition</h3>
                  <p className="vita-text highlight-achievement">
                    People's Choice Winner - Runway GEN:48 Aleph Edition
                  </p>
                  <p className="vita-text">
                    Recognized for pushing creative boundaries with AI-generated video art. Selected from 3000+ submissions, among 32 finalists.
                  </p>
                </div>

                {/* Experience */}
                <div className="vita-item">
                  <h3 className="vita-heading">Experience</h3>
                  
                  <div className="experience-entry">
                    <div className="experience-header">
                      <span className="experience-role">Co-founder</span>
                      <span className="experience-company">Pardesi</span>
                    </div>
                    <div className="experience-meta">
                      <span>2023 - Present</span>
                      <span className="meta-divider">·</span>
                      <span>Victoria, BC</span>
                    </div>
                    <p className="vita-text">
                      Co-founded and leading a cultural events organization. Led AJ Wavy Canada tour organization, managed event logistics and marketing, leveraged AI tools for content creation.
                    </p>
                  </div>

                  <div className="experience-entry">
                    <div className="experience-header">
                      <span className="experience-role">Technical and Creative Lead</span>
                      <span className="experience-company">Jambo Jar Technologies</span>
                    </div>
                    <div className="experience-meta">
                      <span>March 2024 - March 2025</span>
                      <span className="meta-divider">·</span>
                      <span>New Delhi</span>
                    </div>
                    <p className="vita-text">
                      Leading technical and creative teams in delivering AI-driven solutions. Overseeing technical and creative teams, managing AI/ML project pipelines, developing innovative tech solutions.
                    </p>
                  </div>

                  <div className="experience-entry">
                    <div className="experience-header">
                      <span className="experience-role">AI Engineer Intern</span>
                      <span className="experience-company">Denave</span>
                    </div>
                    <div className="experience-meta">
                      <span>April 2023 - September 2023</span>
                      <span className="meta-divider">·</span>
                      <span>New Delhi</span>
                    </div>
                    <p className="vita-text">
                      Led the development of an AI-driven database management system. Deployed in-house AI query system using LLMs, improved query response time and enhanced database efficiency.
                    </p>
                  </div>

                  <div className="experience-entry">
                    <div className="experience-header">
                      <span className="experience-role">AI Intern</span>
                      <span className="experience-company">Aftershoot (IIT Delhi)</span>
                    </div>
                    <div className="experience-meta">
                      <span>May 2022 - August 2022</span>
                      <span className="meta-divider">·</span>
                      <span>New Delhi</span>
                    </div>
                    <p className="vita-text">
                      Worked on AI photo-culling systems and model optimization. Tested and improved ML/AI models, enhanced model accuracy, collaborated with research teams.
                    </p>
                  </div>
                </div>
                
                {/* Philosophy */}
                <div className="vita-item">
                  <h3 className="vita-heading">Philosophy</h3>
                  <p className="vita-text">
                    I believe in creating tools that empower creativity rather than replace it.
                    Every project is an opportunity to push boundaries and challenge conventions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT Section */}
        <section id="contact" className="section section-alt" style={{ background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5' }} data-testid="contact-section">
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
                    href="mailto:kartikyekashyap@gmail.com"
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