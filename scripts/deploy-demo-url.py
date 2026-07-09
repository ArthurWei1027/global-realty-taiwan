"""Create lean demo zip (no design PNGs) and deploy to PageDrop for public URL."""

import json
import urllib.request
import zipfile
from datetime import date
from io import BytesIO
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

INCLUDE_DIRS = {"css", "js", "data", "assets", "design"}
INCLUDE_ROOT = {
    "index.html", "properties.html", "leasing.html", "events.html",
    "classroom.html", "about.html", "group.html", "sitemap.html",
    "sitemap.xml", "robots.txt", "contact.html", "news.html", "insights.html",
    "README.md", "HANDOFF-IT-DONY.md",
}
SKIP_DIRS = {"scripts", "presentations", "__pycache__", "SITEMAP", ".git"}
SKIP_EXT = {".pyc", ".pdf", ".pptx", ".py", ".png"}


def should_include(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    if any(p in SKIP_DIRS for p in rel.parts):
        return False
    if path.suffix.lower() in SKIP_EXT:
        return False
    if rel.parts[:2] == ("design", "desktop"):
        return False
    if len(rel.parts) == 1:
        return path.name in INCLUDE_ROOT
    return rel.parts[0] in INCLUDE_DIRS


def build_zip() -> bytes:
    buf = BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for path in sorted(ROOT.rglob("*")):
            if path.is_file() and should_include(path):
                zf.write(path, path.relative_to(ROOT).as_posix())
    return buf.getvalue()


def deploy_pagedrop(data: bytes) -> str:
    boundary = "----WebKitFormBoundaryDemoDeploy7"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="site.zip"\r\n'
        f"Content-Type: application/zip\r\n\r\n"
    ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        "https://pagedrop.dev/api/deploy",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.loads(resp.read().decode())
    return payload.get("url") or payload.get("link") or str(payload)


def main() -> None:
    data = build_zip()
    mb = len(data) / (1024 * 1024)
    print(f"Demo zip size: {mb:.2f} MB")
    if mb > 10:
        raise SystemExit("Zip exceeds 10MB PageDrop limit; trim assets further.")

    out = ROOT.parent / f"Global-Realty-TW-Demo-{date.today():%Y%m%d}.zip"
    out.write_bytes(data)
    print(f"Saved local copy: {out}")

    try:
        url = deploy_pagedrop(data)
        print(f"PUBLIC_URL={url}")
    except Exception as exc:
        print(f"Auto-deploy failed: {exc}")
        print("Upload manually: https://pagedrop.dev/ (Upload ZIP, max 10MB)")


if __name__ == "__main__":
    main()
