from pathlib import Path
import shutil
from PIL import Image

src_dir = next(p for p in Path(r"C:\Users\Arthur\Desktop\gr用图\人像").rglob("300ppi") if p.is_dir())
out = Path(__file__).resolve().parents[1] / "assets" / "images" / "team"
files = sorted(src_dir.glob("*.png"))

names = [
    "becky-zhao",
    "tony-zhang",
    "jasmine-bi",
    "alan-qu",
    "nick-li",
    "ray-li",
    "jimmy-zeng",
    "jackson-huang",
    "michael-lee",
    "marco-song",
    "steve-miao",
]

sizes = {}
for slug, src in zip(names, files):
    dest = out / f"{slug}.png"
    shutil.copy2(src, dest)
    im = Image.open(dest)
    sizes[slug] = im.size
    print(f"{slug}.png <= {src.name} {im.size}")

preview = out / "_preview"
if preview.exists():
    shutil.rmtree(preview)

print("SIZES", sizes)
