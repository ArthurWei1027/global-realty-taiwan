# 環球置業台灣官網 — IT 交接包（Dony / Codex）

**打包日期：** 2026-07-09  
**GitHub Pages 預覽：** https://arthurwei1027.github.io/global-realty-taiwan/  
**Repo：** https://github.com/ArthurWei1027/global-realty-taiwan  
**用途：** 靜態 HTML 定稿版供內部審閱；正式版以 WordPress 上線，本包為 UI／文案／SEO 參考快照。

---

## 1. 這是什麼

繁體中文靜態官網，**環球置業 Global Realty** 為主品牌，**澳華國際集團 Award Global** 以 from 署名呈現。

- **技術：** 純 HTML + CSS + JavaScript（無 build 步驟）
- **資料：** `data/*.json` + `js/*-data.js`（離線備援）
- **Header/Footer：** 由 `js/main.js` 動態注入（各頁需保留 `#site-header` / `#site-footer`）
- **SEO：** `js/seo-config.js` + `js/seo.js`（OG、canonical、JSON-LD）

---

## 2. 頁面清單

| 檔案 | 說明 |
|------|------|
| `index.html` | 首頁 |
| `properties.html` | 精選建案列表 |
| `property.html?slug=...` | 建案詳情（4 案） |
| `leasing.html` | 租賃管理 |
| `events.html` | 活動預告列表 |
| `event.html?slug=...` | 活動詳情 |
| `classroom.html` | 澳洲不動產小課堂 |
| `about.html` | 關於環球置業 |
| `group.html` | 澳華國際集團（關於我們子分頁） |
| `privacy.html` | 隱私權政策（台灣站版） |
| `sitemap.html` | 網站地圖 |
| `search.html` | 站內搜尋 |
| `contact.html` / `news.html` / `insights.html` | 301 導向用 |

---

## 3. 本地測試

```bash
# 在解壓後的根目錄（與 index.html 同層）
python -m http.server 8080
# 瀏覽 http://localhost:8080/index.html
```

**必須用 HTTP 伺服器**，不可直接用 `file://` 開啟（JSON 載入會失敗）。

---

## 4. 靜態上線建議

1. 將整包上傳至 host 根目錄（或子目錄）
2. 預設首頁設為 `index.html`
3. 確認 `data/*.json` 可公開讀取
4. MIME：`.json` → `application/json`，`.svg` → `image/svg+xml`
5. 根目錄放置 `llms.txt`（GEO 用）

**表單：** `js/forms.js` 目前為前端佔位，提交後無後端；WP 上線時接 CRM／郵件外掛。

**外部連結：**
- 澳洲隱私權（參考）：https://globalrealty.com.au/privacy-policy/
- 集團官網：https://www.awardglobal.com.au/

---

## 5. 目錄結構

```
├── index.html … group.html, event.html, property.html, privacy.html
├── css/                       # design-system, layout, components, home, brand
├── js/                        # main.js, brand.js, seo.js, 各頁邏輯
├── data/                      # properties, events, news, classroom, wp-url-mapping
├── assets/images/             # hero、建案、品牌 logo
├── design/                    # 設計預覽站（可選）
├── sitemap.xml / robots.txt / llms.txt
├── SEO-GEO-CONTENT-GUIDE.md   # SEO／GEO 完整指南
└── README.md
```

---

## 6. SEO / WordPress 遷移

詳見 **`SEO-GEO-CONTENT-GUIDE.md`** 與 **`data/wp-url-mapping.json`**。

**Dony 上線前請確認：**

1. 正式網域（台灣站是否獨立子網域）
2. `js/seo-config.js`：`usePreviewBase: false`，更新 `productionBase`
3. `sitemap.xml`、`robots.txt` URL 改為正式網域
4. 依 `wp-url-mapping.json` 建立 WP 固定頁 / CPT / 301
5. 建案 CPT slug、活動 CPT slug 與靜態站保持一致
6. LocalBusiness schema（台北 101、大巨蛋）
7. Google Search Console 驗證

**目前預覽設定：** `usePreviewBase: true` → canonical / OG 指向 GitHub Pages。

---

## 7. 打包

```bash
python scripts/package-it-handoff.py
```

輸出：`../Global-Realty-TW-Website-IT-Handoff-YYYYMMDD.zip`

---

## 8. 聯絡

內容／UI 問題：**Arthur**  
GitHub 審閱：**Jackson / Leo / Tom**  
部署／WordPress：**Dony**
