# Digital East – Delivery Plan (2026-ready)

## What has been built in this starter
- Multilingual public website (Arabic / English / Turkish).
- Modern responsive front-end (desktop/tablet/mobile).
- Lead form for service requests.
- Admin dashboard with login.
- CRUD for projects, team members, blog posts.
- Settings editor for hero and company info.
- SQLite database for fast MVP launch.

## Suggested sitemap
1. Home
2. Services
3. Portfolio
4. Team
5. Blog
6. Contact / Request Service
7. Admin (private)

## Security baseline included
- Password hashing with bcrypt.
- JWT auth in HTTP-only cookie.
- Helmet security headers.
- Protected admin APIs.

## What to improve next (Phase 2)
- Integrate SMTP for real email delivery from leads.
- Add role-based permissions (editor/admin).
- Add media library with image optimization.
- Add CSRF tokens and rate limiting.
- Add analytics dashboard for campaign KPIs.
- Add service pricing calculator and quotation PDF.

## Cost guidance
- Domain: already owned.
- VPS starter: ~6$ to 12$ monthly (Hetzner/Contabo range).
- Managed email (optional): 1$ to 6$ mailbox/month.
- CDN + DNS (optional): Cloudflare free plan can be enough initially.
- SSL: free via Let's Encrypt.

## Recommended stack for this use-case
- Runtime: Node.js + Express.
- DB: SQLite now, upgrade to PostgreSQL when traffic grows.
- Hosting: Linux VPS + PM2 + Nginx reverse proxy.

## Default admin credentials
- Username: `admin`
- Password: `Admin@2026!`

> Change credentials and JWT secret before production deployment.


## Repository naming
- Recommended repo name: `Digital_East`.
- GitHub Pages entry point is now root `index.html`.
