"""Date overlay drawing on images."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def draw_date_overlay(
    img: Image.Image,
    text: str,
    font_size: int = 24,
) -> Image.Image:
    """Draw a date string on the bottom-left of *img* and return a new image."""
    img = img.copy()
    draw = ImageDraw.Draw(img)

    font_path = Path(__file__).parent / "fonts" / "Roboto.ttf"
    try:
        font = ImageFont.truetype(str(font_path), font_size)
    except OSError:
        font = ImageFont.load_default()

    margin = 10
    x = margin
    y = img.height - font_size - margin * 2

    # Semi-transparent background for readability
    bbox = draw.textbbox((x, y), text, font=font)
    padding = 4
    draw.rectangle(
        [bbox[0] - padding, bbox[1] - padding, bbox[2] + padding, bbox[3] + padding],
        fill=(0, 0, 0, 160),
    )
    draw.text((x, y), text, fill=(255, 255, 255), font=font)

    return img


def date_from_filename(path: Path) -> str | None:
    """Try to extract a YYYY-MM-DD date from a filename.

    Supports patterns like ``2026-02-17.jpg`` or ``day_2026-02-17_1.jpg``.
    """
    import re

    match = re.search(r"\d{4}-\d{2}-\d{2}", path.stem)
    return match.group(0) if match else None
