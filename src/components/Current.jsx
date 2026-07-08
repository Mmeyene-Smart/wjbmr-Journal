import React, { useState } from 'react';
import { FileText, Download, Share2, MessageSquare, ChevronDown, ChevronUp, Search as SearchIcon, Minus, Plus } from 'lucide-react';
import API_BASE from '../api.js';

export default function Current({ articles = [], onNavigateToArticle }) {
  const [expandedId, setExpandedId] = useState(null);

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
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedVolumes([]);
    setAppliedSearchTerm('');
    setAppliedVolumes([]);
  };

  // Filter articles based on applied filters
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
      (typeof art.authors === 'string' 
        ? art.authors.toLowerCase().includes(appliedSearchTerm.toLowerCase())
        : art.authors.some(auth => auth.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()))
      );

    const matchesVolume = 
      appliedVolumes.length === 0 || 
      appliedVolumes.includes(art.volume || 'Volume 12 (2026)');

    return matchesSearch && matchesVolume;
  });

  return (
    <div className="container">
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Current Issue</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse WJBMR Volume 12, Issue 2, June 2026 table of contents.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }} className="responsive-home-grid">
        
        {/* Left Side: Filter Sidebar (matches the user screenshot layout exactly!) */}
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
                  fontWeight: '700',
                  fontSize: '16px',
                  color: 'var(--text-dark)',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  userSelect: 'none'
                }}
              >
                <span>Search</span>
                {isSearchExpanded ? <Minus size={16} /> : <Plus size={16} />}
              </div>
              
              {isSearchExpanded && (
                <div style={{ marginTop: '16px', position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search with keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 36px 12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                      backgroundColor: 'var(--bg-light)'
                    }}
                  />
                  <SearchIcon 
                    size={16} 
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }} 
                  />
                </div>
              )}
            </div>

            {/* Volume Filter Section */}
            <div>
              <div 
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: 'var(--text-dark)',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  userSelect: 'none'
                }}
              >
                <span>By category</span>
                {isCategoryExpanded ? <Minus size={16} /> : <Plus size={16} />}
              </div>

              {isCategoryExpanded && (
                <div style={{
                  marginTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {uniqueVolumes.map(vol => (
                    <label 
                      key={vol} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'var(--text-dark)',
                        fontWeight: '500'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedVolumes.includes(vol)}
                          onChange={() => handleVolumeCheckboxChange(vol)}
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer'
                          }}
                        />
                        <span>{vol}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {volumeCounts[vol]}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons (Themed blue instead of green for brand consistency!) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <button 
                onClick={handleApplyFilter}
                className="submit-form-btn"
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  borderRadius: '8px',
                  width: '100%',
                  background: 'var(--primary-color)'
                }}
              >
                Apply filter
              </button>
              
              <button 
                onClick={handleResetFilter}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '8px',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                Reset filter
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Articles Listing */}
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
              height: '180px'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>WJBMR COVER</div>
              <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)', margin: '8px 0 4px 0' }}>Vol. 12</div>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>Issue 2</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px' }}>June 2026</div>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                World Journal of Biomedical Research (WJBMR)
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span><strong>Release:</strong> June 2026</span>
                <span><strong>Indexed:</strong> AIM, AJOL, CrossRef</span>
              </div>
              <p className="text-block" style={{ fontSize: '13px', margin: 0 }}>
                Filter publications using the sidebar search tools. Access full-text abstracts or read directly in the HTML frames below.
              </p>
            </div>
          </div>

          {/* Dynamic Article List */}
          {filteredArticles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredArticles.map(art => (
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

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {art.doi}
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
                      
                      {/* Check if article is dynamic HTML upload or default text */}
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
