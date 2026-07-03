import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle, Eye, ArrowLeft, RefreshCw, FileText, Trash2, Copy, Image } from 'lucide-react';

export default function AdminPanel({ onAddArticle, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('publish'); // 'publish' or 'submissions'
  
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

  const [htmlFile, setHtmlFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlFileName, setHtmlFileName] = useState('');
  
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState({});

  const fileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

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
      setHtmlFile(file);
      setErrors(prev => ({ ...prev, htmlFile: null }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setHtmlContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrors(prev => ({ ...prev, pdfFile: 'Only PDF files are allowed (.pdf)' }));
        return;
      }

      setPdfFileName(file.name);
      setPdfFile(file);
      setErrors(prev => ({ ...prev, pdfFile: null }));
    }
  };

  // Fetch submitted manuscripts
  const fetchSubmissions = () => {
    setLoadingSubmissions(true);
    fetch('/api/submissions')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch submissions');
        return res.json();
      })
      .then(data => {
        setSubmissions(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoadingSubmissions(false);
      });
  };

  // Fetch uploaded images
  const fetchImages = () => {
    setLoadingImages(true);
    fetch('/api/images')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch images');
        return res.json();
      })
      .then(data => {
        setImages(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoadingImages(false);
      });
  };

  useEffect(() => {
    fetchImages(); // fetch images initially for counts
  }, []);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    } else if (activeTab === 'images') {
      fetchImages();
    }
  }, [activeTab]);

  const handleDeleteSubmission = (id) => {
    if (!window.confirm('Are you sure you want to delete/archive this submission?')) return;
    
    fetch(`/api/submissions/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete submission');
        setSubmissions(prev => prev.filter(s => s.id !== id));
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete submission');
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    setUploadingImage(true);
    setImageError(null);

    const postData = new FormData();
    postData.append('imageFile', file);

    fetch('/api/images', {
      method: 'POST',
      body: postData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || 'Failed to upload image');
          });
        }
        return res.json();
      })
      .then(newImage => {
        setImages(prev => [newImage, ...prev]);
      })
      .catch(err => {
        console.error(err);
        setImageError(err.message || 'Failed to upload image');
      })
      .finally(() => {
        setUploadingImage(false);
        if (e.target) e.target.value = '';
      });
  };

  const handleDeleteImage = (id) => {
    if (!window.confirm('Are you sure you want to delete this image? This will permanently remove the file from the server.')) return;

    fetch(`/api/images/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete image');
        setImages(prev => prev.filter(img => img.id !== id));
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete image');
      });
  };

  const handleCopyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyFeedback(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopyFeedback(prev => ({ ...prev, [key]: false }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy to clipboard', err);
      });
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
    if (!htmlFile) newErrors.htmlFile = 'HTML file upload is required';
    if (!pdfFile) newErrors.pdfFile = 'PDF file upload is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('authors', formData.authors);
    postData.append('affiliations', formData.affiliations);
    postData.append('correspondingAuthor', formData.correspondingAuthor);
    postData.append('keywords', formData.keywords);
    postData.append('category', formData.category);
    postData.append('volume', formData.volume);
    postData.append('issue', formData.issue);
    postData.append('pages', formData.pages);
    postData.append('doi', formData.doi);
    postData.append('htmlFile', htmlFile);
    postData.append('pdfFile', pdfFile);

    fetch('/api/articles', {
      method: 'POST',
      body: postData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || 'Failed to publish article');
          });
        }
        return res.json();
      })
      .then(newArticle => {
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
        setHtmlFile(null);
        setHtmlContent('');
        setHtmlFileName('');
        setPdfFile(null);
        setPdfFileName('');

        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      })
      .catch(err => {
        console.error(err);
        setErrors(prev => ({ ...prev, submit: err.message || 'Failed to submit article' }));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };


  return (
    <div className="container">
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 className="section-title">Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage published journal articles and review author submissions.
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

      {/* Admin Tabs */}
      <div style={{
        display: 'flex',
        gap: '16px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '32px',
        paddingBottom: '1px'
      }}>
        <button
          onClick={() => setActiveTab('publish')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'publish' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'publish' ? 'var(--primary-color)' : 'var(--text-muted)',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '15px',
            fontFamily: 'var(--font-display)',
            transition: 'var(--transition)'
          }}
        >
          Publish New Article
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'submissions' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'submissions' ? 'var(--primary-color)' : 'var(--text-muted)',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '15px',
            fontFamily: 'var(--font-display)',
            transition: 'var(--transition)'
          }}
        >
          Submitted Manuscripts ({submissions.length})
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

      {errors.submit && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={20} />
          <div>
            <strong>Error:</strong> {errors.submit}
          </div>
        </div>
      )}

      {activeTab === 'publish' ? (
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
                  placeholder="e.g. Record-Keeping Habits Among Grain Marketers..."
                  className="form-input" 
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  placeholder="e.g. record keeping, grains, marketers..."
                  className="form-input" 
                  disabled={isSubmitting}
                />
                {errors.keywords && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.keywords}</div>}
              </div>

              {/* Category and Volume */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Section Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" disabled={isSubmitting}>
                    <option value="ORIGINAL RESEARCH">Original Research</option>
                    <option value="CLINICAL STUDY">Clinical Study</option>
                    <option value="REVIEW ARTICLE">Review Article</option>
                    <option value="CASE REPORT">Case Report</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Volume *</label>
                  <select name="volume" value={formData.volume} onChange={handleInputChange} className="form-select" disabled={isSubmitting}>
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
                  <select name="issue" value={formData.issue} onChange={handleInputChange} className="form-select" disabled={isSubmitting}>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  {errors.doi && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.doi}</div>}
                </div>
              </div>

              {/* PDF File Dropzone */}
              <div className="form-group">
                <label className="form-label">Manuscript PDF File *</label>
                <div 
                  className="file-dropzone" 
                  onClick={() => !isSubmitting && pdfFileInputRef.current.click()}
                  style={{
                    borderColor: errors.pdfFile ? '#f87171' : 'var(--border-color)',
                    backgroundColor: pdfFileName ? 'var(--primary-light)' : 'var(--bg-light)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Upload size={36} style={{ color: pdfFileName ? 'var(--primary-color)' : 'var(--text-muted)' }} />
                  <div>
                    {pdfFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        <FileText size={18} /> {pdfFileName}
                      </div>
                    ) : (
                      <>
                        <strong>Click to upload PDF File</strong> or drag & drop<br />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PDF file containing full manuscript (.pdf)</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={pdfFileInputRef}
                    accept=".pdf"
                    onChange={handlePdfFileChange}
                    style={{ display: 'none' }} 
                    disabled={isSubmitting}
                  />
                </div>
                {errors.pdfFile && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.pdfFile}</div>}
              </div>

              {/* HTML Article Content Dropzone */}
              <div className="form-group">
                <label className="form-label">Manuscript Full Text (HTML File Only) *</label>
                <div 
                  className="file-dropzone" 
                  onClick={() => !isSubmitting && fileInputRef.current.click()}
                  style={{
                    borderColor: errors.htmlFile ? '#f87171' : 'var(--border-color)',
                    backgroundColor: htmlFileName ? 'var(--primary-light)' : 'var(--bg-light)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
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
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HTML file containing article body (.html)</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".html"
                    onChange={handleHtmlFileChange}
                    style={{ display: 'none' }} 
                    disabled={isSubmitting}
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

              <button type="submit" className="submit-form-btn" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  'Publish Article Live'
                )}
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
      ) : (
        /* Submissions Tab */
        <div className="glass-card" style={{ width: '100%', overflowX: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)' }}>Submitted Manuscripts</h3>
            <button 
              onClick={fetchSubmissions} 
              className="submit-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px' }}
              disabled={loadingSubmissions}
            >
              <RefreshCw size={14} className={loadingSubmissions ? "animate-spin" : ""} /> Refresh List
            </button>
          </div>

          {loadingSubmissions ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary-color)' }} />
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-light)'
            }}>
              <FileText size={48} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)', opacity: 0.5 }} />
              <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>No submissions found</strong>
              Authors' submissions will appear here once they complete the Submit Manuscript form.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--primary-dark)', fontWeight: 'bold' }}>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px' }}>Manuscript Title & Abstract</th>
                  <th style={{ padding: '12px 8px' }}>Author Details</th>
                  <th style={{ padding: '12px 8px' }}>Files</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '14px', marginBottom: '8px' }}>{sub.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sub.abstract}
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', fontSize: '13px' }}>
                      <strong>{sub.authorName}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{sub.authorEmail}</div>
                      <div style={{ fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>{sub.affiliation}</div>
                      {sub.coAuthors && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Co-authors: {sub.coAuthors}</div>}
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', fontSize: '13px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <a 
                          href={sub.manuscriptFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="submit-btn"
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: 'var(--bg-white)',
                            backgroundColor: 'var(--primary-color)',
                            borderRadius: '4px'
                          }}
                        >
                          <FileText size={12} /> Manuscript File
                        </a>
                        {sub.coverLetterFile && (
                          <a 
                            href={sub.coverLetterFile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="submit-btn"
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              color: 'var(--primary-color)',
                              backgroundColor: 'var(--primary-light)',
                              border: '1px solid var(--primary-color)',
                              borderRadius: '4px'
                            }}
                          >
                            <FileText size={12} /> Cover Letter
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteSubmission(sub.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Delete Submission"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
