import React, { useState, useEffect } from 'react';
import { FileText, Download, Share2, MessageSquare, ChevronDown, ChevronUp, Search as SearchIcon, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import API_BASE from '../api.js';

export default function Current({ articles = [], onNavigateToArticle }) {
  const [expandedId, setExpandedId] = useState(null);

  // Pagination state
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  // Resolve a usable PDF URL — prepend API_BASE for /uploads/ paths
  const resolvePdfUrl = (url) => {
    if (!url || url === '#') return '/sample_article.pdf';
    if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
    return url;
  };

  // Sidebar state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolumes, setSelectedVolumes] = useState([]);
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedVolumes, setAppliedVolumes] = useState([]);

  // Collapsible accordion parts in sidebar
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  // Group unique volumes and calculate counts
  const volumeCounts = articles.reduce((acc, art) => {
    const vol = art.volume || 'Volume 12 (2026)';
    acc[vol] = (acc[vol] || 0) + 1;
    return acc;
  }, {});

  const uniqueVolumes = Object.keys(volumeCounts);

  const toggleAbstract = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleVolumeCheckboxChange = (vol) => {
    setSelectedVolumes(prev => 
      prev.includes(vol) ? prev.filter(v => v !== vol) : [...prev, vol]
    );
  };

  const handleApplyFilter = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedVolumes(selectedVolumes);
    setCurrentPageNum(1); // reset to first page on new filter
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedVolumes([]);
    setAppliedSearchTerm('');
    setAppliedVolumes([]);
    setCurrentPageNum(1); // reset to first page on filter reset
  };

  // Filter articles based on applied filters
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
      (typeof art.authors === 'string' 
        ? art.authors.toLowerCase().includes(appliedSearchTerm.toLowerCase())
        : (Array.isArray(art.authors) ? art.authors.some(auth => auth.name.toLowerCase().includes(appliedSearchTerm.toLowerCase())) : false)
      );

    const matchesVolume = 
      appliedVolumes.length === 0 || 
      appliedVolumes.includes(art.volume || 'Volume 12 (2026)');

    return matchesSearch && matchesVolume;
  });

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
      {/* Page Title - Updated August 2026 to April 2026 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Current Issue</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse WJBMR issue 1 April 2026 volume 13 no. 1 table of contents.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }} className="responsive-home-grid">
        
        {/* Left Side: Filter Sidebar */}
        <div>
          <div style={{
            backgroundColor: 'var(--bg-white)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Search Section */}
            <div>
              <div 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  fontWeight: '700',
                  color: 'var(--primary-dark)'
                }}
              >
                <span>Search</span>
                {isSearchExpanded ? <Minus size={16} /> : <Plus size={16} />}
              </div>

              {isSearchExpanded && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Keyword / Author"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 36px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                    <SearchIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Volume Selection Section */}
            <div>
              <div 
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  fontWeight: '700',
                  color: 'var(--primary-dark)'
                }}
              >
                <span>Volume</span>
                {isCategoryExpanded ? <Minus size={16} /> : <Plus size={16} />}
              </div>

              {isCategoryExpanded && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {uniqueVolumes.map((vol) => (
                    <label key={vol} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedVolumes.includes(vol)}
                        onChange={() => handleVolumeCheckboxChange(vol)}
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <span style={{ flex: 1 }}>{vol}</span>
                      <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {volumeCounts[vol]}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={handleApplyFilter}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--bg-white)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
              <button 
                onClick={handleResetFilter}
                style={{
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-white)',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Articles Table / Cards */}
        <div>
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            fontSize: '14px',
            color: 'var(--text-muted)'
          }}>
            <div>
              Showing {filteredArticles.length > 0 ? `${startIndex + 1}–${Math.min(startIndex + ARTICLES_PER_PAGE, filteredArticles.length)}` : 0} of {filteredArticles.length} Articles
            </div>
            {totalPages > 1 && (
              <div style={{ fontSize: '13px', fontWeight: '600' }}>
                Page {currentPageNum} of {totalPages}
              </div>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paginatedArticles.map((art) => (
                <div 
                  key={art.id}
                  className="glass-card" 
                  style={{ 
                    padding: '24px', 
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                    backgroundColor: 'var(--bg-white)'
                  }}
                >
                  {/* Article Title */}
                  <h3 
                    onClick={() => onNavigateToArticle(art.id)}
                    style={{ 
                      fontSize: '18px', 
                      lineHeight: '1.4', 
                      color: 'var(--primary-dark)', 
                      marginBottom: '12px',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                    className="article-card-title-hover"
                  >
                    {art.title}
                  </h3>

                  {/* Authors */}
                  <div style={{ fontSize: '13px', color: 'var(--text-dark)', marginBottom: '12px', fontWeight: '500' }}>
                    {typeof art.authors === 'string' 
                      ? <span dangerouslySetInnerHTML={{ __html: art.authors }} />
                      : art.authors.map(a => a.name).join(', ')
                    }
                  </div>

                  {/* Metadata Row */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    paddingTop: '12px',
                    borderTop: '1px dashed var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span><strong>Category:</strong> {art.category}</span>
                      <span><strong>Volume:</strong> {art.volume || 'Volume 13 No 1 (2026)'}</span>
                      <span><strong>Issue:</strong> {art.issue || 'Issue 1 (April 2026)'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button 
                        onClick={() => toggleAbstract(art.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-color)',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Abstract {expandedId === art.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <a 
                        href={resolvePdfUrl(art.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
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
    </div>
  );
}
