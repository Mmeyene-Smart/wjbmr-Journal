import React from 'react';
import { User, Calendar, BookOpen, Download, Share2, Printer, ChevronRight, FileCheck } from 'lucide-react';
import API_BASE from '../api.js';

export default function ArticleDetail({ article, articles = [], onNavigateToArticle, onBackToHome }) {
  if (!article) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h3>Article not found.</h3>
        <button onClick={onBackToHome} className="submit-btn" style={{ marginTop: '20px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  // Filter out the current article to find related articles in the same category or volume
  const relatedArticles = articles
    .filter(art => art.id !== article.id)
    .slice(0, 5); // display up to 5 related articles

  const handleDownload = (e) => {
    if (!article.pdfUrl || article.pdfUrl === '#') {
      e.preventDefault();
      alert(`Downloading PDF for: "${article.title}"... (Simulated)`);
    }
  };

  const getAuthorsDisplay = () => {
    if (typeof article.authors === 'string') return article.authors;
    return article.authors.map(a => a.name).join(', ');
  };

  return (
    <div className="container">
      {/* 2-Column Grid matching reference layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px' }} className="responsive-home-grid">
        
        {/* Left Column - Article Content */}
        <div>
          <div className="glass-card" style={{ padding: '36px' }}>
            
            {/* 1. Article Title */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: '800',
              lineHeight: '1.3',
              color: 'var(--primary-dark)',
              marginBottom: '16px'
            }}>
              {article.title}
            </h2>

            {/* 2. Metadata strip */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '20px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} /> WJBMR
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} /> {article.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={15} /> {article.volume || 'Volume 12'} No {article.issue ? article.issue.split(' ')[1] : '2'}
              </span>
              <a 
                href={article.pdfUrl && article.pdfUrl.startsWith('/uploads/') ? `${API_BASE}${article.pdfUrl}` : (article.pdfUrl || '#')} 
                onClick={handleDownload}
                target={article.pdfUrl && article.pdfUrl !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  color: 'var(--primary-color)',
                  fontWeight: '700'
                }}
              >
                <Download size={14} /> Download PDF
              </a>
            </div>

            {/* 3. Author details and affiliations */}
            <div style={{ marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Authors:</strong> {getAuthorsDisplay()}
              </div>
              
              {article.affiliations && (
                <div style={{
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  marginBottom: '12px',
                  whiteSpace: 'pre-line' // respects line breaks in input
                }}>
                  {article.affiliations}
                </div>
              )}

              {article.correspondingAuthor && (
                <div style={{ fontSize: '13px', borderTop: '1px dotted var(--border-color)', paddingTop: '8px' }}>
                  <strong>*Corresponding Author:</strong> {article.correspondingAuthor}
                </div>
              )}

              {article.keywords && (
                <div style={{ marginTop: '12px', fontSize: '13px' }}>
                  <strong>Keywords:</strong> <span style={{ color: 'var(--text-muted)' }}>{article.keywords}</span>
                </div>
              )}
            </div>

            {/* 4. Top Download PDF Button */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              backgroundColor: 'var(--primary-light)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-light)',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCheck style={{ color: 'var(--primary-color)' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-dark)' }}>
                  Full Manuscript PDF File available for download
                </span>
              </div>
              
              <a 
                href={article.pdfUrl && article.pdfUrl.startsWith('/uploads/') ? `${API_BASE}${article.pdfUrl}` : (article.pdfUrl || '#')} 
                onClick={handleDownload}
                target={article.pdfUrl && article.pdfUrl !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="submit-form-btn"
                style={{
                  width: 'auto',
                  padding: '10px 20px',
                  fontSize: '13px',
                  background: 'var(--primary-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: 'var(--bg-white)'
                }}
              >
                <Download size={16} /> Download Full PDF (Top)
              </a>
            </div>

            {/* 5. Abstract & Full HTML Content Render */}
            <div>
              {/* Abstract section header */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                color: 'var(--primary-dark)',
                marginBottom: '14px',
                borderBottom: '2px solid var(--border-color)',
                paddingBottom: '6px'
              }}>
                {article.fullText ? 'Full Manuscript Text' : 'Abstract'}
              </h3>

              {article.isHtmlArticle ? (
                /* Dynamic HTML Rendering */
                <div 
                  dangerouslySetInnerHTML={{ __html: article.fullText || article.abstract }} 
                  className="html-article-renderer" 
                  style={{ marginBottom: '32px' }}
                />
              ) : (
                /* Static Text fallback */
                <p className="text-block" style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
                  {article.abstract}
                </p>
              )}
            </div>

            {/* 6. Bottom Download PDF Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '32px',
              marginTop: '40px'
            }}>
              <a 
                href={article.pdfUrl && article.pdfUrl.startsWith('/uploads/') ? `${API_BASE}${article.pdfUrl}` : (article.pdfUrl || '#')} 
                onClick={handleDownload}
                target={article.pdfUrl && article.pdfUrl !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="submit-form-btn"
                style={{
                  width: 'auto',
                  padding: '12px 30px',
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--primary-color)',
                  textDecoration: 'none',
                  color: 'var(--bg-white)'
                }}
              >
                <Download size={18} /> Download Full PDF (Bottom)
              </a>
            </div>

          </div>
        </div>

        {/* Right Column - Sidebar (matches screenshot layout) */}
        <div>
          {/* Journal Branding Card */}
          <div className="glass-card" style={{
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Circular small logo */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              border: '2px solid var(--primary-color)',
              flexShrink: 0
            }}>
              Wjbmr
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--primary-dark)', fontWeight: '800', lineHeight: 1.1 }}>Wjbmr</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>World Journal of Biomedical Research</span>
            </div>
          </div>

          {/* Related Articles Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              color: 'var(--primary-dark)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
              marginBottom: '16px',
              fontWeight: '800'
            }}>
              Related articles
            </h3>

            {relatedArticles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {relatedArticles.map(art => (
                  <div 
                    key={art.id} 
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onNavigateToArticle(art.id)}
                  >
                    <h4 style={{
                      fontSize: '13px',
                      color: 'var(--primary-color)',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      transition: 'var(--transition)'
                    }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--primary-color)'}
                    >
                      {art.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      {art.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                No other related articles found.
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
