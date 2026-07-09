# 環球置業台灣官網 — SEO / GEO 內容與技術指南

**適用對象：** 內容編輯（Arthur）、審閱（Jackson / Leo / Tom）、IT 部署（Dony）  
**最後更新：** 2026-07-09  
**GitHub Pages 預覽：** https://arthurwei1027.github.io/global-realty-taiwan/

---

## 1. 目標

1. **SEO**：讓 Google / Bing 正確索引台灣站各頁，建案與活動詳情可被搜尋到。  
2. **GEO**（Generative Engine Optimization）：讓 AI 搜尋／助理能準確引用品牌事實、服務範圍與聯絡方式。  
3. **WordPress 遷移**：靜態站 slug 與 IA 作為定稿，上線時盡量保留 URL 結構。

---

## 2. 品牌與合規底線

| 項目 | 規範 |
|------|------|
| 主品牌 | 環球置業 / Global Realty |
| 母品牌 | 澳華國際集團 / Award Global（from 署名，非主標） |
| 語言 | 繁體中文（`lang="zh-Hant"`） |
| 公開數據 | 30+ 分行、500+ 員工、50,000+ 客戶、500 億+ 澳元交易額（僅引用官網已公開資料） |
| 禁止 | 保證審批、利率、房價、租金回報；編造數據；具體法律／稅務／移民建議 |

---

## 3. 頁面 Meta 模板

每頁 `<head>` 應有：

- `<title>`：主關鍵字｜次關鍵字｜環球置業 Global Realty（≤ 60 字元為佳）
- `<meta name="description">`：120–160 字，說明頁面價值，含 1–2 個自然關鍵字
- `data-page` 屬性（供 `js/seo.js` 判斷頁型）

**動態注入（全站已掛載 `seo-config.js` + `seo.js`）：**

- Open Graph / Twitter Card
- `link rel="canonical"`（依 `usePreviewBase` 切換預覽／正式網域）
- JSON-LD：RealEstateAgent、WebSite、LocalBusiness（台北 101、大巨蛋）

**詳情頁額外注入：**

- 建案：`RealEstateListing`（`property-detail.js`）
- 活動：`Event`（`event-detail.js`）

### 各頁 Title / Description 參考

| 頁面 | Title 範例 | Description 重點 |
|------|-----------|-----------------|
| 首頁 | 環球置業 Global Realty｜澳華國際集團 · 跨境置產智庫 | 雪梨／墨爾本置產、租賃管理、台北顧問 |
| 精選建案 | 精選建案｜環球置業 Global Realty | 澳洲精選建案、戶型、價格區間（不含保證） |
| 建案詳情 | {建案名}｜精選建案｜環球置業 Global Realty | 取自 `properties.json` 的 `summary` |
| 活動列表 | 活動預告｜環球置業 Global Realty | 說明會、品酒會、台北場次 |
| 活動詳情 | {活動名}｜活動預告｜環球置業 Global Realty | 取自 `events.json` 的 `summary` |
| 租賃管理 | 租賃管理｜環球置業 Global Realty | 跨境房東租賃代管 |
| 小課堂 | 澳洲不動產小課堂｜環球置業 Global Realty | FIRB、印花稅、購屋流程教育 |
| 關於我們 | 關於環球置業｜環球置業 Global Realty | 台灣團隊、服務據點 |
| 澳華國際集團 | 澳華國際集團 Award Global｜環球置業 Global Realty | 集團背景、from 署名頁 |
| 隱私權 | 隱私權政策｜環球置業 Global Realty | 個資處理說明 |

---

## 4. URL 對照（靜態 → WordPress 建議）

完整對照見 `data/wp-url-mapping.json`。

| 靜態檔 | 建議 WP slug | 備註 |
|--------|-------------|------|
| `index.html` | `/` | 首頁 |
| `properties.html` | `/properties/` | 建案列表 CPT archive |
| `property.html?slug=xxx` | `/property/xxx/` | 建案單篇，slug 保持一致 |
| `events.html` | `/events/` | 活動列表 |
| `event.html?slug=xxx` | `/events/xxx/` | 活動單篇 |
| `leasing.html` | `/leasing/` | 固定頁 |
| `classroom.html` | `/classroom/` | 文章列表或 CPT |
| `about.html` | `/about/` | 固定頁 |
| `group.html` | `/about/group/` | 子頁 |
| `privacy.html` | `/privacy/` | 固定頁 |
| `contact.html` | `/contact/` | 301 → 首頁 `#consult` 或 WP 表單頁 |

