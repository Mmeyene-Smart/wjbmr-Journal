import React from 'react';
import { Mail, Phone, MapPin, Award, BookOpen, FileCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="container">
      <div className="about-grid">
        {/* Left Column (Reference 2 Left Side) */}
        <div className="about-left-col">
          <h1 className="about-journal-title">
            World Journal of<br />
            Biomedical Research
          </h1>
          <div className="about-journal-divider"></div>
          
          <div className="about-circle-frame">
            <img 
              src="/biomedical_illustration.png" 
              alt="World Journal of Biomedical Research Illustration" 
              className="about-circle-img"
              onError={(e) => {
                // Fallback icon representation if image fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Logo Icons at the bottom (Reference 2 logos) */}
          <div className="about-logos">
            {/* University of Uyo Mock Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 100 100" width="60" height="60" style={{ fill: 'var(--primary-color)' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-color)" strokeWidth="3" />
                <path d="M50,15 L75,35 L75,65 L50,85 L25,65 L25,35 Z" fill="none" stroke="var(--primary-color)" strokeWidth="2" />
                <path d="M50,22 L68,37 L68,63 L50,78 L32,63 L32,37 Z" fill="var(--primary-light)" />
                <path d="M43,40 L50,30 L57,40 L57,60 L43,60 Z" fill="var(--primary-color)" />
                <text x="50" y="70" fontSize="8" textAnchor="middle" fill="var(--primary-dark)" fontWeight="bold">UNIUYO</text>
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>University of Uyo</span>
            </div>
            
            {/* WJBMR Society Crest Mock Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 100 100" width="60" height="60" style={{ fill: 'var(--accent-color)' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-color)" strokeWidth="3" />
                <path d="M35,35 A15,15 0 1,1 65,35 A15,15 0 1,1 35,35" fill="none" stroke="var(--accent-color)" strokeWidth="3" />
                <path d="M30,55 C30,45 70,45 70,55 C70,65 30,65 30,55" fill="none" stroke="var(--primary-color)" strokeWidth="3" />
                <path d="M50,18 L50,82" stroke="var(--accent-color)" strokeWidth="2" />
                <text x="50" y="93" fontSize="8" textAnchor="middle" fill="var(--primary-dark)" fontWeight="bold">WJBMR</text>
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>CHS Society</span>
            </div>
          </div>
        </div>

        {/* Right Column (Reference 2 Right Side) */}
        <div className="about-right-col">
          {/* Main Journal Description */}
          <div className="info-section">
            <h2 className="info-section-title">
              WORLD JOURNAL OF BIOMEDICAL RESEARCH (WJBMR)
            </h2>
            <p className="info-section-body text-block">
              is published by the <strong>College of Health Sciences, University of Uyo, Uyo, Nigeria</strong>. The purpose of the Journal is to publish papers on all aspects of medicine, dental sciences, anatomy, physiology, pharmacology, biochemistry, pathology, microbiology, community health, and allied health sciences.
            </p>
            <p className="info-section-body text-block">
              The focus is to bring to the scientific, academic, and policy-making communities, as well as the reading public, empirical information on current scientific breakthroughs, clinical studies, medical reviews, technologies, policies, and health system innovations. This is to contribute to the global and regional search for solutions to human health challenges and tropical diseases.
            </p>
          </div>

          {/* Subscription Section */}
          <div className="info-section">
            <h2 className="info-section-title">Subscription</h2>
            <div className="info-section-body glass-card" style={{ padding: '20px', margin: 0, borderLeft: '4px solid var(--primary-color)' }}>
              <p className="text-block" style={{ margin: 0 }}>
                The Journal is published in <strong>one volume with four issues per year</strong>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>INDIVIDUALS</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-color)', fontFamily: 'var(--font-display)' }}>₦5,000</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Per Issue (Nigeria)</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>LIBRARIES & ORGS</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-color)', fontFamily: 'var(--font-display)' }}>₦10,000</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Per Issue (Nigeria)</div>
                </div>
              </div>
              <p className="text-block" style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', margin: '16px 0 0 0' }}>
                * Overseas subscription rates: $100 (Individuals) and $200 (Institutions) per volume. Individual readers and non-profit libraries are permitted to make fair use of the materials. Articles cited in publications must include due acknowledgement.
              </p>
            </div>
          </div>

          {/* Publication Schedule Section */}
          <div className="info-section">
            <h2 className="info-section-title">Publication Schedule & Charges</h2>
            <p className="info-section-body text-block">
              WJBMR operates on a rolling publication cycle, finalizing four full issues annually. 
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--primary-light)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-light)'
            }}>
              <Award className="guidelines-bullet" size={24} style={{ color: 'var(--primary-color)' }} />
              <div>
                <span style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: '700', textTransform: 'uppercase' }}>Article Processing Charges (APC):</span>
                <p style={{ fontSize: '15px', color: 'var(--text-dark)', fontWeight: '600' }}>
                  Only Publication Fee (₦25,000) or its equivalent in other currencies is charged upon the official acceptance of an article. No submission fees apply.
                </p>
              </div>
            </div>
          </div>

          {/* Correspondence Section */}
          <div className="info-section">
            <h2 className="info-section-title">Correspondence</h2>
            <p className="info-section-body text-block">
              All correspondence, including manuscripts, reviews, and subscription inquiries should be forwarded to the Editor-in-Chief:
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <MapPin size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Office of the Editor-in-Chief, WJBMR</strong><br />
                  College of Health Sciences, University of Uyo<br />
                  P.M.B. 1017, Uyo, Akwa Ibom State, Nigeria
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                <div>
                  <a href="mailto:editor@wjbmr.org">editor@wjbmr.org</a> / <a href="mailto:wjbmr.editor@gmail.com">wjbmr.editor@gmail.com</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                <div>
                  +234 (0) 803 123 4567, +234 (0) 802 987 6543
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Board (Additional premium detail) */}
      <div style={{ marginTop: '60px' }}>
        <h2 className="section-title">Editorial Board & Administration</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '20px',
          marginTop: '24px'
        }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
            <div style={{ fontWeight: '800', color: 'var(--primary-dark)' }}>Prof. Anietie E. Moses</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>Editor-in-Chief</div>
            <div style={{ fontSize: '13px' }}>Medical Microbiologist, University of Uyo</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid var(--primary-color)' }}>
            <div style={{ fontWeight: '800', color: 'var(--primary-dark)' }}>Prof. Friday E. Okonofua</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>Associate Editor</div>
            <div style={{ fontSize: '13px' }}>Obstetrics & Gynaecology, CHS UNIUYO</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid var(--primary-color)' }}>
            <div style={{ fontWeight: '800', color: 'var(--primary-dark)' }}>Dr. Emem A. Bassey</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>Managing Editor</div>
            <div style={{ fontSize: '13px' }}>Clinical Pharmacology, CHS UNIUYO</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid var(--primary-color)' }}>
            <div style={{ fontWeight: '800', color: 'var(--primary-dark)' }}>Prof. Eme F. Archibong</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>Editorial Adviser</div>
            <div style={{ fontSize: '13px' }}>Biomedical Pathology, University of Calabar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
