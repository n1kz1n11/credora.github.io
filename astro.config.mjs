import { defineConfig } from 'astro/config';

const runtimeProcess = /** @type {{ env?: Record<string, string | undefined> } | undefined} */ (Reflect.get(globalThis, 'process'));
const rawSite = runtimeProcess?.env?.PUBLIC_SITE_URL?.trim();
let site;
if (rawSite) {
  try {
    const parsedSite = new URL(rawSite);
    if (parsedSite.protocol === 'https:') site = parsedSite.origin;
  } catch {
    // Leave site unset for an invalid value; canonical URLs must never be guessed.
  }
}

export default defineConfig({
  // Set PUBLIC_SITE_URL to the final HTTPS origin before publishing.
  ...(site ? { site } : {}),
  trailingSlash: 'always',
});
