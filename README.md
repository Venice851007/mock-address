# 美区测试地址生成器 · MiniSpaceX Address

Client-side mock US address generator for **sales-tax-free states**: **AK, DE, MT, NH, OR**.

> **Disclaimer:** Fictional test / form-validation sample data only. Not real identity documents. Do not use for fraud or platform ToS violations.

Live: [https://address.minispacex.com](https://address.minispacex.com) · Worker fallback: `https://mock-address.<account>.workers.dev`

## Features

- Generate name, street, city, state, ZIP, phone
- Optional fake profile (DOB, occupation) and **TEST** Luhn-looking card (clearly labeled fake)
- Curated sample street/city/ZIP lists per state (hundreds of rows; client-side)
- Copy one field / copy all · export JSON / CSV · batch N rows
- ZH / EN toggle
- SEO lite for 免税州地址 / 测试地址

## Stack

- Cloudflare Worker + static assets (`public/`)
- 100% client-side generation (free-tier friendly)

## Local development

```bash
export PATH="/home/box/.local/node-v22.19.0-linux-x64/bin:$PATH"  # or any Node 22+
export WRANGLER_CACHE_DIR=/tmp/wrangler-cache
npm install
npm run dev
```

Open the URL printed by `wrangler dev`.

## Deploy

```bash
export WRANGLER_CACHE_DIR=/tmp/wrangler-cache
npx wrangler deploy
```

`wrangler.toml` binds custom domain **address.minispacex.com** via:

```toml
[[routes]]
pattern = "address.minispacex.com"
custom_domain = true
```

Cloudflare Worker custom domains usually auto-create the DNS record on zone `minispacex.com`.

## DNS (only if custom_domain attach fails)

If the Worker custom domain does not appear:

1. Confirm zone **minispacex.com** is Active on the same CF account as the Worker.
2. In Workers → mock-address → Settings → Domains & Routes → add `address.minispacex.com`.
3. Or add a CNAME: `address` → `<worker>.<subdomain>.workers.dev` (proxied / orange cloud).

NS for the zone (reference): `ned.ns.cloudflare.com`, `sureena.ns.cloudflare.com`.

## License

MIT — original code; not affiliated with any third-party mock-address brand.
