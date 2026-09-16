#!/usr/bin/env python3
"""Generate the Agentower favicon and app icons from the source logo.

Requires Pillow (pip3 install Pillow). Run from the repo root:

    python3 scripts/make-icons.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SOURCE = PUBLIC / "app-icon.jpeg"


def resized(image: Image.Image, size: int) -> Image.Image:
    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    src = Image.open(SOURCE).convert("RGBA")

    # Multi-resolution favicon for browsers and legacy clients.
    resized(src, 256).save(
        PUBLIC / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    resized(src, 180).save(PUBLIC / "apple-touch-icon.png", optimize=True)
    resized(src, 192).save(PUBLIC / "icon-192.png", optimize=True)
    resized(src, 512).save(PUBLIC / "icon-512.png", optimize=True)

    # Lightweight logo used in the nav and footer.
    resized(src, 128).save(PUBLIC / "logo.png", optimize=True)

    print("Icons written to", PUBLIC)


if __name__ == "__main__":
    main()
