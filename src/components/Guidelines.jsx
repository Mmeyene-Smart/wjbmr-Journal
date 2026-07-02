import React from 'react';
import { FileDown, CheckCircle, Info, BookOpen, AlertCircle } from 'lucide-react';

export default function Guidelines() {
  const AUTHOR_CHECKLIST = [
    "The manuscript is written in clear, concise English.",
    "The submission has not been previously published, nor is it before another journal for consideration.",
    "The text is double-spaced, uses a 12-point font, and employs italics rather than underlining (except with URL addresses).",
    "All illustrations, figures, and tables are placed within the text at the appropriate points, rather than at the end.",
    "A blinded version of the manuscript is prepared for review (all direct/indirect author identifiers removed).",
    "References are formatted strictly according to the Vancouver Style guide.",
    "Ethical clearance details and consent forms are referenced for all studies involving human or animal trials."
  ];

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Author Guidelines</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Detailed instructions, formatting guides, and submission policies for authors preparing manuscripts for WJBMR.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px' }} className="responsive-home-grid">
        {/* Main Guidelines */}
        <div>
          {/* General Policy */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={22} style={{ color: 'var(--primary-color)' }} /> General Manuscript Policies
            </h3>
            <p className="text-block">
              World Journal of Biomedical Research (WJBMR) publishes original clinical studies, basic biomedical laboratory research, review articles, epidemiological surveys, and reports of medical cases. We accept submissions from authors around the globe.
            </p>
            <p className="text-block">
              All manuscripts undergo a rigorous <strong>double-blind peer-review process</strong>. At least two independent subject experts evaluate each manuscript. The final decision rests with the Editor-in-Chief.
            </p>
          </div>

          {/* Formatting Rules */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={22} style={{ color: 'var(--primary-color)' }} /> Manuscript Structure & Formatting
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--primary-color)', marginBottom: '6px' }}>1. Title Page (Submitted Separately)</h4>
                <p className="text-block" style={{ fontSize: '14px' }}>
                  Must contain: Full title of the paper, running title (max 50 characters), name of all authors with ORCID IDs, affiliations, and contact email of the corresponding author.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--primary-color)', marginBottom: '6px' }}>2. Blinded Manuscript File</h4>
                <p className="text-block" style={{ fontSize: '14px' }}>
                  Must contain: Title, Abstract, Keywords (3-6), Introduction, Materials and Methods, Results, Discussion, Acknowledgement (blinded), Conflicts of Interest, and References.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--primary-color)', marginBottom: '6px' }}>3. Reference Style (Vancouver Style)</h4>
                <p className="text-block" style={{ fontSize: '14px' }}>
                  References must be numbered consecutively in the order in which they are first mentioned in the text. Identify references in text, tables, and legends by Arabic numerals in superscript.
                  <br />
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', display: 'block', marginTop: '6px', backgroundColor: 'var(--bg-light)', padding: '8px', borderRadius: '4px' }}>
                    Example: Moses AE, Archibong UD. Molecular diagnostics in malaria control. WJBMR. 2026;12(2):145-152.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Submission Checklist */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Submission Checklist</h3>
            <p className="text-block">
              Before submitting your manuscript, please confirm that your package meets all of these criteria:
            </p>
            <div className="guidelines-list" style={{ marginTop: '16px' }}>
              {AUTHOR_CHECKLIST.map((item, idx) => (
                <div key={idx} className="guidelines-item">
                  <CheckCircle size={18} className="guidelines-bullet" style={{ color: 'var(--primary-color)' }} />
                  <span className="guidelines-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Downloads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Templates */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Downloads
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--primary-dark)'
                }}
              >
                <FileDown size={20} style={{ color: 'var(--primary-color)' }} />
                Manuscript Template (DOCX)
              </a>
              
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--primary-dark)'
                }}
              >
                <FileDown size={20} style={{ color: 'var(--primary-color)' }} />
                Title Page Template (DOCX)
              </a>

              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--primary-dark)'
                }}
              >
                <FileDown size={20} style={{ color: 'var(--primary-color)' }} />
                Conflict of Interest Form (PDF)
              </a>
            </div>
          </div>

          {/* Ethics Policy Card */}
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #ea580c' }}>
            <h3 style={{ fontSize: '16px', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertCircle size={18} /> Ethical Compliance
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
              Studies involving human subjects, tissue, or data must be in accordance with the Declaration of Helsinki. Proof of ethics committee approval (with institutional certificate number) must be included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
