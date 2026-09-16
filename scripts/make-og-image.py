#!/usr/bin/env python3
"""Generate the Agentower Open Graph image (1200x630).

Requires Pillow (pip3 install Pillow). Run from the repo root:

    python3 scripts/make-og-image.py

The script downloads the brand fonts (Sora + Instrument Sans) from the
Google Fonts repository into a local cache the first time it runs.
"""

import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
LOGO = PUBLIC / "app-icon.jpeg"
OUT = PUBLIC / "og-image.png"

W, H = 1200, 630
BG = (8, 9, 12)
BRAND = (240, 169, 46)
INK_100 = (232, 235, 240)
INK_300 = (154, 163, 178)
INK_400 = (139, 149, 165)
INK_700 = (35, 40, 51)

FONT_CACHE = Path(tempfile.gettempdir()) / "agentower-fonts"
FONTS = {
    "sora": (
        "https://github.com/google/fonts/raw/main/ofl/sora/Sora%5Bwght%5D.ttf",
        "Sora.ttf",
    ),
    "instrument": (
        "https://github.com/google/fonts/raw/main/ofl/instrumentsans/InstrumentSans%5Bwdth,wght%5D.ttf",
        "InstrumentSans.ttf",
    ),
}


def font_path(key: str) -> Path:
    url, name = FONTS[key]
    FONT_CACHE.mkdir(parents=True, exist_ok=True)
    path = FONT_CACHE / name
    if not path.exists():
        urllib.request.urlretrieve(url, path)
    return path


def display(size: int, weight: int = 800) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(font_path("sora"), size)
    font.set_variation_by_axes([weight])
    return font


def sans(size: int, weight: int = 500) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(font_path("instrument"), size)
    font.set_variation_by_axes([100, weight])
    return font


def rounded_logo(size: int, radius: int) -> Image.Image:
    logo = Image.open(LOGO).convert("RGBA").resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    logo.putalpha(mask)
    return logo


def glow() -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((-260, -420, 760, 300), fill=(*BRAND, 60))
    draw.ellipse((520, -360, 1560, 260), fill=(*BRAND, 34))
    return layer.filter(ImageFilter.GaussianBlur(150))


def chip(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, font: ImageFont.FreeTypeFont) -> int:
    pad_x, pad_y = 18, 12
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    tw, th = right - left, bottom - top
    box = (x, y, x + tw + pad_x * 2, y + th + pad_y * 2)
    draw.rounded_rectangle(box, radius=14, outline=INK_700, width=2, fill=(18, 21, 27))
    draw.text((x + pad_x, y + pad_y - top), text, font=font, fill=INK_300)
    return box[2]


def main() -> None:
    canvas = Image.new("RGBA", (W, H), BG)
    canvas.alpha_composite(glow())

    draw = ImageDraw.Draw(canvas)

    # Watermark of the logo on the right edge.
    watermark = Image.open(LOGO).convert("RGBA").resize((520, 520), Image.LANCZOS)
    alpha = watermark.getchannel("A").point(lambda v: int(v * 0.10))
    watermark.putalpha(alpha)
    canvas.alpha_composite(watermark, (760, 90))

    # Header: logo + wordmark.
    logo = rounded_logo(84, 22)
    canvas.alpha_composite(logo, (80, 72))
    draw.text((186, 88), "Agentower", font=display(40, 800), fill=INK_100)

    # Headline.
    draw.text((80, 232), "Controlá tus agentes de IA", font=display(70, 800), fill=INK_100)
    draw.text((80, 314), "desde Telegram", font=display(70, 800), fill=BRAND)

    # Subtitle.
    draw.text(
        (82, 418),
        "opencode · Claude Code · Kiro · GitHub Copilot · Codex · Antigravity",
        font=sans(27, 500),
        fill=INK_300,
    )

    # Badges.
    badges = ["MIT", "Go 1.22+", "macOS", "Windows", "sin puertos abiertos"]
    x = 80
    badge_font = sans(22, 600)
    for badge in badges:
        x = chip(draw, x, 500, badge, badge_font) + 14

    canvas.convert("RGB").save(OUT, optimize=True)
    print("OG image written to", OUT)


if __name__ == "__main__":
    main()
