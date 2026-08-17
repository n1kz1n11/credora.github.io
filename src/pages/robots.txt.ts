import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapLine = site ? `\nSitemap: ${new URL('/sitemap.xml', site).href}` : '\n# TODO: configure PUBLIC_SITE_URL to publish an absolute sitemap URL.';
  return new Response(`User-agent: *\nAllow: /${sitemapLine}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
