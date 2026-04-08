import uuid
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps

MEDIA_IMAGES_DIR = Path("media_images")


# Process incoming image and save it out to specified path
def process_img(content: bytes, output_name: str) -> str:
    with Image.open(BytesIO(content)) as original:
        img = ImageOps.exif_transpose(original)
        # NOTE: Resize according to frontend expected size
        img = ImageOps.fit(img, (300, 300), method=Image.Resampling.LANCZOS)

        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")

        filepath = MEDIA_IMAGES_DIR / output_name
        MEDIA_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        img.save(filepath, "JPEG", quality=85, optimize=True)

    return filepath


def delete_img(filename: str | None) -> None:
    if filename is None:
        return

    filepath = MEDIA_IMAGES_DIR / filename
    if filepath.exists():
        filepath.unlink()
