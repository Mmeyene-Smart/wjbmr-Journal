import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const uploadsDir = path.join(dataDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── Initialize Firebase Admin ───────────────────────────────────────────────
let db = null;
let useJsonDb = false;
let jsonData = { articles: [], submissions: [], images: [], archives: [] };

const jsonDbPath = path.join(dataDir, 'journal-db.json');

function saveJsonDb() {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(jsonData, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save JSON database to disk:', err);
  }
}

function findServiceAccountKey() {
  const rootDir = path.join(__dirname, '..');
  const files = fs.readdirSync(rootDir);
  const found = files.find(f => f.includes('firebase-adminsdk') || f === 'serviceAccountKey.json');
  if (found) {
    return path.join(rootDir, found);
  }
  return null;
}

try {
  let credentialConfig = null;

  // 1. Check for FIREBASE_SERVICE_ACCOUNT JSON string in env (for Render / Production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      credentialConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', e.message);
    }
  }
  
  // 2. Check for individual env vars
  if (!credentialConfig && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    credentialConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'wjbmr-journal',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  // 3. Check for local JSON service account key file
  if (!credentialConfig) {
    const serviceAccountPath = findServiceAccountKey();
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      credentialConfig = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    }
  }

  if (credentialConfig) {
    initializeApp({
      credential: cert(credentialConfig)
    });
    db = getFirestore();
    console.log('Connected to Firebase Firestore successfully.');
  } else {
    console.warn('Firebase credentials not found. Falling back to local JSON database.');
    useJsonDb = true;
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin — falling back to JSON db:', err.message);
  useJsonDb = true;
}

// Load JSON fallback from disk if needed
if (useJsonDb) {
  if (fs.existsSync(jsonDbPath)) {
    try {
      jsonData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
      if (!jsonData.archives) jsonData.archives = [];
    } catch (e) {
      console.error('Error parsing journal-db.json:', e);
      jsonData = { articles: [], submissions: [], images: [], archives: [] };
    }
  } else {
    jsonData = { articles: [], submissions: [], images: [], archives: [] };
    saveJsonDb();
  }
}

// ─── ARTICLES ────────────────────────────────────────────────────────────────

const ARTICLE_SUMMARY_FIELDS = [
  'id', 'title', 'authors', 'date', 'readTime', 'pdfUrl',
  'chartType', 'chartData', 'category', 'doi', 'pages',
  'volume', 'issue', 'abstract', 'keywords', 'affiliations',
  'correspondingAuthor', 'isHtmlArticle'
];

export async function getArticles() {
  if (useJsonDb) {
    return [...jsonData.articles].sort((a, b) => b.id - a.id);
  }
  try {
    const snapshot = await db.collection('articles').get();
    const articles = [];
    snapshot.forEach(doc => {
      articles.push({ ...doc.data() });
    });
    return articles.sort((a, b) => (b.id || 0) - (a.id || 0));
  } catch (err) {
    console.error('Error in getArticles:', err);
    return [];
  }
}

export async function getArticlesSummary() {
  if (useJsonDb) {
    return [...jsonData.articles].map(({ fullText, ...rest }) => {
      if (rest.abstract && rest.abstract.length > 200) rest.abstract = rest.abstract.substring(0, 200) + '...';
      return rest;
    }).sort((a, b) => b.id - a.id);
  }
  try {
    const snapshot = await db.collection('articles').get();
    const articles = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const summary = {};
      for (const field of ARTICLE_SUMMARY_FIELDS) {
        if (data[field] !== undefined) summary[field] = data[field];
      }
      if (summary.abstract && summary.abstract.length > 200) summary.abstract = summary.abstract.substring(0, 200) + '...';
      articles.push(summary);
    });
    return articles.sort((a, b) => (b.id || 0) - (a.id || 0));
  } catch (err) {
    console.error('Error in getArticlesSummary:', err);
    return [];
  }
}

