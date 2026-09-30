# MiniSpaceX Address

[![Live](https://img.shields.io/badge/demo-address.minispacex.com-22d3ee)](https://address.minispacex.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![No API keys](https://img.shields.io/badge/API_keys-none_needed-blue)](https://address.minispacex.com/)

Multi-region **mock address** + **MAC** sample generators for **development / form validation**.
100% client-side — no backend, no tracking, no API keys.

🌐 **Live:** [https://address.minispacex.com](https://address.minispacex.com)
⭐ Star this repo if it saves you time writing test fixtures!

> **Disclaimer:** Fictional / curated **测试样例** (sample test data) only. Not real identities.
> Do not use for fraud or platform ToS violations. No government endorsement.

## Features

- 12 generators: US tax-free states, all US states, HK, UK, DE, SG, JP, CA, IN, TW, PH + MAC
- Compact result cards — short fields share a row, every field has its own **copy button**
- 姓 / 名 (last / first name) as separate fields
- Optional test profile (DOB + occupation) and TEST Luhn-looking card (clearly fake, not chargeable)
- Copy all · save to localStorage · export JSON/CSV · ZH/EN UI
- SEO-friendly static pages: unique title/description/H1/FAQ, breadcrumbs, sitemap

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
| `/ph-address/` | Philippines — real street + barangay + 4-digit ZIP samples |
| `/mac-address/` | MAC generator |
| `/mac-address/vendor-lookup/` | MAC OUI vendor lookup |
| `/help/` `/about/` `/privacy/` `/terms/` | Info pages |

## Data sources & free APIs

**No API keys. No runtime API calls.** Generation happens entirely in the browser from
pre-built static files. External APIs are used **only at build time** to validate curated data:

| API | Key? | What we use it for |
|-----|------|--------------------|
| [Nominatim](https://nominatim.openstreetmap.org/) (OpenStreetMap) | No — 1 req/sec, descriptive User-Agent | Validates PH street + city + ZIP combos (`scripts/validate-ph.mjs`) |
| [Zippopotam](https://www.zippopotam.us/) | No | Validates PH 4-digit ZIPs exist and match the city |
| [Photon](https://photon.komoot.io/) (Komoot, OSM-based) | No | Available fallback for build-time checks |

By region:

- **US / tax-free states** — street names, ZIPs and address ranges from U.S. Census Bureau
  [TIGER/Line ADDRFEAT](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
  (public domain); city names from [GeoNames](https://www.geonames.org/) postal dump (CC-BY).
  Built offline via `scripts/build-us-tiger.py`. House numbers are randomized within Census ranges.
- **Philippines** — hand-curated real streets + barangay + 4-digit ZIPs (Metro Manila, Cebu, Davao,
  Iloilo, Bacolod, Baguio, CDO, Zamboanga, GenSan, Angeles, Lipa). Every record is cross-checked
  against Nominatim + Zippopotam at build time; fixes go back into `scripts/generate-data.mjs`.
- **HK / UK / DE / SG / JP / CA / IN / TW** — hand-curated real area/street samples in
  `scripts/generate-data.mjs` (not scraped live).
- **Names, phone numbers, DOB, occupations, card numbers** are synthetic test values everywhere.

Approximate shipped counts (may vary by rebuild):

| Dataset | Records (street×city×ZIP) | Raw JS | ~gzip |
|---------|---------------------------|--------|-------|
| Tax-free AK/DE/MT/NH/OR | ~17,500 (~3.5k/state) | ~0.75 MB | ~175 KB |
| Nationwide `us` | ~55k+ (incl. CT curated fallback) | ~2.5 MB | ~0.5 MB |

## Develop

```bash
npm install
npm run build        # build data + pages into public/
npm run dev          # local preview (see package.json)

# data pipelines
npm run data         # rebuild curated regions (does NOT overwrite US TIGER assets)
npm run data:us      # rebuild US extracts (needs TIGER zips + GeoNames US.txt under $OA_CACHE)

# quality checks
node scripts/validate-ph.mjs   # cross-check PH dataset vs Nominatim + Zippopotam (~3 min)
node scripts/smoke-test.mjs     # run every page's generator in a stubbed DOM
```

Deploys automatically via **Cloudflare Workers Builds** on push to `main`
(see `wrangler.toml`). Custom domain: `address.minispacex.com`.

## Contributing

Found a wrong street/ZIP combo? PRs welcome — add the fix to `scripts/generate-data.mjs`
(or run `node scripts/validate-ph.mjs` for PH first), then `npm run build`.

## License

[MIT](LICENSE) — original code. Geographic extracts retain upstream terms
(Census: public domain; GeoNames: CC-BY). Not affiliated with any third-party
mock-address brand.
