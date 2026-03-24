"""Tests for timelapse_gif.rename."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

from timelapse_gif.rename import (
    build_rename_plan,
    execute_rename,
    get_exif_datetime,
    get_file_datetime,
)


def test_get_exif_datetime_with_exif(jpeg_with_exif: Path) -> None:
    """Extracts datetime from EXIF data."""
    dt = get_exif_datetime(jpeg_with_exif)
    assert dt is not None
    assert dt.year == 2026
    assert dt.month == 1
    assert dt.day == 15


def test_get_exif_datetime_no_exif(sample_jpeg: Path) -> None:
    """Returns None when no EXIF datetime is present."""
    dt = get_exif_datetime(sample_jpeg)
    assert dt is None


def test_get_file_datetime(sample_jpeg: Path) -> None:
    """Returns a datetime from file mtime."""
    dt = get_file_datetime(sample_jpeg)
    assert dt is not None
    assert dt.year >= 2020


def test_build_rename_plan_basic(tmp_path: Path) -> None:
    """Builds a rename plan from images that already match their mtime date."""
    from datetime import datetime

    import os

    # Create images and set mtime to match their filenames
    for name, ts in [
        ("a.jpg", datetime(2026, 1, 10, 12, 0, 0).timestamp()),
        ("b.jpg", datetime(2026, 1, 11, 12, 0, 0).timestamp()),
    ]:
        img = Image.new("RGB", (10, 10))
        path = tmp_path / name
        img.save(path, "JPEG")
        os.utime(path, (ts, ts))

    plan = build_rename_plan(tmp_path, prefix=None)
    new_names = [p[1].name for p in plan]
    assert "2026-01-10.jpg" in new_names
    assert "2026-01-11.jpg" in new_names


def test_build_rename_plan_with_prefix(dated_image_dir: Path) -> None:
    """Builds a rename plan with prefix."""
    plan = build_rename_plan(dated_image_dir, prefix="tomato")
    assert len(plan) == 3
    for old, new in plan:
        assert new.name.startswith("tomato_")


def test_build_rename_plan_duplicate_dates(tmp_path: Path) -> None:
    """Adds _N suffix for same-date files."""
    for name in ["a.jpg", "b.jpg"]:
        img = Image.new("RGB", (10, 10), color=(0, 0, 0))
        img.save(tmp_path / name, "JPEG")

    plan = build_rename_plan(tmp_path, prefix=None)
    new_names = [p[1].name for p in plan]
    # Both files have the same mtime-based date, so one gets _1 suffix
    suffixed = [n for n in new_names if "_1" in n]
    assert len(suffixed) == 1


def test_build_rename_plan_ignores_non_images(tmp_path: Path) -> None:
    """Non-image files are not included in the plan."""
    (tmp_path / "notes.txt").write_text("hello")
    (tmp_path / "data.csv").write_text("a,b")
    img = Image.new("RGB", (10, 10))
    img.save(tmp_path / "photo.jpg", "JPEG")

    plan = build_rename_plan(tmp_path, prefix="test")
    # Only the JPEG should appear
    old_names = [p[0].name for p in plan]
    assert "notes.txt" not in old_names
    assert "data.csv" not in old_names


def test_execute_rename_dry_run(dated_image_dir: Path) -> None:
    """Dry run does not modify files."""
    original_files = set(f.name for f in dated_image_dir.iterdir())
    execute_rename(dated_image_dir, prefix="tomato", dry_run=True)
    after_files = set(f.name for f in dated_image_dir.iterdir())
    assert original_files == after_files


def test_execute_rename_actual(dated_image_dir: Path) -> None:
    """Actual rename changes file names."""
    result = execute_rename(dated_image_dir, prefix="plant")
    assert len(result) == 3
    for old, new in result:
        assert new.exists()
        assert not old.exists()
        assert new.name.startswith("plant_")


def test_execute_rename_no_changes(tmp_path: Path) -> None:
    """When no renames are needed, returns empty list."""
    import os
    from datetime import datetime

    # Create a file whose name already matches its mtime-based date
    path = tmp_path / "2026-03-01.jpg"
    img = Image.new("RGB", (10, 10))
    img.save(path, "JPEG")
    ts = datetime(2026, 3, 1, 12, 0, 0).timestamp()
    os.utime(path, (ts, ts))

    result = execute_rename(tmp_path, prefix=None)
    assert result == []
