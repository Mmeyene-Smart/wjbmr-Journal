import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';

const ARCHIVE_VOLUMES = [
  {
    volume: 'Volume 12 (2026)',
    issues: [
      {
        name: 'Issue 1 (March 2026)',
        papers: [
          'Genomic Surveillance of Drug-Resistant Microbes in Uyo Teaching Hospital',
          'A Double-Blind Randomized Control Trial on Immunological Effects of Dietary Honey',
          'Assessment of Biomedical Waste Disposal Mechanisms in Akwa Ibom State'
        ]
      }
    ]
  },
  {
    volume: 'Volume 11 (2025)',
    issues: [
      {
        name: 'Issue 4 (December 2025)',
        papers: [
          'Prevalence and Molecular Characteristics of HPV Among Women in South-South Nigeria',
          'Phytochemical Profiles and Antibacterial Properties of Ethanolic Moringa Extracts',
          'Evaluating Healthcare Delivery Speeds in Urban and Rural Clinics: A Comparative Analysis'
        ]
      },
      {
        name: 'Issue 3 (September 2025)',
        papers: [
          'Histopathological Changes of Liver and Kidney in Albino Rats Induced with Acetaminophen',
          'Impact of Sickle Cell Gene Counseling in Rural Akwa Ibom Local Government Areas',
          'Biochemical Parameters of Patients Administered with Antiretroviral Therapy'
        ]
      },
      {
        name: 'Issue 2 (June 2025)',
        papers: [
          'Microbiological Evaluation of Hand-Hygiene Audits in Tertiary Hospitals in Uyo',
          'Antioxidant Capacities of Refined Palm Kernel Oil Formulated with Alpha-Tocopherol',
          'Epidemiological Analysis of Neonatal Tetanus Cases: A Ten-Year Review'
        ]
      },
      {
        name: 'Issue 1 (March 2025)',
        papers: [
          'Serum Electrolyte and Lipid Profiles in Hypertensive Patients in South-East Nigeria',
          'Therapeutic Potential of Vernonia amygdalina in Diabetic Nephropathy Rats',
          'Quality Control Assessments of Commercially Available Amoxicillin Suspensions'
        ]
      }
    ]
  },
  {
    volume: 'Volume 10 (2024)',
    issues: [
      {
        name: 'Issue 4 (December 2024)',
        papers: [
          'Review of Vector-borne Tropical Disease Prevalences in Coastal West Africa',
          'Evaluation of Blood Transfusion Safeties and Nucleic Acid Amplification Screening',
          'Phytotherapy Practices Among Diabetic Patients in Akwa Ibom State'
        ]
      },
      {
        name: 'Issue 3 (September 2024)',
        papers: [
          'Comparative Evaluations of Local Antimicrobial Resistance Indices in UTI Isolates',
          'Toxicity Assessment of Heavily Consumed Carbonated Drinks in Animal Models',
          'Investigating Heavy Metal Residues in Shellfish Sourced from Akwa Ibom Estuaries'
        ]
      }
    ]
  }
];

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
              <strong>Total Issues:</strong> 42 Issues<br />
              <strong>Total Articles:</strong> 156 Papers
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div>
          <div className="accordion">
            {ARCHIVE_VOLUMES.map((vol, vIdx) => {
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
