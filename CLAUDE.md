# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

timelapse-gif is a CLI tool that generates timelapse GIF images from image sequences. Two subcommands: `rename` (rename photo files by EXIF date) and `generate` (create timelapse GIFs with date overlays).

## Commands

```bash
# Install dependencies
uv sync

# Run CLI
uv run timelapse-gif --help
uv run timelapse-gif rename ./photos --dry-run
uv run timelapse-gif generate ./photos -o output.gif

# Run all tests with coverage
uv run pytest --cov --cov-report=term-missing

# Run a single test file or test
uv run pytest tests/test_rename.py
uv run pytest tests/test_rename.py::test_function_name -v

# Build & publish
uv build
uv publish
```

**Python 3.13+** required. Uses **uv** + **hatchling**. Version is sourced from `src/timelapse_gif/__init__.py` (`__version__`). Coverage threshold: 80%.

## Architecture

`src/timelapse_gif/` — flat module layout, `src` layout with hatchling build:

- **cli.py** — Click `Group` subclass (`BannerGroup`) with two subcommands. Config defaults loaded into `ctx.default_map` from TOML.
- **config.py** — Reads `timelapse-gif.toml` via `tomllib`. Returns empty dict if file missing.
- **rename.py** — `build_rename_plan()` collects images, reads EXIF `DateTimeOriginal`/`DateTime` (falls back to mtime), sorts by date, handles duplicate dates with `_N` suffixes. `execute_rename()` applies the plan with progress bar.
- **gif.py** — `collect_images()` gathers and optionally date-filters files. `generate_gif()` resizes (aspect-ratio preserving), applies overlay, saves animated GIF via Pillow.
- **overlay.py** — `draw_date_overlay()` draws semi-transparent label on bottom-left. `date_from_filename()` extracts `YYYY-MM-DD` via regex. Bundles `fonts/Roboto.ttf`.

## Testing

Tests mirror source modules (`test_cli.py`, `test_gif.py`, `test_rename.py`, `test_overlay.py`, `test_config.py`). Shared fixtures in `conftest.py` create temporary JPEG images — including a raw EXIF builder (`_make_jpeg_with_exif_raw`) that avoids the `piexif` dependency. CLI tests use Click's `CliRunner`.

## Configuration

Users can place `timelapse-gif.toml` in working directory with `[rename]` and `[generate]` sections. CLI args override config. Custom path via `--config`.
