# MiniSpaceX Address

Multi-region **mock address** + **MAC** sample generators for **development / form validation**.

Live: [https://address.minispacex.com](https://address.minispacex.com)

> **Disclaimer:** Fictional / curated sample test data only. Not real IDs. Do not use for fraud or platform ToS violations.

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

## Features

- Client-side curated street/city samples per region
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
npm run build
npm run dev    # or
npm run deploy
```

Custom domain: `address.minispacex.com` (see `wrangler.toml`).

## License

MIT — original code; not affiliated with any third-party mock-address brand.
