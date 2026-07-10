import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronRight, FolderOpen, RefreshCw } from 'lucide-react';
import API_BASE from '../api.js';

export default function Archives({ onNavigate }) {
  const [openVolumeIdx, setOpenVolumeIdx] = useState(0);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/archives`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setArchives(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleVolume = (idx) => {
    setOpenVolumeIdx(openVolumeIdx === idx ? null : idx);
  };

  // Group raw archives flat array into hierarchial structure
  const getGroupedArchives = () => {
    const volumesMap = {};

    archives.forEach(arch => {
      const volName = arch.volume;
      const issName = arch.issue;

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

      return {
        volume: volName,
        issues: issuesList
      };
    });
  };

  const archiveVolumes = getGroupedArchives();

  // Sidebar stats
  let totalIssues = 0;
  let totalArticles = 0;
  archiveVolumes.forEach(vol => {
    totalIssues += vol.issues.length;
    vol.issues.forEach(iss => {
      totalArticles += iss.papers.length;
    });
  });

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Journal Archives</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse past volumes, issues, and articles published by the World Journal of Biomedical Research.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3.2fr', gap: '32px' }} className="responsive-home-grid">
        {/* Sidebar Info */}
        <div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderOpen size={18} style={{ color: 'var(--primary-color)' }} /> Archives Info
            </h3>
            <p className="text-block" style={{ fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
              WJBMR maintains digital archives of all issues published since its inception in 2015. All articles are preserved in perpetuity.
            </p>
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              <strong>Total Issues:</strong> {totalIssues} Issue{totalIssues !== 1 ? 's' : ''}<br />
              <strong>Total Articles:</strong> {totalArticles} Paper{totalArticles !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Accordion List */}
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
          ) : archiveVolumes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-white)'
            }}>
              No archives available.
            </div>
          ) : (
            <div className="accordion">
              {archiveVolumes.map((vol, vIdx) => {
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
                                  href={`${API_BASE}${paper.pdfUrl}`}
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
              })
            }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

