"""Export full-page desktop PNG mockups for the design gallery."""

import subprocess
import sys
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent.parent
OUT = BASE / "design" / "desktop"
PORT = 9876

PAGES = [
    ("01-index", "/index.html"),
    ("02-properties", "/properties.html"),
    ("03-leasing", "/leasing.html"),
    ("04-events", "/events.html"),
    ("05-classroom", "/classroom.html"),
    ("06-about", "/about.html"),
    ("07-group", "/group.html"),
]


def wait_for_server(url: str, timeout: float = 15.0) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urlopen(url, timeout=1) as response:
                if response.status == 200:
                    return
        except (URLError, OSError):
            time.sleep(0.25)
    raise RuntimeError(f"Server did not become ready at {url}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for old in OUT.glob("*.png"):
        old.unlink()
        print(f"Removed {old.name}")

    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=str(BASE),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        wait_for_server(f"http://127.0.0.1:{PORT}/index.html")

        with sync_playwright() as p:
            browser = p.chromium.launch()
            context = browser.new_context(
                viewport={"width": 1440, "height": 900},
                device_scale_factor=1,
            )
            page = context.new_page()

            for filename, path in PAGES:
                url = f"http://127.0.0.1:{PORT}{path}"
                page.goto(url, wait_until="networkidle")
                page.wait_for_timeout(1200)
                target = OUT / f"{filename}.png"
                page.screenshot(path=str(target), full_page=True)
                print(f"Saved {target.name}")

            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)


if __name__ == "__main__":
    main()
