# Digital_East – Project Delivery Guide

A multilingual agency website + admin dashboard starter for **Digital East**.

## 1) What is included
- Public website (Arabic / English / Turkish).
- Modern responsive design (desktop/tablet/mobile).
- Lead form (stores requests in DB).
- Admin panel login + content management.
- CRUD for: Projects, Team, Blog Posts, and site Settings.

## 2) Project structure
- `index.html` → main public page for GitHub Pages/static preview.
- `public/` → CSS/JS/assets + admin page.
- `src/server.js` → backend APIs + auth + DB bootstrapping.
- `digitaleast.db` → SQLite DB file (created at runtime).

## 3) Local run (development)
# Digital East Web Platform

A production-ready starter for a multilingual agency website with an admin dashboard.

## Stack
- Node.js + Express
- SQLite (`better-sqlite3`)
- Vanilla HTML/CSS/JS frontend

## Features
- Arabic / English / Turkish public site.
- Modern responsive UI.
- Lead capture form.
- Secure dashboard login.
- Manage Projects / Team / Blog / Settings.

## Run
```bash
npm install
npm start
```
Then open:
- Public: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## 4) Default admin credentials
- Username: `admin`
- Password: `Admin@2026!`

> Change immediately before production.

## 5) Production setup (VPS)
1. Install Node.js LTS + Nginx + PM2.
2. Copy project files to server.
3. Create `.env` with a strong JWT secret:
   - `JWT_SECRET=CHANGE_TO_LONG_RANDOM_SECRET`
4. Install dependencies and run with PM2:
```bash
npm install
pm2 start src/server.js --name digitaleast
pm2 save
```
5. Configure Nginx reverse proxy to `localhost:3000`.
6. Enable SSL via Let's Encrypt (`certbot`).

## 6) Client handover checklist
- [ ] Change admin password.
- [ ] Set strong `JWT_SECRET`.
- [ ] Replace demo content (team/projects/blog).
- [ ] Connect real SMTP provider for lead emails.
- [ ] Replace demo images with final assets.
- [ ] Verify Arabic/English/Turkish content QA.
- [ ] Test contact flow + admin CRUD on production domain.

## 7) Rename GitHub repo to `Digital_East`
### Option A: GitHub UI
- Open repository settings on GitHub.
- Change repository name to: **Digital_East**.
- Save.

### Option B: GitHub CLI
```bash
gh repo rename Digital_East
```

After rename, update local remote URL:
```bash
git remote set-url origin <NEW_REPO_URL>
```

## 8) Recommended costs
- VPS: ~6$–12$/month.
- SSL: free (Let's Encrypt).
- DNS/CDN: free Cloudflare plan is enough initially.
- Business mail (optional): 1$–6$/mailbox.

Then open:
- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## Default admin
- user: `admin`
- pass: `Admin@2026!`

Change these and set `JWT_SECRET` before production.
