import React, { useState } from 'react';
import { FileText, Download, Share2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const CURRENT_ARTICLES = [
  {
    id: 1,
    title: 'Molecular Characterization and Drug Resistance Profiling of Plasmodium falciparum Isolates in Southern Nigeria',
    authors: 'Dr. Ukeme D. Archibong, Dr. Juliet U. Don & Prof. Kofon G. Nkanta',
    type: 'ORIGINAL RESEARCH',
    pages: '101 - 112',
    doi: 'https://doi.org/10.5281/wjbmr.2026.0401',
    abstract: 'Background: Drug-resistant malaria remains a significant challenge to eradication campaigns in sub-Saharan Africa. This study investigates the molecular markers associated with chloroquine and artemisinin-based combination therapy (ACT) resistance in Plasmodium falciparum isolates in Akwa Ibom State, Nigeria. Methods: One hundred blood samples were collected from febrile patients. DNA extraction and nested PCR were used to amplify pfcrt and pfmdr1 genes, followed by restriction fragment length polymorphism (RFLP) analysis. Results: The pfcrt K76T mutation was detected in 35% of the samples, while pfmdr1 N86Y was present in 48%. No kelch13 mutations indicating artemisinin resistance were observed. Conclusion: Although artemisinin remains highly effective, there is a persistent presence of chloroquine resistance alleles, demanding continuous molecular surveillance.',
    keywords: 'Plasmodium falciparum, Drug Resistance, pfcrt, pfmdr1, Nigeria'
  },
  {
    id: 2,
    title: 'Efficacy and Safety of Novel Phytochemical Extracts from Vernonia amygdalina in Hepatoprotective Therapy: A Randomized Controlled Trial',
    authors: 'Dr. Ezenwa O. Nwosu & Prof. Blessing C. Akpan',
    type: 'CLINICAL STUDY',
    pages: '113 - 124',
    doi: 'https://doi.org/10.5281/wjbmr.2026.0402',
    abstract: 'Background: Liver diseases continue to present a heavy global burden with limited drug treatment options. Vernonia amygdalina is widely used in traditional African medicine. We aimed to evaluate the liver protection potential of its refined extracts under clinical trial settings. Methods: A double-blind RCT randomized 60 patients with mild hepatic impairment into receiving extract capsules (500mg daily) or placebo for 12 weeks. Serum liver enzymes (ALT, AST) and bilirubin were monitored. Results: Treatment with the extract resulted in a significant decrease in serum ALT (p < 0.01) and AST levels compared to placebo. No severe adverse events were reported. Conclusion: Standardized Vernonia amygdalina extract is safe and demonstrates clinical efficacy in improving liver function markers.',
    keywords: 'Vernonia amygdalina, Hepatoprotection, Clinical Trial, Liver Enzymes'
  },
  {
    id: 3,
    title: 'Recent Advances in CRISPR-Cas9 Gene Editing Applications for Hereditary Hematological Disorders in Sub-Saharan Africa',
    authors: 'Dr. Amina Y. Bello, Prof. Charles K. Tetteh & Dr. Sarah E. Cole',
    type: 'REVIEW ARTICLE',
    pages: '125 - 138',
    doi: 'https://doi.org/10.5281/wjbmr.2026.0403',
    abstract: 'Hereditary hematological disorders, particularly sickle cell disease (SCD) and beta-thalassemia, pose a massive socio-economic and public health burden in sub-Saharan Africa. With the advent of CRISPR-Cas9 gene editing technology, curative therapies are transitioning from theoretical concepts to clinical realities. This review summarizes the current landscape of gene editing trials targeting fetal hemoglobin (HbF) induction and direct beta-globin gene correction. We highlight the regulatory, financial, infrastructural, and bioethical challenges of deploying gene therapies in low-resource settings, and discuss strategies to build regional capacity for gene-editing medicine.',
    keywords: 'CRISPR-Cas9, Sickle Cell Disease, Gene Therapy, Hematology, Africa'
  }
];

export default function Current() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleAbstract = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="container">
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Current Issue</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Volume 12, Issue 2, June 2026. Browse table of contents and download full papers.
        </p>
      </div>

      {/* Issue Cover Panel */}
      <div className="glass-card responsive-home-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '32px',
        background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--primary-light) 100%)',
        borderColor: 'var(--accent-light)',
        alignItems: 'center'
      }} >
        <div style={{
          backgroundColor: 'var(--primary-color)',
          color: 'var(--bg-white)',
          padding: '40px 24px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '220px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>WJBMR COVER</div>
          <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', margin: '12px 0 6px 0' }}>Vol. 12</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>Issue 2</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '12px' }}>June 2026</div>
        </div>

        <div>
          <h3 style={{ fontSize: '22px', color: 'var(--primary-dark)', marginBottom: '12px' }}>
            World Journal of Biomedical Research (Vol. 12, No. 2)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <span><strong>Released:</strong> June 30, 2026</span>
            <span><strong>Articles:</strong> {CURRENT_ARTICLES.length}</span>
            <span><strong>Publisher:</strong> College of Health Sciences, UNIUYO</span>
          </div>
          <p className="text-block" style={{ fontSize: '14px' }}>
            This issue covers groundbreaking investigations in malaria parasite molecular genomics, clinical trials validation of indigenous West African medicinal plant extracts, and an in-depth bioethical review of deploying gene therapies for sickle cell anemias.
          </p>
        </div>
      </div>

      {/* Table of Contents Header */}
      <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', margin: '40px 0 20px 0', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
        Table of Contents
      </h3>

      {/* Articles List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {CURRENT_ARTICLES.map(art => (
          <div key={art.id} className="glass-card" style={{ padding: '24px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '24px' }} className="responsive-home-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.5px'
                }}>
                  {art.type} | PAGES: {art.pages}
                </span>
                
                <h4 style={{ fontSize: '18px', color: 'var(--primary-dark)', lineHeight: '1.4' }}>
                  {art.title}
                </h4>
                
                <div style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: '500' }}>
                  {art.authors}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {art.doi}
                </div>
              </div>

              {/* Actions Box */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button 
                  onClick={() => toggleAbstract(art.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-white)',
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition)'
                  }}
                >
                  Abstract {expandedId === art.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("PDF Download started... (Simulated)"); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--primary-color)',
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--bg-white)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '700',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition)'
                  }}
                >
                  <Download size={14} /> PDF
                </a>
              </div>
            </div>

            {/* Collapsed Abstract Content */}
            {expandedId === art.id && (
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-light)',
                padding: '20px',
                borderRadius: 'var(--radius-md)'
              }}>
                <h5 style={{ fontSize: '14px', color: 'var(--primary-dark)', marginBottom: '8px' }}>Abstract</h5>
                <p className="text-block" style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {art.abstract}
                </p>
                <div style={{ marginTop: '14px', fontSize: '13px' }}>
                  <strong>Keywords:</strong> <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{art.keywords}</span>
                </div>
                
                {/* Micro Actions */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Share2 size={14} /> Cite this Article
                  </button>
                  <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <MessageSquare size={14} /> Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
