import React, { useState } from 'react';
import { BookOpen, GraduationCap, Calendar, Users, FileText, ArrowRight, Search, TrendingUp } from 'lucide-react';

const MOCK_PUBLICATIONS = [
  {
    id: 1,
    category: 'ORIGINAL RESEARCH',
    title: 'Molecular Characterization and Drug Resistance Profiling of Plasmodium falciparum Isolates in Southern Nigeria',
    authors: [
      { name: 'Dr. Ukeme D. Archibong', profile: '#' },
      { name: 'Dr. Juliet U. Don', profile: '#' },
      { name: 'Prof. Kofon G. Nkanta', profile: '#' }
    ],
    date: 'June 28, 2026',
    readTime: '12 min read',
    pdfUrl: '#',
    chartType: 'bar',
    chartData: [45, 62, 38, 85, 52]
  },
  {
    id: 2,
    category: 'CLINICAL STUDY',
    title: 'Efficacy and Safety of Novel Phytochemical Extracts from Vernonia amygdalina in Hepatoprotective Therapy: A Randomized Controlled Trial',
    authors: [
      { name: 'Dr. Ezenwa O. Nwosu', profile: '#' },
      { name: 'Prof. Blessing C. Akpan', profile: '#' }
    ],
    date: 'May 15, 2026',
    readTime: '15 min read',
    pdfUrl: '#',
    chartType: 'line',
    chartData: [10, 25, 45, 60, 95]
  },
  {
    id: 3,
    category: 'REVIEW ARTICLE',
    title: 'Recent Advances in CRISPR-Cas9 Gene Editing Applications for Hereditary Hematological Disorders in Sub-Saharan Africa',
    authors: [
      { name: 'Dr. Amina Y. Bello', profile: '#' },
      { name: 'Prof. Charles K. Tetteh', profile: '#' },
      { name: 'Dr. Sarah E. Cole', profile: '#' }
    ],
    date: 'April 02, 2026',
    readTime: '18 min read',
    pdfUrl: '#',
    chartType: 'pie',
    chartData: [30, 20, 50]
  }
];

