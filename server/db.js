import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const jsonDbPath = path.join(dataDir, 'journal-db.json');

// ─── JSON fallback (used when MONGODB_URI is not set) ────────────────────────
let useJsonDb = false;
let jsonData = { articles: [], submissions: [], images: [] };

function saveJsonDb() {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(jsonData, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save JSON database to disk:', err);
  }
}

// ─── Mongoose Schemas ────────────────────────────────────────────────────────
const articleSchema = new mongoose.Schema({
  id:                 { type: Number, required: true, unique: true },
  category:           { type: String, required: true },
  title:              { type: String, required: true },
  authors:            { type: mongoose.Schema.Types.Mixed, required: true }, // string or array
  date:               { type: String, required: true },
  readTime:           { type: String, required: true },
  pdfUrl:             { type: String, required: true },
  chartType:          { type: String, required: true },
  chartData:          { type: [Number], required: true },
  doi:                { type: String, default: '' },
  pages:              { type: String, default: '' },
  volume:             { type: String, default: '' },
  issue:              { type: String, default: '' },
  abstract:           { type: String, default: '' },
  fullText:           { type: String, default: '' },
  isHtmlArticle:      { type: Boolean, default: true },
  affiliations:       { type: String, default: '' },
  correspondingAuthor:{ type: String, default: '' },
  keywords:           { type: String, default: '' },
}); // use default _id generation, keep custom numeric id field for lookups

const submissionSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  abstract:       { type: String, required: true },
  category:       { type: String, required: true },
  authorName:     { type: String, required: true },
  authorEmail:    { type: String, required: true },
  affiliation:    { type: String, required: true },
  coAuthors:      { type: String, default: '' },
  manuscriptFile: { type: String, required: true },
  coverLetterFile:{ type: String, default: null },
  submittedAt:    { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
  filename:   { type: String, required: true },
  url:        { type: String, required: true },
  uploadedAt: { type: String, required: true },
});

const fileSchema = new mongoose.Schema({
  filename:    { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  data:        { type: Buffer, required: true },
  uploadedAt:  { type: Date, default: Date.now }
});

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

let Article, Submission, Image, FileModel;

if (MONGODB_URI) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas.');

    Article    = mongoose.model('Article',    articleSchema);
    Submission = mongoose.model('Submission', submissionSchema);
    Image      = mongoose.model('Image',      imageSchema);
    FileModel  = mongoose.model('File',       fileSchema);
  } catch (err) {
    console.error('Failed to connect to MongoDB — falling back to JSON db:', err.message);
    useJsonDb = true;
  }
} else {
  console.warn('MONGODB_URI not set. Using local JSON database (not suitable for production).');
  useJsonDb = true;
}

// Load JSON fallback from disk
if (useJsonDb) {
  if (fs.existsSync(jsonDbPath)) {
    try {
      jsonData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
    } catch (e) {
      console.error('Error parsing journal-db.json, starting empty:', e);
      jsonData = { articles: [], submissions: [], images: [] };
    }
  } else {
    jsonData = { articles: [], submissions: [], images: [] };
    saveJsonDb();
  }
}

// ─── Helper: strip MongoDB internals from returned objects ──────────────────
function cleanArticle(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.__v;
  delete obj._id;
  return obj;
}

function cleanDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const id = obj._id?.toString() || obj.id;
  delete obj.__v;
  delete obj._id;
  return { id: parseInt(id), ...obj };
}

// ─── Exported async DB functions ─────────────────────────────────────────────

export async function getArticles() {
  if (useJsonDb) {
    return [...jsonData.articles].sort((a, b) => b.id - a.id);
  }
  const docs = await Article.find().sort({ id: -1 }).lean();
  return docs.map(d => { delete d.__v; delete d._id; return d; });
}

export async function getArticleById(id) {
  if (useJsonDb) {
    const article = jsonData.articles.find(art => art.id === parseInt(id));
    return article ? { ...article } : null;
  }
  const doc = await Article.findOne({ id: parseInt(id) }).lean();
  if (!doc) return null;
  delete doc.__v;
  delete doc._id;
  return doc;
}

export async function addArticle(article) {
  if (useJsonDb) {
    const newArt = { ...article, id: article.id || Date.now(), isHtmlArticle: !!article.isHtmlArticle };
    jsonData.articles.push(newArt);
    saveJsonDb();
    return newArt;
  }
  const doc = new Article({ ...article, id: article.id || Date.now() });
  await doc.save();
  return getArticleById(article.id);
}

