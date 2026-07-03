import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'journal.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency performance
db.pragma('journal_mode = WAL');

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,          -- JSON string of {name: string, profile: string}[]
    date TEXT NOT NULL,
    readTime TEXT NOT NULL,
    pdfUrl TEXT NOT NULL,
    chartType TEXT NOT NULL,
    chartData TEXT NOT NULL,        -- JSON string of number[]
    doi TEXT,
    pages TEXT,
    volume TEXT,
    issue TEXT,
    abstract TEXT NOT NULL,         -- Stores the full HTML article body
    isHtmlArticle INTEGER DEFAULT 1,
    affiliations TEXT,
    correspondingAuthor TEXT,
    keywords TEXT
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    category TEXT NOT NULL,
    authorName TEXT NOT NULL,
    authorEmail TEXT NOT NULL,
    affiliation TEXT NOT NULL,
    coAuthors TEXT,
    manuscriptFile TEXT NOT NULL,  -- Filename/URL of manuscript doc
    coverLetterFile TEXT,          -- Filename/URL of cover letter
    submittedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    uploadedAt TEXT NOT NULL
  );
`);

// Pre-seed articles if table is empty
const checkArticles = db.prepare('SELECT COUNT(*) as count FROM articles');
const articleCount = checkArticles.get().count;

if (articleCount === 0) {
  console.log('Seeding SQLite database with default mock publications...');
  
  const seedArticles = [
    {
      id: 1,
      category: 'ORIGINAL RESEARCH',
      title: 'Molecular Characterization and Drug Resistance Profiling of Plasmodium falciparum Isolates in Southern Nigeria',
      authors: JSON.stringify([
        { name: 'Dr. Ukeme D. Archibong', profile: '#' },
        { name: 'Dr. Juliet U. Don', profile: '#' },
        { name: 'Prof. Kofon G. Nkanta', profile: '#' }
      ]),
      date: 'June 28, 2026',
      readTime: '12 min read',
      pdfUrl: '#',
      chartType: 'bar',
      chartData: JSON.stringify([45, 62, 38, 85, 52]),
      doi: 'https://doi.org/10.5281/wjbmr.2026.0401',
      pages: '101 - 112',
      volume: 'Volume 12 (2026)',
      issue: 'Issue 2 (June 2026)',
      abstract: `
        <h3>Abstract</h3>
        <p><strong>Background:</strong> Malaria drug resistance remains a major threat to public health in Sub-Saharan Africa. This study characterizes the molecular profiles of <em>Plasmodium falciparum</em> isolates and maps resistance trends in Southern Nigeria.</p>
        <p><strong>Methods:</strong> Blood samples from 250 clinical malaria patients were subjected to PCR amplification and gene sequencing targeting the Pfmdr1 and Pfcrt loci.</p>
        <p><strong>Results:</strong> Molecular analysis revealed a 64% prevalence of the K76T mutation in Pfcrt, indicating sustained chloroquine resistance markers. In contrast, the N86Y allele on Pfmdr1 was detected in only 18% of samples, suggesting rising sensitivity to lumefantrine.</p>
        <p><strong>Conclusion:</strong> These findings underscore the critical need for continuous surveillance of molecular markers to guide clinical drug usage policies.</p>
      `,
      isHtmlArticle: 1,
      affiliations: 'Department of Medical Microbiology, University of Uyo, Uyo, Nigeria\nDepartment of Pharmacology, College of Health Sciences, University of Uyo, Nigeria',
      correspondingAuthor: 'Dr. Ukeme D. Archibong (ukemearchibong@uniuyo.edu.ng)',
      keywords: 'Plasmodium falciparum, drug resistance, molecular markers, Southern Nigeria, Pfmdr1'
    },
    {
      id: 2,
      category: 'CLINICAL STUDY',
      title: 'Efficacy and Safety of Novel Phytochemical Extracts from Vernonia amygdalina in Hepatoprotective Therapy: A Randomized Controlled Trial',
      authors: JSON.stringify([
        { name: 'Dr. Ezenwa O. Nwosu', profile: '#' },
        { name: 'Prof. Blessing C. Akpan', profile: '#' }
      ]),
      date: 'May 15, 2026',
      readTime: '15 min read',
      pdfUrl: '#',
      chartType: 'line',
      chartData: JSON.stringify([10, 25, 45, 60, 95]),
      doi: 'https://doi.org/10.5281/wjbmr.2026.0402',
      pages: '113 - 128',
      volume: 'Volume 12 (2026)',
      issue: 'Issue 2 (June 2026)',
      abstract: `
        <h3>Abstract</h3>
        <p><strong>Background:</strong> Plant-derived bioactive agents are increasingly evaluated for clinical therapeutics. We evaluated the safety and liver protection profile of standardized <em>Vernonia amygdalina</em> (bitter leaf) extracts in patients with mild hepatic impairment.</p>
        <p><strong>Methods:</strong> A double-blind, randomized controlled trial was conducted with 80 participants randomized to receive either 500mg extracts or matching placebo daily for 8 weeks.</p>
        <p><strong>Results:</strong> The treatment group exhibited a significant decrease in serum alanine aminotransferase (ALT) and aspartate aminotransferase (AST) compared to placebo (p &lt; 0.05). No serious adverse events were reported, confirming a robust safety profile.</p>
        <p><strong>Conclusion:</strong> <em>Vernonia amygdalina</em> extract is a safe and promising hepatoprotective agent for supplementary liver therapy.</p>
      `,
      isHtmlArticle: 1,
      affiliations: 'Department of Clinical Medicine, Enugu State University of Science and Technology, Enugu, Nigeria\nDepartment of Pharmacognosy, University of Nigeria, Nsukka, Nigeria',
      correspondingAuthor: 'Dr. Ezenwa O. Nwosu (ezenwa.nwosu@esut.edu.ng)',
      keywords: 'Vernonia amygdalina, clinical trial, hepatoprotective, ALT, AST, liver safety'
    },
    {
      id: 3,
      category: 'REVIEW ARTICLE',
      title: 'Recent Advances in CRISPR-Cas9 Gene Editing Applications for Hereditary Hematological Disorders in Sub-Saharan Africa',
      authors: JSON.stringify([
        { name: 'Dr. Amina Y. Bello', profile: '#' },
        { name: 'Prof. Charles K. Tetteh', profile: '#' },
        { name: 'Dr. Sarah E. Cole', profile: '#' }
      ]),
      date: 'April 02, 2026',
      readTime: '18 min read',
      pdfUrl: '#',
      chartType: 'pie',
      chartData: JSON.stringify([30, 20, 50]),
      doi: 'https://doi.org/10.5281/wjbmr.2026.0403',
      pages: '129 - 138',
      volume: 'Volume 12 (2026)',
      issue: 'Issue 1 (March 2026)',
      abstract: `
        <h3>Abstract</h3>
        <p>Hereditary hematological disorders, particularly sickle cell disease (SCD) and beta-thalassemia, present an immense burden of morbidity and mortality in Sub-Saharan Africa. Recent progress in genome editing, specifically CRISPR-Cas9, offers a potential curative approach via autologous hematopoietic stem cell transfection and fetal hemoglobin induction.</p>
        <p>This review summarizes key molecular clinical trials, compares therapeutic delivery mechanisms, and highlights the unique ethical, economic, and infrastructural hurdles confronting the implementation of genetic therapeutics in low-resource environments.</p>
      `,
      isHtmlArticle: 1,
      affiliations: 'Department of Hematology, Ahmadu Bello University, Zaria, Nigeria\nDepartment of Biochemistry, University of Ghana, Legon, Ghana\nDivision of Human Genetics, University of Cape Town, South Africa',
      correspondingAuthor: 'Dr. Amina Y. Bello (aminabello@abu.edu.ng)',
      keywords: 'CRISPR-Cas9, gene editing, sickle cell disease, hematology, Sub-Saharan Africa'
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO articles (id, category, title, authors, date, readTime, pdfUrl, chartType, chartData, doi, pages, volume, issue, abstract, isHtmlArticle, affiliations, correspondingAuthor, keywords)
    VALUES (@id, @category, @title, @authors, @date, @readTime, @pdfUrl, @chartType, @chartData, @doi, @pages, @volume, @issue, @abstract, @isHtmlArticle, @affiliations, @correspondingAuthor, @keywords)
  `);

  const transaction = db.transaction((rows) => {
    for (const row of rows) insertStmt.run(row);
  });

  transaction(seedArticles);
  console.log('Seeding complete.');
}

