// Central API base URL.
// If VITE_API_BASE_URL is set, use it. Otherwise default to '' (same-origin relative URLs for cPanel / production)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://wjbmr-journal.onrender.com';

/**
 * Resolve a usable PDF URL.
 * Handles missing/invalid URLs, absolute HTTP(S) links, normalized /uploads/ paths, and relative filenames.
 */
export function resolvePdfUrl(url) {
  if (!url || url === '#') return '/sample_article.pdf';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  let cleanUrl = url;
  if (cleanUrl.startsWith('uploads/')) {
    cleanUrl = '/' + cleanUrl;
  }

  if (cleanUrl.startsWith('/')) {
    return `${API_BASE}${cleanUrl}`;
  }

  return `${API_BASE}/uploads/${cleanUrl}`;
}

/**
 * Build the server endpoint URL that serves a PDF with the article title as download filename.
 * Uses Content-Disposition: attachment on the server, so the download triggers cross-origin.
 */
export function getArticlePdfUrl(articleId) {
  return `${API_BASE}/api/articles/${articleId}/pdf`;
}

export default API_BASE;

