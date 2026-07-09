# 環球置業 設計預覽站



依 Nord 式 Sitemap 匯出之桌面版全頁截圖（1440×900 viewport，全頁高度）。



## 設計預覽站



在專案根目錄啟動本地伺服器後，開啟 `http://localhost:8765/design/`：



```powershell

cd 官網

.\design\serve.ps1

# 或：python -m http.server 8765

```



- **卡片總覽**：7 頁縮圖與 Live 連結

- **Live 預覽**：`?design=1` 附底部設計導覽列

- **關於我們子分頁**：06 關於環球置業、07 澳華國際集團 — Header 下拉 + 頁頂 tab

- **Cursor Design Mode**：在 Cursor 內建瀏覽器開啟 Live 頁面，點選元素即可修改原始碼



### 子分頁 Demo URL



| 頁面 | Live（Design Mode） |

|------|---------------------|

| 關於環球置業 | http://localhost:8765/about.html?design=1 |

| 澳華國際集團 | http://localhost:8765/group.html?design=1 |



## Sitemap 對照



| 檔案 | 頁面 | 路徑 | 導覽 |

|------|------|------|------|

| `desktop/01-index.png` | 首頁 | `/index.html` | 頂層 |

| `desktop/02-properties.png` | 精選建案 | `/properties.html` | 頂層 |

| `desktop/03-leasing.png` | 租賃管理 | `/leasing.html` | 頂層 |

| `desktop/04-events.png` | 活動預告 | `/events.html` | 頂層 |

| `desktop/05-classroom.png` | 小課堂 | `/classroom.html` | 頂層 |

| `desktop/06-about.png` | 關於環球置業 | `/about.html` | 關於我們 · 子分頁 |

| `desktop/07-group.png` | 澳華國際集團 | `/group.html` | 關於我們 · 子分頁 |



## 重新匯出



```powershell

cd 官網

python scripts/export-design-screenshots.py

```



最後更新：2026 年 6 月


