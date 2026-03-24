"""Tests for timelapse_gif.overlay."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import patch

from PIL import Image, ImageFont

from timelapse_gif.overlay import date_from_filename, draw_date_overlay


class TestDateFromFilename:
    def test_date_only(self) -> None:
        assert date_from_filename(Path("2026-02-17.jpg")) == "2026-02-17"

    def test_date_with_prefix_and_suffix(self) -> None:
        assert date_from_filename(Path("tomato_2026-02-17_1.jpg")) == "2026-02-17"

    def test_no_date(self) -> None:
        assert date_from_filename(Path("photo.jpg")) is None

    def test_partial_date(self) -> None:
        assert date_from_filename(Path("2026-02.jpg")) is None


class TestDrawDateOverlay:
    def test_returns_same_size_image(self) -> None:
        img = Image.new("RGBA", (200, 150), color=(255, 255, 255, 255))
        result = draw_date_overlay(img, "2026-02-17")
        assert result.size == img.size
        assert result.mode == img.mode

    def test_does_not_mutate_original(self) -> None:
        img = Image.new("RGBA", (200, 150), color=(255, 255, 255, 255))
        original_data = img.tobytes()
        draw_date_overlay(img, "2026-02-17")
        assert img.tobytes() == original_data

    def test_fallback_font(self) -> None:
        """When the bundled font is not found, it falls back to default."""
        img = Image.new("RGBA", (200, 150), color=(255, 255, 255, 255))
        real_truetype = ImageFont.truetype

        def patched_truetype(*args, **kwargs):
            # Block loading of the bundled Roboto font but allow load_default
            if args and isinstance(args[0], str) and "Roboto" in args[0]:
                raise OSError("font not found")
            return real_truetype(*args, **kwargs)

        with patch(
            "timelapse_gif.overlay.ImageFont.truetype", side_effect=patched_truetype
        ):
            result = draw_date_overlay(img, "2026-02-17")
        assert result.size == img.size
