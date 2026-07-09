# 環球置業台灣官網 — IT 交接包（Dony / Codex 臨時上線）

**打包日期：** 2026-07-06  
**用途：** 靜態 HTML 臨時站部署；正式版後續以 WordPress 為目標，本包供先行上線預覽。

---

## 1. 這是什麼

繁體中文靜態官網，**環球置業 Global Realty** 為主品牌，**澳華國際集團 Award Global** 以 from 署名呈現。

- **技術：** 純 HTML + CSS + JavaScript（無 build 步驟）
- **資料：** `data/*.json` + `js/properties-data.js`（建案離線備援）
- **Header/Footer：** 由 `js/main.js` 動態注入（各頁需保留 `#site-header` / `#site-footer`）

---

## 2. 頁面清單（7 頁 + 工具頁）

| 檔案 | 說明 |
|------|------|
| `index.html` | 首頁 |
| `properties.html` | 精選建案 |
| `leasing.html` | 租賃管理 |
| `events.html` | 活動預告 |
| `classroom.html` | 澳洲不動產小課堂 |
| `about.html` | 關於環球置業 |
| `group.html` | 澳華國際集團（關於我們子分頁） |
| `sitemap.html` | 網站地圖 |
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
3. 確認 `data/properties.json`、`data/news.json`、`data/classroom.json` 可公開讀取
4. MIME：`.json` → `application/json`，`.svg` → `image/svg+xml`

**表單：** `js/forms.js` 目前為前端佔位，提交後無後端；臨時站可保留 UI，或改 mailto / 外部表單 URL。

**外部連結：**
- 隱私權政策：https://globalrealty.com.au/privacy-policy/
- 集團官網：https://www.awardglobal.com.au/

---

## 5. 目錄結構

```
├── index.html … group.html    # 頁面
├── css/                       # 樣式（design-system, layout, components, home, brand）
├── js/                        # main.js, brand.js, 各頁邏輯
├── data/                      # properties.json, news.json, classroom.json
├── assets/images/             # SVG 圖（hero、建案、品牌 logo）
├── design/                    # 設計預覽站 + desktop PNG 設計稿（可選）
├── sitemap.xml / robots.txt
└── README.md
```

---

## 6. 聯絡

內容／UI 問題：**Arthur**  
部署／Codex 上線：**Dony**

---

## 7. 與 WordPress 正式版

本包為 **UI + 文案 + 圖片資產快照**。WordPress 上線時可對照各頁 HTML 區塊與 `data/` 內容遷移，無需沿用本靜態站程式架構。
