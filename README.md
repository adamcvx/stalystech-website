# StalysTech Website

Static, Netlify-ready website built around the supplied StalysTech brand assets.

## Deploy to Netlify

1. Create a GitHub repository named `stalystech-website`.
2. Upload everything in this folder to the repository root.
3. In Netlify, choose **Add new project → Import an existing project**.
4. Select GitHub and the `stalystech-website` repository.
5. Netlify should require no build command. The publish directory is `.`.
6. Deploy the site.

The contact form uses Netlify Forms and will be detected at deploy time.

## Files

- `index.html` — site content
- `styles.css` — responsive visual design
- `script.js` — navigation/header behavior
- `netlify.toml` — Netlify configuration and security headers
- `assets/` — supplied StalysTech images

## Before going live

Product purchase buttons are wired to Paddle Checkout through `paddle-config.js`. See `SETUP_COMMERCE_CONTACT.md` for Paddle, n8n fulfillment, and contact setup.
