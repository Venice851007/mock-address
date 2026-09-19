/**
 * MiniSpaceX Address — static assets + light SEO redirects.
 * Generation is 100% client-side.
 */
const REDIRECT_MAP = {
  "/usa-address": "/usa-address/",
  "/hk-address": "/hk-address/",
  "/uk-address": "/uk-address/",
  "/de-address": "/de-address/",
  "/sg-address": "/sg-address/",
  "/jp-address": "/jp-address/",
  "/ca-address": "/ca-address/",
  "/in-address": "/in-address/",
  "/tw-address": "/tw-address/",
  "/mac-address": "/mac-address/",
  "/mac-address/vendor-lookup": "/mac-address/vendor-lookup/",
  "/help": "/help/",
  "/about": "/about/",
  "/privacy": "/privacy/",
  "/terms": "/terms/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const raw = url.pathname;
    // Only redirect when path has NO trailing slash (avoid loops)
    if (!raw.endsWith("/") && REDIRECT_MAP[raw]) {
      url.pathname = REDIRECT_MAP[raw];
      return Response.redirect(url.toString(), 301);
    }
    const res = await env.ASSETS.fetch(request);
    const headers = new Headers(res.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  },
};
