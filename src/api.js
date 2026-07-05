// Central API base URL.
// In development: empty string (Vite proxy handles /api → localhost:5000)
// In production: set VITE_API_BASE_URL in Vercel env variables to your backend URL
// e.g. https://your-backend.onrender.com  (no trailing slash)
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE;
