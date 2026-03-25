"""Tests for timelapse_gif.cli."""

from __future__ import annotations

from pathlib import Path

from click.testing import CliRunner

from PIL import Image

from timelapse_gif import __version__
from timelapse_gif.cli import BANNER, cli


def test_cli_version() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["--version"])
    assert result.exit_code == 0
    assert __version__ in result.output


def test_cli_help_contains_banner() -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    # The ASCII art banner contains "GrowTimelapse" rendered in figlet style
    assert "____" in result.output
    assert "Timelapse GIF generator from image sequences" in result.output


def test_rename_dry_run(dated_image_dir: Path) -> None:
    runner = CliRunner()
    result = runner.invoke(cli, ["rename", str(dated_image_dir), "--dry-run"])
    assert result.exit_code == 0


def test_generate_subcommand(dated_image_dir: Path, tmp_path: Path) -> None:
    output = tmp_path / "test.gif"
    runner = CliRunner()
    result = runner.invoke(
        cli,
        ["generate", str(dated_image_dir), "-o", str(output), "--width", "64"],
    )
    assert result.exit_code == 0
    assert output.exists()


def test_generate_auto_rename(tmp_path: Path) -> None:
    img_dir = tmp_path / "photos"
    img_dir.mkdir()
    # Create images with non-date names that will be renamed by mtime
    for name in ["IMG_001.jpg", "IMG_002.jpg"]:
        img = Image.new("RGB", (100, 80), color=(60, 120, 200))
        img.save(img_dir / name, "JPEG")
    output = tmp_path / "test.gif"
    runner = CliRunner()
    result = runner.invoke(
        cli,
        ["generate", str(img_dir), "-o", str(output), "--width", "64", "--auto-rename"],
    )
    assert result.exit_code == 0
    assert output.exists()
    # Files should have been renamed to date-based names
    remaining = [f.name for f in img_dir.iterdir() if f.is_file()]
    assert any("2026-" in name for name in remaining)


def test_generate_auto_rename_with_prefix(dated_image_dir: Path, tmp_path: Path) -> None:
    output = tmp_path / "test.gif"
    runner = CliRunner()
    result = runner.invoke(
        cli,
        ["generate", str(dated_image_dir), "-o", str(output), "--width", "64", "--auto-rename", "--prefix", "tomato"],
    )
    assert result.exit_code == 0
    assert output.exists()
    remaining = [f.name for f in dated_image_dir.iterdir() if f.is_file()]
    assert any("tomato_" in name for name in remaining)
