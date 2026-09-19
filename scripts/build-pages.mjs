/**
 * Emit SEO-friendly HTML pages (real paths) for MiniSpaceX Address.
 * Original Chinese/English copy — not copied from third-party sites.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, "../public");

const NAV = [
  { path: "/", id: "taxfree", zh: "美国免税州", en: "US Tax-Free", shortZh: "免税州", shortEn: "Tax-Free" },
  { path: "/usa-address/", id: "usa", zh: "美国地址", en: "US Address", shortZh: "美国", shortEn: "US" },
  { path: "/hk-address/", id: "hk", zh: "香港地址", en: "HK Address", shortZh: "港", shortEn: "HK" },
  { path: "/uk-address/", id: "uk", zh: "英国地址", en: "UK Address", shortZh: "英", shortEn: "UK" },
  { path: "/de-address/", id: "de", zh: "德国地址", en: "DE Address", shortZh: "德", shortEn: "DE" },
  { path: "/sg-address/", id: "sg", zh: "新加坡地址", en: "SG Address", shortZh: "新", shortEn: "SG" },
  { path: "/jp-address/", id: "jp", zh: "日本地址", en: "JP Address", shortZh: "日", shortEn: "JP" },
  { path: "/ca-address/", id: "ca", zh: "加拿大地址", en: "CA Address", shortZh: "加", shortEn: "CA" },
  { path: "/in-address/", id: "in", zh: "印度地址", en: "IN Address", shortZh: "印", shortEn: "IN" },
  { path: "/tw-address/", id: "tw", zh: "台湾地址", en: "TW Address", shortZh: "台", shortEn: "TW" },
  { path: "/mac-address/", id: "mac", zh: "MAC生成", en: "MAC Gen", shortZh: "MAC生成", shortEn: "MAC Gen" },
  { path: "/mac-address/vendor-lookup/", id: "mac-vendor", zh: "MAC厂商查询", en: "MAC Vendor", shortZh: "MAC查询", shortEn: "MAC Lookup" },
];

const LEGAL = [
  { path: "/help/", zh: "使用帮助", en: "Help" },
  { path: "/about/", zh: "关于", en: "About" },
  { path: "/privacy/", zh: "隐私", en: "Privacy" },
  { path: "/terms/", zh: "条款", en: "Terms" },
];

function dataScripts(keys) {
  const base = [`<script src="/data/common.js"></script>`];
  for (const k of keys) base.push(`<script src="/data/${k}.js"></script>`);
  return base.join("\n  ");
}

function shell({ page, path: pagePath, titleZh, titleEn, descZh, descEn, h1Zh, h1En, leadZh, leadEn, crumbs, dataKeys, controlsHtml, faqHtml, extraMain = "", isStub = false }) {
  const canonical = `https://address.minispacex.com${pagePath === "/" ? "/" : pagePath}`;
  const currentNav = NAV.find((n) => n.id === page);
  const currentShort = currentNav ? currentNav.shortZh : "";
  const navHtml = NAV.map((n) =>
    `<a href="${n.path}" data-nav-id="${n.id}" data-short-zh="${escAttr(n.shortZh)}" data-short-en="${escAttr(n.shortEn)}" data-full-zh="${escAttr(n.zh)}" data-full-en="${escAttr(n.en)}" class="${n.id === page ? "active" : ""}" role="menuitem">${n.shortZh}</a>`
  ).join("\n            ");
  const footerTools = NAV.map((n) => `<a href="${n.path}">${n.zh}</a>`).join("\n          ");
  const footerLegal = LEGAL.map((n) => `<a href="${n.path}">${n.zh}</a>`).join("\n          ");
  const crumb = crumbs.map((c, i) =>
    i < crumbs.length - 1
      ? `<a href="${c.href}">${c.zh}</a><span>/</span>`
      : `<span aria-current="page">${c.zh}</span>`
  ).join("");
  const hubHtml = `<nav class="site-hub theme-dark" aria-label="小磊哥の站点">
        <div class="site-hub__title">小磊哥の站点 · More</div>
        <ul class="site-hub__list">
          <li><a href="https://www.minispacex.com" target="_blank" rel="noopener">博客</a></li>
          <li><a href="https://go.minispacex.com" target="_blank" rel="noopener">工具箱</a></li>
          <li><a href="https://mail.5201616.xyz" target="_blank" rel="noopener">临时邮箱</a></li>
          <li><a href="https://otp.minispacex.com" target="_blank" rel="noopener">OTP</a></li>
          <li><a href="https://tarot.minispacex.com" target="_blank" rel="noopener">打工人塔罗</a></li>
          <li><a href="https://air.minispacex.com" target="_blank" rel="noopener">苍穹打击者</a></li>
          <li><a href="https://brick.minispacex.com" target="_blank" rel="noopener">方块轮回</a></li>
          <li><span class="is-current" aria-current="page">美区地址 · 当前</span></li>
        </ul>
      </nav>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#070b14" />
  <title>${titleZh}</title>
  <meta name="description" content="${descZh}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${titleZh}" />
  <meta property="og:description" content="${descZh}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <link rel="alternate" hreflang="zh-CN" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2322d3ee'/%3E%3Cstop offset='1' stop-color='%23a78bfa'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-size='16' font-weight='700' fill='%23041018'%3EA%3C/text%3E%3C/svg%3E" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body data-page="${page}" data-title-zh="${escAttr(titleZh)}" data-title-en="${escAttr(titleEn)}">
  <header class="site-header">
    <div class="site-header-inner">
      <a class="brand-link" href="/"><span class="logo">A</span><span>MiniSpaceX Address</span></a>
      <div class="nav-tools">
        <div class="nav-dd" id="navToolsDd">
          <button type="button" class="nav-dd-btn" id="btnToolsMenu" aria-expanded="false" aria-haspopup="true" aria-controls="toolsMenu">
            <span data-i18n="toolsMenu">地址工具</span> <span class="caret" aria-hidden="true">▾</span>
          </button>
          <div class="nav-dd-menu" id="toolsMenu" role="menu">
            ${navHtml}
          </div>
        </div>
        ${currentNav ? `<span class="nav-current" data-i18n-keep>当前：<strong id="navCurrentLabel" data-nav-current="${currentNav.id}">${currentShort}</strong></span>` : ""}
      </div>
      <div class="header-actions">
        <button type="button" id="btnLang" class="btn ghost sm">EN</button>
      </div>
    </div>
  </header>

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">${crumb}</nav>
    <header class="page-hero">
      <h1 data-h1-zh="${escAttr(h1Zh)}" data-h1-en="${escAttr(h1En)}">${h1Zh}</h1>
      <p class="lead" data-lead-zh="${escAttr(leadZh)}" data-lead-en="${escAttr(leadEn)}">${leadZh}</p>
    </header>

    <aside class="panel disclaimer" role="note">
      <p data-i18n="disclaimer">⚠️ 本站仅提供虚构/样例测试数据，用于开发联调与表单校验。禁止用于欺诈、冒充身份或违反任何平台服务条款。</p>
    </aside>

    ${isStub ? extraMain : `
    <section class="panel controls">
      ${controlsHtml}
      <p class="sample-note" data-i18n="sampleNote">地理样例来自公开来源（如美国 Census TIGER/Line 街道+ZIP 范围）精选提取；门牌号在合理范围内随机。标签：测试样例 / 非真实身份。非官方邮政全库，无政府背书。</p>
    </section>

    <section class="panel">
      <h2 class="section-title" data-i18n="results">生成结果</h2>
      <div id="results"></div>
    </section>

    <section class="panel">
      <h2 class="section-title" data-i18n="saved">已保存的样例（本机浏览器）</h2>
      <div id="savedBox"></div>
    </section>
    `}

    <section class="panel faq">
      ${faqHtml}
    </section>

    <section class="panel">
      <h2 class="section-title">相关工具</h2>
      <div class="footer-grid" style="margin:0">
        ${NAV.filter((n) => n.id !== page).map((n) => `<a href="${n.path}">${n.zh}</a>`).join("\n        ")}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-title" data-i18n="footerTools">工具导航</p>
      <div class="footer-grid">${footerTools}</div>
      <p class="footer-title" data-i18n="footerLegal">说明与条款</p>
      <div class="footer-grid">${footerLegal}</div>
      ${hubHtml}
      <div class="footer-meta">
        <p>MiniSpaceX Address · address.minispacex.com · 测试 / 表单校验样例数据专用</p>
        <p>与第三方 mock 地址品牌无关联。数据在浏览器本地生成，不上传服务器。</p>
      </div>
    </div>
  </footer>
  <div id="toast" class="toast" role="status"></div>
  ${dataScripts(dataKeys)}
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function addrControls(extra = "") {
  return `
      <div class="grid-2">
        <label>
          <span class="lbl" data-i18n="region">地区 / 州</span>
          <select id="region"><option value="" data-i18n="allRegions">全部（随机）</option></select>
        </label>
        <label>
          <span class="lbl" data-i18n="count">生成数量</span>
          <input id="count" type="number" min="1" max="100" value="1" />
        </label>
      </div>
      ${extra}
      <div class="checks">
        <label class="check"><input type="checkbox" id="optProfile" checked /> <span data-i18n="withProfile">包含测试档案（生日 / 职业）</span></label>
        <label class="check"><input type="checkbox" id="optCard" /> <span data-i18n="withCard">包含 TEST 假卡号（Luhn 格式 · 不可支付）</span></label>
      </div>
      <div class="actions">
        <button type="button" id="btnGen" class="btn primary" data-i18n="generate">生成</button>
        <button type="button" id="btnCopyAll" class="btn" data-i18n="copyAll">复制全部</button>
        <button type="button" id="btnSave" class="btn" data-i18n="save">保存本页结果</button>
        <button type="button" id="btnJson" class="btn" data-i18n="exportJson">导出 JSON</button>
        <button type="button" id="btnCsv" class="btn" data-i18n="exportCsv">导出 CSV</button>
        <button type="button" id="btnClear" class="btn ghost" data-i18n="clear">清空结果</button>
        <button type="button" id="btnClearSaved" class="btn ghost" data-i18n="clearSaved">清空已保存</button>
      </div>`;
}

function simpleControls(extra = "") {
  return `
      <div class="grid-2">
        <label>
          <span class="lbl" data-i18n="count">生成数量</span>
          <input id="count" type="number" min="1" max="100" value="1" />
        </label>
        <div></div>
      </div>
      ${extra}
      <div class="checks">
        <label class="check"><input type="checkbox" id="optProfile" checked /> <span data-i18n="withProfile">包含测试档案（生日 / 职业）</span></label>
        <label class="check"><input type="checkbox" id="optCard" /> <span data-i18n="withCard">包含 TEST 假卡号（Luhn 格式 · 不可支付）</span></label>
      </div>
      <div class="actions">
        <button type="button" id="btnGen" class="btn primary" data-i18n="generate">生成</button>
        <button type="button" id="btnCopyAll" class="btn" data-i18n="copyAll">复制全部</button>
        <button type="button" id="btnSave" class="btn" data-i18n="save">保存本页结果</button>
        <button type="button" id="btnJson" class="btn" data-i18n="exportJson">导出 JSON</button>
        <button type="button" id="btnCsv" class="btn" data-i18n="exportCsv">导出 CSV</button>
        <button type="button" id="btnClear" class="btn ghost" data-i18n="clear">清空结果</button>
        <button type="button" id="btnClearSaved" class="btn ghost" data-i18n="clearSaved">清空已保存</button>
      </div>`;
}

function faq(title, items) {
  return `<h2>${title}</h2>
      ${items.map((it, i) => `<details${i === 0 ? " open" : ""}>
        <summary>${it.q}</summary>
        <p>${it.a}</p>
      </details>`).join("\n      ")}`;
}

function writePage(relPath, html) {
  const full = path.join(pub, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log("page", relPath);
}

const pages = [];

// 1. Tax-free home
pages.push({
  out: "index.html",
  cfg: {
    page: "taxfree",
    path: "/",
    titleZh: "美国免税州地址生成器｜AK DE MT NH OR 测试地址｜MiniSpaceX",
    titleEn: "US Tax-Free State Mock Address Generator | MiniSpaceX",
    descZh: "在线生成美国五大免税州（阿拉斯加、特拉华、蒙大拿、新罕布什尔、俄勒冈）样例地址、邮编与电话。客户端本地生成，仅供开发测试与表单校验。",
    descEn: "Generate sample addresses for US sales-tax-free states AK DE MT NH OR. Client-side only. For form testing and QA.",
    h1Zh: "美国免税州地址在线生成器",
    h1En: "US Tax-Free State Address Generator",
    leadZh: "为开发与 QA 准备的美区免税州样例地址：街道、城市、州缩写、ZIP、电话；可选测试档案与 TEST 假卡字段。数据在浏览器本地组合，明确标注为测试用途。",
    leadEn: "Sample US tax-free-state addresses for developers and QA: street, city, state, ZIP, phone; optional profile and TEST card fields. Built client-side and labeled for testing only.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/", zh: "美国免税州地址" }],
    dataKeys: ["us-taxfree"],
    controlsHtml: addrControls(),
    faqHtml: faq("常见问题 · 美国免税州地址", [
      { q: "本页覆盖哪些美国免税州？", a: "本页面向通常不征收州级销售税的五个州样例：阿拉斯加（AK）、特拉华（DE）、蒙大拿（MT）、新罕布什尔（NH）、俄勒冈（OR）。生成结果包含常见表单字段，方便你检查州缩写、ZIP 与电话区号的格式是否匹配。" },
      { q: "生成的数据是真实可投递地址吗？", a: "否。街道名/城市/ZIP 来自公开地理样例（如美国 Census TIGER/Line 地址范围），门牌号在范围内随机；姓名与电话等为合成格式。结果标注为测试样例 / 非真实身份，请勿当作真实收件地址或用于需要真实身份/居住证明的场景。本站不声称政府背书。" },
      { q: "为什么地图上有时能搜到街道？", a: "因为样例使用真实存在的街道名与 ZIP 组合（类似常见 mock 地址工具的思路），便于你验证地图组件/地址自动完成；门牌仍随机，且整条记录仍是测试样例，不是某人的真实身份信息。请勿冒充居住或用于平台违规注册。" },
      { q: "能否用于平台账号注册？", a: "不可以。本工具定位是开发测试与表单校验。使用虚假信息规避平台规则、冒充他人或从事欺诈属于违法或违约行为。需要真实服务时，请使用你本人合法真实的信息。" },
      { q: "美国地址通常包含哪些字段？", a: "常见结构是：姓名 → 门牌号与街道 → 城市 → 两位州缩写 → 五位 ZIP（可选 ZIP+4）→ 电话。本工具按该结构输出，便于对照 USPS 风格字段做前端校验。" },
      { q: "TEST 卡号可以支付吗？", a: "不能。可选卡号仅通过 Luhn 校验外观，并明确标记为 TEST / 不可支付，只适合支付表单的前端格式联调。" },
      { q: "数据会上传到服务器吗？", a: "不会。生成、复制、本地保存与导出都在你的浏览器完成，适合静态站点与 Cloudflare Worker 资源部署。" },
      { q: "如何批量导出？", a: "设置生成数量后点击生成，再使用「导出 JSON / CSV」或「保存本页结果」（写入本机 localStorage）。适合准备测试夹具。" },
    ]),
  },
});

pages.push({
  out: "usa-address/index.html",
  cfg: {
    page: "usa",
    path: "/usa-address/",
    titleZh: "美国地址生成器｜50 州样例地址 ZIP 电话｜MiniSpaceX",
    titleEn: "US Address Generator | 50 States Sample Data | MiniSpaceX",
    descZh: "覆盖美国各州与特区的样例地址生成器：州、城市、街道、ZIP、电话。可选测试档案与 TEST 假卡。仅供开发测试与表单校验。",
    descEn: "Sample US addresses across states: street, city, state, ZIP, phone. Optional profile & TEST card. For QA and form validation only.",
    h1Zh: "美国地址在线生成器（全州样例）",
    h1En: "US Address Generator (All-State Samples)",
    leadZh: "按州筛选或随机生成美区地址字段样例。免税州数据也可在本页出现；若你只需要免税州场景，请使用首页专用入口。",
    leadEn: "Filter by state or randomize US address field samples. Tax-free states are included; use the home page for a tax-free-only workflow.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/usa-address/", zh: "美国地址" }],
    dataKeys: ["us"],
    controlsHtml: addrControls(),
    faqHtml: faq("常见问题 · 美国地址", [
      { q: "本页与「免税州」页有什么区别？", a: "免税州页只聚焦 AK/DE/MT/NH/OR；本页提供更广的州列表样例，方便测试跨州下拉框、运费规则或州缩写校验。两者都是测试数据，不是官方地址库。" },
      { q: "地理样例从哪来？", a: "优先使用公开数据精选提取：美国 Census TIGER/Line ADDRFEAT 的街道名与 ZIP/门牌范围，城市名参考 GeoNames 邮政数据（CC-BY）。门牌号在范围内随机。不是居民名录，无政府背书，禁止用于欺诈或冒充。" },
      { q: "ZIP Code 格式是怎样的？", a: "标准为 5 位数字；部分业务表单还接受 ZIP+4。本工具输出 5 位样例 ZIP，并与所选州的城市样例一并给出，便于检查「州-城市-邮编」联动逻辑。" },
      { q: "电话区号如何处理？", a: "每个州配置了常见区号样例池，生成时随机选取并组成 (NXX) NXX-XXXX 形态，用于北美电话字段校验。" },
      { q: "适合哪些技术场景？", a: "前端表单校验、E2E 填充、后台导入测试、地址组件 UI 演示、文档截图等。明确不支持真实注册、物流投递或身份核验。" },
      { q: "如何切换中英文界面？", a: "点击右上角 EN / 中文。页面标题与导语会同步切换；生成字段标签也会切换。" },
      { q: "内部链接怎么用？", a: "页脚与「相关工具」矩阵可跳转到香港、英国、德国、新加坡、日本、加拿大、印度、台湾与 MAC 工具，便于站内 SEO 与测试场景切换。" },
    ]),
  },
});

pages.push({
  out: "hk-address/index.html",
  cfg: {
    page: "hk",
    path: "/hk-address/",
    titleZh: "香港地址生成器｜中英地址样例 电话｜MiniSpaceX",
    titleEn: "Hong Kong Address Generator | ZH/EN Samples | MiniSpaceX",
    descZh: "生成香港岛、九龙、新界样例地址（中文或英文），含楼层单位、区域与 +852 电话格式。客户端本地生成，仅供测试。",
    descEn: "HK Island / Kowloon / New Territories sample addresses in Chinese or English. Client-side. For testing only.",
    h1Zh: "香港地址生成器（中英切换）",
    h1En: "Hong Kong Address Generator (ZH/EN)",
    leadZh: "面向港区表单的地址字段样例：区域、街道、楼层单位与电话。香港通常无统一邮政编码，样例中可能使用占位邮编以便兼容「必填邮编」类表单。",
    leadEn: "Sample HK address fields: district, street, floor/unit, phone. HK has no universal postcode; placeholders may appear for forms that require a postal field.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/hk-address/", zh: "香港地址" }],
    dataKeys: ["hk"],
    controlsHtml: simpleControls(`
      <label style="display:block;margin:.5rem 0">
        <span class="lbl" data-i18n="hkLang">地址语言</span>
        <select id="hkLang">
          <option value="zh">中文地址</option>
          <option value="en">英文地址</option>
        </select>
      </label>`),
    faqHtml: faq("常见问题 · 香港地址", [
      { q: "支持哪些区域？", a: "样例覆盖香港岛、九龙与新界的常见地区名与街道名结构，用于检查区域下拉与中英字段切换，而非提供可投递清单。" },
      { q: "香港有邮编吗？", a: "日常邮政较少依赖统一邮编。若目标表单强制要求 Postal Code，可用占位值做格式联调；真实业务请遵循服务商规则。" },
      { q: "中英文地址如何切换？", a: "在控件中选择「中文地址」或「英文地址」后再生成。适合分别测试中英表单布局与字符长度。" },
      { q: "电话格式？", a: "样例使用 +852 与 8 位数字结构，便于校验国际区号与本地号码长度。" },
      { q: "能否用于真实开户？", a: "不能。仅限开发测试。请使用合法真实资料办理正式业务。" },
    ]),
  },
});

pages.push({
  out: "uk-address/index.html",
  cfg: {
    page: "uk",
    path: "/uk-address/",
    titleZh: "英国地址生成器｜Postcode 样例｜MiniSpaceX",
    titleEn: "UK Address Generator | Postcode Samples | MiniSpaceX",
    descZh: "生成英国（英格兰、苏格兰、威尔士、北爱尔兰城市）样例地址与 Postcode、电话。开发测试专用。",
    descEn: "UK sample addresses with postcodes for England, Scotland, Wales, NI cities. Testing only.",
    h1Zh: "英国地址在线生成器",
    h1En: "UK Address Generator",
    leadZh: "输出街道、城市、地区与英国邮编（Postcode）样例，便于校验外向地址表单与 +44 电话字段。",
    leadEn: "Street, city, region, and UK postcode samples for outbound address forms and +44 phone fields.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/uk-address/", zh: "英国地址" }],
    dataKeys: ["uk"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 英国地址", [
      { q: "Postcode 长什么样？", a: "英国邮编为字母数字组合（如 SW1A 1AA）。本页输出与城市样例匹配的格式化邮编字符串，用于正则与长度测试。" },
      { q: "覆盖哪些城市？", a: "包含伦敦、曼彻斯特、伯明翰、利物浦、爱丁堡、格拉斯哥、布里斯托、利兹、卡迪夫、贝尔法斯特等样例点。" },
      { q: "地址行如何排列？", a: "常见顺序：门牌街道 → 城市 → 郡/地区 → Postcode。复制整块时可直接粘贴到多行地址框做 UI 测试。" },
      { q: "数据来源说明？", a: "客户端精选样例组合，标注为测试数据。不是皇家邮政官方下载库。" },
    ]),
  },
});

pages.push({
  out: "de-address/index.html",
  cfg: {
    page: "de",
    path: "/de-address/",
    titleZh: "德国地址生成器｜PLZ 城市街道样例｜MiniSpaceX",
    titleEn: "German Address Generator | PLZ Samples | MiniSpaceX",
    descZh: "生成德国城市样例地址：街道门牌、城市、五位邮编（PLZ）与电话。仅供开发测试。",
    descEn: "German sample addresses: street, city, 5-digit PLZ, phone. For development testing only.",
    h1Zh: "德国地址在线生成器",
    h1En: "German Address Generator",
    leadZh: "按德语地址习惯输出「街道 + 门牌、邮编、城市」字段样例，适合欧盟表单与物流字段联调。",
    leadEn: "German-style street+house number, PLZ, and city samples for EU forms and shipping field checks.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/de-address/", zh: "德国地址" }],
    dataKeys: ["de"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 德国地址", [
      { q: "德国邮编是几位？", a: "通常为 5 位数字（PLZ）。本工具输出五位样例并与城市名一起展示。" },
      { q: "街道门牌顺序？", a: "德语习惯常为「街名 + 门牌号」。生成结果按此排列，便于对照本地化表单。" },
      { q: "包含哪些城市？", a: "柏林、慕尼黑、汉堡、法兰克福、科隆、斯图加特、杜塞尔多夫、莱比锡等样例。" },
      { q: "可以当真邮寄吗？", a: "不可以。仅测试用途。" },
    ]),
  },
});

pages.push({
  out: "sg-address/index.html",
  cfg: {
    page: "sg",
    path: "/sg-address/",
    titleZh: "新加坡地址生成器｜邮区六位样例｜MiniSpaceX",
    titleEn: "Singapore Address Generator | 6-digit Postal | MiniSpaceX",
    descZh: "生成新加坡组屋/街道样例地址与六位邮区编号、+65 电话。开发测试专用。",
    descEn: "Singapore HDB/street-style samples with 6-digit postal codes and +65 phones. Testing only.",
    h1Zh: "新加坡地址在线生成器",
    h1En: "Singapore Address Generator",
    leadZh: "输出 Blk / 街道 / 单位号与六位 Postal Code 样例，方便东南亚表单与电商地址组件测试。",
    leadEn: "Blk / street / unit and 6-digit postal samples for SEA forms and checkout address widgets.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/sg-address/", zh: "新加坡地址" }],
    dataKeys: ["sg"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 新加坡地址", [
      { q: "邮编几位？", a: "新加坡邮区编号一般为 6 位数字。本页样例遵循该长度。" },
      { q: "地址里为什么有 Blk？", a: "组屋地址常用 Block 号 + 街道 + 楼层单位。样例模拟该结构以便测试多段地址输入框。" },
      { q: "仅测试吗？", a: "是。请勿用于真实注册或物流。" },
    ]),
  },
});

pages.push({
  out: "jp-address/index.html",
  cfg: {
    page: "jp",
    path: "/jp-address/",
    titleZh: "日本地址生成器｜郵便番号 都道府县样例｜MiniSpaceX",
    titleEn: "Japan Address Generator | Yubin Samples | MiniSpaceX",
    descZh: "生成日本样例地址：郵便番号、都道府县、市区町村与丁目番地名。客户端测试数据。",
    descEn: "Japanese sample addresses: postal code, prefecture, city, chome/banchi. Client-side test data.",
    h1Zh: "日本地址在线生成器",
    h1En: "Japan Address Generator",
    leadZh: "按日式地址层级组合样例字段，支持界面中英切换时的展示差异，便于国际化表单 QA。",
    leadEn: "Japanese hierarchical address samples; UI language toggle helps i18n form QA.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/jp-address/", zh: "日本地址" }],
    dataKeys: ["jp"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 日本地址", [
      { q: "郵便番号格式？", a: "常见为 NNN-NNNN。样例按此形态输出。" },
      { q: "地址书写顺序？", a: "通常由大到小：邮编 → 都道府县 → 市区町村 → 町名丁目番地。复制块按该逻辑拼接。" },
      { q: "覆盖哪些地区？", a: "东京、大阪、京都、神奈川等样例点。" },
      { q: "用途限制？", a: "仅开发测试与格式演示。" },
    ]),
  },
});

pages.push({
  out: "ca-address/index.html",
  cfg: {
    page: "ca",
    path: "/ca-address/",
    titleZh: "加拿大地址生成器｜省缩写 邮编样例｜MiniSpaceX",
    titleEn: "Canada Address Generator | Province Postal | MiniSpaceX",
    descZh: "生成加拿大样例地址：街道、城市、省缩写与邮编（A1A 1A1）、电话。测试专用。",
    descEn: "Canadian sample addresses: street, city, province, postal code, phone. Testing only.",
    h1Zh: "加拿大地址在线生成器",
    h1En: "Canada Address Generator",
    leadZh: "覆盖安大略、卑诗、魁北克、阿尔伯塔等省的城市样例，输出加拿大邮编空格格式。",
    leadEn: "Samples across ON, BC, QC, AB cities with spaced Canadian postal format.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/ca-address/", zh: "加拿大地址" }],
    dataKeys: ["ca"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 加拿大地址", [
      { q: "邮编格式？", a: "加拿大邮编为字母数字交替（如 M5H 2N2）。样例保留中间空格。" },
      { q: "省缩写？", a: "输出两位省代码（ON、BC、QC、AB 等）与全名，便于下拉框测试。" },
      { q: "仅测试？", a: "是。禁止欺诈与违规注册用途。" },
    ]),
  },
});

pages.push({
  out: "in-address/index.html",
  cfg: {
    page: "in",
    path: "/in-address/",
    titleZh: "印度地址生成器｜PIN Code 样例｜MiniSpaceX",
    titleEn: "India Address Generator | PIN Code Samples | MiniSpaceX",
    descZh: "生成印度城市样例地址与六位 PIN Code、电话。开发测试与表单校验专用。",
    descEn: "Indian city address samples with 6-digit PIN and phone. For form testing only.",
    h1Zh: "印度地址在线生成器",
    h1En: "India Address Generator",
    leadZh: "面向含邦（State）与 PIN 字段的表单，提供孟买、班加罗尔、新德里、金奈、海德拉巴等样例。",
    leadEn: "Samples for forms with State and PIN fields — Mumbai, Bengaluru, New Delhi, Chennai, Hyderabad, and more.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/in-address/", zh: "印度地址" }],
    dataKeys: ["in"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 印度地址", [
      { q: "PIN Code 几位？", a: "一般为 6 位数字。样例遵循该规则。" },
      { q: "字段结构？", a: "街道 → 城市 → 邦 → PIN → 电话，便于对照电商结账表单。" },
      { q: "免责声明？", a: "虚构/样例数据，仅 QA。勿用于欺诈。" },
    ]),
  },
});

pages.push({
  out: "tw-address/index.html",
  cfg: {
    page: "tw",
    path: "/tw-address/",
    titleZh: "台湾地址生成器｜邮递区号 县市样例｜MiniSpaceX",
    titleEn: "Taiwan Address Generator | Postal District Samples | MiniSpaceX",
    descZh: "生成台湾样例地址：县市、行政区、街道门牌与邮递区号。客户端测试数据。",
    descEn: "Taiwan sample addresses: city, district, street, postal code. Client-side test data.",
    h1Zh: "台湾地址在线生成器",
    h1En: "Taiwan Address Generator",
    leadZh: "覆盖台北、新北、台中、高雄等样例行政区，输出中文门牌结构；界面切到英文时可查看英文拼接。",
    leadEn: "Taipei, New Taipei, Taichung, Kaohsiung district samples; English UI shows latinized concatenation.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/tw-address/", zh: "台湾地址" }],
    dataKeys: ["tw"],
    controlsHtml: simpleControls(),
    faqHtml: faq("常见问题 · 台湾地址", [
      { q: "邮递区号？", a: "样例使用常见三码区号形态，用于长度与必填校验。" },
      { q: "地址顺序？", a: "中文习惯由大到小：县市 → 区 → 路街 → 号。生成块按此拼接。" },
      { q: "用途？", a: "开发测试与表单演示，非真实户籍或物流数据。" },
    ]),
  },
});

pages.push({
  out: "mac-address/index.html",
  cfg: {
    page: "mac",
    path: "/mac-address/",
    titleZh: "MAC地址生成器｜随机单播 OUI 格式｜MiniSpaceX",
    titleEn: "MAC Address Generator | Unicast OUI Formats | MiniSpaceX",
    descZh: "在线生成随机本地单播 MAC，支持冒号/连字符/点分/纯十六进制，可选常见厂商 OUI，并给出 IPv6 Link-Local。网络测试专用。",
    descEn: "Random local-unicast MACs with colon/hyphen/dot/plain formats, optional vendor OUI, IPv6 link-local. For network testing.",
    h1Zh: "MAC 地址在线生成器",
    h1En: "MAC Address Generator",
    leadZh: "生成符合单播、本地管理位习惯的测试 MAC，可指定样例厂商 OUI，并转换多种书写格式与 IPv6 链路本地地址。",
    leadEn: "Generate test MACs with unicast/local-admin bits, optional sample OUIs, multiple notations, and IPv6 link-local.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/mac-address/", zh: "MAC地址生成" }],
    dataKeys: ["mac-oui"],
    controlsHtml: `
      <div class="grid-2">
        <label>
          <span class="lbl" data-i18n="format">输出格式</span>
          <select id="macFmt">
            <option value="colon">Colon AA:BB:CC:DD:EE:FF</option>
            <option value="hyphen">Hyphen AA-BB-CC-DD-EE-FF</option>
            <option value="dot">Dot AABB.CCDD.EEFF</option>
            <option value="plain">Plain AABBCCDDEEFF</option>
          </select>
        </label>
        <label>
          <span class="lbl" data-i18n="count">生成数量</span>
          <input id="count" type="number" min="1" max="100" value="1" />
        </label>
      </div>
      <label style="display:block;margin:.65rem 0">
        <span class="lbl" data-i18n="vendor">厂商 OUI（可选）</span>
        <select id="macVendor"></select>
      </label>
      <p class="sample-note" data-i18n="unicast">随机本地单播（U/L=1, I/G=0）</p>
      <div class="actions" style="margin-top:.75rem">
        <button type="button" id="btnGen" class="btn primary" data-i18n="macGen">生成 MAC</button>
        <button type="button" id="btnCopyAll" class="btn" data-i18n="copyAll">复制全部</button>
        <button type="button" id="btnSave" class="btn" data-i18n="save">保存本页结果</button>
        <button type="button" id="btnJson" class="btn" data-i18n="exportJson">导出 JSON</button>
        <button type="button" id="btnCsv" class="btn" data-i18n="exportCsv">导出 CSV</button>
        <button type="button" id="btnClear" class="btn ghost" data-i18n="clear">清空结果</button>
        <a class="btn" href="/mac-address/vendor-lookup/">厂商查询</a>
      </div>`,
    faqHtml: faq("常见问题 · MAC 生成", [
      { q: "什么是 MAC 地址？", a: "MAC（Media Access Control）是网卡硬件地址，48 位，常写成六段十六进制。实验室与虚拟机场景经常需要临时 MAC 做连通性测试。" },
      { q: "什么是 OUI？", a: "OUI 是前 24 位厂商标识。本页内置常见厂商样例表，可按厂商前缀生成，便于模拟特定设备外观（仍是测试地址）。" },
      { q: "随机模式如何保证单播？", a: "未指定 OUI 时，生成算法将第一字节的 I/G 位置 0（单播），U/L 位置 1（本地管理），降低与全球唯一烧录地址冲突的测试风险表述更清晰。" },
      { q: "IPv6 Link-Local 如何得出？", a: "按 EUI-64 思路：插入 FFFE 并翻转 U/L 位，再映射到 fe80::/10 形式，便于路由器/主机配置演练。" },
      { q: "需要厂商反查？", a: "请打开 MAC 厂商查询页，粘贴 MAC 或 OUI 即可在本地样例表中检索。" },
    ]),
  },
});

pages.push({
  out: "mac-address/vendor-lookup/index.html",
  cfg: {
    page: "mac-vendor",
    path: "/mac-address/vendor-lookup/",
    titleZh: "MAC地址厂商查询｜OUI 识别与格式转换｜MiniSpaceX",
    titleEn: "MAC Vendor Lookup | OUI Identify & Format | MiniSpaceX",
    descZh: "输入 MAC 或 OUI，本地查询常见厂商样例表，并输出冒号/连字符/点分格式与 IPv6 Link-Local。",
    descEn: "Look up sample OUI vendors locally; normalize MAC formats and show IPv6 link-local.",
    h1Zh: "MAC 地址厂商查询",
    h1En: "MAC Address Vendor Lookup",
    leadZh: "粘贴任意常见分隔符的 MAC/OUI，在浏览器内归一化并匹配精选 OUI 样例表。未命中不代表无效，仅表示不在本站样例库。",
    leadEn: "Paste a MAC/OUI in any common notation; we normalize and match our curated OUI sample table. Misses mean not in-sample, not necessarily invalid.",
    crumbs: [{ href: "/", zh: "首页" }, { href: "/mac-address/", zh: "MAC生成" }, { href: "/mac-address/vendor-lookup/", zh: "厂商查询" }],
    dataKeys: ["mac-oui"],
    controlsHtml: `
      <label style="display:block;margin-bottom:.65rem">
        <span class="lbl" data-i18n="macInput">MAC 或 OUI</span>
        <input id="macInput" type="text" placeholder="00:1B:44:11:3A:B7 或 001B44" autocomplete="off" />
      </label>
      <div class="actions">
        <button type="button" id="btnLookup" class="btn primary" data-i18n="lookup">查询厂商</button>
        <button type="button" id="btnCopyAll" class="btn" data-i18n="copyAll">复制全部</button>
        <button type="button" id="btnSave" class="btn" data-i18n="save">保存本页结果</button>
        <button type="button" id="btnClear" class="btn ghost" data-i18n="clear">清空结果</button>
        <a class="btn" href="/mac-address/">返回 MAC 生成</a>
      </div>`,
    faqHtml: faq("常见问题 · MAC 厂商查询", [
      { q: "支持哪些输入格式？", a: "冒号、连字符、点分或连续十六进制均可；工具会先去除分隔符再取前 6 位作为 OUI。" },
      { q: "查不到厂商怎么办？", a: "本站使用精选样例 OUI 表，不是完整 IEEE 全量库。查无只说明未收录，你仍可把归一化结果用于格式测试。" },
      { q: "会把 MAC 传到服务器吗？", a: "不会。查询完全在本地完成。" },
      { q: "还能做什么？", a: "同一结果会给出多种书写格式与 IPv6 Link-Local，方便文档与配置粘贴。" },
    ]),
  },
});

function stubPage({ out, page, path: p, titleZh, titleEn, h1Zh, h1En, bodyZh }) {
  pages.push({
    out,
    cfg: {
      page,
      path: p,
      titleZh,
      titleEn,
      descZh: titleZh,
      descEn: titleEn,
      h1Zh,
      h1En,
      leadZh: "",
      leadEn: "",
      crumbs: [{ href: "/", zh: "首页" }, { href: p, zh: h1Zh }],
      dataKeys: [],
      controlsHtml: "",
      faqHtml: `<h2>${h1Zh}</h2><div class="stub-body">${bodyZh}</div>`,
      isStub: true,
      extraMain: `<section class="panel stub-body">${bodyZh}</section>`,
    },
  });
}

stubPage({
  out: "help/index.html",
  page: "help",
  path: "/help/",
  titleZh: "使用帮助｜MiniSpaceX Address",
  titleEn: "Help | MiniSpaceX Address",
  h1Zh: "使用帮助",
  h1En: "Help",
  bodyZh: `<p>打开顶部「地址工具」下拉，选择地区或 MAC 工具 → 设置数量与选项 → 点击生成 → 复制字段或导出 JSON/CSV。</p>
  <p>「保存本页结果」写入浏览器 localStorage，仅保存在你的设备。</p>
  <h2>建议用途</h2>
  <ul><li>表单校验与 UI 演示</li><li>自动化测试夹具</li><li>网络实验室 MAC 配置演练</li></ul>
  <h2>禁止用途</h2>
  <ul><li>欺诈、冒充、绕过平台风控</li><li>真实支付或身份核验</li></ul>`,
});

stubPage({
  out: "about/index.html",
  page: "about",
  path: "/about/",
  titleZh: "关于｜MiniSpaceX Address",
  titleEn: "About | MiniSpaceX Address",
  h1Zh: "关于本站",
  h1En: "About",
  bodyZh: `<p>MiniSpaceX Address（address.minispacex.com）是 MiniSpaceX 生态中的<strong>测试地址 / MAC 样例</strong>工具站，强调轻量、可读与本地生成。</p>
  <p>本站与任何第三方商业 mock-address 品牌<strong>无关联</strong>。文案与样式为原创实现。</p>
  <p>Hub：<a href="https://www.minispacex.com" rel="noopener" target="_blank">www.minispacex.com</a></p>`,
});

stubPage({
  out: "privacy/index.html",
  page: "privacy",
  path: "/privacy/",
  titleZh: "隐私说明｜MiniSpaceX Address",
  titleEn: "Privacy | MiniSpaceX Address",
  h1Zh: "隐私说明",
  h1En: "Privacy",
  bodyZh: `<p>地址与 MAC 均在浏览器本地生成。我们不收集你输入的查询内容，也不将生成结果上传到服务器。</p>
  <p>语言偏好与「已保存样例」存储在 localStorage。清除站点数据即可删除。</p>
  <p>访问日志（若有）仅可能包含标准 CDN/Worker 边缘日志，用于可用性，不含生成正文。</p>`,
});

stubPage({
  out: "terms/index.html",
  page: "terms",
  path: "/terms/",
  titleZh: "使用条款｜MiniSpaceX Address",
  titleEn: "Terms | MiniSpaceX Address",
  h1Zh: "使用条款",
  h1En: "Terms",
  bodyZh: `<p>你可免费使用本站生成<strong>测试样例数据</strong>。你必须遵守所在地法律与目标平台服务条款。</p>
  <p>禁止将输出用于欺诈、冒充、未经授权访问或任何违法用途。测试卡号不可支付。</p>
  <p>数据按「原样」提供，不作适销性或特定用途保证。因滥用造成的后果由使用者自行承担。</p>`,
});

for (const p of pages) {
  writePage(p.out, shell(p.cfg));
}

// robots + sitemap
fs.writeFileSync(path.join(pub, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://address.minispacex.com/sitemap.xml\n`);
const urls = ["/", ...NAV.filter((n) => n.path !== "/").map((n) => n.path), ...LEGAL.map((l) => l.path)];
const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>https://address.minispacex.com${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(pub, "sitemap.xml"), sm);
console.log("wrote robots + sitemap, pages:", pages.length);