**301 導向頁（保留 SEO 權重）：** `contact.html`、`news.html`、`insights.html` → 對應新 IA。

---

## 5. 結構化資料（Schema.org）

| 類型 | 頁面 | 來源 |
|------|------|------|
| RealEstateAgent | 全站 | `seo-config.js` |
| WebSite | 全站 | `seo.js` |
| LocalBusiness × 2 | 全站 | 台北 101、大巨蛋辦公室 |
| RealEstateListing | 建案詳情 | `property-detail.js` |
| Event | 活動詳情 | `event-detail.js` |
| Article | 小課堂／消息（待擴充） | 可於 `classroom.js` 呼叫 `GRSeo.injectArticleSchema()` |

驗證工具：[Google Rich Results Test](https://search.google.com/test/rich-results)

---

## 6. GEO：`llms.txt`

根目錄 `llms.txt` 供 AI 爬蟲快速理解：

- 品牌定位與服務
- 台灣辦公室地址
- 主要頁面連結
- 合規聲明

正式上線後請 Dony 將其中的 `Preview-URL` 改為正式網域。

---

## 7. 內容維護流程

### 新增建案

1. 編輯 `data/properties.json` + `js/properties-data.js`（離線備援）
2. 新增建案詳情至 `js/property-details.js`（若已有該檔）
3. 更新 `sitemap.xml` 加入 `property.html?slug=...`
4. 更新 `data/wp-url-mapping.json`

### 新增活動

1. 編輯 `data/events.json`
2. 活動類消息在 `data/news.json` 的 `link` 改為 `event.html?slug=...`
3. 更新 `sitemap.xml`
4. 示範場次（如 2026-09 / 10）上線前由內容團隊決定是否保留

### 新增小課堂文章

1. 編輯 `data/classroom.json`
2. 若未來有單篇詳情頁，slug 建議 `/classroom/{slug}/`

### 切換正式網域

1. `js/seo-config.js`：`usePreviewBase: false`，確認 `productionBase`
2. `sitemap.xml`：全站 URL 改為正式網域
3. `robots.txt`：Sitemap 改為正式網域
4. 各 HTML 內硬編碼的 `canonical`（若有）一併更新

---

## 8. Dony WordPress 需求清單

- [ ] 確認正式網域（台灣站是否獨立子網域或路徑）
- [ ] 依 `wp-url-mapping.json` 建立固定頁 / CPT / 301
- [ ] Yoast 或 Rank Math：匯入 title / description / OG 模板
- [ ] 上傳 `sitemap.xml` 邏輯至 WP 自動 sitemap
- [ ] LocalBusiness schema（101 + 大巨蛋）— 可用 schema 外掛或自訂
- [ ] 表單後端（目前 `forms.js` 為前端占位）
- [ ] `llms.txt` 置於網站根目錄
- [ ] Google Search Console / Bing Webmaster 驗證
- [ ] 301：`contact.html`、`news.html`、`insights.html`

---

## 9. 事實卡（供 AI / 編輯引用）

**環球置業 Global Realty（台灣）**

- 定位：澳華國際集團旗下地產品牌，服務台灣高資產客戶跨境澳洲置產
- 服務：建案銷售、租賃管理、置產諮詢、活動說明會
- 台北 101 辦公室：台北市信義區信義路五段 7 號 台北 101 45 樓 A-1 室
- 大巨蛋辦公室：台北市信義區忠孝東路四段 525 號 14–15 樓
- 聯絡：arthurwei@globalrealty.com.au
- 母品牌官網：https://www.awardglobal.com.au/
- 澳洲品牌站：https://www.globalrealty.com.au/

**澳華國際集團 Award Global**

- 2005 年成立於澳洲雪梨
- 綜合性金融地產集團；核心理念「誠信為本，業精於勤」

---

## 10. 技術檔案索引

| 檔案 | 用途 |
|------|------|
| `js/seo-config.js` | 站名、網域、辦公室、sameAs |
| `js/seo.js` | OG、canonical、JSON-LD、詳情 schema API |
| `llms.txt` | GEO 摘要 |
| `data/wp-url-mapping.json` | WP slug 對照 |
| `sitemap.xml` | 搜尋引擎 URL 清單 |
| `robots.txt` | 爬蟲規則 + sitemap 位置 |
