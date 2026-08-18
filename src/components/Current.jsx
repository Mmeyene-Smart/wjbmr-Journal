import React, { useState } from 'react';
import { FileText, Download, Share2, MessageSquare, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import API_BASE, { resolvePdfUrl } from '../api.js';

export default function Current({ articles = [], onNavigateToArticle }) {
  const [expandedId, setExpandedId] = useState(null);

  // Pagination state (12 articles per page: 6 on left, 6 on right)
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const ARTICLES_PER_PAGE = 12;

  const toggleAbstract = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredArticles = articles;

  // Calculate pagination bounds
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE) || 1;
  const startIndex = (currentPageNum - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPageNum(newPage);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Current Issue</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse WJBMR issue 1 April 2026 volume 13 no. 1 table of contents.
        </p>
      </div>

      <div>
        {/* Cover Panel Header */}
        <div className="glass-card responsive-home-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '32px',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--primary-light) 100%)',
          borderColor: 'var(--accent-light)',
          alignItems: 'center',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--primary-color)',
            color: 'var(--bg-white)',
            padding: '30px 16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: '3/4'
          }}>
            <FileText size={32} style={{ marginBottom: '12px', opacity: 0.9 }} />
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, fontWeight: '700' }}>WJBMR</div>
            <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0' }}>Vol 13 No 1</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>2026</div>
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Current Issue • Vol 13 No 1 (2026)
            </span>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '8px' }}>
              World Journal of Biomedical Research (WJBMR)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              <span><strong>Release:</strong> April 2026</span>
              <span><strong>Indexed:</strong> AIM, AJOL, CrossRef</span>
            </div>
          </div>
        </div>

        {/* Results Summary & Page Status Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing {filteredArticles.length > 0 ? `${startIndex + 1}–${Math.min(startIndex + ARTICLES_PER_PAGE, filteredArticles.length)}` : 0} of {filteredArticles.length} Articles
          </div>
          {totalPages > 1 && (
            <div style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>
              Page {currentPageNum} of {totalPages}
            </div>
          )}
        </div>

        {/* Dynamic Paginated Article List (2 Columns: 6 left, 6 right) */}
        {filteredArticles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="responsive-home-grid">
              {paginatedArticles.map(art => (
                <div 
                  key={art.id} 
                  className="glass-card" 
                  style={{ padding: '24px', margin: 0, cursor: 'pointer' }}
                  onClick={() => onNavigateToArticle(art.id)}
                >
                  <div className="article-card-row">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.5px'
                      }}>
                        {art.type || art.category} | PAGES: {art.pages} | {art.volume}
                      </span>
                      
                      <h4 
                        style={{ 
                          fontSize: '17px', 
                          color: 'var(--primary-color)', 
                          lineHeight: '1.4',
                          margin: 0,
                          transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--primary-color)'}
                      >
                        {art.title}
                      </h4>
                      
                      <div style={{ fontSize: '13px', color: 'var(--text-dark)', fontWeight: '500' }}>
                        {typeof art.authors === 'string'
                          ? <span dangerouslySetInnerHTML={{ __html: art.authors }} />
                          : art.authors.map(a => a.name).join(', ')
                        }
                      </div>
                    </div>

                    {/* Actions Box */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAbstract(art.id);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-white)',
                          color: 'var(--primary-color)',
                          fontFamily: 'var(--font-display)',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'var(--transition)'
                        }}
                      >
                        Abstract {expandedId === art.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <a 
                        href={resolvePdfUrl(art.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--primary-color)',
                          backgroundColor: 'var(--primary-color)',
                          color: 'var(--bg-white)',
                          fontFamily: 'var(--font-display)',
                          fontWeight: '700',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'var(--transition)',
                          textDecoration: 'none'
                        }}
                      >
                        <Download size={12} /> PDF
                      </a>
                    </div>
                  </div>

                  {/* Expandable Abstract Panel */}
                  {expandedId === art.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-light)',
                        padding: '16px',
                        borderRadius: '8px'
                      }}
                    >
                      <h5 style={{ fontSize: '13px', color: 'var(--primary-dark)', marginBottom: '8px' }}>Abstract</h5>
                      
                      {art.isHtmlArticle ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: art.abstract }} 
                          className="html-article-renderer" 
                          style={{ fontSize: '13px', lineHeight: '1.6' }}
                        />
                      ) : (
                        <p className="text-block" style={{ fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                          {art.abstract}
                        </p>
                      )}

                      {art.keywords && (
                        <div style={{ marginTop: '12px', fontSize: '12px' }}>
                          <strong>Keywords:</strong> <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{art.keywords}</span>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <Share2 size={12} /> Cite this Article
                        </button>
                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <MessageSquare size={12} /> Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button 
                    onClick={() => handlePageChange(currentPageNum - 1)}
                    disabled={currentPageNum === 1}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: currentPageNum === 1 ? 'var(--bg-light)' : 'var(--bg-white)',
                      color: currentPageNum === 1 ? 'var(--text-muted)' : 'var(--primary-dark)',
                      cursor: currentPageNum === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                    <button 
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: pageNum === currentPageNum ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                        backgroundColor: pageNum === currentPageNum ? 'var(--primary-color)' : 'var(--bg-white)',
                        color: pageNum === currentPageNum ? 'var(--bg-white)' : 'var(--primary-dark)',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        minWidth: '36px'
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPageNum + 1)}
                    disabled={currentPageNum === totalPages}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: currentPageNum === totalPages ? 'var(--bg-light)' : 'var(--bg-white)',
                      color: currentPageNum === totalPages ? 'var(--text-muted)' : 'var(--primary-dark)',
                      cursor: currentPageNum === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-white)',
              marginTop: '16px'
            }}>
              No published articles match the search keywords or volume selection criteria.
            </div>
          )}
        </div>
    </div>
  );
}
