"""Package Taiwan website static assets for IT handoff (lean bundle)."""

import zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT.parent / f"Global-Realty-TW-Website-IT-Handoff-{date.today():%Y%m%d}.zip"

INCLUDE_DIRS = {"css", "js", "data", "assets", "design"}
INCLUDE_ROOT_FILES = {
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
    "sitemap.xml",
    "robots.txt",
    "llms.txt",
    "contact.html",
    "news.html",
    "insights.html",
    "README.md",
    "HANDOFF-IT-DONY.md",
    "SEO-GEO-CONTENT-GUIDE.md",
}

EXCLUDE_DIR_NAMES = {"scripts", "presentations", "__pycache__", "SITEMAP", ".git"}
EXCLUDE_EXTENSIONS = {".pyc", ".pdf", ".pptx", ".py"}
# design/desktop PNGs are for internal mockups only — exclude from demo deploy
EXCLUDE_GLOBS = ("design/desktop/*.png",)


def should_include(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    rel_posix = rel.as_posix()
    for pattern in EXCLUDE_GLOBS:
        if rel.match(pattern.replace("/", "\\")) or Path(rel_posix).match(pattern):
            return False
    parts = rel.parts
    if any(p in EXCLUDE_DIR_NAMES for p in parts):
        return False
    if path.suffix.lower() in EXCLUDE_EXTENSIONS:
        return False
    if path.name == "GLOBAL_REALTY_MASTER_PRD.md":
        return False
    if len(parts) == 1:
        return path.name in INCLUDE_ROOT_FILES
    if parts[0] in INCLUDE_DIRS:
        return True
    return False


def main() -> None:
    if OUT.exists():
        OUT.unlink()

    count = 0
    total = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for path in sorted(ROOT.rglob("*")):
            if not path.is_file() or not should_include(path):
                continue
            arc = path.relative_to(ROOT).as_posix()
            zf.write(path, arc)
            count += 1
            total += path.stat().st_size

    mb = total / (1024 * 1024)
    print(f"Saved: {OUT}")
    print(f"Files: {count}  Uncompressed: {mb:.2f} MB")


if __name__ == "__main__":
    main()
