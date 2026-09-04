# Digital East

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
- zero-server deployment through GitHub Pages.

## Tech stack

- HTML5
- CSS3
- JavaScript
- RTL / Arabic web design
- Responsive design
- GitHub Pages

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

## Roadmap

- Add automated HTML/link validation
- Improve accessibility auditing and keyboard navigation
- Add a build-time reusable component pipeline for shared page fragments
- Add image optimization and performance budgets
- Add structured data where appropriate
- Add automated Lighthouse checks

## Portfolio note

This project is part of my public software portfolio and demonstrates Arabic RTL front-end implementation, multi-page information architecture and static deployment.

---

Built by [Mahmoud Karzoun](https://github.com/mkarson1997).