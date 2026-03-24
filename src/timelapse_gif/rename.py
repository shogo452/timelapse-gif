"""EXIF date-based photo file renaming."""

from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path

import click
from PIL import Image
from PIL.ExifTags import Base as ExifBase


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp"}


def get_exif_datetime(path: Path) -> datetime | None:
    """Extract the original shooting datetime from EXIF data."""
    try:
        with Image.open(path) as img:
            exif = img.getexif()
            if exif:
                # DateTimeOriginal
                dt_str = exif.get(ExifBase.DateTimeOriginal) or exif.get(
                    ExifBase.DateTime
                )
                if dt_str:
                    return datetime.strptime(dt_str, "%Y:%m:%d %H:%M:%S")
    except Exception:
        pass
    return None


def get_file_datetime(path: Path) -> datetime:
    """Fallback: use file modification time."""
    return datetime.fromtimestamp(os.path.getmtime(path))


def build_rename_plan(
    directory: Path, prefix: str | None
) -> list[tuple[Path, Path]]:
    """Build a list of (old_path, new_path) rename pairs.

    Files are sorted by their detected date so that suffix numbering
    is deterministic.
    """
    files = sorted(
        (f for f in directory.iterdir() if f.suffix.lower() in IMAGE_EXTENSIONS),
        key=lambda f: f.name,
    )

    # Collect (file, date_str) pairs, sorted by date then original name
    dated: list[tuple[Path, str]] = []
    for f in files:
        dt = get_exif_datetime(f) or get_file_datetime(f)
        dated.append((f, dt.strftime("%Y-%m-%d-%H-%M")))
    dated.sort(key=lambda x: (x[1], x[0].name))

    # Assign filenames, handling duplicates within the same date
    date_counts: dict[str, int] = {}
    plan: list[tuple[Path, Path]] = []
    for f, date_str in dated:
        count = date_counts.get(date_str, 0)
        date_counts[date_str] = count + 1

        base = f"{prefix}_{date_str}" if prefix else date_str
        if count > 0:
            new_name = f"{base}_{count}{f.suffix.lower()}"
        else:
            new_name = f"{base}{f.suffix.lower()}"

        new_path = f.parent / new_name
        if f.name != new_name:
            plan.append((f, new_path))

    return plan


def execute_rename(
    directory: Path,
    *,
    prefix: str | None = None,
    dry_run: bool = False,
) -> list[tuple[Path, Path]]:
    """Rename image files in *directory* based on EXIF/file dates.

    Returns the list of (old, new) pairs that were (or would be) renamed.
    """
    plan = build_rename_plan(directory, prefix)

    with click.progressbar(plan, label="Renaming files", item_show_func=lambda p: f"{p[0].name} -> {p[1].name}" if p else "") as bar:
        for old, new in bar:
            if dry_run:
                pass
            else:
                old.rename(new)

    if not plan:
        click.echo("No files to rename.")

    return plan
