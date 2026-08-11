"""Mirror Jackson prototype (Cloudflare) into a local handoff folder."""

from __future__ import annotations

import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE_URL = "https://prototype-barbara-option-spell.trycloudflare.com"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "handoff" / "jackson-prototype"

SEED_DIRS = ["data"]

SEED_PAGES = [
    "index.html",
    "properties.html",
    "property.html",
    "leasing.html",
    "events.html",
    "event.html",
    "classroom.html",
    "about.html",
    "group.html",
    "privacy.html",
    "search.html",
    "sitemap.html",
    "contact.html",
    "news.html",
    "insights.html",
    "sitemap.xml",
    "robots.txt",
    "llms.txt",
    "data/properties.json",
    "data/events.json",
    "data/news.json",
    "data/classroom.json",
    "data/wp-url-mapping.json",
    "README.md",
    "HANDOFF-IT-DONY.md",
    "SEO-GEO-CONTENT-GUIDE.md",
]

ASSET_RE = re.compile(
    r"""(?:href|src)=["'](?!https?://|//|mailto:|tel:|#)([^"']+)["']"""
    r"""|url\(\s*['"]?(?!https?://|//|data:)([^'")]+)['"]?\s*\)"""
)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "GR-Handoff-Mirror/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def normalize_path(raw: str, page_url: str) -> str | None:
    raw = raw.strip()
    if not raw or raw.startswith("#"):
        return None
    if "${" in raw or "`" in raw or " " in raw or raw.startswith("{"):
        return None
    raw = raw.split("?", 1)[0].split("#", 1)[0]
    if raw.startswith("/"):
        path = raw.lstrip("/")
    else:
        base_dir = page_url.rsplit("/", 1)[0] + "/"
        path = urllib.parse.urljoin(base_dir, raw)
        if path.startswith(BASE_URL + "/"):
            path = path[len(BASE_URL) + 1 :]
        elif path.startswith("/"):
            path = path.lstrip("/")
    if ".." in path.split("/"):
        resolved = urllib.parse.urljoin(page_url + "/", raw)
        path = resolved.replace(BASE_URL + "/", "")
    return path


def collect_assets(content: str, page_url: str) -> set[str]:
    found: set[str] = set()
    for m in ASSET_RE.finditer(content):
        ref = m.group(1) or m.group(2)
        if not ref:
            continue
        path = normalize_path(ref, page_url)
        if path:
            found.add(path)
    return found


def save_file(rel: str, data: bytes) -> None:
    dest = OUT / rel.replace("/", "\\")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)


def mirror() -> tuple[int, int]:
    if OUT.exists():
        import shutil

        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    queue: list[str] = list(SEED_PAGES)
    seen: set[str] = set()
    ok = fail = 0

    for d in SEED_DIRS:
        try:
            listing = fetch(f"{BASE_URL}/{d}/").decode("utf-8", errors="replace")
        except (urllib.error.URLError, TimeoutError):
            continue
        for m in re.finditer(r'href=["\']([^"\']+\.json)["\']', listing, re.I):
            path = normalize_path(m.group(1), f"{BASE_URL}/{d}/")
            if path and path not in seen:
                queue.append(path)

    while queue:
        rel = queue.pop(0)
        if rel in seen:
            continue
        seen.add(rel)
        url = f"{BASE_URL}/{rel}"
        try:
            data = fetch(url)
        except (urllib.error.URLError, TimeoutError) as exc:
            print(f"FAIL {rel}: {exc}")
            fail += 1
            continue

        save_file(rel, data)
        ok += 1
        print(f"OK   {rel} ({len(data)} bytes)")

        text_types = (".html", ".css", ".js", ".json", ".xml", ".txt", ".md")
        if Path(rel).suffix.lower() in text_types:
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                text = data.decode("utf-8", errors="replace")
            for asset in collect_assets(text, url):
                if asset not in seen:
                    queue.append(asset)

    return ok, fail


def main() -> None:
    global BASE_URL
    if len(sys.argv) > 1:
        BASE_URL = sys.argv[1].rstrip("/")
    print(f"Mirroring {BASE_URL}")
    print(f"Output: {OUT}")
    ok, fail = mirror()
    print(f"Done: {ok} ok, {fail} failed")


if __name__ == "__main__":
    main()
