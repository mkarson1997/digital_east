# Digital East

[![Quality](https://github.com/mkarson1997/digital_east/actions/workflows/quality.yml/badge.svg)](https://github.com/mkarson1997/digital_east/actions/workflows/quality.yml)

A responsive Arabic RTL marketing-agency website built as a multi-page static web experience and deployed with GitHub Pages.

**Live demo:** https://mkarson1997.github.io/Digital_East/

## Project overview

Digital East is structured as a complete business website rather than a single landing page. It includes service discovery, portfolio content, blog content, contact flows, company information and legal pages.

The project focuses on building a polished Arabic-first interface while keeping the deployment simple and portable.

## Highlights

- Arabic RTL interface
- Responsive multi-page layout
- Agency landing page and conversion-oriented calls to action
- Dedicated service pages
- Portfolio and project sections
- Blog structure
- About and contact pages
- Privacy and terms pages
- Custom 404 page
- SEO-oriented page titles and metadata
- Reusable visual system and shared assets
- GitHub Pages deployment
- Automated local-reference validation in GitHub Actions

## Site structure

```text
Digital East
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── blog.html
├── contact.html
├── privacy.html
├── terms.html
├── 404.html
├── services/
├── portfolio/
├── blog/
├── partials/
└── assets/
    ├── css/
    ├── js/
    └── images/
```

## Engineering focus

Although this is a static site, the repository demonstrates several production-facing front-end concerns:

- designing for right-to-left reading order,
- keeping a consistent visual system across many pages,
- building reusable navigation and content patterns,
- responsive behavior across mobile and desktop layouts,
- search-friendly metadata,
- clear information architecture for a service business,
- zero-server deployment through GitHub Pages,
- validating internal assets and links automatically on every push/PR.

## Tech stack

- HTML5
- CSS3
- JavaScript
- Python 3.12 for repository validation
- RTL / Arabic web design
- Responsive design
- GitHub Actions
- GitHub Pages

## Quality gate

`.github/workflows/quality.yml` runs `scripts/validate_static.py` on pushes and pull requests to `main`.

The validator scans the repository's HTML files, parses local `href`/`src` references and fails when a path escapes the repository or points to a missing local file.

Run the same check locally:

```bash
python scripts/validate_static.py
```

This gives the static site a repeatable engineering gate rather than relying only on manual clicking after changes.

## Run locally

Because the site uses project-relative routes, the most reliable local preview is through a small static server.

With Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

For the deployed version use the live GitHub Pages URL above.

## Open-source workflow

The repository includes:

- `SECURITY.md` for vulnerability reporting,
- `CONTRIBUTING.md` for contribution expectations,
- a pull-request checklist,
- GitHub Actions quality validation,
- tracked issues for the next accessibility/performance improvements.

## Roadmap

- Add automated accessibility auditing for representative pages
- Improve keyboard navigation and focus behavior
- Add image optimization and performance budgets
- Add automated Lighthouse checks
- Add structured data where appropriate
- Evolve shared page fragments toward a maintainable build-time component pipeline if the project grows

## Portfolio note

This project is part of my public software portfolio and demonstrates Arabic RTL front-end implementation, multi-page information architecture, static deployment and automated quality checks.

---

Built by [Mahmoud Karzoun](https://github.com/mkarson1997).