#!/usr/bin/env node
/**
 * Build-time validator for the PH dataset.
 * Cross-checks every shipped record (street + city + 4-digit ZIP) against
 * free public APIs, then caches nothing — results are reviewed by a human
 * and fixes go back into scripts/generate-data.mjs.
 *
 *  - Nominatim (OSM): street exists in city? postcode matches?
 *  - Zippopotam: does the ZIP exist in PH, and where?
 *
 * Usage: node scripts/validate-ph.mjs [--limit N]
 * Respects Nominatim usage policy: 1 req/sec, descriptive User-Agent.
 */
import { readFileSync } from "node:fs";

const UA = "mock-address-validator/1.0 (https://address.minispacex.com/; build-time dataset check)";
const SLEEP_MS = 1100;
const limit = Number(process.argv.find((a) => a.startsWith("--limit"))?.split("=")[1]) || Infinity;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return { ok: false, status: res.status };
  return { ok: true, data: await res.json() };
}
const normZip = (z) => String(z || "").replace(/\D/g, "").slice(0, 4);

// Load the shipped artifact (what users actually get)
const window = {};
const src = readFileSync(new URL("../public/data/ph.js", import.meta.url), "utf8");
eval(src);
const records = window.MSA_DATA.ph.addresses.slice(0, limit);
console.log(`Validating ${records.length} PH records...\n`);

const zipCache = new Map();
async function checkZip(zip) {
  if (zipCache.has(zip)) return zipCache.get(zip);
  const r = await get(`https://api.zippopotam.us/ph/${zip}`);
  const info = !r.ok
    ? { ok: false, note: `HTTP ${r.status}` }
    : { ok: true, places: r.data.places?.map((p) => p["place name"]).join(" / ") || "?" };
  zipCache.set(zip, info);
  await sleep(300);
  return info;
}

const results = [];
for (const [i, rec] of records.entries()) {
  const streetName = rec.street.replace(/^\d+\s+/, ""); // strip synthetic house number
  const q = new URLSearchParams({
    street: streetName, city: rec.city, country: "Philippines",
    format: "json", addressdetails: "1", limit: "3",
  });
  const r = await get(`https://nominatim.openstreetmap.org/search?${q}`);
  let verdict = "NOT_FOUND", detail = "";
  if (r.ok && r.data.length) {
    const zips = [...new Set(r.data.map((d) => normZip(d.address?.postcode)).filter(Boolean))];
    const match = zips.includes(rec.zip);
    verdict = match ? "PASS" : "ZIP_MISMATCH";
    detail = `osm_zips=[${zips.join(",") || "none"}] top=${r.data[0].display_name.slice(0, 80)}`;
  } else if (r.ok) {
    detail = "no results";
  } else {
    verdict = "API_ERROR"; detail = `HTTP ${r.status}`;
  }
  const zc = await checkZip(rec.zip);
  const zipNote = zc.ok ? `zip_ok(${zc.places.slice(0, 40)})` : `zip_bad(${zc.note})`;
  results.push({ i, street: rec.street, barangay: rec.barangay, city: rec.city, zip: rec.zip, verdict, detail, zipNote });
  await sleep(SLEEP_MS);
  if ((i + 1) % 20 === 0) console.log(`  ... ${i + 1}/${records.length}`);
}

console.log("\n=== SUMMARY ===");
for (const v of ["PASS", "ZIP_MISMATCH", "NOT_FOUND", "API_ERROR"]) {
  const n = results.filter((r) => r.verdict === v).length;
  console.log(`${v}: ${n}`);
}
console.log("\n=== NEEDS REVIEW ===");
for (const r of results.filter((r) => r.verdict !== "PASS")) {
  console.log(`[${r.verdict}] ${r.street}, ${r.barangay}, ${r.city} ${r.zip} | ${r.detail} | ${r.zipNote}`);
}
