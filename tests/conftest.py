"""Shared fixtures for timelapse-gif tests."""

from __future__ import annotations

import struct
from pathlib import Path

import pytest
from PIL import Image


@pytest.fixture()
def sample_jpeg(tmp_path: Path) -> Path:
    """Create a small JPEG image without EXIF data."""
    path = tmp_path / "photo.jpg"
    img = Image.new("RGB", (100, 80), color=(120, 200, 50))
    img.save(path, "JPEG")
    return path


@pytest.fixture()
def sample_jpeg_with_exif(tmp_path: Path) -> Path:
    """Create a small JPEG image with EXIF DateTimeOriginal."""
    path = tmp_path / "IMG_001.jpg"
    img = Image.new("RGB", (100, 80), color=(120, 200, 50))
    import piexif

    exif_dict = {"Exif": {piexif.ExifIFD.DateTimeOriginal: b"2026:01:15 10:30:00"}}
    exif_bytes = piexif.dump(exif_dict)
    img.save(path, "JPEG", exif=exif_bytes)
    return path


def _make_jpeg_with_exif_raw(path: Path, datetime_str: str) -> Path:
    """Create a JPEG with EXIF DateTime using raw bytes (no piexif dependency)."""
    img = Image.new("RGB", (100, 80), color=(120, 200, 50))
    img.save(path, "JPEG")

    # Build a minimal EXIF with DateTime (tag 0x0132) in IFD0
    datetime_bytes = datetime_str.encode("ascii") + b"\x00"

    # IFD0 with one entry: DateTime (0x0132), type ASCII (2), count=20
    ifd_entry_count = struct.pack(">H", 1)
    ifd_entry = struct.pack(">HHI", 0x0132, 2, 20)
    # Offset to the value data: 8 (TIFF header) + 2 (count) + 12 (entry) + 4 (next IFD) = 26
    ifd_entry += struct.pack(">I", 26)
    next_ifd = struct.pack(">I", 0)

    tiff_header = b"MM" + struct.pack(">H", 42) + struct.pack(">I", 8)
    tiff_body = tiff_header + ifd_entry_count + ifd_entry + next_ifd + datetime_bytes

    exif_header = b"Exif\x00\x00"
    app1_data = exif_header + tiff_body
    app1_marker = b"\xff\xe1" + struct.pack(">H", len(app1_data) + 2)

    # Read the JPEG and inject APP1 after SOI
    jpeg_data = path.read_bytes()
    new_data = jpeg_data[:2] + app1_marker + app1_data + jpeg_data[2:]
    path.write_bytes(new_data)
    return path


@pytest.fixture()
def jpeg_with_exif(tmp_path: Path) -> Path:
    """Create a small JPEG image with EXIF DateTime (no piexif needed)."""
    path = tmp_path / "IMG_001.jpg"
    return _make_jpeg_with_exif_raw(path, "2026:01:15 10:30:00")


@pytest.fixture()
def dated_image_dir(tmp_path: Path) -> Path:
    """Create a directory with several date-named JPEG images."""
    for name in ["2026-01-10.jpg", "2026-01-11.jpg", "2026-01-12.jpg"]:
        img = Image.new("RGB", (100, 80), color=(60, 120, 200))
        img.save(tmp_path / name, "JPEG")
    return tmp_path


@pytest.fixture()
def toml_config(tmp_path: Path) -> Path:
    """Create a sample TOML config file."""
    path = tmp_path / "timelapse-gif.toml"
    path.write_text(
        '[rename]\nprefix = "tomato"\n\n[generate]\nwidth = 320\nduration = 300\n'
    )
    return path