export async function getArticleById(id) {
  if (useJsonDb) {
    const article = jsonData.articles.find(art => String(art.id) === String(id));
    return article ? { ...article } : null;
  }
  try {
    const strId = String(id);
    const numId = Number(id);

    // 1. Check direct doc ID match
    const docRef = db.collection('articles').doc(strId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    // 2. Query by 'id' field as string or number
    let querySnap = await db.collection('articles').where('id', '==', strId).limit(1).get();
    if (querySnap.empty && !isNaN(numId)) {
      querySnap = await db.collection('articles').where('id', '==', numId).limit(1).get();
    }

    if (!querySnap.empty) {
      const matchDoc = querySnap.docs[0];
      return { id: matchDoc.id, ...matchDoc.data() };
    }

    return null;
  } catch (err) {
    console.error('Error in getArticleById:', err);
    return null;
  }
}

export async function addArticle(article) {
  const newId = article.id || Date.now();
  const newArt = { ...article, id: newId, isHtmlArticle: !!article.isHtmlArticle };

  if (useJsonDb) {
    jsonData.articles.push(newArt);
    saveJsonDb();
    return newArt;
  }
  try {
    await db.collection('articles').doc(newId.toString()).set(newArt, { merge: true });
    return newArt;
  } catch (err) {
    console.error('Error in addArticle:', err);
    throw err;
  }
}

export async function deleteArticle(id) {
  if (useJsonDb) {
    const before = jsonData.articles.length;
    jsonData.articles = jsonData.articles.filter(art => String(art.id) !== String(id));
    if (jsonData.articles.length < before) { saveJsonDb(); return true; }
    return false;
  }
  try {
    const strId = String(id);
    const numId = Number(id);

    // 1. Try doc deletion by string document ID
    const docRef = db.collection('articles').doc(strId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      await docRef.delete();
      return true;
    }

    // 2. Query by 'id' property as string or number
    let querySnap = await db.collection('articles').where('id', '==', strId).get();
    if (querySnap.empty && !isNaN(numId)) {
      querySnap = await db.collection('articles').where('id', '==', numId).get();
    }

    if (!querySnap.empty) {
      for (const d of querySnap.docs) {
        await d.ref.delete();
      }
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error in deleteArticle:', err);
    return false;
  }
}

export async function updateArticle(id, updatedFields) {
  if (useJsonDb) {
    const index = jsonData.articles.findIndex(art => String(art.id) === String(id));
    if (index !== -1) {
      jsonData.articles[index] = { ...jsonData.articles[index], ...updatedFields };
      saveJsonDb();
      return jsonData.articles[index];
    }
    return null;
  }
  try {
    const strId = String(id);
    const numId = Number(id);

    const docRef = db.collection('articles').doc(strId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      await docRef.update(updatedFields);
      const updated = await docRef.get();
      return { id: updated.id, ...updated.data() };
    }

    let querySnap = await db.collection('articles').where('id', '==', strId).limit(1).get();
    if (querySnap.empty && !isNaN(numId)) {
      querySnap = await db.collection('articles').where('id', '==', numId).limit(1).get();
    }

    if (!querySnap.empty) {
      const matchDoc = querySnap.docs[0];
      await matchDoc.ref.update(updatedFields);
      const updated = await matchDoc.ref.get();
      return { id: updated.id, ...updated.data() };
    }

    return null;
  } catch (err) {
    console.error('Error in updateArticle:', err);
    return null;
  }
}


// ─── SUBMISSIONS ─────────────────────────────────────────────────────────────

export async function getSubmissions() {
  if (useJsonDb) {
    return [...jsonData.submissions].sort((a, b) => (b.id || 0) - (a.id || 0));
  }
  try {
    const snapshot = await db.collection('submissions').get();
    const subs = [];
    snapshot.forEach(doc => {
      subs.push({ id: doc.id, ...doc.data() });
    });
    return subs.sort((a, b) => String(b.submittedAt || '').localeCompare(String(a.submittedAt || '')));
  } catch (err) {
    console.error('Error in getSubmissions:', err);
    return [];
  }
}

export async function addSubmission(sub) {
  if (useJsonDb) {
    const maxId = jsonData.submissions.reduce((max, s) => s.id > max ? s.id : max, 0);
    const newSub = { id: maxId + 1, ...sub };
    jsonData.submissions.push(newSub);
    saveJsonDb();
    return newSub;
  }
  try {
    const docRef = db.collection('submissions').doc();
    const newSub = { id: docRef.id, ...sub };
    await docRef.set(newSub);
    return newSub;
  } catch (err) {
    console.error('Error in addSubmission:', err);
    throw err;
  }
}

export async function deleteSubmission(id) {
  if (useJsonDb) {
    const targetId = parseInt(id);
    const before = jsonData.submissions.length;
    jsonData.submissions = jsonData.submissions.filter(s => s.id !== targetId);
    if (jsonData.submissions.length < before) { saveJsonDb(); return true; }
    return false;
  }
  try {
    const docRef = db.collection('submissions').doc(id.toString());
    await docRef.delete();
    return true;
  } catch (err) {
    console.error('Error in deleteSubmission:', err);
    return false;
  }
}


// ─── IMAGES ──────────────────────────────────────────────────────────────────

export async function getImages() {
  if (useJsonDb) {
    return [...jsonData.images].sort((a, b) => (b.id || 0) - (a.id || 0));
  }
  try {
    const snapshot = await db.collection('images').get();
    const imgs = [];
    snapshot.forEach(doc => {
      imgs.push({ id: doc.id, ...doc.data() });
    });
    return imgs.sort((a, b) => String(b.uploadedAt || '').localeCompare(String(a.uploadedAt || '')));
  } catch (err) {
    console.error('Error in getImages:', err);
    return [];
  }
}

export async function addImage(img) {
  if (useJsonDb) {
    const maxId = jsonData.images.reduce((max, i) => i.id > max ? i.id : max, 0);
    const newImg = { id: maxId + 1, ...img };
    jsonData.images.push(newImg);
    saveJsonDb();
    return newImg;
  }
  try {
    const docRef = db.collection('images').doc();
    const newImg = { id: docRef.id, ...img };
    await docRef.set(newImg);
    return newImg;
  } catch (err) {
    console.error('Error in addImage:', err);
    throw err;
  }
}

export async function deleteImage(id) {
  if (useJsonDb) {
    const targetId = parseInt(id);
    const before = jsonData.images.length;
    jsonData.images = jsonData.images.filter(img => img.id !== targetId);
    if (jsonData.images.length < before) { saveJsonDb(); return true; }
    return false;
  }
  try {
    const docRef = db.collection('images').doc(id.toString());
    await docRef.delete();
    return true;
  } catch (err) {
    console.error('Error in deleteImage:', err);
    return false;
  }
}


// ─── FILE STORAGE ────────────────────────────────────────────────────────────

export async function saveFile(filename, contentType, buffer) {
  const dest = path.join(uploadsDir, filename);
  fs.writeFileSync(dest, buffer);

  const canStoreInDb = buffer.length <= 1000 * 1024;

  if (useJsonDb) {
    if (!jsonData.files) jsonData.files = {};
    jsonData.files[filename] = {
      filename,
      contentType,
      fileData: canStoreInDb ? buffer.toString('base64') : null,
      uploadedAt: new Date().toISOString()
    };
    saveJsonDb();
  } else if (db) {
    try {
      const payload = {
        filename,
        contentType,
        uploadedAt: new Date().toISOString()
      };
      if (canStoreInDb) {
        payload.fileData = buffer; // Buffer is saved natively as Bytes in Firestore
      }
      await db.collection('files').doc(filename).set(payload, { merge: true });
    } catch (err) {
      console.warn('Failed to save file metadata to Firestore:', err.message);
    }
  }
}

export async function getFile(filename) {
  const dest = path.join(uploadsDir, filename);
  let data = null;
  let contentType = 'application/octet-stream';
  const ext = path.extname(filename).toLowerCase();
  
  if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.html') contentType = 'text/html';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.svg') contentType = 'image/svg+xml';
  else if (ext === '.webp') contentType = 'image/webp';

  // 1. If file exists on disk
  if (fs.existsSync(dest)) {
    data = fs.readFileSync(dest);
    if (!useJsonDb && db) {
      try {
        const docSnap = await db.collection('files').doc(filename).get();
        if (docSnap.exists && docSnap.data().contentType) {
          contentType = docSnap.data().contentType;
        }
      } catch (e) {}
    }
    return { data, contentType };
  }

  // 2. If file missing from disk (e.g. after Render restart), restore from DB fallback
  if (useJsonDb && jsonData.files && jsonData.files[filename]) {
    const fData = jsonData.files[filename];
    if (fData.fileData) {
      data = Buffer.isBuffer(fData.fileData) ? fData.fileData : Buffer.from(fData.fileData, 'base64');
      fs.writeFileSync(dest, data);
      return { data, contentType: fData.contentType || contentType };
    }
  } else if (!useJsonDb && db) {
    try {
      const docSnap = await db.collection('files').doc(filename).get();
      if (docSnap.exists) {
        const docData = docSnap.data();
        if (docData.contentType) contentType = docData.contentType;
        if (docData.fileData) {
          if (Buffer.isBuffer(docData.fileData)) {
            data = docData.fileData;
          } else if (docData.fileData.toBuffer) {
            data = docData.fileData.toBuffer();
          } else if (typeof docData.fileData === 'string') {
            data = Buffer.from(docData.fileData, 'base64');
          } else if (docData.fileData.buffer || Array.isArray(docData.fileData.data)) {
            data = Buffer.from(docData.fileData.buffer || docData.fileData.data);
          }
          if (data) {
            fs.writeFileSync(dest, data);
            return { data, contentType };
          }
        }
      }
    } catch (e) {
      console.warn('Failed to retrieve file from Firestore fallback:', e.message);
    }
  }

  return null;
}

export async function deleteFile(filename) {
  const dest = path.join(uploadsDir, filename);
  if (fs.existsSync(dest)) {
    try { fs.unlinkSync(dest); } catch {}
  }
  if (!useJsonDb && db) {
    try {
      await db.collection('files').doc(filename).delete();
    } catch (err) {
      console.warn('Failed to delete file metadata from Firestore:', err.message);
    }
  }
  return true;
}


// ─── ARCHIVES ────────────────────────────────────────────────────────────────

export async function getArchives() {
  if (useJsonDb) {
    return [...(jsonData.archives || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
  }
  try {
    const snapshot = await db.collection('archives').get();
    const archives = [];
    snapshot.forEach(doc => {
      archives.push({ id: doc.id, ...doc.data() });
    });
    return archives.sort((a, b) => String(b.uploadedAt || '').localeCompare(String(a.uploadedAt || '')));
  } catch (err) {
    console.error('Error in getArchives:', err);
    return [];
  }
}

export async function addArchive(archive) {
  if (useJsonDb) {
    const archivesList = jsonData.archives || [];
    const maxId = archivesList.reduce((max, a) => a.id > max ? a.id : max, 0);
    const newArch = { id: maxId + 1, ...archive };
    jsonData.archives = [...archivesList, newArch];
    saveJsonDb();
    return newArch;
  }
  try {
    const docRef = db.collection('archives').doc();
    const newArch = { id: docRef.id, ...archive };
    await docRef.set(newArch);
    return newArch;
  } catch (err) {
    console.error('Error in addArchive:', err);
    throw err;
  }
}

export async function deleteArchive(id) {
  if (useJsonDb) {
    const targetId = parseInt(id);
    const before = (jsonData.archives || []).length;
    jsonData.archives = (jsonData.archives || []).filter(a => a.id !== targetId);
    if (jsonData.archives.length < before) { saveJsonDb(); return true; }
    return false;
  }
  try {
    const docRef = db.collection('archives').doc(id.toString());
    await docRef.delete();
    return true;
  } catch (err) {
    console.error('Error in deleteArchive:', err);
    return false;
  }
}
