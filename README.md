# timelapse-gif

A CLI tool that generates timelapse GIF images from image sequences.

## Features

- **rename** — Rename photo files to `YYYY-MM-DD.jpg` format based on EXIF date taken
- **generate** — Generate a timelapse GIF from images in a directory (with date overlay)

## Installation

### From PyPI (after publishing)

```bash
pip install timelapse-gif
```

### Directly from the repository

```bash
pip install git+https://github.com/shogo452/timelapse-gif.git
```

### For development (clone and use the repository)

```bash
git clone https://github.com/shogo452/timelapse-gif.git
cd timelapse-gif
uv sync
```

## Requirements

- Python 3.13+

## Usage

> **Note:** For development setup, prefix commands with `uv run`.
> If installed from PyPI, you can run `timelapse-gif` directly.

### Show help

```bash
timelapse-gif --help
timelapse-gif rename --help
timelapse-gif generate --help
```

### Rename photos

Renames files to `YYYY-MM-DD.jpg` based on EXIF date taken.
Falls back to the file modification date if EXIF data is not available.

```bash
# Preview (does not actually rename)
timelapse-gif rename ./photos --dry-run
```

```
[dry-run] IMG_0781.jpg -> 2026-02-10.jpg
[dry-run] IMG_0782.jpg -> 2026-02-11.jpg
[dry-run] IMG_0783.jpg -> 2026-02-12.jpg
```

```bash
# Execute (apply renaming)
timelapse-gif rename ./photos

# With prefix (e.g., day_2026-02-17.jpg)
timelapse-gif rename ./photos --prefix day
```

If multiple files share the same date, a suffix is added like `YYYY-MM-DD_1.jpg`.

#### rename options

| Option | Description |
|---|---|
| `--dry-run` | Preview only (does not actually rename) |
| `--prefix TEXT` | Add a prefix to the file name |

### Generate timelapse GIF

Combines images in a directory in ascending filename order to generate a GIF animation.
It is recommended to rename files to date order using the `rename` command first.

```bash
# Basic (default: width 640px, 500ms/frame, date overlay enabled)
timelapse-gif generate ./photos
```

```
Generated timelapse.gif (30 frames, 500ms/frame)
```

```bash
# Specify output path, size, and speed
timelapse-gif generate ./photos \
  -o output.gif \
  --width 800 \
  --duration 300

# Filter by date range, without date overlay
timelapse-gif generate ./photos \
  --start 2026-02-10 \
  --end 2026-02-17 \
  --no-date-overlay

# Change font size, loop 3 times
timelapse-gif generate ./photos \
  --font-size 32 \
  --loop 3
```

#### generate options

| Option | Default | Description |
|---|---|---|
| `-o`, `--output` | `timelapse.gif` | Output file path |
| `--width` | `640` | Output width (px). Height is calculated automatically from the aspect ratio |
| `-d`, `--duration` | `500` | Display duration per frame (ms) |
| `--date-overlay` / `--no-date-overlay` | Enabled | Toggle date overlay display |
| `--font-size` | `24` | Font size for date overlay |
| `--loop` | `0` | Number of loops (0 = infinite loop) |
| `--start` | None | Start date filter (`YYYY-MM-DD`) |
| `--end` | None | End date filter (`YYYY-MM-DD`) |

## Configuration file

You can define default values for CLI options by placing a `timelapse-gif.toml` file in the current directory.
CLI arguments take precedence when specified. The file is ignored if it does not exist.

```toml
[rename]
prefix = "day"

[generate]
output = "timelapse.gif"
width = 800
duration = 300
date-overlay = true
font-size = 32
loop = 0
```

You can also specify a different path using the `--config` option.

```bash
timelapse-gif --config my-config.toml generate ./photos
```

## Typical workflow

```bash
# 1. Gather photos into a single directory
ls ./photos/
# IMG_0781.jpg  IMG_0782.jpg  IMG_0783.jpg ...

# 2. Rename by EXIF date (preview first)
timelapse-gif rename ./photos --dry-run --prefix day

# 3. Execute if everything looks good
timelapse-gif rename ./photos --prefix day
ls ./photos/
# day_2026-02-10.jpg  day_2026-02-11.jpg  day_2026-02-12.jpg ...

# 4. Generate timelapse GIF
timelapse-gif generate ./photos -o timelapse.gif --width 800 --duration 300
```

## Supported image formats

JPEG, PNG, TIFF, WebP, GIF

## License

MIT
