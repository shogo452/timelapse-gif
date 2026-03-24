"""Timelapse GIF generation."""

from __future__ import annotations

from datetime import date
from pathlib import Path

import click
from PIL import Image, ImageOps

from timelapse_gif.overlay import date_from_filename, draw_date_overlay


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp", ".gif"}


def collect_images(
    directory: Path,
    *,
    start: date | None = None,
    end: date | None = None,
) -> list[Path]:
    """Collect image files from *directory*, sorted by name, with optional date range filter."""
    files = sorted(
        f
        for f in directory.iterdir()
        if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
    )

    if start or end:
        filtered: list[Path] = []
        for f in files:
            d = date_from_filename(f)
            if d is None:
                continue
            file_date = date.fromisoformat(d)
            if start and file_date < start:
                continue
            if end and file_date > end:
                continue
            filtered.append(f)
        files = filtered

    return files


def generate_gif(
    directory: Path,
    *,
    output: Path = Path("timelapse.gif"),
    width: int = 640,
    duration: int = 500,
    date_overlay: bool = True,
    font_size: int = 24,
    loop: int = 0,
    start: date | None = None,
    end: date | None = None,
) -> Path:
    """Generate a timelapse GIF from images in *directory*."""
    files = collect_images(directory, start=start, end=end)

    if not files:
        raise click.ClickException("No image files found in the specified directory.")

    frames: list[Image.Image] = []
    with click.progressbar(files, label="Processing frames", item_show_func=lambda f: f.name if f else "") as bar:
        for f in bar:
            img = ImageOps.exif_transpose(Image.open(f)).convert("RGBA")

            # Resize maintaining aspect ratio
            ratio = width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((width, new_height), Image.LANCZOS)

            # Date overlay
            if date_overlay:
                text = date_from_filename(f) or f.stem
                img = draw_date_overlay(img, text, font_size=font_size)

            # Convert to P (palette) mode with high-quality quantization
            rgb = img.convert("RGB")
            frames.append(
                rgb.quantize(colors=256, method=Image.Quantize.MAXCOVERAGE, dither=Image.Dither.FLOYDSTEINBERG)
            )

    frames[0].save(
        output,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=loop,
    )

    size_bytes = output.stat().st_size
    if size_bytes >= 1024 * 1024:
        size_str = f"{size_bytes / (1024 * 1024):.1f} MB"
    else:
        size_str = f"{size_bytes / 1024:.1f} KB"
    click.echo(f"Generated {output} ({len(frames)} frames, {duration}ms/frame, {size_str})")
    return output
