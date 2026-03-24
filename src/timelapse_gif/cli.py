"""CLI entry point for timelapse-gif."""

from __future__ import annotations

from datetime import date
from pathlib import Path

import click

from timelapse_gif.config import load_config
from timelapse_gif.gif import generate_gif
from timelapse_gif.rename import execute_rename


CONTEXT_SETTINGS = {"help_option_names": ["-h", "--help"]}


def _validate_prefix(
    ctx: click.Context, param: click.Parameter, value: str | None
) -> str | None:
    """Reject prefix values containing path separators or null bytes."""
    if value is not None:
        if "/" in value or "\\" in value or "\x00" in value:
            raise click.BadParameter(
                "Prefix must not contain path separators (/, \\) or null bytes."
            )
    return value

BANNER = r"""
  _____ _                _                        ____ _  __
 |_   _(_)_ __ ___   ___| | __ _ _ __  ___  ___  / ___(_)/ _|
   | | | | '_ ` _ \ / _ \ |/ _` | '_ \/ __|/ _ \| |  _| | |_
   | | | | | | | | |  __/ | (_| | |_) \__ \  __/| |_| | |  _|
   |_| |_|_| |_| |_|\___|_|\__,_| .__/|___/\___| \____|_|_|
                                 |_|
"""


class BannerGroup(click.Group):
    """Click group that displays an ASCII art banner in help output."""

    def format_help(self, ctx: click.Context, formatter: click.HelpFormatter) -> None:
        formatter.write(BANNER)
        super().format_help(ctx, formatter)


@click.group(cls=BannerGroup, context_settings=CONTEXT_SETTINGS)
@click.version_option(package_name="timelapse-gif")
@click.option(
    "--config",
    "config_path",
    default="timelapse-gif.toml",
    type=click.Path(path_type=Path),
    help="Path to TOML config file.",
)
@click.pass_context
def cli(ctx: click.Context, config_path: Path) -> None:
    """Timelapse GIF generator from image sequences."""
    ctx.default_map = load_config(config_path)


@cli.command(context_settings=CONTEXT_SETTINGS)
@click.argument("directory", type=click.Path(exists=True, file_okay=False, path_type=Path))
@click.option("--dry-run", is_flag=True, help="Preview renames without making changes.")
@click.option("--prefix", default=None, callback=_validate_prefix, expose_value=True, help="Prefix for renamed files (e.g. 'day').")
def rename(directory: Path, dry_run: bool, prefix: str | None) -> None:
    """Rename photos based on EXIF shooting date."""
    execute_rename(directory, prefix=prefix, dry_run=dry_run)


@cli.command(context_settings=CONTEXT_SETTINGS)
@click.argument("directory", type=click.Path(exists=True, file_okay=False, path_type=Path))
@click.option("-o", "--output", default="timelapse.gif", type=click.Path(path_type=Path), help="Output GIF path.")
@click.option("--width", default=640, type=click.IntRange(1, 7680), help="Output width in pixels.")
@click.option("-d", "--duration", default=500, type=click.IntRange(min=10), help="Frame duration in milliseconds.")
@click.option("--date-overlay/--no-date-overlay", default=True, help="Toggle date overlay on frames.")
@click.option("--font-size", default=24, type=click.IntRange(1, 500), help="Date overlay font size.")
@click.option("--loop", default=0, type=click.IntRange(min=0), help="Loop count (0 = infinite).")
@click.option("--start", default=None, type=click.DateTime(formats=["%Y-%m-%d"]), help="Start date filter (YYYY-MM-DD).")
@click.option("--end", default=None, type=click.DateTime(formats=["%Y-%m-%d"]), help="End date filter (YYYY-MM-DD).")
@click.option("--auto-rename", is_flag=True, help="Rename files by EXIF date before generating GIF.")
@click.option("--prefix", default=None, callback=_validate_prefix, expose_value=True, help="Prefix for renamed files (used with --auto-rename).")
def generate(
    directory: Path,
    output: Path,
    width: int,
    duration: int,
    date_overlay: bool,
    font_size: int,
    loop: int,
    start: date | None,
    end: date | None,
    auto_rename: bool,
    prefix: str | None,
) -> None:
    """Generate a timelapse GIF from a directory of photos."""
    if auto_rename:
        execute_rename(directory, prefix=prefix)

    start_date = start.date() if start else None
    end_date = end.date() if end else None

    generate_gif(
        directory,
        output=output,
        width=width,
        duration=duration,
        date_overlay=date_overlay,
        font_size=font_size,
        loop=loop,
        start=start_date,
        end=end_date,
    )
