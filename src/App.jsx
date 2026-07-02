import React, { useState } from 'react';
import Home from './components/Home';
import About from './components/About';
import Current from './components/Current';
import Archives from './components/Archives';
import Guidelines from './components/Guidelines';
import SubmitManuscript from './components/SubmitManuscript';
import { ArrowRight, Menu, X, BookOpen, GraduationCap, Mail } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home onNavigate={handleNavigate} />;
      case 'About':
        return <About />;
      case 'Current':
        return <Current />;
      case 'Archives':
        return <Archives onNavigate={handleNavigate} />;
      case 'Guidelines':
        return <Guidelines />;
      case 'Submit':
        return <SubmitManuscript />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Header Banner (matches Ref 1 structure but themed blue) */}
      <header className="header-banner">
        <div className="container">
          <div className="banner-content">
            {/* Logo box */}
            <div className="banner-logo">
              <svg viewBox="0 0 100 100" width="48" height="48" style={{ fill: 'currentColor' }}>
                <rect x="15" y="15" width="20" height="20" rx="4" />
                <rect x="40" y="15" width="20" height="20" rx="4" />
                <rect x="65" y="15" width="20" height="20" rx="4" />
                <rect x="15" y="40" width="20" height="20" rx="4" />
                <rect x="40" y="40" width="20" height="20" rx="4" />
                <rect x="15" y="65" width="20" height="20" rx="4" />
              </svg>
            </div>
            
            {/* Title Text */}
            <div className="banner-titles">
              <span className="banner-short-title">WJBMR</span>
              <h1 className="banner-full-title" style={{ color: '#ffffff' }}>
                WORLD JOURNAL OF BIOMEDICAL RESEARCH
              </h1>
              <span style={{ fontSize: '13px', opacity: '0.85', letterSpacing: '0.5px', marginTop: '4px', fontWeight: '500' }}>
                College of Health Sciences | University of Uyo, Nigeria
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Navigation Bar (matches Ref 1 structure) */}
      <nav className="navbar-wrapper">
        <div className="container navbar-container">
          {/* Desktop Nav Links */}
          <div className="nav-links" style={{ display: 'flex' }}>
            {['Home', 'About', 'Current', 'Archives', 'Guidelines'].map((page) => (
              <button
                key={page}
                onClick={() => handleNavigate(page)}
                className={`nav-link ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Submit Action Pill Button (matches Ref 1 submit button) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => handleNavigate('Submit')}
              className={`submit-btn ${currentPage === 'Submit' ? 'active' : ''}`}
            >
              Submit Manuscript <ArrowRight size={16} />
            </button>

            {/* Mobile Hamburger menu icon */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                marginLeft: '16px',
                cursor: 'pointer'
              }}
              className="mobile-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--bg-white)',
            borderTop: '1px solid var(--border-color)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-md)'
          }}>
            {['Home', 'About', 'Current', 'Archives', 'Guidelines'].map((page) => (
              <button
                key={page}
                onClick={() => handleNavigate(page)}
                style={{
                  textAlign: 'left',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: currentPage === page ? 'var(--primary-light)' : 'transparent',
                  color: currentPage === page ? 'var(--primary-color)' : 'var(--text-dark)',
                  fontWeight: '600',
                  fontSize: '14px',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* 3. Main Body Content */}
      <main className="page-layout" style={{ flex: 1 }}>
        {renderPage()}
      </main>

      {/* 4. Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Info Col */}
            <div className="footer-col">
              <h3 className="footer-title">WJBMR</h3>
              <p style={{ lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.7)' }}>
                World Journal of Biomedical Research (WJBMR) is a premium peer-reviewed, open-access medical and biochemical research journal published by the College of Health Sciences, University of Uyo, Nigeria.
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>p-ISSN: 2956-4279</span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>e-ISSN: 2956-4287</span>
              </div>
            </div>

            {/* Quick Links Col */}
            <div className="footer-col">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li className="footer-link" onClick={() => handleNavigate('Home')}>Home Page</li>
                <li className="footer-link" onClick={() => handleNavigate('About')}>Journal Information</li>
                <li className="footer-link" onClick={() => handleNavigate('Current')}>Current Issue</li>
                <li className="footer-link" onClick={() => handleNavigate('Archives')}>Past Archives</li>
                <li className="footer-link" onClick={() => handleNavigate('Guidelines')}>Author Guidelines</li>
              </ul>
            </div>

            {/* Publisher Col */}
            <div className="footer-col">
              <h3 className="footer-title">Publisher & Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'rgba(255,255,255,0.7)' }}>
                <div>
                  <strong>College of Health Sciences</strong><br />
                  University of Uyo, Akwa Ibom State, Nigeria
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} />
                  <a href="mailto:editor@wjbmr.org" style={{ color: 'var(--accent-light)' }}>editor@wjbmr.org</a>
                </div>
                <div style={{ fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '4px' }}>
                  Indexed in: African Index Medicus, AJOL, CrossRef, Google Scholar.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} World Journal of Biomedical Research. All Rights Reserved.</span>
            <span style={{ display: 'flex', gap: '16px' }}>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.5)' }}>Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.5)' }}>Privacy Policy</a>
            </span>
          </div>
        </div>
      </footer>

      {/* CSS adjustments for mobile burger toggle */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block !important;
          }
          .nav-links {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
