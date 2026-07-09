# 環球置業 Global Realty 台灣官網



環球置業為主品牌、澳華國際集團 from 背書的跨境置產靜態網站（from Meta 式雙品牌）。



## 本地預覽



```powershell

cd 官網

.\design\serve.ps1

# 或：python -m http.server 8765

```



| 用途 | URL |

|------|-----|

| 首頁 | http://localhost:8765/ |

| 設計畫廊 | http://localhost:8765/design/ |

| Design Mode | http://localhost:8765/index.html?design=1 |

| 子分頁 demo | http://localhost:8765/about.html?design=1 |



> 若 `ERR_EMPTY_RESPONSE`：`netstat -ano | findstr ":8765"` 查 PID → `Stop-Process` → 重啟。同一埠只跑一個伺服器。



## 資訊架構



**頂層導覽（6 項）：** 首頁、精選建案、租賃管理、活動預告、小課堂、關於我們



**關於我們子分頁：**



| 子頁 | 檔案 | 內容 |

|------|------|------|

| 關於環球置業 | `about.html` | GR 定位、辦公室、GR 數據 |

| 澳華國際集團 | `group.html` | 集團故事、六大板塊、集團級數據 |



子分頁入口：Header「關於我們」下拉、about/group 頁頂 tab、from 署名、Footer、首頁品牌關係區。



## 目錄結構



```

官網/

├── design/                 # 設計預覽站 + desktop PNG（7 頁）

├── index.html              # 首頁（含品牌關係區）

├── properties.html         # 精選建案

├── leasing.html            # 租賃管理

├── events.html             # 活動預告

├── classroom.html          # 澳洲不動產小課堂

├── about.html              # 關於環球置業（子分頁）

├── group.html              # 澳華國際集團（子分頁）

├── sitemap.html / sitemap.xml / robots.txt

├── css/

│   ├── brand.css           # 雙品牌、子導覽、集團頁

│   └── …

├── js/

│   ├── brand.js            # AGBrand lockup / from

│   ├── main.js             # Header 下拉、子導覽、Footer

│   ├── design-toolbar.js   # ?design=1 底欄

│   └── …

├── assets/images/brands/   # GR / AG SVG

└── data/

```



## 頁面一覽



| 頁面 | 檔案 | 重點 |

|------|------|------|

| 首頁 | `index.html` | Hero、品牌關係區、建案/活動/小課堂 |

| 精選建案 | `properties.html` | 依城市分組建案 |

| 租賃管理 | `leasing.html` | 委託流程、物管 |

| 活動預告 | `events.html` | 側欄篩選 + 活動 grid |

| 小課堂 | `classroom.html` | 教學影片 grid |

| 關於環球置業 | `about.html` | GR 敘事、辦公室、GR 數據 |

| 澳華國際集團 | `group.html` | 六大板塊、Tony Lam、集團數據 |



## 設計圖匯出



```powershell

cd 官網

python scripts/export-design-screenshots.py

```



輸出至 `design/desktop/01-index.png` … `07-group.png`。



## 品牌與合規



- 主品牌：**環球置業 / Global Realty**

- from 背書：**澳華國際集團 / Award Global**

- 業務頁文案主語用「環球置業」；集團數據僅放 `group.html`

- 數據引用官方公開資料；禁止保證獲利表述



詳見工作區 `.cursor/skills/global-realty-taiwan-site/` 與 `.cursor/skills/award-global-brand/`。


