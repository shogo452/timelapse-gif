"""Configuration file loader for timelapse-gif."""

from __future__ import annotations

import tomllib
from pathlib import Path


def load_config(path: Path) -> dict:
    """Load a TOML configuration file and return it as a dict.

    Returns an empty dict when the file does not exist.
    """
    if not path.is_file():
        return {}
    with path.open("rb") as f:
        return tomllib.load(f)
