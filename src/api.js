// Central API base URL.
// In development: empty string (Vite proxy handles /api -> localhost:5000)
// In production: default to live Render backend API URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://wjbmr-journal.onrender.com');

export default API_BASE;
