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

// Serve uploaded files dynamically from database (or local directory fallback)
app.get('/uploads/:filename', async (req, res) => {
  try {
    const file = await db.getFile(req.params.filename);
    if (!file) {
      return res.status(404).send('File not found');
    }
    res.setHeader('Content-Type', file.contentType);
    res.send(file.data);
  } catch (err) {
    console.error('Error serving file:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Helper to generate unique filenames for database storage
const generateFilename = (fieldname, originalname) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalname);
  return fieldname + '-' + uniqueSuffix + ext;
};

const upload = multer({
  storage: multer.memoryStorage(),
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
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db.getArticles();
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
]), async (req, res) => {
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
    const htmlContent = htmlFile.buffer.toString('utf8');

    // Generate unique filenames
    const htmlFilename = generateFilename('htmlFile', htmlFile.originalname);
    const pdfFilename = generateFilename('pdfFile', pdfFile.originalname);

    // Save files
    await db.saveFile(htmlFilename, htmlFile.mimetype, htmlFile.buffer);
    await db.saveFile(pdfFilename, pdfFile.mimetype, pdfFile.buffer);

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
      pdfUrl: `/uploads/${pdfFilename}`,
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

    const savedArticle = await db.addArticle(newArticle);

    res.status(201).json(savedArticle);
  } catch (err) {
    console.error('Error publishing article:', err);
    res.status(500).json({ error: err.message || 'Failed to publish article' });
  }
});

// 3. Delete an article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await db.getArticleById(articleId);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // If PDF file exists, try to delete it from database/fallback
    if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
      const filename = article.pdfUrl.replace('/uploads/', '');
      await db.deleteFile(filename);
    }

    const success = await db.deleteArticle(articleId);
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

// 3b. Update an article
app.put('/api/articles/:id', upload.fields([
  { name: 'htmlFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const existing = await db.getArticleById(articleId);
    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

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

    const updatedFields = {
      title: title || existing.title,
      authors: authors || existing.authors,
      affiliations: affiliations !== undefined ? affiliations : existing.affiliations,
      correspondingAuthor: correspondingAuthor !== undefined ? correspondingAuthor : existing.correspondingAuthor,
      keywords: keywords !== undefined ? keywords : existing.keywords,
      category: category || existing.category,
      volume: volume || existing.volume,
      issue: issue || existing.issue,
      pages: pages || existing.pages,
      doi: doi || existing.doi,
      abstract: abstract || existing.abstract
    };

    // Process new HTML file if uploaded
    if (req.files && req.files.htmlFile) {
      const htmlFile = req.files.htmlFile[0];
      const htmlContent = htmlFile.buffer.toString('utf8');
      const htmlFilename = generateFilename('htmlFile', htmlFile.originalname);
      await db.saveFile(htmlFilename, htmlFile.mimetype, htmlFile.buffer);
      updatedFields.fullText = htmlContent;
    }

    // Process new PDF file if uploaded
    if (req.files && req.files.pdfFile) {
      const pdfFile = req.files.pdfFile[0];
      const pdfFilename = generateFilename('pdfFile', pdfFile.originalname);
      await db.saveFile(pdfFilename, pdfFile.mimetype, pdfFile.buffer);
      updatedFields.pdfUrl = `/uploads/${pdfFilename}`;

      // Delete old PDF file if it exists
      if (existing.pdfUrl && existing.pdfUrl.startsWith('/uploads/')) {
        const filename = existing.pdfUrl.replace('/uploads/', '');
        await db.deleteFile(filename);
      }
    }

    const updatedArticle = await db.updateArticle(articleId, updatedFields);
    res.json(updatedArticle);
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ error: err.message || 'Failed to update article' });
  }
});


