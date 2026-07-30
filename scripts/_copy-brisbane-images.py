import shutil
from pathlib import Path

src = Path(r"C:\Users\Arthur\Desktop\布里斯班项目信息")
dst = Path(r"C:\Users\Arthur\Desktop\澳華國際\官網\assets\images")

files = {
    "Armida.jpg": "armida.jpg",
    "Leaf four.jpg": "leaf-four-solis.jpg",
    "CYPRESS.jpg": "cypress-palms.jpg",
    "ABBOTSFORD.jpg": "the-abbotsford.jpg",
}

for src_name, dst_name in files.items():
    matches = list(src.rglob(src_name))
    if not matches:
        raise FileNotFoundError(src_name)
    shutil.copy2(matches[0], dst / dst_name)
    print("OK:", dst_name)
