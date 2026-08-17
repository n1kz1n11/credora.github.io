import type { APIRoute } from 'astro';

const pages = ['', 'loans/', 'cards/', 'privacy/', 'terms/', 'contacts/'];

export const GET: APIRoute = ({ site }) => {
  // An XML sitemap requires absolute URLs. It remains intentionally empty until
  // PUBLIC_SITE_URL is configured, instead of publishing a made-up domain.
  const urls = site ? pages.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
