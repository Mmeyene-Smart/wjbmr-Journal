import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle, Eye, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminPanel({ onAddArticle, onBackToHome }) {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    affiliations: '',
    correspondingAuthor: '',
    keywords: '',
    category: 'ORIGINAL RESEARCH',
    volume: 'Volume 12 (2026)',
    issue: 'Issue 2 (June 2026)',
    pages: '',
    doi: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  const [htmlContent, setHtmlContent] = useState('');
  const [htmlFileName, setHtmlFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleHtmlFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
        setErrors(prev => ({ ...prev, htmlFile: 'Only HTML files are allowed (.html)' }));
        return;
      }

      setHtmlFileName(file.name);
      setErrors(prev => ({ ...prev, htmlFile: null }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setHtmlContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Manuscript title is required';
    if (!formData.authors.trim()) newErrors.authors = 'Authors are required (comma separated)';
    if (!formData.affiliations.trim()) newErrors.affiliations = 'Institutional affiliations are required';
    if (!formData.correspondingAuthor.trim()) newErrors.correspondingAuthor = 'Corresponding author details are required';
    if (!formData.keywords.trim()) newErrors.keywords = 'Keywords are required';
    if (!formData.pages.trim()) newErrors.pages = 'Page range is required (e.g. 139 - 148)';
    if (!formData.doi.trim()) newErrors.doi = 'DOI is required';
    if (!htmlContent.trim()) newErrors.htmlFile = 'HTML file upload is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build the dynamic article object
    const newArticle = {
      id: Date.now(),
      category: formData.category,
      title: formData.title,
      // Parse authors to standard structure
      authors: formData.authors.split(',').map(auth => ({ name: auth.trim(), profile: '#' })),
      affiliations: formData.affiliations,
      correspondingAuthor: formData.correspondingAuthor,
      keywords: formData.keywords,
      date: formData.date,
      readTime: '10 min read',
      pdfUrl: '#',
      chartType: 'line',
      chartData: [Math.floor(Math.random() * 30 + 10), Math.floor(Math.random() * 40 + 30), Math.floor(Math.random() * 30 + 50), Math.floor(Math.random() * 20 + 75)],
      doi: formData.doi,
      pages: formData.pages,
      volume: formData.volume,
      issue: formData.issue,
      abstract: htmlContent,
      isHtmlArticle: true
    };

    onAddArticle(newArticle);
    setSuccess(true);

    // Reset fields
    setFormData({
      title: '',
      authors: '',
      affiliations: '',
      correspondingAuthor: '',
      keywords: '',
      category: 'ORIGINAL RESEARCH',
      volume: 'Volume 12 (2026)',
      issue: 'Issue 2 (June 2026)',
      pages: '',
      doi: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });
    setHtmlContent('');
    setHtmlFileName('');

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div className="container">
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 className="section-title">Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Publish new biomedical articles dynamically to WJBMR using HTML uploads.
          </p>
        </div>
        <button 
          onClick={onBackToHome}
          className="submit-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Exit Admin Side
        </button>
      </div>

      {success && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #86efac',
          color: '#166534',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle size={20} />
          <div>
            <strong>Article Published Successfully!</strong> The manuscript is now live and searchable on the Home and Current Issue pages.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="responsive-home-grid">
        
        {/* Left Side - Upload Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--primary-dark)' }}>Publish New Article</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Article Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="e.g. Record-Keeping Habits Among Grain Marketers in Uyo Metropolis..."
                className="form-input" 
              />
              {errors.title && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.title}</div>}
            </div>

            {/* Authors */}
            <div className="form-group">
              <label className="form-label">Authors * (comma separated)</label>
              <input 
                type="text" 
                name="authors" 
                value={formData.authors} 
                onChange={handleInputChange} 
                placeholder="e.g. Akpan, OD., Bassey, EA."
                className="form-input" 
              />
              {errors.authors && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.authors}</div>}
            </div>

            {/* Affiliations */}
            <div className="form-group">
              <label className="form-label">Institutional Affiliations * (use linebreaks for multiple)</label>
              <textarea 
                name="affiliations" 
                rows="3"
                value={formData.affiliations} 
                onChange={handleInputChange} 
                placeholder="e.g. Department of Agricultural Economics, University of Uyo, Uyo, Nigeria"
                className="form-textarea" 
              ></textarea>
              {errors.affiliations && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.affiliations}</div>}
            </div>

            {/* Corresponding Author details */}
            <div className="form-group">
              <label className="form-label">Corresponding Author Contacts *</label>
              <input 
                type="text" 
                name="correspondingAuthor" 
                value={formData.correspondingAuthor} 
                onChange={handleInputChange} 
                placeholder="e.g. drodakpan@uniuyo.edu.ng; +234-8032717955"
                className="form-input" 
              />
              {errors.correspondingAuthor && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.correspondingAuthor}</div>}
            </div>

            {/* Keywords */}
            <div className="form-group">
              <label className="form-label">Keywords * (comma separated)</label>
              <input 
                type="text" 
                name="keywords" 
                value={formData.keywords} 
                onChange={handleInputChange} 
                placeholder="e.g. record keeping, grains, marketers, Uyo, Nigeria"
                className="form-input" 
              />
              {errors.keywords && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.keywords}</div>}
            </div>

            {/* Category and Volume */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Section Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                  <option value="ORIGINAL RESEARCH">Original Research</option>
                  <option value="CLINICAL STUDY">Clinical Study</option>
                  <option value="REVIEW ARTICLE">Review Article</option>
                  <option value="CASE REPORT">Case Report</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Volume *</label>
                <select name="volume" value={formData.volume} onChange={handleInputChange} className="form-select">
                  <option value="Volume 12 (2026)">Volume 12 (2026)</option>
                  <option value="Volume 11 (2025)">Volume 11 (2025)</option>
                  <option value="Volume 10 (2024)">Volume 10 (2024)</option>
                  <option value="Volume 7 (2025)">Volume 7 (2025)</option>
                  <option value="Volume 6 (2024)">Volume 6 (2024)</option>
                </select>
              </div>
            </div>

            {/* Issue, Pages, DOI */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Issue *</label>
                <select name="issue" value={formData.issue} onChange={handleInputChange} className="form-select">
                  <option value="Issue 2 (June 2026)">Issue 2 (June)</option>
                  <option value="Issue 1 (March 2026)">Issue 1 (March)</option>
                  <option value="Issue 4 (December 2025)">Issue 4 (December)</option>
                  <option value="Issue 3 (September 2025)">Issue 3 (September)</option>
                  <option value="Issue 2 (June 2025)">Issue 2 (June)</option>
                  <option value="Issue 1 (March 2025)">Issue 1 (March)</option>
                  <option value="Issue 1 (2025)">Issue 1 (2025)</option>
                  <option value="Issue 1 (2024)">Issue 1 (2024)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Page Range *</label>
                <input 
                  type="text" 
                  name="pages" 
                  value={formData.pages} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 139 - 148"
                  className="form-input" 
                />
                {errors.pages && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.pages}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">DOI Link *</label>
                <input 
                  type="text" 
                  name="doi" 
                  value={formData.doi} 
                  onChange={handleInputChange} 
                  placeholder="e.g. https://doi.org/10.5281/wjbmr.2026.0404"
                  className="form-input" 
                />
                {errors.doi && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.doi}</div>}
              </div>
            </div>

            {/* HTML Article Content Dropzone */}
            <div className="form-group">
              <label className="form-label">Manuscript Full Text (HTML File Only) *</label>
              <div 
                className="file-dropzone" 
                onClick={() => fileInputRef.current.click()}
                style={{
                  borderColor: errors.htmlFile ? '#f87171' : 'var(--border-color)',
                  backgroundColor: htmlFileName ? 'var(--primary-light)' : 'var(--bg-light)'
                }}
              >
                <Upload size={36} style={{ color: htmlFileName ? 'var(--primary-color)' : 'var(--text-muted)' }} />
                <div>
                  {htmlFileName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                      <FileCode size={18} /> {htmlFileName}
                    </div>
                  ) : (
                    <>
                      <strong>Click to upload HTML File</strong> or drag & drop<br />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HTML file containing article structure (.html)</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".html"
                  onChange={handleHtmlFileChange}
                  style={{ display: 'none' }} 
                />
              </div>
              {errors.htmlFile && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.htmlFile}</div>}
            </div>

            {/* Preview toggle */}
            {htmlContent && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  className="submit-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '12px' }}
                >
                  <Eye size={14} /> {isPreviewOpen ? 'Hide HTML Preview' : 'Show HTML Preview'}
                </button>
              </div>
            )}

            {/* Live Rendered HTML Preview */}
            {isPreviewOpen && htmlContent && (
              <div style={{
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <h5 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '12px', color: 'var(--primary-color)' }}>
                  Live Article Content Preview
                </h5>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="html-content-preview" />
              </div>
            )}

            <button type="submit" className="submit-form-btn" style={{ marginTop: '16px' }}>
              Publish Article Live
            </button>
          </form>
        </div>

        {/* Right Side - Information / Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={18} /> HTML Guidelines
            </h3>
            <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>The HTML file should contain the body content of the article (paragraphs, headings, lists).</li>
              <li>Avoid full HTML documents with `&lt;html&gt;`, `&lt;head&gt;`, or `&lt;body&gt;` tags. Only upload structural tags.</li>
              <li>You can include bold (`&lt;strong&gt;`), tables, list tags, and clean inline CSS for layouts.</li>
              <li>Make sure references inside the HTML file follow the Vancouver Style consecutively.</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Active Archives</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Active Volume:</strong> Vol 12 (2026)</div>
              <div><strong>Active Issue:</strong> Issue 2 (June 2026)</div>
              <div><strong>Target Directory:</strong> Current Issue Table of Contents</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
