/**
 * Global HTTP/HTTPS proxy support for Node.js fetch.
 *
 * Node.js native fetch (undici) does not respect HTTPS_PROXY/HTTP_PROXY
 * environment variables by default. This module sets up a global proxy
 * dispatcher when these variables are present.
 */

import { ProxyAgent, setGlobalDispatcher } from "undici";

let initialized = false;

/**
 * Initialize global proxy if HTTPS_PROXY or HTTP_PROXY is set.
 * Safe to call multiple times - only initializes once.
 */
export function initGlobalProxy(): void {
  if (initialized) return;
  initialized = true;

  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.http_proxy;

  if (!proxyUrl) return;

  try {
    const agent = new ProxyAgent(proxyUrl);
    setGlobalDispatcher(agent);
    // Only log in debug mode to avoid noise
    if (process.env.DEBUG || process.env.OPENCLAW_DEBUG) {
      console.log(`[proxy] Global proxy configured: ${proxyUrl}`);
    }
  } catch (error) {
    console.error(
      `[proxy] Failed to configure proxy (${proxyUrl}):`,
      error instanceof Error ? error.message : error,
    );
  }
}
