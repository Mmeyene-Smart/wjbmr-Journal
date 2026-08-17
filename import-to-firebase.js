import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Automatically detect Firebase Service Account JSON file in workspace root
function findServiceAccountKey() {
  const files = fs.readdirSync(process.cwd());
  const found = files.find(f => f.includes('firebase-adminsdk') || f === 'serviceAccountKey.json');
  if (found) {
    return path.join(process.cwd(), found);
  }
  return null;
}

const serviceAccountPath = findServiceAccountKey();

if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  console.error('Error: Firebase service account JSON key not found in root directory!');
  process.exit(1);
}

console.log(`Using Firebase Service Account Key: ${path.basename(serviceAccountPath)}`);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Directory for local file storage fallback (e.g. PDFs, images)
const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function importToFirestore() {
  const exportDir = path.join(process.cwd(), 'mongodb_export');
  const allBackupFile = path.join(exportDir, 'all_collections.json');

  if (!fs.existsSync(allBackupFile)) {
    console.error(`Export file not found at ${allBackupFile}. Run "node export-mongodb.js" first!`);
    process.exit(1);
  }

  const collectionsData = JSON.parse(fs.readFileSync(allBackupFile, 'utf8'));

  for (const [colName, docs] of Object.entries(collectionsData)) {
    console.log(`\nImporting ${docs.length} documents into Firestore collection "${colName}"...`);
    if (docs.length === 0) {
      console.log(`  -> Collection "${colName}" is empty. Skipping.`);
      continue;
    }

    // Process documents individually to handle large files & prevent batch size limits
    let count = 0;
    for (const doc of docs) {
      // Extract document ID
      let docId = doc.id;
      if (!docId && doc._id) {
        docId = typeof doc._id === 'object' ? (doc._id.$oid || doc._id.toString()) : doc._id.toString();
      }
      if (!docId) {
        docId = Date.now().toString() + Math.random().toString(36).substring(2, 7);
      } else {
        docId = docId.toString();
      }

      // Handle binary file data in "files" collection
      if (colName === 'files' && doc.data) {
        try {
          let buffer;
          if (typeof doc.data === 'string') {
            buffer = Buffer.from(doc.data, 'base64');
          } else if (doc.data.buffer) {
            buffer = Buffer.from(doc.data.buffer);
          } else if (Array.isArray(doc.data.data)) {
            buffer = Buffer.from(doc.data.data);
          }
          
          if (buffer && doc.filename) {
            const savePath = path.join(uploadsDir, doc.filename);
            fs.writeFileSync(savePath, buffer);
          }
        } catch (e) {
          console.warn(`    ⚠️  Failed to save file buffer for ${doc.filename}:`, e.message);
        }
        
        // Remove raw heavy binary buffer from Firestore doc to stay under 1MB limit
        delete doc.data;
      }

      // Clean out raw MongoDB internal fields
      delete doc._id;
      delete doc.__v;

      const docRef = db.collection(colName).doc(docId);
      await docRef.set(doc, { merge: true });
      count++;
    }

    console.log(`  ✅ Successfully imported ${count} items into "${colName}"`);
  }

  console.log('\n========================================');
  console.log('🎉 FIREBASE FIRESTORE IMPORT COMPLETE!');
  console.log('All collections have been uploaded to your Firebase database.');
  console.log('All binary files have been extracted to data/uploads/.');
  console.log('========================================\n');
  process.exit(0);
}

importToFirestore().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
