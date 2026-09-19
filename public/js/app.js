/* MiniSpaceX Address — client-side generators. Test/form-validation only. */
(function () {
  "use strict";

  const PAGE = document.body.getAttribute("data-page") || "taxfree";
  const SAVE_KEY = "msa_saved_v1";

  const NAV = [
    { path: "/", id: "taxfree", zh: "美国免税州", en: "US Tax-Free" },
    { path: "/usa-address/", id: "usa", zh: "美国地址", en: "US Address" },
    { path: "/hk-address/", id: "hk", zh: "香港地址", en: "HK Address" },
    { path: "/uk-address/", id: "uk", zh: "英国地址", en: "UK Address" },
    { path: "/de-address/", id: "de", zh: "德国地址", en: "DE Address" },
    { path: "/sg-address/", id: "sg", zh: "新加坡地址", en: "SG Address" },
    { path: "/jp-address/", id: "jp", zh: "日本地址", en: "JP Address" },
    { path: "/ca-address/", id: "ca", zh: "加拿大地址", en: "CA Address" },
    { path: "/in-address/", id: "in", zh: "印度地址", en: "IN Address" },
    { path: "/tw-address/", id: "tw", zh: "台湾地址", en: "TW Address" },
    { path: "/mac-address/", id: "mac", zh: "MAC生成", en: "MAC Gen" },
    { path: "/mac-address/vendor-lookup/", id: "mac-vendor", zh: "MAC厂商", en: "MAC Vendor" },
  ];

  const I18N = {
    zh: {
      disclaimer: "⚠️ 本站仅提供虚构/样例测试数据，用于开发联调与表单校验。禁止用于欺诈、冒充身份或违反任何平台服务条款。",
      generate: "生成",
      copyAll: "复制全部",
      exportJson: "导出 JSON",
      exportCsv: "导出 CSV",
      clear: "清空结果",
      save: "保存本页结果",
      clearSaved: "清空已保存",
      count: "生成数量",
      withProfile: "包含测试档案（生日 / 职业）",
      withCard: "包含 TEST 假卡号（Luhn 格式 · 不可支付）",
      region: "地区 / 州",
      allRegions: "全部（随机）",
      results: "生成结果",
      saved: "已保存的样例（本机浏览器）",
      savedEmpty: "暂无保存。生成后点击「保存本页结果」。",
      name: "姓名",
      street: "街道",
      city: "城市",
      stateLabel: "州/省",
      zip: "邮编",
      phone: "电话",
      dob: "出生日期",
      occupation: "职业",
      card: "测试卡号",
      cardHint: "假卡 · 仅格式测试 · 不可支付",
      copyField: "复制",
      copied: "已复制",
      empty: "点击「生成」开始（样例测试数据）",
      sampleNote: "数据集为客户端精选样例，标签为测试用途，非官方邮政全库导出。",
      lang: "EN",
      home: "首页",
      footerTools: "工具导航",
      footerLegal: "说明与条款",
      format: "输出格式",
      vendor: "厂商 OUI（可选）",
      vendorAny: "随机 / 任意",
      macGen: "生成 MAC",
      lookup: "查询厂商",
      macInput: "MAC 或 OUI",
      ipv6: "IPv6 Link-Local",
      oui: "OUI",
      vendorName: "厂商",
      unknownVendor: "未在样例表中找到（可扩展本地 OUI 表）",
      unicast: "随机本地单播（U/L=1, I/G=0）",
      remove: "移除",
      hkLang: "地址语言",
      hkZh: "中文地址",
      hkEn: "英文地址",
    },
    en: {
      disclaimer: "⚠️ Fictional / sample test data only — for form validation & QA. Do not use for fraud, impersonation, or ToS violations.",
      generate: "Generate",
      copyAll: "Copy all",
      exportJson: "Export JSON",
      exportCsv: "Export CSV",
      clear: "Clear results",
      save: "Save results",
      clearSaved: "Clear saved",
      count: "Count",
      withProfile: "Test profile (DOB / occupation)",
      withCard: "TEST fake card (Luhn-looking · not chargeable)",
      region: "Region / State",
      allRegions: "All (random)",
      results: "Results",
      saved: "Saved samples (this browser)",
      savedEmpty: "Nothing saved yet. Generate, then click Save.",
      name: "Name",
      street: "Street",
      city: "City",
      stateLabel: "State/Province",
      zip: "Postal / ZIP",
      phone: "Phone",
      dob: "Date of birth",
      occupation: "Occupation",
      card: "Test card",
      cardHint: "Fake · format test only · not chargeable",
      copyField: "Copy",
      copied: "Copied",
      empty: "Click Generate to start (sample test data)",
      sampleNote: "Curated client-side samples for testing — not an official postal dump.",
      lang: "中文",
      home: "Home",
      footerTools: "Tools",
      footerLegal: "Legal",
      format: "Format",
      vendor: "Vendor OUI (optional)",
      vendorAny: "Random / any",
      macGen: "Generate MAC",
      lookup: "Lookup vendor",
      macInput: "MAC or OUI",
      ipv6: "IPv6 Link-Local",
      oui: "OUI",
      vendorName: "Vendor",
      unknownVendor: "Not found in sample OUI table",
      unicast: "Random local unicast (U/L=1, I/G=0)",
      remove: "Remove",
      hkLang: "Address language",
      hkZh: "Chinese",
      hkEn: "English",
    },
  };

  let lang = localStorage.getItem("msa_lang") || "zh";
  let results = [];

  function t(k) {
    return (I18N[lang] && I18N[lang][k]) || I18N.zh[k] || k;
  }
  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }
  function pad(n, w) {
    return String(n).padStart(w, "0");
  }
  function D(key) {
    return (window.MSA_DATA && window.MSA_DATA[key]) || null;
  }
  function common() {
    return D("common") || { firstNames: ["Alex"], lastNames: ["Test"], occupations: ["Tester"], aptUnits: [""] };
  }

  function fakeCard() {
    let body = "4111";
    for (let i = 0; i < 11; i++) body += String(randInt(0, 9));
    let sum = 0, alt = true;
    for (let i = body.length - 1; i >= 0; i--) {
      let n = parseInt(body[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    const check = (10 - (sum % 10)) % 10;
    const full = body + String(check);
    return full.replace(/(.{4})/g, "$1 ").trim();
  }
  function fakeDob() {
    return `${randInt(1968, 2003)}-${pad(randInt(1, 12), 2)}-${pad(randInt(1, 28), 2)}`;
  }
  function attachOpts(row, opts) {
    if (opts.profile) {
      row.dob = fakeDob();
      row.occupation = pick(common().occupations);
    }
    if (opts.card) {
      row.card = fakeCard();
      row.cardLabel = "TEST / Luhn fake — not chargeable";
    }
    return row;
  }

  /* ---------- Generators ---------- */
  function genUS(taxFreeOnly, statePref, opts) {
    const pack = taxFreeOnly ? D("us-taxfree") : D("us");
    if (!pack) return { error: "data missing" };
    const codes = taxFreeOnly
      ? pack.taxFreeCodes
      : Object.keys(pack.states);
    const code = statePref && pack.states[statePref] ? statePref : pick(codes);
    const st = pack.states[code];
    const addr = pick(st.addresses);
    const apt = pick(common().aptUnits);
    const street = apt ? `${addr.street}, ${apt}` : addr.street;
    const c = common();
    return attachOpts({
      name: `${pick(c.firstNames)} ${pick(c.lastNames)}`,
      street, city: addr.city, state: code, stateName: st.name,
      zip: addr.zip,
      phone: `(${pick(st.areaCodes)}) ${randInt(200, 999)}-${pad(randInt(0, 9999), 4)}`,
      country: "US",
    }, opts);
  }

  function genHK(opts) {
    const pack = D("hk");
    const a = pick(pack.addresses);
    const useEn = document.getElementById("hkLang") && document.getElementById("hkLang").value === "en";
    const name = useEn
      ? `${pick(pack.firstNamesEn)} ${pick(pack.lastNamesEn)}`
      : `${pick(pack.lastNamesZh)}${pick(pack.firstNamesZh)}`;
    const street = useEn
      ? `${a.floorUnitEn}, ${a.streetEn}, ${a.districtEn}, ${a.regionEn}`
      : `${a.region}${a.district}${a.streetZh}${a.floorUnitZh}`;
    return attachOpts({
      name, street,
      city: useEn ? a.districtEn : a.district,
      state: useEn ? a.regionEn : a.region,
      stateName: useEn ? a.regionEn : a.region,
      zip: a.postal,
      phone: `+852 ${pick(pack.areaCodes)}${randInt(100, 9999)} ${pad(randInt(0, 9999), 4)}`,
      country: "HK",
    }, opts);
  }

  function genUK(opts) {
    const pack = D("uk");
    const a = pick(pack.addresses);
    return attachOpts({
      name: `${pick(pack.firstNames)} ${pick(pack.lastNames)}`,
      street: a.street, city: a.city, state: a.region, stateName: a.region,
      zip: a.postcode,
      phone: `+44 ${pick(pack.areaCodes)} ${randInt(1000, 9999)} ${pad(randInt(0, 9999), 4)}`,
      country: "GB",
    }, opts);
  }

  function genDE(opts) {
    const pack = D("de");
    const a = pick(pack.addresses);
    return attachOpts({
      name: `${pick(pack.firstNames)} ${pick(pack.lastNames)}`,
      street: a.street, city: a.city, state: "", stateName: "Germany",
      zip: a.zip,
      phone: `+49 ${randInt(30, 89)}${randInt(1000000, 9999999)}`,
      country: "DE",
    }, opts);
  }

  function genSG(opts) {
    const pack = D("sg");
    const a = pick(pack.addresses);
    return attachOpts({
      name: `${pick(pack.firstNames)} ${pick(pack.lastNames)}`,
      street: a.street, city: a.city, state: a.area, stateName: a.area,
      zip: a.zip,
      phone: `+65 ${randInt(8000, 9999)} ${pad(randInt(0, 9999), 4)}`,
      country: "SG",
    }, opts);
  }

  function genJP(opts) {
    const pack = D("jp");
    const a = pick(pack.addresses);
    const useEn = lang === "en";
    return attachOpts({
      name: `${pick(pack.lastNames)} ${pick(pack.firstNames)}`,
      street: useEn ? `${a.zip} ${a.prefEn} ${a.cityEn} ${a.streetEn}` : `〒${a.zip} ${a.pref}${a.city}${a.streetZh}`,
      city: useEn ? a.cityEn : a.city,
      state: useEn ? a.prefEn : a.pref,
      stateName: useEn ? a.prefEn : a.pref,
      zip: a.zip,
      phone: `+81 ${randInt(3, 90)}-${randInt(1000, 9999)}-${pad(randInt(0, 9999), 4)}`,
      country: "JP",
    }, opts);
  }

  function genCA(opts) {
    const pack = D("ca");
    const a = pick(pack.addresses);
    return attachOpts({
      name: `${pick(pack.firstNames)} ${pick(pack.lastNames)}`,
      street: a.street, city: a.city, state: a.province, stateName: a.provinceName,
      zip: a.postal,
      phone: `+1 (${pick(pack.areaCodes)}) ${randInt(200, 999)}-${pad(randInt(0, 9999), 4)}`,
      country: "CA",
    }, opts);
  }

  function genIN(opts) {
    const pack = D("in");
    const a = pick(pack.addresses);
    return attachOpts({
      name: `${pick(pack.firstNames)} ${pick(pack.lastNames)}`,
      street: a.street, city: a.city, state: a.state, stateName: a.state,
      zip: a.pin,
      phone: `+91 ${pick(pack.areaCodes)}${randInt(10000000, 99999999)}`,
      country: "IN",
    }, opts);
  }

  function genTW(opts) {
    const pack = D("tw");
    const a = pick(pack.addresses);
    const useEn = lang === "en";
    return attachOpts({
      name: `${pick(pack.lastNames)}${pick(pack.firstNames)}`,
      street: useEn
        ? `${a.streetEn}, ${a.districtEn}, ${a.cityEn} ${a.zip}`
        : `${a.city}${a.district}${a.streetZh}`,
      city: useEn ? a.cityEn : a.city,
      state: useEn ? a.districtEn : a.district,
      stateName: useEn ? a.cityEn : a.city,
      zip: a.zip,
      phone: `+886 9${randInt(10000000, 99999999)}`,
      country: "TW",
    }, opts);
  }

  /* ---------- MAC ---------- */
  function normalizeMac(s) {
    return String(s || "").replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
  }
  function formatMac(hex, fmt) {
    const h = hex.padEnd(12, "0").slice(0, 12);
    if (fmt === "hyphen") return h.replace(/(.{2})(?=.)/g, "$1-");
    if (fmt === "dot") return h.slice(0, 4) + "." + h.slice(4, 8) + "." + h.slice(8, 12);
    if (fmt === "plain") return h;
    return h.replace(/(.{2})(?=.)/g, "$1:");
  }
  function macToIpv6(hex) {
    const h = normalizeMac(hex).padEnd(12, "0").slice(0, 12);
    let b = parseInt(h.slice(0, 2), 16) ^ 0x02;
    const eui = pad(b.toString(16), 2) + h.slice(2, 6) + "fffe" + h.slice(6, 12);
    const parts = [];
    for (let i = 0; i < 16; i += 4) parts.push(eui.slice(i, i + 4));
    return "fe80::" + parts.join(":").replace(/:0+/g, ":").replace(/::+/g, "::");
  }
  function lookupOui(hex) {
    const pack = D("mac-oui");
    if (!pack) return null;
    const o = normalizeMac(hex).slice(0, 6);
    const hit = pack.vendors.find((v) => v.oui === o);
    return hit || null;
  }
  function randomUnicastMac(ouiPref) {
    let bytes;
    if (ouiPref && /^[0-9A-Fa-f]{6}$/.test(ouiPref)) {
      bytes = ouiPref.toUpperCase().match(/.{2}/g).map((x) => parseInt(x, 16));
      bytes.push(randInt(0, 255), randInt(0, 255), randInt(0, 255));
    } else {
      bytes = [0, 0, 0, 0, 0, 0].map(() => randInt(0, 255));
      bytes[0] = (bytes[0] | 0x02) & 0xfe; // locally administered, unicast
    }
    return bytes.map((b) => pad(b.toString(16), 2)).join("").toUpperCase();
  }
  function genMac() {
    const fmt = (document.getElementById("macFmt") || {}).value || "colon";
    const vendorSel = (document.getElementById("macVendor") || {}).value || "";
    const hex = randomUnicastMac(vendorSel || null);
    const hit = lookupOui(hex);
    return {
      mac: formatMac(hex, fmt),
      macRaw: hex,
      oui: hex.slice(0, 6),
      vendor: hit ? hit.vendor : t("unknownVendor"),
      ipv6: macToIpv6(hex),
      format: fmt,
    };
  }

  function generateOne() {
    const opts = {
      profile: !!(document.getElementById("optProfile") || {}).checked,
      card: !!(document.getElementById("optCard") || {}).checked,
    };
    const region = (document.getElementById("region") || {}).value || "";
    switch (PAGE) {
      case "taxfree": return genUS(true, region, opts);
      case "usa": return genUS(false, region, opts);
      case "hk": return genHK(opts);
      case "uk": return genUK(opts);
      case "de": return genDE(opts);
      case "sg": return genSG(opts);
      case "jp": return genJP(opts);
      case "ca": return genCA(opts);
      case "in": return genIN(opts);
      case "tw": return genTW(opts);
      case "mac": return genMac();
      default: return null;
    }
  }

  function generate() {
    if (PAGE === "mac-vendor") return doLookup();
    const countEl = document.getElementById("count");
    const count = Math.min(100, Math.max(1, parseInt((countEl || {}).value, 10) || 1));
    results = [];
    for (let i = 0; i < count; i++) {
      const row = generateOne();
      if (row) results.push(row);
    }
    render();
  }

  function doLookup() {
    const input = (document.getElementById("macInput") || {}).value || "";
    const hex = normalizeMac(input);
    if (hex.length < 6) {
      results = [{ error: lang === "zh" ? "请输入至少 6 位十六进制（OUI）或完整 MAC" : "Enter at least 6 hex digits (OUI) or a full MAC" }];
      render();
      return;
    }
    const hit = lookupOui(hex);
    const full = hex.padEnd(12, "0").slice(0, 12);
    results = [{
      mac: formatMac(full, "colon"),
      macHyphen: formatMac(full, "hyphen"),
      macDot: formatMac(full, "dot"),
      macPlain: formatMac(full, "plain"),
      oui: hex.slice(0, 6),
      vendor: hit ? hit.vendor : t("unknownVendor"),
      ipv6: macToIpv6(full),
      found: !!hit,
    }];
    render();
  }

  /* ---------- Render ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function formatBlock(r) {
    if (r.error) return r.error;
    if (r.mac) {
      let s = `MAC: ${r.mac}\nOUI: ${r.oui}\nVendor: ${r.vendor}`;
      if (r.ipv6) s += `\nIPv6 LL: ${r.ipv6}`;
      if (r.macHyphen) s += `\nHyphen: ${r.macHyphen}\nDot: ${r.macDot}\nPlain: ${r.macPlain}`;
      return s;
    }
    let s = `${r.name}\n${r.street}\n`;
    if (r.city) s += r.city;
    if (r.state) s += (r.city ? ", " : "") + r.state;
    if (r.zip) s += " " + r.zip;
    s += "\n" + (r.phone || "");
    if (r.dob) s += `\nDOB: ${r.dob}`;
    if (r.occupation) s += `\n${r.occupation}`;
    if (r.card) s += `\nTEST CARD: ${r.card} (${r.cardLabel})`;
    return s.trim();
  }

  function render() {
    const box = document.getElementById("results");
    if (!box) return;
    if (!results.length) {
      box.innerHTML = `<p class="empty">${t("empty")}</p>`;
      return;
    }
    box.innerHTML = results.map((r, idx) => {
      if (r.error) {
        return `<article class="card"><p class="muted">${escapeHtml(r.error)}</p></article>`;
      }
      let fields;
      if (r.mac) {
        fields = [
          ["mac", "MAC", r.mac],
          ["oui", t("oui"), r.oui],
          ["vendor", t("vendorName"), r.vendor],
          ["ipv6", t("ipv6"), r.ipv6],
        ];
        if (r.macHyphen) {
          fields.push(["hyphen", "Hyphen", r.macHyphen]);
          fields.push(["dot", "Dot", r.macDot]);
          fields.push(["plain", "Plain", r.macPlain]);
        }
      } else {
        fields = [
          ["name", t("name"), r.name],
          ["street", t("street"), r.street],
          ["city", t("city"), r.city || ""],
          ["state", t("stateLabel"), r.state ? `${r.state}${r.stateName ? " (" + r.stateName + ")" : ""}` : (r.stateName || "")],
          ["zip", t("zip"), r.zip || ""],
          ["phone", t("phone"), r.phone || ""],
        ];
        if (r.dob) fields.push(["dob", t("dob"), r.dob]);
        if (r.occupation) fields.push(["occupation", t("occupation"), r.occupation]);
        if (r.card) fields.push(["card", t("card"), r.card, `<span class="badge">${t("cardHint")}</span>`]);
      }
      const rows = fields.filter((f) => f[2]).map(([key, label, val, extra]) => `
        <div class="field" data-key="${key}">
          <div class="field-meta"><span class="label">${label}</span>${extra || ""}</div>
          <div class="field-row">
            <code class="value">${escapeHtml(val)}</code>
            <button type="button" class="btn ghost sm" data-copy="${escapeAttr(val)}">${t("copyField")}</button>
          </div>
        </div>`).join("");
      const pill = r.mac ? (r.oui || "MAC") : (r.state || r.country || PAGE.toUpperCase());
      return `<article class="card" data-idx="${idx}">
        <header class="card-head">
          <span class="pill">${escapeHtml(pill)}</span>
          <span class="muted">#${idx + 1}</span>
          <button type="button" class="btn ghost sm" data-copy-block="${idx}">${t("copyAll")}</button>
        </header>
        <div class="fields">${rows}</div>
      </article>`;
    }).join("");
  }

  function renderSaved() {
    const box = document.getElementById("savedBox");
    if (!box) return;
    const all = loadSaved().filter((x) => x.page === PAGE);
    if (!all.length) {
      box.innerHTML = `<p class="empty">${t("savedEmpty")}</p>`;
      return;
    }
    box.innerHTML = `<div class="saved-list">${all.map((item, i) => `
      <div class="saved-item" data-sid="${escapeAttr(item.id)}">
        <code>${escapeHtml(item.text)}</code>
        <button type="button" class="btn ghost sm" data-copy="${escapeAttr(item.text)}">${t("copyField")}</button>
        <button type="button" class="btn ghost sm" data-remove-saved="${escapeAttr(item.id)}">${t("remove")}</button>
      </div>`).join("")}</div>`;
  }

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); }
    catch { return []; }
  }
  function persistSaved(list) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(list.slice(-200)));
  }
  function saveCurrent() {
    if (!results.length) return;
    const list = loadSaved();
    for (const r of results) {
      list.push({ id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 7), page: PAGE, text: formatBlock(r), at: Date.now() });
    }
    persistSaved(list);
    renderSaved();
    toast(t("copied").replace(/已复制|Copied/, lang === "zh" ? "已保存" : "Saved"));
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1600);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copied"));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove(); toast(t("copied"));
    }
  }

  function download(name, body, type) {
    const blob = new Blob([body], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    URL.revokeObjectURL(a.href);
  }
  function exportJson() {
    if (!results.length) return;
    download("msa-" + PAGE + ".json", JSON.stringify(results, null, 2), "application/json");
  }
  function exportCsv() {
    if (!results.length) return;
    const keys = Object.keys(results[0]);
    const lines = [keys.join(",")];
    for (const r of results) {
      lines.push(keys.map((k) => `"${String(r[k] == null ? "" : r[k]).replace(/"/g, '""')}"`).join(","));
    }
    download("msa-" + PAGE + ".csv", lines.join("\n"), "text/csv");
  }

  function applyI18nChrome() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    const btn = document.getElementById("btnLang");
    if (btn) btn.textContent = t("lang");
    // nav labels
    document.querySelectorAll("[data-nav-id]").forEach((a) => {
      const id = a.getAttribute("data-nav-id");
      const item = NAV.find((n) => n.id === id);
      if (item) a.textContent = lang === "zh" ? item.zh : item.en;
    });
    // SEO titles from data attributes when switching lang
    const titleZh = document.body.getAttribute("data-title-zh");
    const titleEn = document.body.getAttribute("data-title-en");
    if (titleZh && titleEn) document.title = lang === "zh" ? titleZh : titleEn;
    const h1 = document.querySelector("[data-h1-zh]");
    if (h1) h1.textContent = lang === "zh" ? h1.getAttribute("data-h1-zh") : h1.getAttribute("data-h1-en");
    const lead = document.querySelector("[data-lead-zh]");
    if (lead) lead.textContent = lang === "zh" ? lead.getAttribute("data-lead-zh") : lead.getAttribute("data-lead-en");
  }

  function fillRegionSelect() {
    const sel = document.getElementById("region");
    if (!sel) return;
    let codes = [];
    if (PAGE === "taxfree") {
      const p = D("us-taxfree");
      if (p) codes = p.taxFreeCodes.map((c) => ({ v: c, l: `${p.states[c].name} (${c})` }));
    } else if (PAGE === "usa") {
      const p = D("us");
      if (p) codes = Object.keys(p.states).sort().map((c) => ({ v: c, l: `${p.states[c].name} (${c})` }));
    }
    if (!codes.length) return;
    sel.innerHTML = `<option value="">${t("allRegions")}</option>` +
      codes.map((c) => `<option value="${c.v}">${escapeHtml(c.l)}</option>`).join("");
  }

  function fillMacVendors() {
    const sel = document.getElementById("macVendor");
    if (!sel) return;
    const pack = D("mac-oui");
    if (!pack) return;
    const byVendor = {};
    for (const v of pack.vendors) {
      if (!byVendor[v.vendor]) byVendor[v.vendor] = v.oui;
    }
    const opts = Object.keys(byVendor).sort().map((name) =>
      `<option value="${byVendor[name]}">${escapeHtml(name)} (${byVendor[name]})</option>`
    );
    sel.innerHTML = `<option value="">${t("vendorAny")}</option>` + opts.join("");
  }

  function init() {
    applyI18nChrome();
    fillRegionSelect();
    fillMacVendors();

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", fn);
    };
    bind("btnGen", generate);
    bind("btnLookup", doLookup);
    bind("btnClear", () => { results = []; render(); });
    bind("btnJson", exportJson);
    bind("btnCsv", exportCsv);
    bind("btnCopyAll", () => {
      if (!results.length) return;
      copyText(results.map(formatBlock).join("\n\n---\n\n"));
    });
    bind("btnSave", saveCurrent);
    bind("btnClearSaved", () => {
      persistSaved(loadSaved().filter((x) => x.page !== PAGE));
      renderSaved();
    });
    bind("btnLang", () => {
      lang = lang === "zh" ? "en" : "zh";
      localStorage.setItem("msa_lang", lang);
      applyI18nChrome();
      fillRegionSelect();
      fillMacVendors();
      render();
      renderSaved();
    });

    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (btn) { copyText(btn.getAttribute("data-copy")); return; }
      const block = e.target.closest("[data-copy-block]");
      if (block) {
        const idx = parseInt(block.getAttribute("data-copy-block"), 10);
        copyText(formatBlock(results[idx]));
        return;
      }
      const rm = e.target.closest("[data-remove-saved]");
      if (rm) {
        const id = rm.getAttribute("data-remove-saved");
        persistSaved(loadSaved().filter((x) => x.id !== id));
        renderSaved();
      }
    });

    render();
    renderSaved();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
