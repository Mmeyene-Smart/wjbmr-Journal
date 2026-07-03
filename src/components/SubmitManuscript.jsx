import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubmitManuscript() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    category: 'ORIGINAL RESEARCH',
    authorName: '',
    authorEmail: '',
    affiliation: '',
    coAuthors: '',
    declarations: false,
    manuscriptFile: null,
    coverLetterFile: null
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));
      if (errors[fileType]) {
        setErrors(prev => ({ ...prev, [fileType]: null }));
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Manuscript title is required';
    if (!formData.abstract.trim()) newErrors.abstract = 'Manuscript abstract is required';
    if (formData.abstract.trim().split(/\s+/).length < 50) {
      newErrors.abstract = 'Abstract must be at least 50 words';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.authorName.trim()) newErrors.authorName = 'Primary author name is required';
    if (!formData.authorEmail.trim()) newErrors.authorEmail = 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.authorEmail.trim() && !emailRegex.test(formData.authorEmail)) {
      newErrors.authorEmail = 'Invalid email address';
    }
    if (!formData.affiliation.trim()) newErrors.affiliation = 'Academic affiliation is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.manuscriptFile) newErrors.manuscriptFile = 'Manuscript file is required';
    if (!formData.declarations) newErrors.declarations = 'You must accept the manuscript declarations';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('abstract', formData.abstract);
    postData.append('category', formData.category);
    postData.append('authorName', formData.authorName);
    postData.append('authorEmail', formData.authorEmail);
    postData.append('affiliation', formData.affiliation);
    postData.append('coAuthors', formData.coAuthors);
    postData.append('manuscriptFile', formData.manuscriptFile);
    if (formData.coverLetterFile) {
      postData.append('coverLetterFile', formData.coverLetterFile);
    }

    fetch('/api/submissions', {
      method: 'POST',
      body: postData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || 'Failed to submit manuscript');
          });
        }
        return res.json();
      })
      .then(data => {
        setIsSubmitting(false);
        setStep(4);
        triggerSuccessConfetti();
      })
      .catch(err => {
        console.error(err);
        setErrors(prev => ({ ...prev, submit: err.message || 'Submission failed. Please try again.' }));
        setIsSubmitting(false);
      });
  };

  const triggerSuccessConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#0f4c81', '#0077b6', '#90e0ef']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#0f4c81', '#0077b6', '#90e0ef']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="container">
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Submit Manuscript</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Please complete all steps to submit your research to the World Journal of Biomedical Research editorial system.
        </p>
      </div>

      {/* Submission Steps Bar */}
      {step < 4 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-white)',
          padding: '20px 30px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          border: '1px solid var(--border-color)'
        }}>
          {[
            { n: 1, label: 'Metadata' },
            { n: 2, label: 'Authors' },
            { n: 3, label: 'Files & Submit' }
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step === s.n ? 'var(--primary-color)' : (step > s.n ? 'var(--primary-light)' : 'var(--bg-light)'),
                color: step === s.n ? 'var(--bg-white)' : (step > s.n ? 'var(--primary-color)' : 'var(--text-muted)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                border: `1px solid ${step === s.n ? 'var(--primary-color)' : 'var(--border-color)'}`
              }}>
                {s.n}
              </div>
              <span style={{
                fontWeight: step === s.n ? '700' : '500',
                color: step === s.n ? 'var(--primary-dark)' : 'var(--text-muted)',
                fontSize: '14px',
                fontFamily: 'var(--font-display)'
              }}>
                {s.label}
              </span>
              {s.n < 3 && <ChevronRight size={16} style={{ color: 'var(--border-color)', marginLeft: '12px' }} />}
            </div>
          ))}
        </div>
      )}

      {/* Form Content */}
      <div className="glass-card" style={{ padding: '36px' }}>
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--primary-dark)' }}>Manuscript Metadata</h3>
            
            <div className="form-group">
              <label className="form-label">Manuscript Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Enter the full title of your manuscript"
                className="form-input" 
              />
              {errors.title && <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{errors.title}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Journal Section *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                  <option value="ORIGINAL RESEARCH">Original Research</option>
                  <option value="CLINICAL STUDY">Clinical Study</option>
                  <option value="REVIEW ARTICLE">Review Article</option>
                  <option value="CASE REPORT">Case Report</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Language</label>
                <input type="text" value="English" disabled className="form-input" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Abstract * (Min 50 words)</label>
              <textarea 
                name="abstract" 
                rows="8"
                value={formData.abstract} 
                onChange={handleInputChange} 
                placeholder="Paste your abstract text here..."
                className="form-textarea"
              ></textarea>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {errors.abstract ? (
                  <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />{errors.abstract}
                  </div>
                ) : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Provide a structured abstract (Introduction, Methods, Results, Conclusion)</span>}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  {formData.abstract ? formData.abstract.trim().split(/\s+/).filter(Boolean).length : 0} words
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={nextStep} className="submit-form-btn" style={{ width: 'auto' }}>
                Next Step: Author Details <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--primary-dark)' }}>Corresponding Author Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name * (with academic titles)</label>
                <input 
                  type="text" 
                  name="authorName" 
                  value={formData.authorName} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Dr. Jane O. Doe"
                  className="form-input" 
                />
                {errors.authorName && <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{errors.authorName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  name="authorEmail" 
                  value={formData.authorEmail} 
                  onChange={handleInputChange} 
                  placeholder="e.g. author@university.edu"
                  className="form-input" 
                />
                {errors.authorEmail && <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{errors.authorEmail}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Institution / Affiliation *</label>
              <input 
                type="text" 
                name="affiliation" 
                value={formData.affiliation} 
                onChange={handleInputChange} 
                placeholder="e.g. Dept of Biochemistry, College of Health Sciences, University of Uyo"
                className="form-input" 
              />
              {errors.affiliation && <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{errors.affiliation}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Co-Authors (optional)</label>
              <textarea 
                name="coAuthors" 
                rows="3"
                value={formData.coAuthors} 
                onChange={handleInputChange} 
                placeholder="Enter names, email addresses, and affiliations of co-authors, separated by semicolons"
                className="form-textarea"
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button onClick={prevStep} className="submit-btn">Back</button>
              <button onClick={nextStep} className="submit-form-btn" style={{ width: 'auto' }}>
                Next Step: Document Upload <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--primary-dark)' }}>Upload Documents & Declare Interests</h3>

            <div className="form-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Manuscript Document * (DOC, DOCX, or PDF)</label>
                  <div className="file-dropzone" onClick={() => document.getElementById('manuscriptFile').click()}>
                    <Upload size={32} style={{ color: 'var(--primary-color)' }} />
                    <div>
                      {formData.manuscriptFile ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                          <FileText size={18} /> {formData.manuscriptFile.name}
                        </div>
                      ) : (
                        <>
                          <strong>Click to upload</strong> or drag and drop<br />
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PDF or Word Document (Max 15MB)</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      id="manuscriptFile"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'manuscriptFile')}
                      style={{ display: 'none' }} 
                    />
                  </div>
                  {errors.manuscriptFile && <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{errors.manuscriptFile}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter (optional)</label>
                  <div className="file-dropzone" onClick={() => document.getElementById('coverLetterFile').click()} style={{ padding: '20px' }}>
                    <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      {formData.coverLetterFile ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)', fontWeight: 'bold' }}>
                          <FileText size={16} /> {formData.coverLetterFile.name}
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px' }}>Click to upload cover letter</span>
                      )}
                    </div>
                    <input 
                      type="file" 
                      id="coverLetterFile"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'coverLetterFile')}
                      style={{ display: 'none' }} 
                    />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px'
              }}>
                <h4 style={{ fontSize: '14px', color: 'var(--primary-dark)', marginBottom: '12px' }}>Submission Requirements:</h4>
                <ul style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px' }}>
                  <li>Main text file must be blinded for peer review (remove author names from file content).</li>
                  <li>A separate Title Page can be uploaded in Cover Letter section.</li>
                  <li>Ensure references are in Vancouver / Harvard format.</li>
                  <li>Include Ethical approval references if human/animal trials are involved.</li>
                </ul>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px', backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-light)' }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'start', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="declarations" 
                  checked={formData.declarations}
                  onChange={handleInputChange}
                  style={{ marginTop: '4px' }} 
                />
                <span style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: '500' }}>
                  I declare that this manuscript is original, has not been published elsewhere, is not currently under consideration by another journal, and all authors have approved the submission. I agree to pay the Article Processing Charge of ₦25,000 if my manuscript is officially accepted for publication.
                </span>
              </label>
              {errors.declarations && <div style={{ color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}><AlertCircle size={14} />{errors.declarations}</div>}
            </div>

            {errors.submit && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginTop: '16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" onClick={prevStep} className="submit-btn">Back</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="submit-form-btn" 
                style={{ width: 'auto' }}
              >
                {isSubmitting ? 'Submitting Manuscript...' : (
                  <>
                    Submit Manuscript <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="success-card">
            <div className="success-icon-wrapper">
              <Sparkles size={36} />
            </div>
            <h2 style={{ color: 'var(--primary-color)' }}>Submission Successful!</h2>
            <p className="text-block" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Thank you for submitting your research to the <strong>World Journal of Biomedical Research (WJBMR)</strong>. Your manuscript has been uploaded successfully and is assigned the reference ID <strong>WJBMR-2026-0492</strong>.
            </p>
            <div style={{
              backgroundColor: 'var(--bg-light)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '14px',
              textAlign: 'left',
              width: '100%',
              maxWidth: '500px',
              margin: '12px auto'
            }}>
              <strong>Next Steps:</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>A confirmation email has been sent to <strong>{formData.authorEmail}</strong>.</li>
                <li>The manuscript will undergo initial editorial screening within 3-5 days.</li>
                <li>Upon passing, it will be assigned to double-blind peer review.</li>
              </ul>
            </div>
            <button 
              onClick={() => {
                setFormData({
                  title: '',
                  abstract: '',
                  category: 'ORIGINAL RESEARCH',
                  authorName: '',
                  authorEmail: '',
                  affiliation: '',
                  coAuthors: '',
                  declarations: false,
                  manuscriptFile: null,
                  coverLetterFile: null
                });
                setStep(1);
              }} 
              className="submit-form-btn"
              style={{ width: 'auto', marginTop: '12px' }}
            >
              Submit Another Manuscript
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
