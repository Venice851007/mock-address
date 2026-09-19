/* MiniSpaceX Address — client-side mock generator. Test data only. */
(function () {
  "use strict";

  const STATE_CODES = ["AK", "DE", "MT", "NH", "OR"];
  const I18N = {
    zh: {
      title: "美区测试地址生成器",
      subtitle: "开发测试 / 表单校验样例数据 · MiniSpaceX Address",
      disclaimer:
        "⚠️ 本工具仅生成虚构测试数据，非真实身份证件。请勿用于欺诈、冒充或违反任何平台服务条款。",
      state: "免税州",
      allStates: "全部免税州（随机）",
      count: "生成数量",
      withProfile: "包含虚假档案（生日 / 职业）",
      withCard: "包含测试卡号（TEST / Luhn 假卡）",
      generate: "生成地址",
      batch: "批量生成",
      copyAll: "复制全部",
      copyField: "复制",
      exportJson: "导出 JSON",
      exportCsv: "导出 CSV",
      clear: "清空",
      name: "姓名",
      street: "街道",
      city: "城市",
      stateLabel: "州",
      zip: "邮编",
      phone: "电话",
      dob: "出生日期",
      occupation: "职业",
      card: "测试卡号",
      cardHint: "假卡 · 仅 Luhn 校验通过 · 不可支付",
      faqTitle: "常见问题",
      faq1q: "什么是美国免税州？",
      faq1a: "阿拉斯加(AK)、特拉华(DE)、蒙大拿(MT)、新罕布什尔(NH)、俄勒冈(OR) 通常不征收州级销售税。本工具仅为这五州提供表单测试样例地址。",
      faq2q: "生成的数据可以用于注册真实账号吗？",
      faq2a: "不可以。数据完全虚构，仅供开发者做表单校验、联调与 UI 演示。用于欺诈或违反平台 ToS 属于违法行为。",
      faq3q: "数据在哪里生成？",
      faq3a: "全部在浏览器本地生成，不上传到服务器。适合 Cloudflare 免费套餐部署。",
      copied: "已复制",
      empty: "点击「生成地址」开始",
      results: "结果",
      lang: "EN",
      footerHub: "MiniSpaceX 生态",
    },
    en: {
      title: "US Tax-Free State Mock Address",
      subtitle: "Dev / form-validation sample data · MiniSpaceX Address",
      disclaimer:
        "⚠️ Fictional test data only — not real IDs. Do not use for fraud, impersonation, or ToS violations.",
      state: "Tax-free state",
      allStates: "All tax-free (random)",
      count: "Count",
      withProfile: "Fake profile (DOB / occupation)",
      withCard: "Fake TEST card (Luhn-looking)",
      generate: "Generate",
      batch: "Batch generate",
      copyAll: "Copy all",
      copyField: "Copy",
      exportJson: "Export JSON",
      exportCsv: "Export CSV",
      clear: "Clear",
      name: "Name",
      street: "Street",
      city: "City",
      stateLabel: "State",
      zip: "ZIP",
      phone: "Phone",
      dob: "Date of birth",
      occupation: "Occupation",
      card: "Test card",
      cardHint: "Fake · Luhn-valid · not chargeable",
      faqTitle: "FAQ",
      faq1q: "What are US sales-tax-free states?",
      faq1a: "Alaska, Delaware, Montana, New Hampshire, and Oregon typically have no statewide sales tax. This tool only generates mock addresses for those five.",
      faq2q: "Can I use these for real account signup?",
      faq2a: "No. Data is fictional, for form testing and demos only. Fraud or ToS abuse is illegal.",
      faq3q: "Where is data generated?",
      faq3a: "Fully client-side in your browser — nothing is uploaded. Friendly to Cloudflare free tier.",
      copied: "Copied",
      empty: "Click Generate to start",
      results: "Results",
      lang: "中文",
      footerHub: "MiniSpaceX ecosystem",
    },
  };

  let lang = localStorage.getItem("msa_lang") || "zh";
  let results = [];

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pad(n, w) {
    return String(n).padStart(w, "0");
  }

  /** Luhn-valid fake Visa-looking number, labeled TEST */
  function fakeCard() {
    const prefix = "4111"; // classic test-range look
    let body = prefix;
    for (let i = 0; i < 11; i++) body += String(randInt(0, 9));
    let sum = 0;
    let alt = true;
    for (let i = body.length - 1; i >= 0; i--) {
      let n = parseInt(body[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    const check = (10 - (sum % 10)) % 10;
    const full = body + String(check);
    return (
      full.slice(0, 4) +
      " " +
      full.slice(4, 8) +
      " " +
      full.slice(8, 12) +
      " " +
      full.slice(12, 16)
    );
  }

  function fakeDob() {
    const y = randInt(1965, 2002);
    const m = randInt(1, 12);
    const d = randInt(1, 28);
    return `${y}-${pad(m, 2)}-${pad(d, 2)}`;
  }

  function fakePhone(areaCodes) {
    const ac = pick(areaCodes);
    return `(${ac}) ${randInt(200, 999)}-${pad(randInt(0, 9999), 4)}`;
  }

  function generateOne(statePref, opts) {
    const data = window.MOCK_ADDR_DATA;
    const code =
      statePref && STATE_CODES.includes(statePref)
        ? statePref
        : pick(STATE_CODES);
    const st = data.states[code];
    const addr = pick(st.addresses);
    const apt = pick(data.aptUnits);
    const street = apt ? `${addr.street}, ${apt}` : addr.street;
    const row = {
      name: `${pick(data.firstNames)} ${pick(data.lastNames)}`,
      street,
      city: addr.city,
      state: code,
      stateName: st.name,
      zip: addr.zip,
      phone: fakePhone(st.areaCodes),
    };
    if (opts.profile) {
      row.dob = fakeDob();
      row.occupation = pick(data.occupations);
    }
    if (opts.card) {
      row.card = fakeCard();
      row.cardLabel = "TEST / Luhn fake — not chargeable";
    }
    return row;
  }

  function generate() {
    const state = document.getElementById("state").value;
    const count = Math.min(
      100,
      Math.max(1, parseInt(document.getElementById("count").value, 10) || 1)
    );
    const opts = {
      profile: document.getElementById("optProfile").checked,
      card: document.getElementById("optCard").checked,
    };
    results = [];
    for (let i = 0; i < count; i++) {
      results.push(generateOne(state || null, opts));
    }
    render();
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      el.textContent = t(k);
    });
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.getElementById("btnLang").textContent = t("lang");
    document.title =
      lang === "zh"
        ? "美区测试地址生成器 | 免税州地址测试 | MiniSpaceX"
        : "US Tax-Free Mock Address Generator | MiniSpaceX";
  }

  function toast(msg) {
    const el = document.getElementById("toast");
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
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast(t("copied"));
    }
  }

  function formatBlock(r) {
    let s = `${r.name}\n${r.street}\n${r.city}, ${r.state} ${r.zip}\n${r.phone}`;
    if (r.dob) s += `\nDOB: ${r.dob}`;
    if (r.occupation) s += `\n${r.occupation}`;
    if (r.card) s += `\nTEST CARD: ${r.card} (${r.cardLabel})`;
    return s;
  }

  function render() {
    const box = document.getElementById("results");
    if (!results.length) {
      box.innerHTML = `<p class="empty">${t("empty")}</p>`;
      return;
    }
    box.innerHTML = results
      .map((r, idx) => {
        const fields = [
          ["name", t("name"), r.name],
          ["street", t("street"), r.street],
          ["city", t("city"), r.city],
          ["state", t("stateLabel"), `${r.state} (${r.stateName})`],
          ["zip", t("zip"), r.zip],
          ["phone", t("phone"), r.phone],
        ];
        if (r.dob) fields.push(["dob", t("dob"), r.dob]);
        if (r.occupation)
          fields.push(["occupation", t("occupation"), r.occupation]);
        if (r.card)
          fields.push([
            "card",
            t("card"),
            r.card,
            `<span class="badge">${t("cardHint")}</span>`,
          ]);

        const rows = fields
          .map(
            ([key, label, val, extra]) => `
          <div class="field" data-key="${key}">
            <div class="field-meta">
              <span class="label">${label}</span>
              ${extra || ""}
            </div>
            <div class="field-row">
              <code class="value">${escapeHtml(val)}</code>
              <button type="button" class="btn ghost sm" data-copy="${escapeAttr(
                val
              )}">${t("copyField")}</button>
            </div>
          </div>`
          )
          .join("");

        return `
        <article class="card" data-idx="${idx}">
          <header class="card-head">
            <span class="pill">${r.state}</span>
            <span class="muted">#${idx + 1}</span>
            <button type="button" class="btn ghost sm" data-copy-block="${idx}">${t(
          "copyAll"
        )}</button>
          </header>
          <div class="fields">${rows}</div>
        </article>`;
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function exportJson() {
    if (!results.length) return;
    download(
      "mock-addresses.json",
      JSON.stringify(results, null, 2),
      "application/json"
    );
  }

  function exportCsv() {
    if (!results.length) return;
    const keys = [
      "name",
      "street",
      "city",
      "state",
      "zip",
      "phone",
      "dob",
      "occupation",
      "card",
    ];
    const lines = [keys.join(",")];
    for (const r of results) {
      lines.push(
        keys
          .map((k) => {
            const v = r[k] == null ? "" : String(r[k]);
            return `"${v.replace(/"/g, '""')}"`;
          })
          .join(",")
      );
    }
    download("mock-addresses.csv", lines.join("\n"), "text/csv");
  }

  function download(name, body, type) {
    const blob = new Blob([body], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function init() {
    applyI18n();
    document.getElementById("btnGen").addEventListener("click", generate);
    document.getElementById("btnClear").addEventListener("click", () => {
      results = [];
      render();
    });
    document.getElementById("btnJson").addEventListener("click", exportJson);
    document.getElementById("btnCsv").addEventListener("click", exportCsv);
    document.getElementById("btnCopyAll").addEventListener("click", () => {
      if (!results.length) return;
      copyText(results.map(formatBlock).join("\n\n---\n\n"));
    });
    document.getElementById("btnLang").addEventListener("click", () => {
      lang = lang === "zh" ? "en" : "zh";
      localStorage.setItem("msa_lang", lang);
      applyI18n();
      render();
    });
    document.getElementById("results").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (btn) {
        copyText(btn.getAttribute("data-copy"));
        return;
      }
      const block = e.target.closest("[data-copy-block]");
      if (block) {
        const idx = parseInt(block.getAttribute("data-copy-block"), 10);
        copyText(formatBlock(results[idx]));
      }
    });
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