// DB Helper Functions
export function getArticles() {
  const stmt = db.prepare('SELECT * FROM articles ORDER BY id DESC');
  const rows = stmt.all();
  return rows.map(row => ({
    ...row,
    authors: JSON.parse(row.authors),
    chartData: JSON.parse(row.chartData),
    isHtmlArticle: !!row.isHtmlArticle
  }));
}

export function getArticleById(id) {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return null;
  return {
    ...row,
    authors: JSON.parse(row.authors),
    chartData: JSON.parse(row.chartData),
    isHtmlArticle: !!row.isHtmlArticle
  };
}

export function addArticle(article) {
  const stmt = db.prepare(`
    INSERT INTO articles (id, category, title, authors, date, readTime, pdfUrl, chartType, chartData, doi, pages, volume, issue, abstract, isHtmlArticle, affiliations, correspondingAuthor, keywords)
    VALUES (@id, @category, @title, @authors, @date, @readTime, @pdfUrl, @chartType, @chartData, @doi, @pages, @volume, @issue, @abstract, @isHtmlArticle, @affiliations, @correspondingAuthor, @keywords)
  `);
  stmt.run({
    ...article,
    authors: JSON.stringify(article.authors),
    chartData: JSON.stringify(article.chartData),
    isHtmlArticle: article.isHtmlArticle ? 1 : 0
  });
  return getArticleById(article.id);
}

export function deleteArticle(id) {
  const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

export function getSubmissions() {
  const stmt = db.prepare('SELECT * FROM submissions ORDER BY id DESC');
  return stmt.all();
}

export function addSubmission(sub) {
  const stmt = db.prepare(`
    INSERT INTO submissions (title, abstract, category, authorName, authorEmail, affiliation, coAuthors, manuscriptFile, coverLetterFile, submittedAt)
    VALUES (@title, @abstract, @category, @authorName, @authorEmail, @affiliation, @coAuthors, @manuscriptFile, @coverLetterFile, @submittedAt)
  `);
  const info = stmt.run(sub);
  return { id: info.lastInsertRowid, ...sub };
}

export function deleteSubmission(id) {
  const stmt = db.prepare('DELETE FROM submissions WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

export function getImages() {
  const stmt = db.prepare('SELECT * FROM images ORDER BY id DESC');
  return stmt.all();
}

export function addImage(img) {
  const stmt = db.prepare(`
    INSERT INTO images (filename, url, uploadedAt)
    VALUES (@filename, @url, @uploadedAt)
  `);
  const info = stmt.run(img);
  return { id: info.lastInsertRowid, ...img };
}

export function deleteImage(id) {
  const stmt = db.prepare('DELETE FROM images WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

