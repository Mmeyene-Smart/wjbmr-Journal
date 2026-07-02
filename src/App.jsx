import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import About from './components/About';
import Current from './components/Current';
import Archives from './components/Archives';
import Guidelines from './components/Guidelines';
import AdminPanel from './components/AdminPanel';
import ArticleDetail from './components/ArticleDetail';
import { ArrowRight, Menu, X, BookOpen, GraduationCap, Mail, ShieldAlert, Key } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeArticleId, setActiveArticleId] = useState(null);
  
  // Articles state initialized from localStorage.
  // Enforces admin-only uploads by defaulting to empty array if not present.
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('wjbmr_articles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse saved articles", e);
      }
    }
    return []; // Empty by default!
  });

  // Save to localStorage when articles change
  useEffect(() => {
    localStorage.setItem('wjbmr_articles', JSON.stringify(articles));
  }, [articles]);

  // URL Query Param Listener (?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdminLogin(true);
      // Clean query parameter from URL for clean presentation
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, []);

  // Admin login states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('wjbmr_admin_auth') === 'true';
  });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArticle = (id) => {
    setActiveArticleId(id);
    handleNavigate('ArticleDetail');
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('wjbmr_admin_auth', 'true');
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
      handleNavigate('Admin');
    } else {
      setAdminError('Invalid administrator credentials');
    }
  };

  const handleAddArticle = (newArticle) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('wjbmr_admin_auth');
    handleNavigate('Home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return (
          <Home 
            onNavigate={handleNavigate} 
            onNavigateToArticle={handleNavigateToArticle}
            articles={articles} 
          />
        );
      case 'About':
        return <About />;
      case 'Current':
        return (
          <Current 
            articles={articles} 
            onNavigateToArticle={handleNavigateToArticle}
            onNavigate={handleNavigate}
          />
        );
      case 'Archives':
        return <Archives onNavigate={handleNavigate} />;
      case 'Guidelines':
        return <Guidelines />;
      case 'Admin':
        return isAdminAuthenticated ? (
          <AdminPanel 
            onAddArticle={handleAddArticle} 
            onBackToHome={() => handleNavigate('Home')} 
          />
        ) : (
          <Home 
            onNavigate={handleNavigate} 
            onNavigateToArticle={handleNavigateToArticle}
            articles={articles} 
          />
        );
      case 'ArticleDetail':
        const activeArt = articles.find(art => art.id === activeArticleId);
        return (
          <ArticleDetail
            article={activeArt}
            articles={articles}
            onNavigateToArticle={handleNavigateToArticle}
            onBackToHome={() => handleNavigate('Home')}
          />
        );
      default:
        return (
          <Home 
            onNavigate={handleNavigate} 
            onNavigateToArticle={handleNavigateToArticle}
            articles={articles} 
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Header Banner (matches Ref 1 structure but themed blue with biomedical bg image) */}
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
              <span style={{ fontSize: '13px', opacity: '0.9', letterSpacing: '0.5px', marginTop: '4px', fontWeight: '500' }}>
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
            {isAdminAuthenticated && (
              <button 
                onClick={() => handleNavigate('Admin')} 
                className={`nav-link ${currentPage === 'Admin' ? 'active' : ''}`}
                style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ShieldAlert size={14} /> Admin Panel
              </button>
            )}
          </div>

          {/* Admin Logout Button in Navbar (only visible when authenticated) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAdminAuthenticated && (
              <button
                onClick={handleLogoutAdmin}
                className="submit-btn"
                style={{ borderColor: '#dc2626', color: '#dc2626', gap: '8px' }}
              >
                Logout Admin <ShieldAlert size={16} />
              </button>
            )}

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
            {isAdminAuthenticated && (
              <button
                onClick={handleLogoutAdmin}
                style={{
                  textAlign: 'left',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  fontWeight: '600',
                  fontSize: '14px',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                Logout Admin
              </button>
            )}
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
                
                {/* Admin Access Trigger */}
                <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                  {isAdminAuthenticated ? (
                    <button 
                      onClick={handleLogoutAdmin}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Logout Admin
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAdminLogin(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--bg-white)'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      <Key size={12} /> Administrator Portal
                    </button>
                  )}
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

      {/* Admin Login Password Modal */}
      {showAdminLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 42, 72, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '32px',
            boxShadow: 'var(--shadow-lg)',
            margin: '20px',
            borderTop: '5px solid var(--primary-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} style={{ color: 'var(--primary-color)' }} /> Admin Authentication
              </h3>
              <button 
                onClick={() => { setShowAdminLogin(false); setAdminPassword(''); setAdminError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Please enter the administrative key to access article publishing systems. (Use password: <strong>admin123</strong>)
              </p>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Secret Key *</label>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="form-input"
                  autoFocus
                />
                {adminError && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>{adminError}</div>}
              </div>

              <button type="submit" className="submit-form-btn" style={{ marginTop: '8px' }}>
                Verify & Enter Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

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
