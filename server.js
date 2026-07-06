import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as db from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Admin password — set ADMIN_PASSWORD env var in cPanel / .env file to override
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe!2026@WJBMR';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Setup storage paths inside /data
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(dataDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded PDFs and HTML files statically
app.use('/uploads', express.static(uploadsDir));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max limit
  fileFilter: (req, file, cb) => {
    // Allowed extensions
    const allowedExtensions = ['.pdf', '.html', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type: ' + ext));
    }
  }
});

// --- API ROUTES ---

// 0. Admin auth — verifies password server-side (never exposes password to client)
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, error: 'Password required' });
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  // Small delay to slow brute-force attempts
  setTimeout(() => res.status(401).json({ success: false }), 500);
});

// 1. Get all articles
app.get('/api/articles', (req, res) => {
  try {
    const articles = db.getArticles();
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
});

// 2. Publish new article (Multer expects pdfFile and htmlFile)
app.post('/api/articles', upload.fields([
  { name: 'htmlFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      title,
      authors,
      affiliations,
      correspondingAuthor,
      keywords,
      category,
      volume,
      issue,
      pages,
      doi,
      abstract
    } = req.body;

    // Validate files
    if (!req.files || !req.files.htmlFile) {
      return res.status(400).json({ error: 'HTML file is required for article body text' });
    }
    if (!req.files.pdfFile) {
      return res.status(400).json({ error: 'PDF file is required for download' });
    }

    const htmlFile = req.files.htmlFile[0];
    const pdfFile = req.files.pdfFile[0];

    // Read the HTML file text content to save as the article's body (fullText)
    const htmlContent = fs.readFileSync(htmlFile.path, 'utf8');

    // Store authors as raw HTML string (supports <sup>/<sub> tags for academic notation)
    const parsedAuthors = authors;

    // Choose random charts just like the simulated React code
    const chartTypes = ['line', 'bar', 'pie'];
    const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];
    let randomChartData = [];
    if (randomChartType === 'pie') {
      randomChartData = [
        Math.floor(Math.random() * 40 + 10),
        Math.floor(Math.random() * 30 + 10),
        Math.floor(Math.random() * 30 + 10)
      ];
    } else {
      randomChartData = [
        Math.floor(Math.random() * 40 + 10),
        Math.floor(Math.random() * 40 + 10),
        Math.floor(Math.random() * 40 + 10),
        Math.floor(Math.random() * 40 + 10)
      ];
    }

    // Format current date e.g. "July 3, 2026"
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const newArticle = {
      id: Date.now(),
      category: category || 'ORIGINAL RESEARCH',
      title: title,
      authors: parsedAuthors,
      date: formattedDate,
      readTime: '10 min read',
      pdfUrl: `/uploads/${pdfFile.filename}`, // Served statically
      chartType: randomChartType,
      chartData: randomChartData,
      doi: doi || '',
      pages: pages || '',
      volume: volume || 'Volume 12 (2026)',
      issue: issue || 'Issue 2 (June 2026)',
      abstract: abstract || '', // Save plain text abstract
      fullText: htmlContent, // Save HTML content in fullText
      isHtmlArticle: true,
      affiliations: affiliations || '',
      correspondingAuthor: correspondingAuthor || '',
      keywords: keywords || ''
    };

    const savedArticle = db.addArticle(newArticle);

    // Clean up temporary HTML file copy if not needed (since content is database-stored)
    try {
      fs.unlinkSync(htmlFile.path);
    } catch (e) {
      console.warn('Could not delete temporary HTML file:', e.message);
    }

    res.status(201).json(savedArticle);
  } catch (err) {
    console.error('Error publishing article:', err);
    res.status(500).json({ error: err.message || 'Failed to publish article' });
  }
});

// 3. Delete an article
app.delete('/api/articles/:id', (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = db.getArticleById(articleId);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // If PDF file exists, try to delete it from disk
    if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
      const filename = article.pdfUrl.replace('/uploads/', '');
      const filepath = path.join(uploadsDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    const success = db.deleteArticle(articleId);
    if (success) {
      res.json({ message: 'Article deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete article from database' });
    }
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// 4. Get all submitted manuscripts
app.get('/api/submissions', (req, res) => {
  try {
    const submissions = db.getSubmissions();
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to retrieve submissions' });
  }
});

// 5. Submit a new manuscript (Multer expects manuscriptFile and optional coverLetterFile)
app.post('/api/submissions', upload.fields([
  { name: 'manuscriptFile', maxCount: 1 },
  { name: 'coverLetterFile', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      title,
      abstract,
      category,
      authorName,
      authorEmail,
      affiliation,
      coAuthors
    } = req.body;

    if (!req.files || !req.files.manuscriptFile) {
      return res.status(400).json({ error: 'Manuscript document file is required' });
    }

    const manuscriptFile = req.files.manuscriptFile[0];
    const coverLetterFile = req.files.coverLetterFile ? req.files.coverLetterFile[0] : null;

    const newSubmission = {
      title: title,
      abstract: abstract,
      category: category || 'ORIGINAL RESEARCH',
      authorName: authorName,
      authorEmail: authorEmail,
      affiliation: affiliation,
      coAuthors: coAuthors || '',
      manuscriptFile: `/uploads/${manuscriptFile.filename}`,
      coverLetterFile: coverLetterFile ? `/uploads/${coverLetterFile.filename}` : null,
      submittedAt: new Date().toISOString()
    };

    const savedSubmission = db.addSubmission(newSubmission);
    res.status(201).json(savedSubmission);
  } catch (err) {
    console.error('Error adding submission:', err);
    res.status(500).json({ error: err.message || 'Failed to submit manuscript' });
  }
});

// 6. Delete/Archive a submission
app.delete('/api/submissions/:id', (req, res) => {
  try {
    const subId = parseInt(req.params.id);
    const submissions = db.getSubmissions();
    const submission = submissions.find(s => s.id === subId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Try deleting manuscript file
    if (submission.manuscriptFile && submission.manuscriptFile.startsWith('/uploads/')) {
      const filename = submission.manuscriptFile.replace('/uploads/', '');
      const filepath = path.join(uploadsDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    // Try deleting cover letter file
    if (submission.coverLetterFile && submission.coverLetterFile.startsWith('/uploads/')) {
      const filename = submission.coverLetterFile.replace('/uploads/', '');
      const filepath = path.join(uploadsDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    const success = db.deleteSubmission(subId);
    if (success) {
      res.json({ message: 'Submission deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete submission from database' });
    }
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// 7. Get all uploaded images
app.get('/api/images', (req, res) => {
  try {
    const images = db.getImages();
    res.json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

// 8. Upload a new image
app.post('/api/images', upload.single('imageFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newImage = {
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    const savedImage = db.addImage(newImage);
    res.status(201).json(savedImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// 9. Delete an image
app.delete('/api/images/:id', (req, res) => {
  try {
    const imageId = parseInt(req.params.id);
    const images = db.getImages();
    const image = images.find(img => img.id === imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Try deleting image file from disk
    if (image.url && image.url.startsWith('/uploads/')) {
      const filename = image.url.replace('/uploads/', '');
      const filepath = path.join(uploadsDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    const success = db.deleteImage(imageId);
    if (success) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete image from database' });
    }
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Serve frontend assets if built
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API server is running. (Note: Frontend build directory "dist" not found. Run "npm run build" to serve frontend).');
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