export async function deleteArticle(id) {
  if (useJsonDb) {
    const targetId = parseInt(id);
    const before = jsonData.articles.length;
    jsonData.articles = jsonData.articles.filter(art => art.id !== targetId);
    if (jsonData.articles.length < before) { saveJsonDb(); return true; }
    return false;
  }
  const result = await Article.deleteOne({ id: parseInt(id) });
  return result.deletedCount > 0;
}

export async function getSubmissions() {
  if (useJsonDb) {
    return [...jsonData.submissions].sort((a, b) => b.id - a.id);
  }
  const docs = await Submission.find().sort({ _id: -1 }).lean();
  return docs.map(d => {
    const id = d._id.toString();
    delete d.__v; delete d._id;
    return { id, ...d };
  });
}

export async function addSubmission(sub) {
  if (useJsonDb) {
    const maxId = jsonData.submissions.reduce((max, s) => s.id > max ? s.id : max, 0);
    const newSub = { id: maxId + 1, ...sub };
    jsonData.submissions.push(newSub);
    saveJsonDb();
    return newSub;
  }
  const doc = new Submission(sub);
  await doc.save();
  const id = doc._id.toString();
  return { id, ...sub };
}

export async function deleteSubmission(id) {
  if (useJsonDb) {
    const targetId = parseInt(id);
    const before = jsonData.submissions.length;
    jsonData.submissions = jsonData.submissions.filter(s => s.id !== targetId);
    if (jsonData.submissions.length < before) { saveJsonDb(); return true; }
    return false;
  }
  // id could be a MongoDB ObjectId string or a numeric string
  let result;
  try {
    result = await Submission.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  } catch {
    result = { deletedCount: 0 };
  }
  return result.deletedCount > 0;
}

export async function getImages() {
  if (useJsonDb) {
    return [...jsonData.images].sort((a, b) => b.id - a.id);
  }
  const docs = await Image.find().sort({ _id: -1 }).lean();
  return docs.map(d => {
    const id = d._id.toString();
    delete d.__v; delete d._id;
    return { id, ...d };
  });
}

export async function addImage(img) {
  if (useJsonDb) {
    const maxId = jsonData.images.reduce((max, i) => i.id > max ? i.id : max, 0);
    const newImg = { id: maxId + 1, ...img };
    jsonData.images.push(newImg);
    saveJsonDb();
    return newImg;
  }
  const doc = new Image(img);
  await doc.save();
  const id = doc._id.toString();
  return { id, ...img };
}

export async function deleteImage(id) {
  if (useJsonDb) {
    const targetId = parseInt(id);
    const before = jsonData.images.length;
    jsonData.images = jsonData.images.filter(img => img.id !== targetId);
    if (jsonData.images.length < before) { saveJsonDb(); return true; }
    return false;
  }
  let result;
  try {
    result = await Image.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  } catch {
    result = { deletedCount: 0 };
  }
  return result.deletedCount > 0;
}

export async function saveFile(filename, contentType, buffer) {
  if (useJsonDb) {
    const dest = path.join(dataDir, 'uploads', filename);
    fs.writeFileSync(dest, buffer);
    return;
  }
  const doc = new FileModel({ filename, contentType, data: buffer });
  await doc.save();
}

export async function getFile(filename) {
  if (useJsonDb) {
    const dest = path.join(dataDir, 'uploads', filename);
    if (fs.existsSync(dest)) {
      const data = fs.readFileSync(dest);
      let contentType = 'application/octet-stream';
      const ext = path.extname(filename).toLowerCase();
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.html') contentType = 'text/html';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.webp') contentType = 'image/webp';
      return { data, contentType };
    }
    return null;
  }
  const doc = await FileModel.findOne({ filename }).lean();
  if (!doc) return null;
  return { data: doc.data.buffer || doc.data, contentType: doc.contentType };
}

export async function deleteFile(filename) {
  if (useJsonDb) {
    const dest = path.join(dataDir, 'uploads', filename);
    if (fs.existsSync(dest)) {
      try { fs.unlinkSync(dest); } catch {}
    }
    return true;
  }
  const result = await FileModel.deleteOne({ filename });
  return result.deletedCount > 0;
}
