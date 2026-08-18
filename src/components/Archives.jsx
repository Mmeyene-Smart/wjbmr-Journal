import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronRight, RefreshCw, Search as SearchIcon, Minus, Plus } from 'lucide-react';
import API_BASE, { resolvePdfUrl } from '../api.js';

export default function Archives({ articles = [], onNavigate }) {
  const [openVolumeIdx, setOpenVolumeIdx] = useState(0);
  const [archives, setArchives] = useState([]);
  const [currentVolumes, setCurrentVolumes] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Sidebar filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolumes, setSelectedVolumes] = useState([]);
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedVolumes, setAppliedVolumes] = useState([]);

  // Accordion states for filter sections
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  useEffect(() => {
    // Fetch archives and current articles in parallel
    // so we can exclude the current issue volume from the archive list
    Promise.all([
      fetch(`${API_BASE}/api/archives`).then(res => res.ok ? res.json() : []).catch(() => []),
      fetch(`${API_BASE}/api/articles`).then(res => res.ok ? res.json() : []).catch(() => [])
    ]).then(([archivesData, articlesData]) => {
      setArchives(archivesData);
      // Collect all volume names that exist in the current (active) articles collection
      const activeVolumes = new Set(
        articlesData
          .map(a => a.volume)
          .filter(Boolean)
      );
      setCurrentVolumes(activeVolumes);
      setLoading(false);
    });
  }, []);

  const toggleVolume = (idx) => {
    setOpenVolumeIdx(openVolumeIdx === idx ? null : idx);
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

  // Group raw archives flat array into hierarchical structure (past archives only)
  // Excludes any volume that matches a volume currently in the active articles collection
  const getGroupedArchives = () => {
    const volumesMap = {};

    archives.forEach(arch => {
      const volName = arch.volume;
      const issName = arch.issue || 'Issue 1';
      if (!volName) return;

      // Skip volumes that belong to the current (active) issue
      if (currentVolumes.has(volName)) return;

      if (!volumesMap[volName]) {
        volumesMap[volName] = {};
      }
      if (!volumesMap[volName][issName]) {
        volumesMap[volName][issName] = [];
      }

      volumesMap[volName][issName].push({
        id: arch.id,
        title: arch.title,
        pdfUrl: arch.pdfUrl
      });
    });

    return Object.keys(volumesMap).map(volName => {
      const issuesMap = volumesMap[volName];
      const issuesList = Object.keys(issuesMap).map(issName => ({
        name: issName,
        papers: issuesMap[issName]
      }));

      const totalPapersCount = issuesList.reduce((sum, iss) => sum + iss.papers.length, 0);

      return {
        volume: volName,
        issues: issuesList,
        totalPapers: totalPapersCount
      };
    });
  };

  const archiveVolumes = getGroupedArchives();

  // All unique volume names & total paper counts for sidebar category list
  const volumeList = archiveVolumes.map(v => ({
    volume: v.volume,
    count: v.totalPapers
  }));

  // Filter volumes based on user selection and search query
  const filteredArchiveVolumes = archiveVolumes
    .filter(vol => appliedVolumes.length === 0 || appliedVolumes.includes(vol.volume))
    .map(vol => {
      if (!appliedSearchTerm.trim()) return vol;
      const filteredIssues = vol.issues.map(iss => ({
        ...iss,
        papers: iss.papers.filter(p => p.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()))
      })).filter(iss => iss.papers.length > 0);

      return {
        ...vol,
        issues: filteredIssues
      };
    })
    .filter(vol => vol.issues.length > 0);

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Journal Archives</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse past volumes, issues, and articles published by the World Journal of Biomedical Research.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }} className="responsive-home-grid">
        
        {/* Left Side: Filter Sidebar (Replacing Archives Info) */}
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

            {/* Category / Volume Filter Section */}
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
                  {volumeList.length === 0 ? (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No categories found</div>
                  ) : (
                    volumeList.map(({ volume, count }) => (
                      <label 
                        key={volume} 
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
                            checked={selectedVolumes.includes(volume)}
                            onChange={() => handleVolumeCheckboxChange(volume)}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer'
                            }}
                          />
                          <span>{volume}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          {count}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
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

        {/* Right Side: Accordion List */}
        <div>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-white)'
            }}>
              <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary-color)' }} />
              Loading journal archives...
            </div>
          ) : filteredArchiveVolumes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-white)'
            }}>
              No matching archives found.
            </div>
          ) : (
            <div className="accordion">
              {filteredArchiveVolumes.map((vol, vIdx) => {
                const isOpen = openVolumeIdx === vIdx;
                return (
                  <div key={vIdx} className="accordion-item">
                    <button 
                      onClick={() => toggleVolume(vIdx)}
                      className="accordion-trigger"
                      style={{
                        backgroundColor: isOpen ? 'var(--primary-light)' : 'var(--bg-white)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={18} style={{ color: 'var(--primary-color)' }} />
                        {vol.volume}
                      </span>
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {isOpen && (
                      <div className="accordion-content">
                        {vol.issues.map((iss, iIdx) => (
                          <div key={iIdx} style={{ marginBottom: '20px' }}>
                            <h4 style={{
                              fontSize: '15px',
                              color: 'var(--primary-color)',
                              marginBottom: '10px',
                              fontWeight: '700',
                              paddingBottom: '4px',
                              borderBottom: '1px solid var(--border-color)'
                            }}>
                              {iss.name}
                            </h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {iss.papers.map((paper, pIdx) => (
                                <a 
                                  key={pIdx}
                                  href={resolvePdfUrl(paper.pdfUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="archive-paper-link"
                                >
                                  <span>{paper.title}</span>
                                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