// 4. Get all submitted manuscripts
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await db.getSubmissions();
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
]), async (req, res) => {
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

    const manuscriptFilename = generateFilename('manuscriptFile', manuscriptFile.originalname);
    await db.saveFile(manuscriptFilename, manuscriptFile.mimetype, manuscriptFile.buffer);

    let coverLetterFilename = null;
    if (coverLetterFile) {
      coverLetterFilename = generateFilename('coverLetterFile', coverLetterFile.originalname);
      await db.saveFile(coverLetterFilename, coverLetterFile.mimetype, coverLetterFile.buffer);
    }

    const newSubmission = {
      title: title,
      abstract: abstract,
      category: category || 'ORIGINAL RESEARCH',
      authorName: authorName,
      authorEmail: authorEmail,
      affiliation: affiliation,
      coAuthors: coAuthors || '',
      manuscriptFile: `/uploads/${manuscriptFilename}`,
      coverLetterFile: coverLetterFilename ? `/uploads/${coverLetterFilename}` : null,
      submittedAt: new Date().toISOString()
    };

    const savedSubmission = await db.addSubmission(newSubmission);
    res.status(201).json(savedSubmission);
  } catch (err) {
    console.error('Error adding submission:', err);
    res.status(500).json({ error: err.message || 'Failed to submit manuscript' });
  }
});

// 6. Delete/Archive a submission
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const subId = req.params.id;
    const submissions = await db.getSubmissions();
    const submission = submissions.find(s => String(s.id) === String(subId));

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Try deleting manuscript file
    if (submission.manuscriptFile && submission.manuscriptFile.startsWith('/uploads/')) {
      const filename = submission.manuscriptFile.replace('/uploads/', '');
      await db.deleteFile(filename);
    }

    // Try deleting cover letter file
    if (submission.coverLetterFile && submission.coverLetterFile.startsWith('/uploads/')) {
      const filename = submission.coverLetterFile.replace('/uploads/', '');
      await db.deleteFile(filename);
    }

    const success = await db.deleteSubmission(subId);
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
app.get('/api/images', async (req, res) => {
  try {
    const images = await db.getImages();
    res.json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

// 8. Upload a new image
app.post('/api/images', upload.single('imageFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageFilename = generateFilename('imageFile', req.file.originalname);
    await db.saveFile(imageFilename, req.file.mimetype, req.file.buffer);

    const newImage = {
      filename: req.file.originalname,
      url: `/uploads/${imageFilename}`,
      uploadedAt: new Date().toISOString()
    };

    const savedImage = await db.addImage(newImage);
    res.status(201).json(savedImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// 9. Delete an image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const images = await db.getImages();
    const image = images.find(img => String(img.id) === String(imageId));

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Try deleting image file from database/fallback
    if (image.url && image.url.startsWith('/uploads/')) {
      const filename = image.url.replace('/uploads/', '');
      await db.deleteFile(filename);
    }

    const success = await db.deleteImage(imageId);
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

// 10. Get all archives
app.get('/api/archives', async (req, res) => {
  try {
    const archives = await db.getArchives();
    res.json(archives);
  } catch (err) {
    console.error('Error fetching archives:', err);
    res.status(500).json({ error: 'Failed to retrieve archives' });
  }
});

// 11. Upload a new archive
app.post('/api/archives', upload.single('archiveFile'), async (req, res) => {
  try {
    const { title, volume, issue } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Archive PDF file is required' });
    }
    if (!title || !volume || !issue) {
      return res.status(400).json({ error: 'Title, Volume, and Issue are required fields' });
    }

    const archiveFilename = generateFilename('archiveFile', req.file.originalname);
    await db.saveFile(archiveFilename, req.file.mimetype, req.file.buffer);

    const newArchive = {
      title,
      volume,
      issue,
      pdfUrl: `/uploads/${archiveFilename}`,
      uploadedAt: new Date().toISOString()
    };

    const savedArchive = await db.addArchive(newArchive);
    res.status(201).json(savedArchive);
  } catch (err) {
    console.error('Error uploading archive:', err);
    res.status(500).json({ error: err.message || 'Failed to upload archive' });
  }
});

// 12. Delete an archive
app.delete('/api/archives/:id', async (req, res) => {
  try {
    const archiveId = req.params.id;
    const archives = await db.getArchives();
    const archive = archives.find(arch => String(arch.id) === String(archiveId));

    if (!archive) {
      return res.status(404).json({ error: 'Archive not found' });
    }

    // Try deleting PDF file from database/fallback
    if (archive.pdfUrl && archive.pdfUrl.startsWith('/uploads/')) {
      const filename = archive.pdfUrl.replace('/uploads/', '');
      await db.deleteFile(filename);
    }

    const success = await db.deleteArchive(archiveId);
    if (success) {
      res.json({ message: 'Archive deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete archive from database' });
    }
  } catch (err) {
    console.error('Error deleting archive:', err);
    res.status(500).json({ error: 'Failed to delete archive' });
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
