# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.1] - 2026-04-05

### Fixed

- Use absolute URL for OG image in README to display correctly on PyPI

## [0.2.0] - 2026-03-25

### Changed

- Add OG image as README header

## [0.1.0] - 2026-03-25

### Added

- `rename` subcommand: rename photo files by EXIF date (`YYYY-MM-DD.jpg`)
- `generate` subcommand: create timelapse GIF with date overlay
- Configuration file support (`timelapse-gif.toml`)
- Date range filtering (`--start`, `--end`)
- Customizable output width, frame duration, font size, and loop count
- Bundled Roboto font for date overlay
- Web site for project documentation
- CI workflow for automated testing
- OSS community files (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY)

[0.2.1]: https://github.com/shogo452/timelapse-gif/releases/tag/v0.2.1
[0.2.0]: https://github.com/shogo452/timelapse-gif/releases/tag/v0.2.0
[0.1.0]: https://github.com/shogo452/timelapse-gif/releases/tag/v0.1.0
