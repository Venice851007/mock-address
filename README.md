# MiniSpaceX Address

Multi-region **mock address** + **MAC** sample generators for **development / form validation**.

Live: [https://address.minispacex.com](https://address.minispacex.com)

> **Disclaimer:** Fictional / curated **测试样例** (sample test data) only. Not real identity. Do not use for fraud or platform ToS violations. No government endorsement.

## Pages

| Path | Tool |
|------|------|
| `/` | US tax-free states (AK DE MT NH OR) |
| `/usa-address/` | All US states samples |
| `/hk-address/` | Hong Kong (ZH/EN) |
| `/uk-address/` | United Kingdom |
| `/de-address/` | Germany |
| `/sg-address/` | Singapore |
| `/jp-address/` | Japan |
| `/ca-address/` | Canada |
| `/in-address/` | India |
| `/tw-address/` | Taiwan |
| `/mac-address/` | MAC generator |
| `/mac-address/vendor-lookup/` | MAC OUI vendor lookup |
| `/help/` `/about/` `/privacy/` `/terms/` | Stubs |

## US geographic samples

US / tax-free generators prefer **larger open geographic extracts** so street+city+ZIP combinations are more often findable on maps (similar idea to public mock-address tools — **not** a scrape of any proprietary DB):

- **Source:** U.S. Census Bureau [TIGER/Line ADDRFEAT](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) (public domain) street names + ZIP + address *ranges*
- **City names:** [GeoNames](https://www.geonames.org/) postal dump (CC-BY)
- **House numbers:** randomized within the Census range at generation time (not a resident roster)
- Names / phone / SSN / cards remain **synthetic format-only**

Approximate shipped counts (may vary by rebuild):

| Dataset | Records (street×city×ZIP) | Raw JS | ~gzip |
|---------|---------------------------|--------|-------|
| Tax-free AK/DE/MT/NH/OR | ~17,500 (~3.5k/state) | ~0.75 MB | ~175 KB |
| Nationwide `us` | ~55k+ (incl. CT curated fallback) | ~2.5 MB | ~0.5 MB |

Rebuild US extracts (needs prior TIGER zips + GeoNames `US.txt` under `$OA_CACHE`, default `/tmp/oa-build`):

```bash
npm run data:us
```

Other regions: `npm run data` (does **not** overwrite US TIGER assets).

## Features

- Client-side street/city samples per region
- Optional test profile + TEST Luhn-looking card (clearly fake)
- Save to localStorage · export JSON/CSV · ZH/EN UI
- Light utilitarian SEO layout: unique title/description/H1/FAQ, breadcrumbs, footer link matrix, canonical URLs
- Not a pixel clone of any third-party site; original copy

## Stack

Cloudflare Worker + static assets (`public/`). Generation is 100% in-browser.

## Develop / deploy

```bash
export PATH="/home/box/.local/node-v22.19.0-linux-x64/bin:$PATH"
export WRANGLER_CACHE_DIR=/tmp/wrangler-cache
npm install
npm run pages   # or: npm run build
npm run dev     # or
npm run deploy
```

Custom domain: `address.minispacex.com` (see `wrangler.toml`).

## License

MIT — original code; geographic extracts retain upstream terms (Census public domain; GeoNames CC-BY). Not affiliated with any third-party mock-address brand.
