# Claude Code Configuration

This directory contains configuration files for Claude Code, Anthropic's AI coding assistant.

## Structure

- `config.toml` - Main configuration file with project settings
- `commands/` - Custom slash commands (e.g., `/custom-command`)
- `hooks/` - Lifecycle hooks for automated tasks

## Usage

With Claude Code installed, these configurations will be automatically loaded when working in this repository.

### Available Scripts

- `npm run generate` - Generate project files and build CSS
- `npm run build` - Build production CSS
- `npm run start` - Generate, build, and serve the project

### Custom Commands

Place custom command files in the `commands/` directory with `.md` extension.

### Hooks

Place hook scripts in the `hooks/` directory to run automatically on events like:
- Session start
- Before/after commits
- File changes

## Learn More

Visit [Claude Code documentation](https://github.com/anthropics/claude-code) for more information.
