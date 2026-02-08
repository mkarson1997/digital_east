const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-super-secret';

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const db = new Database(path.join(__dirname, '..', 'digitaleast.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  budget TEXT,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  language TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  source TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminUser) {
  const hash = bcrypt.hashSync('Admin@2026!', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

const teamCount = db.prepare('SELECT COUNT(*) AS count FROM team').get().count;
if (teamCount === 0) {
  const seedTeam = db.prepare('INSERT INTO team (name, role, bio, image_url, sort_order) VALUES (?, ?, ?, ?, ?)');
  const members = [
    ['Omar Khaled', 'CEO & Strategy Lead'],
    ['Lina Yildiz', 'Operations Manager'],
    ['Ahmad Demir', 'Creative Director'],
    ['Maya Alawi', 'Brand Designer'],
    ['Rami Saad', 'Performance Marketing Specialist'],
    ['Noor Hassan', 'Social Media Lead'],
    ['Kaan Ersoy', 'SEO Specialist'],
    ['Joud Nasser', 'Content Strategist'],
    ['Salim Farouk', 'Web Developer'],
    ['Dalia Hariri', 'Client Success Manager']
  ];
  members.forEach((member, idx) => {
    seedTeam.run(
      member[0],
      member[1],
      'Demo profile. Editable from dashboard.',
      `https://picsum.photos/seed/team${idx + 1}/400/400`,
      idx + 1
    );
  });
}

const projectCount = db.prepare('SELECT COUNT(*) AS count FROM projects').get().count;
if (projectCount === 0) {
  const seedProject = db.prepare('INSERT INTO projects (title, category, description, image_url, source) VALUES (?, ?, ?, ?, ?)');
  for (let i = 1; i <= 8; i += 1) {
    seedProject.run(
      `Portfolio Case ${i}`,
      i % 2 ? 'Branding & Ads' : 'Digital Growth',
      'Demo portfolio case with KPI-focused outcomes and editable details.',
      `https://picsum.photos/seed/project${i}/800/500`,
      i <= 4 ? 'Main Portfolio' : 'PR Portfolio'
    );
  }
}

const postCount = db.prepare('SELECT COUNT(*) AS count FROM posts').get().count;
if (postCount === 0) {
  const seedPost = db.prepare('INSERT INTO posts (language, slug, title, summary, content) VALUES (?, ?, ?, ?, ?)');
  seedPost.run('en', 'future-of-performance-marketing', 'Future of Performance Marketing in 2026', 'How agencies scale leads while keeping CAC healthy.', 'Long-form demo article content editable from dashboard.');
  seedPost.run('ar', 'strategic-growth-playbook', 'دليل النمو الاستراتيجي في 2026', 'خطة عملية لرفع التحويلات وبناء هوية قوية.', 'مقال تجريبي كامل قابل للتعديل من لوحة التحكم.');
  seedPost.run('tr', 'marka-ve-buyume', '2026 Marka ve Büyüme Rehberi', 'Ajanslar için sürdürülebilir dönüşüm stratejileri.', 'Panelden düzenlenebilir örnek blog içeriği.');
}

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`);
  }
});
const upload = multer({ storage });

function authRequired(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function upsertSetting(key, value) {
  db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value);
}

const defaultSettings = {
  company_name: 'Digital East',
  email: 'info@digitaleast.agency',
  phone: '+90 541 392 94 36',
  location: 'Konya, Türkiye',
  hero_title_en: 'Modern Marketing & Advertising That Scales Brands',
  hero_title_ar: 'حلول تسويق وإعلان حديثة تنمّي العلامات التجارية',
  hero_title_tr: 'Markaları Büyüten Modern Pazarlama ve Reklam Çözümleri',
  hero_subtitle_en: 'We build growth engines, premium branding, and high-converting digital experiences.',
  hero_subtitle_ar: 'نبني محركات نمو وهوية بصرية قوية وتجارب رقمية عالية التحويل.',
  hero_subtitle_tr: 'Büyüme motorları, güçlü marka kimliği ve yüksek dönüşüm sağlayan dijital deneyimler inşa ediyoruz.'
};

Object.entries(defaultSettings).forEach(([k, v]) => {
  const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get(k);
  if (!row) upsertSetting(k, v);
});

app.get('/api/public/content', (_req, res) => {
  const settings = db.prepare('SELECT key, value FROM site_settings').all();
  const services = [
    {
      id: 'branding',
      icon: '🎯',
      title: { ar: 'الهوية والعلامة التجارية', en: 'Brand Strategy', tr: 'Marka Stratejisi' },
      desc: {
        ar: 'تصميم هوية كاملة متناسقة مع شخصية المشروع والسوق المستهدف.',
        en: 'Complete identity systems aligned with your business direction.',
        tr: 'Marka kimliğini hedef kitleye göre yapılandırırız.'
      }
    },
    {
      id: 'ads',
      icon: '📈',
      title: { ar: 'إعلانات الأداء', en: 'Performance Ads', tr: 'Performans Reklamları' },
      desc: {
        ar: 'حملات مدفوعة تعتمد على الأرقام والتحسين المستمر.',
        en: 'Data-driven paid campaigns optimized for ROI.',
        tr: 'ROI odaklı, veriyle optimize edilen reklam kampanyaları.'
      }
    },
    {
      id: 'web',
      icon: '💻',
      title: { ar: 'تصميم وبرمجة المواقع', en: 'Web Design & Development', tr: 'Web Tasarım ve Geliştirme' },
      desc: {
        ar: 'مواقع سريعة وحديثة متعددة اللغات ومتوافقة مع جميع الأجهزة.',
        en: 'Modern multilingual websites optimized for all devices.',
        tr: 'Tüm cihazlarda hızlı çalışan çok dilli modern web siteleri.'
      }
    },
    {
      id: 'content',
      icon: '🧠',
      title: { ar: 'صناعة المحتوى', en: 'Content Production', tr: 'İçerik Üretimi' },
      desc: {
        ar: 'محتوى نصي ومرئي مصمم لبناء الثقة وزيادة التحويل.',
        en: 'Strategic copy and visual content for conversion.',
        tr: 'Dönüşüm odaklı metin ve görsel içerik planlama.'
      }
    }
  ];
  const projects = db.prepare('SELECT * FROM projects ORDER BY id DESC').all();
  const team = db.prepare('SELECT * FROM team ORDER BY sort_order ASC, id ASC').all();
  const posts = db.prepare('SELECT id, language, slug, title, summary, created_at FROM posts ORDER BY id DESC').all();
  const mappedSettings = Object.fromEntries(settings.map((item) => [item.key, item.value]));
  res.json({ settings: mappedSettings, services, projects, team, posts });
});

app.post('/api/public/leads', (req, res) => {
  const { name, email, phone, company, service, budget, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
  db.prepare('INSERT INTO leads (name, email, phone, company, service, budget, message) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, email, phone || '', company || '', service || '', budget || '', message);
  res.json({ success: true, message: 'Lead captured and ready to route to email provider.' });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '10h' });
  res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 60 * 1000
  });
  res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 10 * 60 * 60 * 1000 });
  return res.json({ success: true });
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

app.get('/api/admin/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/admin/leads', authRequired, (_req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
  res.json(leads);
});

app.get('/api/admin/projects', authRequired, (_req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/admin/projects', authRequired, (req, res) => {
  const { title, category, description, image_url, source } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const result = db.prepare('INSERT INTO projects (title, category, description, image_url, source) VALUES (?, ?, ?, ?, ?)').run(title, category || '', description || '', image_url || '', source || 'Main Portfolio');
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.json(row);
});

app.delete('/api/admin/projects/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/team', authRequired, (_req, res) => {
  const rows = db.prepare('SELECT * FROM team ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

app.post('/api/admin/team', authRequired, (req, res) => {
  const { name, role, bio, image_url, sort_order } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'name and role required' });
  const result = db.prepare('INSERT INTO team (name, role, bio, image_url, sort_order) VALUES (?, ?, ?, ?, ?)').run(name, role, bio || '', image_url || '', Number(sort_order || 0));
  const row = db.prepare('SELECT * FROM team WHERE id = ?').get(result.lastInsertRowid);
  res.json(row);
});

app.delete('/api/admin/team/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM team WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/posts', authRequired, (_req, res) => {
  const rows = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/admin/posts', authRequired, (req, res) => {
  const { language, slug, title, summary, content } = req.body;
  if (!language || !slug || !title || !summary || !content) return res.status(400).json({ error: 'all fields required' });
  const result = db.prepare('INSERT INTO posts (language, slug, title, summary, content) VALUES (?, ?, ?, ?, ?)').run(language, slug, title, summary, content);
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.json(row);
});

app.delete('/api/admin/posts/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/settings', authRequired, (_req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_settings ORDER BY key ASC').all();
  res.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
});

app.post('/api/admin/settings', authRequired, (req, res) => {
  const entries = Object.entries(req.body || {});
  entries.forEach(([key, value]) => {
    if (typeof value === 'string') upsertSetting(key, value);
  });
  res.json({ success: true });
});

app.post('/api/admin/upload', authRequired, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Digital East app running on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log('Admin login -> username: admin / password: Admin@2026!');
});
