'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/ProjectDescription.css';
import AnimateOnScroll from '../components/AnimateOnScroll'
import { ArrowLeft, ExternalLink, Github, Sun, Moon, Menu, X, ArrowUp } from 'lucide-react';

export default function ProjectDescription({ project, onBack }) {
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lightboxDisplay, setLightboxDisplay] = useState('none');
  const [lightboxSrc, setLightboxSrc] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {

      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 100);
      
      // Handle navbar animation only when sidebar is closed
      const navbar = document.getElementById('navbar');
      if (navbar && !isSidebarOpen) {
        if (scrollPosition > 100) {
          navbar.classList.add('scrolled');
          navbar.classList.add('drop');
        } else {
          navbar.classList.remove('scrolled');
          navbar.classList.remove('drop');
        }
      }

      // Update active section
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          document.querySelectorAll('.route, .navitem').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSidebarOpen]); // Added isSidebarOpen to dependencies

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const newState = !prev;
      // Toggle navbar visibility when sidebar state changes
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (newState) {
          navbar.style.opacity = '0';
          navbar.style.pointerEvents = 'none';
        } else {
          setTimeout(() => {
            navbar.style.opacity = '1';
            navbar.style.pointerEvents = 'auto';
          }, 300); // Match the sidebar transition time
        }
      }
      return newState;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Lightbox handlers
  const openLightbox = (src) => {
    setLightboxSrc(src);
    setLightboxDisplay('block');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxDisplay('none');
    document.body.style.overflow = 'unset';
  };

  const renderSection = (section) => {
    if (!section) return null;
    return (
      <div className="mb-6">
        {section.heading && <h2 className="section-heading">{section.heading}</h2>}
        {section.subheading && <h3 className="section-subheading">{section.subheading}</h3>}
        {section.description && <p className="section-description">{section.description}</p>}
        {section.list && section.list.length > 0 && (
          <ul className="section-list">
            {section.list.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        )}
      </div>
    );
  };

  if (!project) return null;

  return (
    
    <div className={'project-page ${theme}'}>
      {/* Lightbox */}
      <div 
        className="lightbox"
        style={{ display: lightboxDisplay }}
        onClick={(e) => e.target.className === 'lightbox' && closeLightbox()}
      >
        <span className="close" onClick={closeLightbox}>&times;</span>
        <img src={lightboxSrc || 'Lightbox'} className="lightbox-content" alt="Lightbox view" />
      </div>

      {/* Navbar */}
      <nav id="navbar">
        <div className="navbar-controls">
          <div className="logo flex__center">
            <Image src="/assets/icons/logo.svg" alt="Logo" width={40} height={40} />
          </div>
          
          <button onClick={onBack} className="btn btn__primary flex" style={{pointerEvents:'auto'}}>
            <ArrowLeft className="mr-2" /> Back
          </button>

          <div className="nav__routes">
            <a href="#project-details" className="route" >Overview</a>
            <a href="#project-features" className="route" >Features</a>
            <a href="#project-screenshot" className="route" >Screenshots</a>
            <a href="#project-implementation" className="route" >Process</a>
            <a href="#project-video" className="route" >Video</a>
            <a href="#project-conclusion" className="route" >Conclusion</a>
          </div>

          <div className="controls">
            <label className="theme__toggle">
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
              <div className="icon__container">
                {theme === 'light' ? <Sun className="sun" /> : <Moon className="moon" />}
              </div>
            </label>
            <button className="menu__btn" onClick={toggleSidebar} aria-label="Toggle menu">
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'visible' : ''}`}>
        <div className="sidebar__wrapper">
          <div className="top">
            <div className="logo">
              <Image src="/assets/icons/logo.svg" alt="Logo" width={40} height={40} />
            </div>
            <div className="sidebar-controls">
              <label className="theme__toggle">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <div className="icon__container">
                  {theme === 'light' ? <Sun className="sun" /> : <Moon className="moon" />}
                </div>
              </label>
              <button className="close-btn" onClick={toggleSidebar} aria-label="Close menu">
                <X />
              </button>
            </div>
          </div>
          <div className="middle">
            <a href="#project-details" className="navitem" >Overview</a>
            <a href="#project-features" className="navitem" >Features</a>
            <a href="#project-screenshot" className="navitem" >Screenshots</a>
            <a href="#project-implementation" className="navitem" >Process</a>
            <a href="#project-video" className="navitem" >Video</a>
            <a href="#project-conclusion" className="navitem" >Conclusion</a>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main>
      <AnimateOnScroll animation="fade-down">
        <section id="project-details" className="container">
          <div className="box">
            <div className="cluster">
              <div className="project-image-container">
                {project.image && (
                  <Image 
                    src={project.image || 'Project image'}
                    alt={project.title || 'Project image'}
                    width={1400}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                )}
                <div className="project-buttons">
                  {project.demoLink && (
                    <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className="btn btn__primary">
                      <ExternalLink className="mr-2" /> Demo
                    </Link>
                  )}
                  {project.githubLink && (
                    <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn">
                      <Github className="mr-2" /> GitHub
                    </Link>
                  )}
                </div>
              </div>
              
              <h1 className="title flex__center">{project.title}</h1>
              
              <AnimateOnScroll>
              <div id="project-overview">
                {project.overview?.map((section, index) => (
                  <div key={index}>{renderSection(section)}</div>
                ))}
              </div>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-right">
              <div id="project-features">
                {project.features?.map((feature, index) => (
                  <div key={index}>{renderSection(feature)}</div>
                ))}
              </div></AnimateOnScroll>
              <AnimateOnScroll animation="fade-up">
              <div id="project-screenshot" className="screenshots-container">
                {project.screenshot1 && (
                  <img 
                    src={project.screenshot1 || 'Project Screenshot'}
                    alt="Project Screenshot 1"
                    className="project-screenshot"
                    onClick={() => openLightbox(project.screenshot1)}
                  />
                )}
                {project.screenshot2 && (
                  <img 
                    src={project.screenshot2 || 'Project screenshot'}
                    alt="Project Screenshot 2"
                    className="project-screenshot"
                    onClick={() => openLightbox(project.screenshot2)}
                  />
                )}
              </div>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-left">
              <div id="project-implementation">
                {project.implementation?.map((section, index) => (
                  <div key={index}>{renderSection(section)}</div>
                ))}
              </div>
              </AnimateOnScroll>
              
              {project.videoUrl && (
                <AnimateOnScroll>
                <div id="project-video" className="video-container">
                  <video controls width="100%">
                    <source src={project.videoUrl || 'Project video'} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                </AnimateOnScroll>
              )}
              <AnimateOnScroll animation="fade-up">
              <div id="project-conclusion">
                {project.conclusion?.map((section, index) => (
                  <div key={index}>{renderSection(section)}</div>
                ))}
              </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
        </AnimateOnScroll>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button id="backToTopBtn" onClick={scrollToTop} className="btn btn__primary">
          <ArrowUp className="mr-2" /> Back to Top
        </button>
      )}

    <AnimateOnScroll>
      <footer id="footer">
        <div className="container">
          <div className="copyright flex__center">
            <h3>© 2024 Made with 💜</h3>
          </div>
        </div>
      </footer>
      </AnimateOnScroll>
    </div>
  );
}