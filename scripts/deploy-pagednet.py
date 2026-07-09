"""Upload demo zip to PagedNet and capture the deployed site URL."""

import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
ZIP = ROOT.parent / "Global-Realty-TW-Demo-20260706.zip"
OUT = ROOT / "DEMO-URL.md"


def main() -> None:
    if not ZIP.exists():
        import subprocess

        subprocess.check_call([sys.executable, str(ROOT / "scripts" / "deploy-demo-url.py")])

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://paged.net/", wait_until="networkidle", timeout=90000)
        page.locator('input[type="file"]').set_input_files(str(ZIP))
        page.get_by_role("button", name="Deploy Site").click()

        # Wait for success UI
        page.wait_for_timeout(12000)
        html = page.content()
        browser.close()

    patterns = [
        r"https://[a-z0-9-]+\.paged\.net/?",
        r"https://paged\.net/s/[a-zA-Z0-9-]+/?",
        r"https://paged\.net/[a-z0-9-]+/?",
    ]
    url = None
    for pat in patterns:
        m = re.search(pat, html)
        if m:
            url = m.group(0)
            break

    if not url:
        debug = ROOT / "scripts" / "pagednet-debug.html"
        debug.write_text(html, encoding="utf-8")
        raise SystemExit(f"Deploy URL not found. Saved HTML to {debug}")

    if not url.endswith("/"):
        url += "/"

    OUT.write_text(
        f"""# 環球置業台灣官網 — 會議 Demo 連結

## 統一展示 URL（明天開會用）

**{url}**

請只分享這一條連結，即為最新 UI 首頁。

- 託管：PagedNet（無需本機開機）
- 更新：2026-07-06
""",
        encoding="utf-8",
    )
    print(f"PUBLIC_URL={url}")


if __name__ == "__main__":
    main()