export default function Home({ onNavigate, onNavigateToArticle, articles = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPublications = articles.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some(auth => auth.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderChart = (type, data) => {
    if (type === 'bar') {
      return (
        <svg viewBox="0 0 100 60" width="100%" height="100%" style={{ overflow: 'visible' }}>
          {data.map((val, idx) => {
            const barWidth = 10;
            const barSpacing = 6;
            const x = 12 + idx * (barWidth + barSpacing);
            const height = (val / 100) * 45;
            const y = 50 - height;
            const colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa'];
            return (
              <g key={idx}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={height} 
                  fill={colors[idx % colors.length]} 
                  rx={2}
                  style={{ transition: 'all 0.5s ease' }}
                />
                <text x={x + 5} y={y - 3} fontSize="4" textAnchor="middle" fill="#62728f" fontWeight="bold">
                  {val}%
                </text>
              </g>
            );
          })}
          <line x1="8" y1="50" x2="92" y2="50" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      );
    }

    if (type === 'line') {
      const points = data.map((val, idx) => {
        const x = 15 + idx * 18;
        const y = 50 - (val / 100) * 40;
        return `${x},${y}`;
      }).join(' ');

      return (
        <svg viewBox="0 0 100 60" width="100%" height="100%">
          <path 
            d={`M 15 50 L ${points} L 87 50 Z`} 
            fill="rgba(59, 130, 246, 0.15)"
            stroke="none"
          />
          <polyline
            fill="none"
            stroke="#0077b6"
            strokeWidth="2.5"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((val, idx) => {
            const x = 15 + idx * 18;
            const y = 50 - (val / 100) * 40;
            return (
              <circle 
                key={idx} 
                cx={x} 
                cy={y} 
                r="3" 
                fill="#ffffff" 
                stroke="#0f4c81" 
                strokeWidth="2" 
              />
            );
          })}
          <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      );
    }

    // Pie chart fallback
    return (
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        <circle cx="30" cy="30" r="20" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="30" cy="30" r="20" fill="none" stroke="#0f4c81" strokeWidth="10" strokeDasharray="62.8 125.6" strokeDashoffset="0" />
        <circle cx="30" cy="30" r="20" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="37.6 125.6" strokeDashoffset="-62.8" />
        <circle cx="30" cy="30" r="20" fill="none" stroke="#34d399" strokeWidth="10" strokeDasharray="25.2 125.6" strokeDashoffset="-100.4" />
      </svg>
    );
  };

  return (
    <div className="container">
      {/* Hero Search Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(230, 240, 250, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary-color)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '13px',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <TrendingUp size={16} /> Open Access Peer-Reviewed Journal
        </div>
        <h2 style={{ fontSize: '32px', maxWidth: '800px', lineHeight: '1.2' }}>
          Advancing Biomedical Discovery and Health Research Globally
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '15px' }}>
          WJBMR publishes cutting-edge articles in molecular biology, clinical diagnostics, pharmacology, public health, and biochemical innovations.
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '550px',
          position: 'relative',
          marginTop: '10px'
        }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input 
            type="text" 
            placeholder="Search publications by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '16px 20px 16px 48px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'var(--shadow-md)',
              outline: 'none',
              backgroundColor: 'var(--bg-white)',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="responsive-home-grid">
        {/* Main Content Area */}
        <div>
          {/* Call for Submission (matches Reference 1) */}
          <div className="glass-card">
            <h2 className="section-title">Call for Submission</h2>
            <div style={{ marginTop: '20px' }}>
              <p className="text-block">
                <strong>World Journal of Biomedical Research (p-ISSN: 2956-4279; e-ISSN: 2956-4287)</strong> is actively open for submissions for its upcoming issue. The journal is officially published by the <strong>College of Health Sciences, University of Uyo, Uyo, Nigeria</strong>.
              </p>
              <p className="text-block">
                We hope to publish high-quality, open-access, original research papers, reviews, case studies, and clinical letters. We invite global researchers, biochemists, medical professionals, and students to submit suitable manuscripts for peer review and consideration.
              </p>
              <p className="text-block">
                Please refer to our <strong>guidelines for authors</strong> for detailed information on manuscript formatting, word counts, and Article Processing Charges (APCs). The editorial board is committed to supporting scholarship and will consider full or partial waivers of the applicable APCs for deserving researchers.
              </p>
              
              <button 
                onClick={() => onNavigate('About')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-color)',
                  fontWeight: '700',
                  fontSize: '15px',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  marginTop: '16px',
                  transition: 'var(--transition)'
                }}
              >
                Learn more about the activities of College of Health Sciences <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Latest Publications (matches Reference 1) */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 className="section-title" style={{ margin: 0 }}>Latest publications</h2>
              
              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'ORIGINAL RESEARCH', 'CLINICAL STUDY', 'REVIEW ARTICLE'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-color)',
                      fontSize: '11px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === cat ? 'var(--primary-color)' : 'var(--bg-white)',
                      color: selectedCategory === cat ? 'var(--bg-white)' : 'var(--text-muted)',
                      transition: 'var(--transition)'
                    }}
                  >
                    {cat === 'All' ? 'All' : cat.replace(' ARTICLE', '')}
                  </button>
                ))}
              </div>
            </div>

            {filteredPublications.length > 0 ? (
              <div className="publications-list">
                {filteredPublications.map(pub => (
                  <div key={pub.id} className="publication-card">
                    <div className="pub-info">
                      <div className="pub-category">{pub.category}</div>
                      <div className="pub-title" onClick={() => onNavigateToArticle(pub.id)}>{pub.title}</div>
                      <div className="pub-authors">
                        {pub.authors.map((auth, index) => (
                          <React.Fragment key={index}>
                            <span onClick={() => {}}>{auth.name}</span>
                            {index < pub.authors.length - 1 ? ' & ' : ''}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="pub-meta">
                        <span className="pub-meta-item">
                          <Calendar size={14} /> {pub.date}
                        </span>
                        <span className="pub-meta-item">
                          <FileText size={14} /> {pub.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="pub-chart">
                      {renderChart(pub.chartType, pub.chartData)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-white)'
              }}>
                No articles match your filters. Try clearing your search.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Quick Metrics */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
            color: 'var(--bg-white)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <h3 style={{ color: 'var(--bg-white)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', fontSize: '18px' }}>
              Journal Indicators
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>3.42</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-light)' }}>Impact Score</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>1.85</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-light)' }}>CiteScore</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>18 Days</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-light)' }}>First Decision</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>62%</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-light)' }}>Acceptance Rate</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Resources
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <button 
                  onClick={() => onNavigate('Guidelines')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}
                >
                  <BookOpen size={16} /> Information for Authors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('Submit')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}
                >
                  <GraduationCap size={16} /> Submit a Manuscript
                </button>
              </li>
              <li>
                <a 
                  href="#"
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}
                >
                  <Users size={16} /> Editorial Board & Contacts
                </a>
              </li>
            </ul>
          </div>

          {/* Important Notices */}
          <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--primary-light)', borderColor: 'var(--accent-light)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calendar size={18} /> Call for Special Issues
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
              We are accepting proposal submissions for special issues focusing on <strong>"Advances in Vaccine Development and Therapeutics in Tropical Medicine"</strong>.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 'bold' }}>
              Deadline: October 30, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
