# PowerShell helper script for testing GitHub Actions workflows locally with act
# Usage: .\scripts\test-workflows.ps1 [workflow-name] [job-name]

param(
  [string]$Workflow = "",
  [string]$Job = ""
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
  $fc = $host.UI.RawUI.ForegroundColor
  $host.UI.RawUI.ForegroundColor = $ForegroundColor
  if ($args) {
    Write-Output $args
  }
  $host.UI.RawUI.ForegroundColor = $fc
}

# Check if act is installed
$actInstalled = Get-Command act -ErrorAction SilentlyContinue
if (-not $actInstalled) {
  Write-ColorOutput Yellow "act is not installed."
  Write-Output "Install it using one of these methods:"
  Write-Output "  Windows (Chocolatey): choco install act-cli"
  Write-Output "  Or download from: https://github.com/nektos/act/releases"
  exit 1
}

# Check if Docker is running
try {
  docker info | Out-Null
}
catch {
  Write-ColorOutput Yellow "Docker is not running. Please start Docker Desktop and try again."
  exit 1
}

if ([string]::IsNullOrEmpty($Workflow)) {
  Write-ColorOutput Green "Available workflows:"
  Write-Output "  ci              - Comprehensive CI/CD Pipeline"
  Write-Output "  security        - Security Scanning"
  Write-Output "  performance     - Performance Monitoring"
  Write-Output "  dependencies    - Dependency Management"
  Write-Output "  pr-validation   - PR Validation"
  Write-Output "  release         - Release Workflow"
  Write-Output ""
  Write-Output "Usage: .\scripts\test-workflows.ps1 [workflow] [job]"
  Write-Output "Example: .\scripts\test-workflows.ps1 ci quality-checks"
  exit 0
}

# Map workflow names to files
$workflowFile = switch ($Workflow) {
  "ci" { ".github\workflows\ci.yml"; break }
  "security" { ".github\workflows\security.yml"; break }
  "performance" { ".github\workflows\performance.yml"; break }
  "dependencies" { ".github\workflows\dependencies.yml"; break }
  "pr-validation" { ".github\workflows\pr-validation.yml"; break }
  "release" { ".github\workflows\release.yml"; break }
  default {
    Write-ColorOutput Yellow "Unknown workflow: $Workflow"
    Write-Output "Available workflows: ci, security, performance, dependencies, pr-validation, release"
    exit 1
  }
}

$event = switch ($Workflow) {
  "dependencies" { "workflow_dispatch"; break }
  "release" { "workflow_dispatch"; break }
  "pr-validation" { "pull_request"; break }
  default { "push" }
}

if (-not (Test-Path $workflowFile)) {
  Write-ColorOutput Yellow "Workflow file not found: $workflowFile"
  exit 1
}

Write-ColorOutput Green "Running workflow: $Workflow"
Write-ColorOutput Blue "Workflow file: $workflowFile"
Write-ColorOutput Blue "Event: $event"

# Build act command
$actCmd = "act -W $workflowFile $event"

# Add job filter if specified
if (-not [string]::IsNullOrEmpty($Job)) {
  $actCmd = "$actCmd -j $Job"
  Write-ColorOutput Blue "Job: $Job"
}

# Add secrets file if it exists
if (Test-Path ".secrets") {
  $actCmd = "$actCmd --secret-file .secrets"
  Write-ColorOutput Blue "Using secrets from .secrets file"
}

Write-Output ""
Write-ColorOutput Green "Executing: $actCmd"
Write-Output ""

# Execute act command
Invoke-Expression $actCmd

