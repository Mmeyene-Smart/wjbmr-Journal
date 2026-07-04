import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, FileCode, CheckCircle, AlertTriangle, Eye, ArrowLeft,
  RefreshCw, FileText, Trash2, Copy, Image, Check, Code2,
  PenSquare, Library, Plus, ExternalLink, ClipboardCopy
} from 'lucide-react';
import API_BASE from '../api.js';

/* ─────────────────────────────────────────────────────────────────────────────
   TAB BUTTON helper
───────────────────────────────────────────────────────────────────────────── */
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        border: 'none',
        background: 'none',
        borderBottom: active ? '3px solid var(--primary-color)' : '3px solid transparent',
        color: active ? 'var(--primary-color)' : 'var(--text-muted)',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'var(--font-display)',
        transition: 'var(--transition)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminPanel({ onAddArticle, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('publish');

  /* ── Publish form state ── */
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
  const [showHtmlEditor, setShowHtmlEditor] = useState(false); // split editor visible
  const [previewMode, setPreviewMode] = useState(false); // inside the editor: code vs preview

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Submissions state ── */
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  /* ── Images state ── */
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState({});
  const [imageSearch, setImageSearch] = useState('');

  /* ── Refs ── */
  const fileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const htmlEditorRef = useRef(null);

  /* ─────────────────────────── HANDLERS ─────────────────────────── */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleHtmlFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
      setErrors(prev => ({ ...prev, htmlFile: 'Only HTML files are allowed (.html)' }));
      return;
    }
    setHtmlFileName(file.name);
    setHtmlFile(file);
    setErrors(prev => ({ ...prev, htmlFile: null }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setHtmlContent(ev.target.result);
      setShowHtmlEditor(true);
    };
    reader.readAsText(file);
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrors(prev => ({ ...prev, pdfFile: 'Only PDF files are allowed (.pdf)' }));
      return;
    }
    setPdfFileName(file.name);
    setPdfFile(file);
    setErrors(prev => ({ ...prev, pdfFile: null }));
  };

  /* Insert text at cursor in the HTML editor textarea */
  const insertAtCursor = (snippet) => {
    const el = htmlEditorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newVal = htmlContent.slice(0, start) + snippet + htmlContent.slice(end);
    setHtmlContent(newVal);
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + snippet.length;
    }, 0);
  };

  /* ── Submissions ── */
  const fetchSubmissions = () => {
    setLoadingSubmissions(true);
    fetch(`${API_BASE}/api/submissions`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setSubmissions(data))
      .catch(() => {})
      .finally(() => setLoadingSubmissions(false));
  };

  const handleDeleteSubmission = (id) => {
    if (!window.confirm('Delete this submission?')) return;
    fetch(`/api/submissions/${id}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error(); setSubmissions(prev => prev.filter(s => s.id !== id)); })
      .catch(() => alert('Failed to delete submission'));
  };

  /* ── Images ── */
  const fetchImages = useCallback(() => {
    setLoadingImages(true);
    fetch(`${API_BASE}/api/images`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setImages(data))
      .catch(() => {})
      .finally(() => setLoadingImages(false));
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  useEffect(() => {
    if (activeTab === 'submissions') fetchSubmissions();
    if (activeTab === 'images') fetchImages();
  }, [activeTab, fetchImages]);

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageError('Only image files are allowed'); return; }
    setUploadingImage(true);
    setImageError(null);
    const fd = new FormData();
    fd.append('imageFile', file);
    fetch(`${API_BASE}/api/images`, { method: 'POST', body: fd })
      .then(res => res.ok ? res.json() : res.json().then(d => Promise.reject(d.error)))
      .then(img => setImages(prev => [img, ...prev]))
      .catch(err => setImageError(err || 'Upload failed'))
      .finally(() => {
        setUploadingImage(false);
        if (imageFileInputRef.current) imageFileInputRef.current.value = '';
      });
  };

  const handleDeleteImage = (id) => {
    if (!window.confirm('Permanently delete this image from the server?')) return;
    fetch(`/api/images/${id}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error(); setImages(prev => prev.filter(i => i.id !== id)); })
      .catch(() => alert('Failed to delete image'));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyFeedback(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopyFeedback(prev => ({ ...prev, [key]: false })), 2200);
      })
      .catch(() => {});
  };

  /* ── Insert image directly into HTML editor ── */
  const insertImageIntoEditor = (url) => {
    const snippet = `<img src="${url}" alt="figure" style="max-width:100%; height:auto; display:block; margin:16px auto;" />`;
    if (activeTab === 'publish' && htmlContent) {
      insertAtCursor(snippet);
    } else {
      copyToClipboard(snippet, `img-tag-${url}`);
    }
  };

  /* ── Drag-and-drop for image upload zone ── */
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  /* ── Publish form validation + submit ── */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Manuscript title is required';
    if (!formData.authors.trim()) newErrors.authors = 'Authors are required (comma separated)';
    if (!formData.affiliations.trim()) newErrors.affiliations = 'Institutional affiliations are required';
    if (!formData.correspondingAuthor.trim()) newErrors.correspondingAuthor = 'Corresponding author details are required';
    if (!formData.keywords.trim()) newErrors.keywords = 'Keywords are required';
    if (!formData.pages.trim()) newErrors.pages = 'Page range is required (e.g. 139 - 148)';
    if (!formData.doi.trim()) newErrors.doi = 'DOI is required';
    if (!htmlContent.trim()) newErrors.htmlFile = 'HTML content is required';
    if (!pdfFile) newErrors.pdfFile = 'PDF file upload is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Wrap the (possibly edited) htmlContent back into a File/Blob for multipart upload
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlFileToSend = new File([htmlBlob], htmlFileName || 'article.html', { type: 'text/html' });

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
    postData.append('htmlFile', htmlFileToSend);
    postData.append('pdfFile', pdfFile);

    fetch(`${API_BASE}/api/articles`, { method: 'POST', body: postData })
      .then(res => res.ok ? res.json() : res.json().then(d => Promise.reject(d.error || 'Failed to publish')))
      .then(newArticle => {
        onAddArticle(newArticle);
        setSuccess(true);
        setFormData({
          title: '', authors: '', affiliations: '', correspondingAuthor: '',
          keywords: '', category: 'ORIGINAL RESEARCH', volume: 'Volume 12 (2026)',
          issue: 'Issue 2 (June 2026)', pages: '', doi: '',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });
        setHtmlFile(null); setHtmlContent(''); setHtmlFileName(''); setShowHtmlEditor(false);
        setPdfFile(null); setPdfFileName('');
        setTimeout(() => setSuccess(false), 5000);
      })
      .catch(err => setErrors(prev => ({ ...prev, submit: err || 'Failed to submit article' })))
      .finally(() => setIsSubmitting(false));
  };

  const resetHtmlFile = () => {
    setHtmlFile(null); setHtmlContent(''); setHtmlFileName('');
    setShowHtmlEditor(false); setPreviewMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─────────────────────────── RENDER ─────────────────────────── */
  const filteredImages = images.filter(img =>
    img.filename.toLowerCase().includes(imageSearch.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="section-title">Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage published articles, review submissions, and upload images.</p>
        </div>
        <button onClick={onBackToHome} className="submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Exit Admin Side
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <TabBtn active={activeTab === 'publish'} onClick={() => setActiveTab('publish')}>
          <PenSquare size={15} /> Publish Article
        </TabBtn>
        <TabBtn active={activeTab === 'images'} onClick={() => setActiveTab('images')}>
          <Image size={15} /> Image Library
          {images.length > 0 && (
            <span style={{
              background: 'var(--primary-color)', color: '#fff', borderRadius: '20px',
              fontSize: '11px', padding: '1px 7px', fontWeight: '700'
            }}>{images.length}</span>
          )}
        </TabBtn>
        <TabBtn active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>
          <FileText size={15} /> Submissions
          {submissions.length > 0 && (
            <span style={{
              background: 'var(--primary-color)', color: '#fff', borderRadius: '20px',
              fontSize: '11px', padding: '1px 7px', fontWeight: '700'
            }}>{submissions.length}</span>
          )}
        </TabBtn>
      </div>

      {/* ── Global alerts ── */}
      {success && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle size={20} />
          <div><strong>Article Published Successfully!</strong> The manuscript is now live on the Home and Current Issue pages.</div>
        </div>
      )}
      {errors.submit && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={20} />
          <div><strong>Error:</strong> {errors.submit}</div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB: PUBLISH ARTICLE
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'publish' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="responsive-home-grid">

          {/* Left: Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--primary-dark)' }}>Publish New Article</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Record-Keeping Habits Among Grain Marketers..." className="form-input" disabled={isSubmitting} />
                {errors.title && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.title}</div>}
              </div>

              {/* Authors */}
              <div className="form-group">
                <label className="form-label">Authors * (comma separated)</label>
                <input type="text" name="authors" value={formData.authors} onChange={handleInputChange} placeholder="e.g. Akpan, OD., Bassey, EA." className="form-input" disabled={isSubmitting} />
                {errors.authors && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.authors}</div>}
              </div>

              {/* Affiliations */}
              <div className="form-group">
                <label className="form-label">Institutional Affiliations * (use line breaks for multiple)</label>
                <textarea name="affiliations" rows="3" value={formData.affiliations} onChange={handleInputChange} placeholder="e.g. Department of Agricultural Economics, University of Uyo, Uyo, Nigeria" className="form-textarea" disabled={isSubmitting}></textarea>
                {errors.affiliations && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.affiliations}</div>}
              </div>

              {/* Corresponding Author */}
              <div className="form-group">
                <label className="form-label">Corresponding Author Contacts *</label>
                <input type="text" name="correspondingAuthor" value={formData.correspondingAuthor} onChange={handleInputChange} placeholder="e.g. drodakpan@uniuyo.edu.ng; +234-8032717955" className="form-input" disabled={isSubmitting} />
                {errors.correspondingAuthor && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.correspondingAuthor}</div>}
              </div>

              {/* Keywords */}
              <div className="form-group">
                <label className="form-label">Keywords * (comma separated)</label>
                <input type="text" name="keywords" value={formData.keywords} onChange={handleInputChange} placeholder="e.g. record keeping, grains, marketers..." className="form-input" disabled={isSubmitting} />
                {errors.keywords && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.keywords}</div>}
              </div>

              {/* Category + Volume */}
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

              {/* Issue + Pages + DOI */}
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
                  <input type="text" name="pages" value={formData.pages} onChange={handleInputChange} placeholder="e.g. 139 - 148" className="form-input" disabled={isSubmitting} />
                  {errors.pages && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.pages}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">DOI Link *</label>
                  <input type="text" name="doi" value={formData.doi} onChange={handleInputChange} placeholder="https://doi.org/10.5281/..." className="form-input" disabled={isSubmitting} />
                  {errors.doi && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.doi}</div>}
                </div>
              </div>

              {/* PDF upload */}
              <div className="form-group">
                <label className="form-label">Manuscript PDF File *</label>
                <div className="file-dropzone" onClick={() => !isSubmitting && pdfFileInputRef.current.click()} style={{ borderColor: errors.pdfFile ? '#f87171' : 'var(--border-color)', backgroundColor: pdfFileName ? 'var(--primary-light)' : 'var(--bg-light)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  <Upload size={36} style={{ color: pdfFileName ? 'var(--primary-color)' : 'var(--text-muted)' }} />
                  <div>
                    {pdfFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        <FileText size={18} /> {pdfFileName}
                      </div>
                    ) : (
                      <>
                        <strong>Click to upload PDF File</strong> or drag &amp; drop<br />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Full manuscript PDF (.pdf)</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={pdfFileInputRef} accept=".pdf" onChange={handlePdfFileChange} style={{ display: 'none' }} disabled={isSubmitting} />
                </div>
                {errors.pdfFile && <div style={{ color: '#dc2626', fontSize: '12px' }}>{errors.pdfFile}</div>}
              </div>

              {/* HTML upload / editor section */}
              <div className="form-group">
                <label className="form-label">Manuscript Full Text (HTML) *</label>

                {!showHtmlEditor ? (
                  /* ── Upload dropzone (before file selected) ── */
                  <div className="file-dropzone" onClick={() => !isSubmitting && fileInputRef.current.click()} style={{ borderColor: errors.htmlFile ? '#f87171' : 'var(--border-color)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                    <Upload size={36} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <strong>Click to upload HTML File</strong> or drag &amp; drop<br />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HTML file containing article body (.html)</span>
                    </div>
                    <input type="file" ref={fileInputRef} accept=".html" onChange={handleHtmlFileChange} style={{ display: 'none' }} disabled={isSubmitting} />
                  </div>
                ) : (
                  /* ── HTML Editor panel (after file selected) ── */
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>

                    {/* Editor toolbar */}
                    <div style={{ background: 'var(--primary-dark)', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCode size={16} style={{ color: '#93c5fd' }} />
                        <span style={{ color: '#e0f2fe', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>{htmlFileName}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Code / Preview toggle */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                          <button type="button" onClick={() => setPreviewMode(false)} style={{ padding: '5px 12px', border: 'none', background: !previewMode ? 'var(--primary-color)' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Code2 size={12} /> Code
                          </button>
                          <button type="button" onClick={() => setPreviewMode(true)} style={{ padding: '5px 12px', border: 'none', background: previewMode ? 'var(--primary-color)' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={12} /> Preview
                          </button>
                        </div>
                        {/* Quick-insert snippets */}
                        <button type="button" onClick={() => insertAtCursor('<h3>Section Title</h3>\n')} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#e0f2fe', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Insert heading">H3</button>
                        <button type="button" onClick={() => insertAtCursor('<p></p>\n')} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#e0f2fe', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Insert paragraph">&lt;p&gt;</button>
                        <button type="button" onClick={() => insertAtCursor('<strong></strong>')} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#e0f2fe', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }} title="Bold">B</button>
                        <button type="button" onClick={() => insertAtCursor('<em></em>')} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#e0f2fe', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontStyle: 'italic' }} title="Italic">I</button>
                        <button type="button" onClick={() => insertAtCursor('<img src="" alt="figure" style="max-width:100%;height:auto;display:block;margin:16px auto;" />')} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#e0f2fe', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }} title="Insert image tag">
                          <Image size={11} /> IMG
                        </button>
                        {/* Replace file */}
                        <button type="button" onClick={resetHtmlFile} style={{ padding: '4px 8px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} title="Replace file">Replace</button>
                      </div>
                    </div>

                    {/* Editor body */}
                    <div style={{ position: 'relative' }}>
                      {!previewMode ? (
                        /* Code editor */
                        <textarea
                          ref={htmlEditorRef}
                          value={htmlContent}
                          onChange={(e) => setHtmlContent(e.target.value)}
                          spellCheck={false}
                          style={{
                            width: '100%',
                            minHeight: '380px',
                            padding: '16px',
                            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            resize: 'vertical',
                            border: 'none',
                            outline: 'none',
                            background: '#0f172a',
                            color: '#e2e8f0',
                            boxSizing: 'border-box',
                            tabSize: 2
                          }}
                          placeholder="<h3>Abstract</h3>&#10;<p><strong>Background:</strong> ...</p>"
                          disabled={isSubmitting}
                        />
                      ) : (
                        /* Live preview */
                        <div style={{ minHeight: '380px', padding: '24px', background: '#fff', overflowY: 'auto', borderTop: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={12} /> Live Preview — Article will render as shown below
                          </div>
                          {htmlContent.trim() ? (
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="html-content-preview" />
                          ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>No content yet — switch to Code view and start writing.</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Editor footer */}
                    <div style={{ background: '#1e293b', padding: '6px 14px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                      <span>{htmlContent.length.toLocaleString()} characters</span>
                      <span style={{ color: '#22c55e' }}>✓ Will be saved on publish</span>
                    </div>
                  </div>
                )}
                {errors.htmlFile && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>{errors.htmlFile}</div>}
              </div>

              {/* Tip: switch to image library */}
              {showHtmlEditor && (
                <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-color)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '13px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Image size={16} />
                  <span>Need to add images? Go to the <strong>Image Library</strong> tab to upload images and get clickable <code style={{ background: 'rgba(0,0,0,0.08)', padding: '1px 4px', borderRadius: '3px' }}>&lt;img&gt;</code> tags to paste here.</span>
                </div>
              )}

              <button type="submit" className="submit-form-btn" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
                {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Publishing...</> : 'Publish Article Live'}
              </button>

            </form>
          </div>

          {/* Right: Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary-color)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AlertTriangle size={18} /> HTML Guidelines
              </h3>
              <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Upload an HTML file — the editor will open automatically so you can review or edit before publishing.</li>
                <li>Avoid full HTML documents with <code style={{ fontSize: '11px' }}>&lt;html&gt;</code>, <code style={{ fontSize: '11px' }}>&lt;head&gt;</code>, or <code style={{ fontSize: '11px' }}>&lt;body&gt;</code> tags. Upload body content only.</li>
                <li>Use the toolbar buttons to quickly insert headings, paragraphs, bold, italic, or image tags.</li>
                <li>Use the <strong>Image Library</strong> tab to upload images, then copy an <code style={{ fontSize: '11px' }}>&lt;img&gt;</code> tag to paste in the editor here.</li>
                <li>References should follow Vancouver Style consecutively.</li>
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

            {/* Quick Image Library shortcut */}
            <div className="glass-card" style={{ padding: '20px', border: '1px dashed var(--primary-color)', background: 'var(--primary-light)', cursor: 'pointer' }} onClick={() => setActiveTab('images')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
                <Image size={22} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Image Library</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{images.length} image{images.length !== 1 ? 's' : ''} uploaded — click to manage</div>
                </div>
                <ExternalLink size={14} style={{ marginLeft: 'auto', color: 'var(--primary-color)' }} />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB: IMAGE LIBRARY
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'images' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Upload zone + search bar row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="responsive-home-grid">

            {/* Upload dropzone */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '17px', marginBottom: '16px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Upload New Image
              </h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => !uploadingImage && imageFileInputRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '36px 20px',
                  textAlign: 'center',
                  cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  background: dragOver ? 'var(--primary-light)' : 'var(--bg-light)',
                  transition: 'var(--transition)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {uploadingImage ? (
                  <><RefreshCw size={36} className="animate-spin" style={{ color: 'var(--primary-color)' }} /><span style={{ color: 'var(--text-muted)' }}>Uploading...</span></>
                ) : (
                  <>
                    <Image size={40} style={{ color: dragOver ? 'var(--primary-color)' : 'var(--text-muted)', opacity: dragOver ? 1 : 0.6 }} />
                    <div>
                      <strong style={{ color: 'var(--text-dark)' }}>Click to upload</strong> or drag &amp; drop<br />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG, GIF, SVG, WebP — max 25 MB</span>
                    </div>
                  </>
                )}
                <input type="file" ref={imageFileInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e.target.files[0])} />
              </div>
              {imageError && (
                <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> {imageError}
                </div>
              )}
            </div>

            {/* Info / instructions */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary-color)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Library size={16} /> How to use Image Library
              </h3>
              <ol style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: '1.8' }}>
                <li>Upload your image here using the dropzone.</li>
                <li>Each image gets a permanent URL on your server.</li>
                <li>Click <strong>Copy IMG tag</strong> to copy a ready-to-paste <code style={{ fontSize: '11px' }}>&lt;img&gt;</code> snippet.</li>
                <li>Switch to <strong>Publish Article</strong>, upload your HTML file, and paste the tag into the editor.</li>
                <li>The image will appear in the article when viewed on the site.</li>
              </ol>
              <div style={{ marginTop: '14px', padding: '10px 14px', background: 'var(--bg-light)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '11px', color: 'var(--primary-dark)', wordBreak: 'break-all' }}>
                &lt;img src="/uploads/photo.jpg" alt="figure" style="max-width:100%;" /&gt;
              </div>
            </div>
          </div>

          {/* Search + grid */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', margin: 0 }}>
                All Uploaded Images <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '400' }}>({images.length})</span>
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="search"
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  placeholder="Search by filename..."
                  className="form-input"
                  style={{ padding: '8px 14px', fontSize: '13px', maxWidth: '240px' }}
                />
                <button onClick={fetchImages} className="submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px' }} disabled={loadingImages}>
                  <RefreshCw size={13} className={loadingImages ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>

            {loadingImages ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary-color)' }} />
                Loading images...
              </div>
            ) : filteredImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 40px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', background: 'var(--bg-light)' }}>
                <Image size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <strong style={{ display: 'block', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {imageSearch ? `No images matching "${imageSearch}"` : 'No images uploaded yet'}
                </strong>
                {!imageSearch && 'Upload an image above to get started.'}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {filteredImages.map(img => (
                  <div key={img.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-white)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ height: '140px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                      <img
                        src={img.url}
                        alt={img.filename}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {/* Delete overlay button */}
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,38,38,0.9)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                        title="Delete image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.filename}>
                        {img.filename}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        {new Date(img.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {/* Copy IMG tag */}
                        <button
                          onClick={() => copyToClipboard(`<img src="${img.url}" alt="figure" style="max-width:100%; height:auto; display:block; margin:16px auto;" />`, `tag-${img.id}`)}
                          style={{
                            width: '100%', padding: '6px 8px', border: '1px solid var(--primary-color)',
                            borderRadius: '5px', background: copyFeedback[`tag-${img.id}`] ? '#dcfce7' : 'var(--primary-light)',
                            color: copyFeedback[`tag-${img.id}`] ? '#166534' : 'var(--primary-color)',
                            cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            transition: 'all 0.2s'
                          }}
                        >
                          {copyFeedback[`tag-${img.id}`] ? <><Check size={11} /> Copied!</> : <><ClipboardCopy size={11} /> Copy IMG tag</>}
                        </button>

                        {/* Copy URL */}
                        <button
                          onClick={() => copyToClipboard(img.url, `url-${img.id}`)}
                          style={{
                            width: '100%', padding: '6px 8px', border: '1px solid var(--border-color)',
                            borderRadius: '5px', background: copyFeedback[`url-${img.id}`] ? '#dcfce7' : 'transparent',
                            color: copyFeedback[`url-${img.id}`] ? '#166534' : 'var(--text-muted)',
                            cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            transition: 'all 0.2s'
                          }}
                        >
                          {copyFeedback[`url-${img.id}`] ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy URL</>}
                        </button>

                        {/* Open in new tab */}
                        <a
                          href={img.url} target="_blank" rel="noopener noreferrer"
                          style={{
                            width: '100%', padding: '6px 8px', border: '1px solid var(--border-color)',
                            borderRadius: '5px', background: 'transparent', color: 'var(--text-muted)',
                            fontSize: '11px', fontWeight: '600', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            transition: 'all 0.2s', boxSizing: 'border-box'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-light)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                          <ExternalLink size={11} /> Open Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB: SUBMISSIONS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'submissions' && (
        <div className="glass-card" style={{ width: '100%', overflowX: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)' }}>Submitted Manuscripts</h3>
            <button onClick={fetchSubmissions} className="submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px' }} disabled={loadingSubmissions}>
              <RefreshCw size={14} className={loadingSubmissions ? 'animate-spin' : ''} /> Refresh List
            </button>
          </div>

          {loadingSubmissions ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary-color)' }} />
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 40px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', background: 'var(--bg-light)' }}>
              <FileText size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>No submissions found</strong>
              Authors' submissions will appear here once they complete the Submit Manuscript form.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--primary-dark)', fontWeight: 'bold' }}>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px' }}>Manuscript Title &amp; Abstract</th>
                  <th style={{ padding: '12px 8px' }}>Author Details</th>
                  <th style={{ padding: '12px 8px' }}>Files</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '14px', marginBottom: '8px' }}>{sub.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub.abstract}</div>
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', fontSize: '13px' }}>
                      <strong>{sub.authorName}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{sub.authorEmail}</div>
                      <div style={{ fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>{sub.affiliation}</div>
                      {sub.coAuthors && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Co-authors: {sub.coAuthors}</div>}
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <a href={sub.manuscriptFile} target="_blank" rel="noopener noreferrer" className="submit-btn" style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#fff', backgroundColor: 'var(--primary-color)', borderRadius: '4px', justifyContent: 'center' }}>
                          <FileText size={12} /> Manuscript
                        </a>
                        {sub.coverLetterFile && (
                          <a href={sub.coverLetterFile} target="_blank" rel="noopener noreferrer" className="submit-btn" style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--primary-color)', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-color)', borderRadius: '4px', justifyContent: 'center' }}>
                            <FileText size={12} /> Cover Letter
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', verticalAlign: 'top', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '6px', borderRadius: '4px', transition: 'background-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
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
