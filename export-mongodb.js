import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Fix Windows DNS lookup issues with MongoDB SRV
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const outputDir = path.join(process.cwd(), 'mongodb_export');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// URIs to attempt
const srvUri = process.env.MONGODB_URI || "mongodb+srv://Admin:Minator11@cluster0.kciw8zp.mongodb.net/?appName=Cluster0";
const directUri = "mongodb://Admin:Minator11@ac-usnb2eg-shard-00-00.kciw8zp.mongodb.net:27017,ac-usnb2eg-shard-00-01.kciw8zp.mongodb.net:27017,ac-usnb2eg-shard-00-02.kciw8zp.mongodb.net:27017/?ssl=true&replicaSet=atlas-usnb2eg-shard-0&authSource=admin";

async function tryConnect() {
  console.log('Attempting to connect to MongoDB Atlas (Attempt 1: SRV connection with Google DNS)...');
  try {
    await mongoose.connect(srvUri, { serverSelectionTimeoutMS: 15000 });
    return true;
  } catch (err1) {
    console.log('Attempt 1 failed. Trying direct replica set connection...');
    try {
      await mongoose.connect(directUri, { serverSelectionTimeoutMS: 15000 });
      return true;
    } catch (err2) {
      console.error('\n❌ ALL CONNECTION ATTEMPTS TIMED OUT / FAILED.');
      console.error('Error details:', err2.message || err2);
      return false;
    }
  }
}

async function exportAll() {
  const connected = await tryConnect();
  if (!connected) {
    console.log('\n=================================================================');
    console.log('⚠️  IMPORTANT SECURITY / WHITELIST ACTION REQUIRED:');
    console.log('MongoDB Atlas is blocking connections from your current IP address.');
    console.log('Please follow these 3 quick steps in your MongoDB Atlas account:');
    console.log('  1. Go to https://cloud.mongodb.com and log in.');
    console.log('  2. Click "Network Access" in the left sidebar.');
    console.log('  3. Click "+ Add IP Address" -> Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) -> Click "Confirm".');
    console.log('  4. Re-run: node export-mongodb.js');
    console.log('=================================================================\n');
    process.exit(1);
  }

  console.log('✅ Connected to MongoDB Atlas successfully!');
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`Found ${collections.length} collections:`, collections.map(c => c.name));
    
    const summary = {};
    const fullBackup = {};
    
    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`Exporting collection: ${colName}...`);
      const docs = await db.collection(colName).find({}).toArray();
      
      const filePath = path.join(outputDir, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
      
      console.log(`  -> Saved ${docs.length} documents to ${colName}.json`);
      summary[colName] = docs.length;
      fullBackup[colName] = docs;
    }
    
    const allBackupPath = path.join(outputDir, 'all_collections.json');
    fs.writeFileSync(allBackupPath, JSON.stringify(fullBackup, null, 2), 'utf8');
    
    console.log('\n========================================');
    console.log('🎉 EXPORT COMPLETE!');
    console.log(`All files exported to folder: ${outputDir}`);
    console.log('Summary of exported data:');
    console.log(JSON.stringify(summary, null, 2));
    console.log('========================================\n');
    
  } catch (err) {
    console.error('Error while reading collection data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

exportAll();
