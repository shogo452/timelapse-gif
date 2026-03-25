# Contributing to timelapse-gif

Thank you for your interest in contributing to timelapse-gif!

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/timelapse-gif.git
cd timelapse-gif
uv sync
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/shogo452/timelapse-gif.git
```

## Development Workflow

1. Sync your fork with upstream (`git pull upstream main`)
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run tests to make sure everything passes
5. Commit your changes (`git commit -m 'Add my feature'`)
6. Push to your fork (`git push origin feature/my-feature`)
7. Open a Pull Request from your fork to the upstream repository

## Running Tests

```bash
# Run all tests with coverage
uv run pytest --cov --cov-report=term-missing

# Run a specific test file
uv run pytest tests/test_rename.py

# Run a specific test
uv run pytest tests/test_rename.py::test_function_name -v
```

Coverage threshold is 80%. Please ensure your changes maintain or improve test coverage.

## Code Style

- Python 3.13+ features are welcome
- Keep code simple and readable
- Add tests for new features and bug fixes

## Reporting Bugs

Use [GitHub Issues](https://github.com/shogo452/timelapse-gif/issues) to report bugs. Please include:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Python version and OS

## Feature Requests

Feature requests are welcome! Please open an issue describing the feature and its use case.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
