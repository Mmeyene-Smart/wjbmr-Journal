import React from 'react';
import { Mail, Phone, MapPin, Award, BookOpen, FileCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="container">
      <div className="about-grid">
        {/* Left Column (Reference 2 Left Side) */}
        <div className="about-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 className="about-journal-title">
              World Journal of<br />
              Biomedical Research
            </h1>
            <div className="about-journal-divider"></div>
          </div>
          
          {/* Journal Cover Image — fills the box properly without cropping */}
          <div className="about-circle-frame" style={{ 
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '490px',
            height: 'auto',
            border: 'none',
            background: 'none',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            marginBottom: 0,
            display: 'block'
          }}>
            <img 
              src="/wjbm-about-new.jpeg" 
              alt="World Journal of Biomedical Research Cover" 
              className="about-circle-img"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-md)' }}
              onError={(e) => {
                e.target.src = '/wjbmr-about.jpg';
              }}
            />
          </div>

          {/* Subscription Section */}
          <div className="info-section" style={{ width: '100%', textAlign: 'left' }}>
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
                  Only Publication Fee (₦60,000) or its equivalent in other currencies is charged upon the official acceptance of an article. No submission fees apply.
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
                  <a href="mailto:wjbmr2014@gmail.com">wjbmr2014@gmail.com</a>
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

    </div>
  );
}
