# MiniSpaceX Address

[English](README.md) | 中文

[![Live](https://img.shields.io/badge/demo-address.minispacex.com-22d3ee)](https://address.minispacex.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![No API keys](https://img.shields.io/badge/API_keys-无需-blue)](https://address.minispacex.com/)

多地区 ** mock 地址** + **MAC 地址**样例生成器，专为**开发 / 表单验证**打造。
100% 纯前端——无后端、无追踪、无需 API key。

🌐 **在线体验：** [https://address.minispacex.com](https://address.minispacex.com)
⭐ 如果它帮你省了写测试数据的时间，欢迎 Star！

> **声明：** 均为虚构 / 整理后的**测试样例**，非真实身份信息。
> 请勿用于欺诈或违反平台 ToS 的行为。与任何政府机构无关。

## 功能

- 12 个生成器：美国免税州、全美各州、香港、英国、德国、新加坡、日本、加拿大、印度、台湾、菲律宾 + MAC
- 紧凑的结果卡片——短字段并排显示，每个字段都有独立的**复制按钮**
- 姓 / 名拆成独立字段
- 可选测试档案（生日 + 职业）、TEST 测试卡号（明显假卡，不可支付）
- 复制全部 · 保存到 localStorage · 导出 JSON/CSV · 中英双语界面
- SEO 友好的静态页面：独立标题/描述/H1/FAQ、面包屑、sitemap

## 页面

| 路径 | 工具 |
|------|------|
| `/` | 美国免税州（AK DE MT NH OR） |
| `/usa-address/` | 全美各州样例 |
| `/hk-address/` | 香港（中/英） |
| `/uk-address/` | 英国 |
| `/de-address/` | 德国 |
| `/sg-address/` | 新加坡 |
| `/jp-address/` | 日本 |
| `/ca-address/` | 加拿大 |
| `/in-address/` | 印度 |
| `/tw-address/` | 台湾 |
| `/ph-address/` | 菲律宾——真实街道 + Barangay + 4 位邮编样例 |
| `/mac-address/` | MAC 生成器 |
| `/mac-address/vendor-lookup/` | MAC OUI 厂商查询 |
| `/help/` `/about/` `/privacy/` `/terms/` | 说明页面 |

## 数据来源与免费接口

**无需 API key，运行时零接口调用。** 生成完全在浏览器内基于预构建的静态文件完成。
外部接口仅在**构建时**用于校验整理好的数据：

| 接口 | 要 key 吗？ | 用途 |
|-----|------|------|
| [Nominatim](https://nominatim.openstreetmap.org/)（OpenStreetMap） | 不用——1 请求/秒，带描述性 User-Agent | 校验菲律宾街道 + 城市 + 邮编组合（`scripts/validate-ph.mjs`） |
| [Zippopotam](https://www.zippopotam.us/) | 不用 | 校验菲律宾 4 位邮编真实存在且对应城市 |
| [Photon](https://photon.komoot.io/)（Komoot，基于 OSM） | 不用 | 构建时校验的备用选项 |

各地区数据：

- **美国 / 免税州**——街道名、邮编、门牌范围来自美国人口普查局
  [TIGER/Line ADDRFEAT](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
  （public domain）；城市名来自 [GeoNames](https://www.geonames.org/) 邮政数据（CC-BY）。
  通过 `scripts/build-us-tiger.py` 离线构建。门牌号在 Census 范围内随机生成。
- **菲律宾**——人工整理的真实街道 + Barangay + 4 位邮编（大马尼拉、宿务、达沃、
  怡朗、巴科洛德、碧瑶、卡加延德奥罗、三宝颜、将军 Santos、安吉利斯、利帕）。
  每条记录都在构建时用 Nominatim + Zippopotam 交叉核验；修正回写到 `scripts/generate-data.mjs`。
- **香港 / 英国 / 德国 / 新加坡 / 日本 / 加拿大 / 印度 / 台湾**——`scripts/generate-data.mjs`
  中的人工整理样例（非实时抓取）。
- **姓名、电话、生日、职业、卡号**在所有地区均为合成测试值。

数据量级（每次构建可能略有浮动）：

| 数据集 | 记录数（街道×城市×邮编） | 原始 JS | ~gzip |
|---------|---------------------------|--------|-------|
| 免税州 AK/DE/MT/NH/OR | ~17,500（每州 ~3.5k） | ~0.75 MB | ~175 KB |
| 全美 `us` | ~55k+（含 CT 人工 fallback） | ~2.5 MB | ~0.5 MB |

## 开发

```bash
npm install
npm run build        # 构建数据 + 页面到 public/
npm run dev          # 本地预览（见 package.json）

# 数据管线
npm run data         # 重建人工整理地区的数据（不会覆盖美国 TIGER 数据）
npm run data:us      # 重建美国数据（需要 $OA_CACHE 下有 TIGER 压缩包 + GeoNames US.txt）

# 质量检查
node scripts/validate-ph.mjs   # 用 Nominatim + Zippopotam 全量核验菲律宾数据（约 3 分钟）
node scripts/smoke-test.mjs     # 在 stub DOM 里跑遍所有页面的生成器
```

推送到 `main` 后通过 **Cloudflare Workers Builds** 自动部署（见 `wrangler.toml`）。
自定义域名：`address.minispacex.com`。

## 参与贡献

发现街道/邮编组合有误？欢迎 PR——把修正加到 `scripts/generate-data.mjs`
（菲律宾数据先跑 `node scripts/validate-ph.mjs`），然后 `npm run build`。

## 开源协议

[MIT](LICENSE)——原创代码。地理数据保留上游条款
（Census：public domain；GeoNames：CC-BY）。与任何第三方 mock-address 品牌无关。
