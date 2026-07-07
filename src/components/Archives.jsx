import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';

const ARCHIVE_VOLUMES = [];

export default function Archives({ onNavigate }) {
  const [openVolumeIdx, setOpenVolumeIdx] = useState(0);

  const toggleVolume = (idx) => {
    setOpenVolumeIdx(openVolumeIdx === idx ? null : idx);
  };

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
              <strong>Total Issues:</strong> 0 Issues<br />
              <strong>Total Articles:</strong> 0 Papers
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div>
          <div className="accordion">
            {ARCHIVE_VOLUMES.length === 0 ? (
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
              ARCHIVE_VOLUMES.map((vol, vIdx) => {
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
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); onNavigate('Current'); }}
                                  className="archive-paper-link"
                                >
                                  <span>{paper}</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
