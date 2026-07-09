# 澳華國際跨境資產智庫官網建置 Master PRD

> 澳華國際（Award Global）官網開發規格書存檔。完整原始規格見專案啟動文件；本檔為 `官網/` 資料夾內之實作對照索引。

## 商業目標

1. **高淨值名單精準捕捉** — 核心諮詢轉換率目標 ≥ 3%
2. **跨境品牌權威定調** — E-E-A-T 知識庫建立信任
3. **雙向轉化動能** — HNWI 諮詢 + Sales Planning Manager 招募

## 網站架構（Flat Architecture）

| 路徑 | 頁面 | 狀態 |
|------|------|------|
| `/index.html` | 首頁 | ✅ 已實作 |
| `/about.html` | 關於我們 | ✅ Nord 式編輯布局 |
| `/properties.html` | 精選建案 | ✅ Nord 式篩選 + 卡片 |
| `/insights.html` | 趨勢觀點 | ✅ 已實作 |
| `/news.html` | 最新消息 | ✅ 側欄 + 列表 |
| `/contact.html` | 聯絡我們（雙軌轉換） | ✅ 已實作 |

## 技術落地備註

本實作採用**純靜態站**方案：

- **建案篩選：** `data/properties.json` + `js/property-filter.js` 前端篩選；`js/properties-data.js` 作離線 fallback
- **篩選維度：** 城市、房屋類型、地區（URL 仍支援 `status` 參數供首頁快速連結）
- **建案卡片：** 大圖 + 熱門/狀態 badge + 地區 + 價格文案（不編造具體價格）
- **最新消息：** `data/news.json` + `js/news.js` 分類篩選
- **表單：** `js/forms.js` 前端驗證 + 佔位提交（`dataLayer.push`）
- **共用元件：** `js/main.js` 注入 Header / Footer
- **主題：** 固定亮色，無暗色模式切換
- **篩選參數 URL** 的 canonical 統一指向 `/properties.html`

## 設計系統

見 `css/design-system.css` — 品牌色 `#0f172a` / `#b45309`、8pt 間距、WCAG AA 44px 觸控標準。

靜態 UI 設計圖見 `design/desktop/`（1440px 全頁 PNG），由 `scripts/export-design-screenshots.py` 匯出。

## 資料模型（建案）

```json
{
  "slug": "623-collins",
  "name": "623 Collins",
  "city": "melbourne",
  "cityLabel": "墨爾本",
  "district": "melbourne-cbd",
  "districtLabel": "墨爾本中央商務區",
  "type": "apartment",
  "status": "off-plan",
  "statusLabel": "預售",
  "featured": true,
  "priceLabel": "價格請洽專屬顧問",
  "yieldRange": "參考租金回報區間 4.5%–5.5%",
  "image": "assets/images/623-collins.svg",
  "ctaType": "floorplan",
  "ctaLabel": "索取未公開平面圖"
}
```

## 改版時程（Roadmap）

- **Phase 1**：環境佈署、design-system、SEO 基礎 — ✅
- **Phase 2**：Properties 動態篩選與 Nord 卡片 Grid — ✅
- **Phase 3**：Insights 知識庫、News 頁、招募動線 — ✅
- **Phase 4**：GTM 佔位、Core Web Vitals、Canonical 防護 — 進行中

## KPI

- Primary：VIP 預約表單轉換率 ≥ 3%
- Secondary：自然搜尋非品牌流量 YoY +50%
- HR：Sales Planning Manager 履歷投遞數與面試質量

---

*澳華國際 Award Global*
