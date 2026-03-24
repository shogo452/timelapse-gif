"""Tests for timelapse_gif.config."""

from __future__ import annotations

from pathlib import Path

from timelapse_gif.config import load_config


def test_load_config_missing_file(tmp_path: Path) -> None:
    """load_config returns empty dict for non-existent path."""
    result = load_config(tmp_path / "nonexistent.toml")
    assert result == {}


def test_load_config_valid_toml(toml_config: Path) -> None:
    """load_config reads a valid TOML file."""
    result = load_config(toml_config)
    assert result["rename"]["prefix"] == "tomato"
    assert result["generate"]["width"] == 320
    assert result["generate"]["duration"] == 300


def test_load_config_empty_file(tmp_path: Path) -> None:
    """load_config returns empty dict for an empty file."""
    path = tmp_path / "empty.toml"
    path.write_text("")
    result = load_config(path)
    assert result == {}
