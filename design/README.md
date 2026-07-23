# 環球置業 設計預覽站

依 Nord 式 Sitemap 匯出之桌面版全頁截圖（1440×900 viewport，全頁高度）。

**檔名規則：** `design/desktop/网站-01.png` … `网站-08.png`（對齊設計手冊）

## 設計預覽站

在專案根目錄啟動本地伺服器後，開啟 `http://localhost:8765/design/`：

```powershell
cd 官網
.\design\serve.ps1
# 或：python -m http.server 8765
```

- **卡片總覽**：8 頁縮圖與 Live 連結
- **Live 預覽**：`?design=1` 附底部設計導覽列
- **關於我們子分頁**：06 關於環球置業、07 澳華國際集團 — Header 下拉 + 頁頂 tab
- **Cursor Design Mode**：在 Cursor 內建瀏覽器開啟 Live 頁面，點選元素即可修改原始碼

## Sitemap 對照

| 檔案 | 頁面 | 路徑 |
|------|------|------|
| `desktop/网站-01.png` | 首頁 | `/index.html` |
| `desktop/网站-02.png` | 精選建案 | `/properties.html` |
| `desktop/网站-03.png` | 租賃管理 | `/leasing.html` |
| `desktop/网站-04.png` | 活動預告 | `/events.html` |
| `desktop/网站-05.png` | 小課堂 | `/classroom.html` |
| `desktop/网站-06.png` | 關於環球置業 | `/about.html` |
| `desktop/网站-07.png` | 澳華國際集團 | `/group.html` |
| `desktop/网站-08.png` | 隱私權政策 | `/privacy.html` |

## 重新匯出

```powershell
cd 官網
python scripts/export-design-screenshots.py
```

最後更新：2026-07-09
