"""Tests for timelapse_gif.gif."""

from __future__ import annotations

from datetime import date
from pathlib import Path

import click
import pytest
from PIL import Image

from timelapse_gif.gif import collect_images, generate_gif


class TestCollectImages:
    def test_collects_sorted_images(self, dated_image_dir: Path) -> None:
        files = collect_images(dated_image_dir)
        assert len(files) == 3
        names = [f.name for f in files]
        assert names == sorted(names)

    def test_filters_by_start_end(self, dated_image_dir: Path) -> None:
        files = collect_images(
            dated_image_dir,
            start=date(2026, 1, 11),
            end=date(2026, 1, 11),
        )
        assert len(files) == 1
        assert files[0].name == "2026-01-11.jpg"

    def test_excludes_non_images(self, dated_image_dir: Path) -> None:
        (dated_image_dir / "readme.txt").write_text("notes")
        (dated_image_dir / "data.csv").write_text("a,b")
        files = collect_images(dated_image_dir)
        extensions = {f.suffix.lower() for f in files}
        assert ".txt" not in extensions
        assert ".csv" not in extensions

    def test_start_filter_only(self, dated_image_dir: Path) -> None:
        files = collect_images(dated_image_dir, start=date(2026, 1, 12))
        assert len(files) == 1
        assert files[0].name == "2026-01-12.jpg"

    def test_end_filter_only(self, dated_image_dir: Path) -> None:
        files = collect_images(dated_image_dir, end=date(2026, 1, 10))
        assert len(files) == 1
        assert files[0].name == "2026-01-10.jpg"


class TestGenerateGif:
    def test_generates_gif(self, dated_image_dir: Path, tmp_path: Path) -> None:
        output = tmp_path / "out.gif"
        result = generate_gif(dated_image_dir, output=output, width=64)
        assert result == output
        assert output.exists()
        with Image.open(output) as gif:
            assert gif.format == "GIF"

    def test_no_date_overlay(self, dated_image_dir: Path, tmp_path: Path) -> None:
        output = tmp_path / "out.gif"
        result = generate_gif(
            dated_image_dir, output=output, width=64, date_overlay=False
        )
        assert result == output
        assert output.exists()

    def test_no_images_raises(self, tmp_path: Path) -> None:
        empty_dir = tmp_path / "empty"
        empty_dir.mkdir()
        with pytest.raises(click.ClickException, match="No image files found"):
            generate_gif(empty_dir)
