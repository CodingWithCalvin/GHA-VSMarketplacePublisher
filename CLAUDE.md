# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules

**These rules override all other instructions:**

1. **NEVER commit directly to main** - Always create a feature branch and submit a pull request
2. **Conventional commits** - Format: `type(scope): description`
3. **GitHub Issues for TODOs** - Use `gh` CLI to manage issues, no local TODO files. Use conventional commit format for issue titles
4. **Pull Request titles** - Use conventional commit format (same as commits)
5. **Branch naming** - Use format: `type/short-description` (e.g., `feat/settings-dialog`)
6. **Working an issue** - Always create a new branch from an updated main branch
7. **Check branch status before pushing** - Verify the remote tracking branch still exists. If a PR was merged/deleted, create a new branch from main instead

---

### GitHub CLI Commands

```bash
gh issue list                    # List open issues
gh issue view <number>           # View details
gh issue create --title "type(scope): description" --body "..."
gh issue close <number>
```

### Conventional Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

---

## Project Overview

GitHub Action to publish Visual Studio extensions to the Visual Studio Marketplace. This action only runs on Windows-based runners.

## Commands

```bash
# Install dependencies
npm ci

# Run all checks (format, lint, test, package)
npm run all

# Individual commands
npm run format:check    # Check formatting
npm run format:write    # Fix formatting
npm run lint            # Run ESLint
npm run test            # Run tests
npm run ci-test         # Run tests (CI mode)
npm run package         # Bundle with ncc to dist/
npm run bundle          # Format + package
```

## Architecture

This is a single-file TypeScript GitHub Action:

- `src/index.ts` - The entire action logic:
  1. Validates Windows platform requirement
  2. Resolves paths for publish manifest and VSIX file
  3. Locates Visual Studio installation via `vswhere.exe`
  4. Runs `VsixPublisher.exe` to publish the extension

- `action.yml` - Action metadata defining inputs (`marketplace-pat`, `publish-manifest-path`, `vsix-path`, `vs-version`, `vs-prerelease`)
- `dist/index.js` - Bundled output (committed, built with `@vercel/ncc`)
- `__tests__/index.test.ts` - Jest tests

## Key Details

- Node.js 21+ required (see `.node-version`)
- ESLint config at `.github/linters/.eslintrc.yml`
- The bundled `dist/` directory must be committed after changes to source
- TypeScript strict mode enabled
