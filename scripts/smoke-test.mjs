#!/usr/bin/env node
// Smoke test: run every page's generator in a stubbed DOM, verify
// firstName/lastName are present and the rendered card contains 姓/名 fields.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const APP = readFileSync("public/js/app.js", "utf8");
const DATA_FILES = {
  taxfree: ["common", "us-taxfree"], usa: ["common", "us"],
  hk: ["hk"], uk: ["uk"], de: ["de"], sg: ["sg"], jp: ["jp"],
  ca: ["ca"], in: ["in"], tw: ["tw"], ph: ["ph"],
};

function makeCtx(page) {
  const els = {};
  const el = (id) => (els[id] ||= {
    id, value: id === "count" ? "3" : "", checked: true,
    innerHTML: "", textContent: "",
    addEventListener(evt, fn) { this["on" + evt] = fn; },
    getAttribute: () => null, classList: { add() {}, remove() {} },
  });
  const handlers = {};
  const sandbox = {
    console,
    navigator: {},
    localStorage: { _m: new Map(),
      getItem(k) { return this._m.get(k) ?? null; },
      setItem(k, v) { this._m.set(k, v); } },
    document: {
      readyState: "complete",
      documentElement: { lang: "", setAttribute() {}, getAttribute: () => null },
      body: { getAttribute: (n) => (n === "data-page" ? page : null), addEventListener() {} },
      getElementById: (id) => {
        if (id === "btnGen") return { addEventListener: (e, fn) => (handlers.gen = fn) };
        if (id === "results") return el(id);
        if (["optProfile", "optCard", "count", "region", "hkLang"].includes(id)) return el(id);
        return null;
      },
      createElement: () => ({ style: {}, appendChild() {}, remove() {}, select() {} }),
      addEventListener() {},
      execCommand: () => true,
      querySelectorAll: () => [],
      querySelector: () => null,
    },
    window: {},
  };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const f of DATA_FILES[page]) {
    vm.runInContext(readFileSync(`public/data/${f}.js`, "utf8"), ctx);
  }
  // data files assign window.MSA_DATA via `window` — our sandbox.window === sandbox
  vm.runInContext(APP, ctx);
  return { ctx, els, handlers };
}

let fail = 0;
for (const page of Object.keys(DATA_FILES)) {
  try {
    const { els, handlers } = makeCtx(page);
    if (!handlers.gen) throw new Error("btnGen not bound");
    handlers.gen(); // run generate() with count=3, profile+card on
    const html = els["results"].innerHTML;
    const checks = [
      ["card rendered", html.includes("field-grid")],
      ["姓 label", html.includes(">姓<")],
      ["名 label", html.includes(">名<")],
      ["no undefined", !html.includes("undefined")],
    ];
    const bad = checks.filter(([, ok]) => !ok).map(([n]) => n);
    if (bad.length) { fail++; console.log(`FAIL ${page}: ${bad.join(", ")}`); }
    else console.log(`ok   ${page}`);
  } catch (e) { fail++; console.log(`ERROR ${page}: ${e.message}`); }
}
process.exit(fail ? 1 : 0);
