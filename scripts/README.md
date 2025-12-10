# Scripts Directory

This directory contains automation scripts for the LifeSmart Calculator project.

## Files

### `update_changelog.py`

A smart changelog generator that automatically creates meaningful changelog entries from git commits.

**Features:**
- ✨ **Smart categorization** - Automatically categorizes commits by type
- 📊 **Commit statistics** - Shows insertion/deletion counts
- 🎨 **Professional formatting** - Beautiful emoji-based sections
- 🔍 **Conventional commits** - Supports conventional commit format
- 📅 **Automatic dating** - Extracts commit dates for releases

**Usage:**
```bash
# Update changelog for a specific release
python scripts/update_changelog.py v1.2.3

# Or use the release script (recommended)
./release.sh --minor
```

**Commit Types Supported:**
- `feat:` - New features and enhancements
- `fix:` - Bug fixes and improvements
- `docs:` - Documentation updates
- `style:` - Code style and formatting changes
- `refactor:` - Code refactoring and restructuring
- `perf:` - Performance improvements
- `test:` - Test additions and improvements
- `chore:` - Maintenance tasks and chores
- `security:` - Security improvements
- `build:` - Build system changes
- `ci:` - CI/CD pipeline changes
- `revert:` - Reverted changes
- `remove:` - Removed features and cleanup
- `deps:` - Dependency updates

**Requirements:**
- Python 3.6+
- Git repository with commit history
- Proper git configuration

## Integration

This script is automatically called by the `release.sh` script when creating new releases. It ensures that every release has a properly formatted changelog entry with categorized changes.

## Examples

The script will automatically:
1. Analyze all commits since the last release
2. Categorize them by type and impact
3. Format them with emojis and statistics
4. Insert them into the CHANGELOG.md file
5. Maintain proper chronological order

This creates professional, readable changelogs that users and developers can easily understand.

---

### `test-workflows.sh` / `test-workflows.ps1`

Helper scripts for testing GitHub Actions workflows locally using [`act`](https://github.com/nektos/act).

**Features:**
- 🚀 **Easy workflow testing** - Test workflows before pushing
- 🎯 **Job-specific testing** - Run individual jobs or entire workflows
- 🔐 **Secrets support** - Automatically uses `.secrets` file if present
- ✅ **Pre-flight checks** - Verifies Docker and act are installed

**Prerequisites:**
- Docker Desktop installed and running
- `act` CLI tool installed
  - Windows: `choco install act-cli`
  - macOS: `brew install act`
  - Linux: See [act installation guide](https://github.com/nektos/act#installation)

**Usage (Bash/Linux/macOS):**
```bash
# List available workflows
./scripts/test-workflows.sh

# Run a specific workflow
./scripts/test-workflows.sh ci

# Run a specific job
./scripts/test-workflows.sh ci quality-checks

# Run security workflow
./scripts/test-workflows.sh security
```

**Usage (PowerShell/Windows):**
```powershell
# List available workflows
.\scripts\test-workflows.ps1

# Run a specific workflow
.\scripts\test-workflows.ps1 ci

# Run a specific job
.\scripts\test-workflows.ps1 ci quality-checks

# Run security workflow
.\scripts\test-workflows.ps1 security
```

**Available Workflows:**
- `ci` - Comprehensive CI/CD Pipeline
- `security` - Security Scanning
- `performance` - Performance Monitoring
- `dependencies` - Dependency Management
- `pr-validation` - PR Validation
- `release` - Release Workflow

**Secrets File:**
Create a `.secrets` file in the project root (already in `.gitignore`):
```bash
GITHUB_TOKEN=your_personal_access_token
SNYK_TOKEN=your_snyk_token
SEMGREP_APP_TOKEN=your_semgrep_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token
```

**Examples:**
```bash
# Test the lint step
./scripts/test-workflows.sh ci lint

# Test security scanning
./scripts/test-workflows.sh security code-security

# Test dependency updates
./scripts/test-workflows.sh dependencies security-updates
```

**Note:** Some actions may behave differently in local Docker environment compared to GitHub-hosted runners. Always verify critical workflows on GitHub Actions as well.

For more information, see the [Local Workflow Testing section](../docs/development.md#local-workflow-testing) in the development guide.
