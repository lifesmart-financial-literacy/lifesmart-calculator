#!/bin/bash

# Helper script for testing GitHub Actions workflows locally with act
# Usage: ./scripts/test-workflows.sh [workflow-name] [job-name]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo -e "${YELLOW}act is not installed.${NC}"
    echo "Install it using one of these methods:"
    echo "  Windows (Chocolatey): choco install act-cli"
    echo "  macOS (Homebrew): brew install act"
    echo "  Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${YELLOW}Docker is not running. Please start Docker Desktop and try again.${NC}"
    exit 1
fi

WORKFLOW=${1:-""}
JOB=${2:-""}

echo -e "${BLUE}GitHub Actions Local Testing Helper${NC}"
echo ""

if [ -z "$WORKFLOW" ]; then
    echo -e "${GREEN}Available workflows:${NC}"
    echo "  ci              - Comprehensive CI/CD Pipeline"
    echo "  security        - Security Scanning"
    echo "  performance     - Performance Monitoring"
    echo "  dependencies    - Dependency Management"
    echo "  pr-validation   - PR Validation"
    echo "  release         - Release Workflow"
    echo ""
    echo "Usage: ./scripts/test-workflows.sh [workflow] [job]"
    echo "Example: ./scripts/test-workflows.sh ci quality-checks"
    exit 0
fi

# Map workflow names to files
case $WORKFLOW in
    ci)
        WORKFLOW_FILE=".github/workflows/ci.yml"
        EVENT="push"
        ;;
    security)
        WORKFLOW_FILE=".github/workflows/security.yml"
        EVENT="push"
        ;;
    performance)
        WORKFLOW_FILE=".github/workflows/performance.yml"
        EVENT="push"
        ;;
    dependencies)
        WORKFLOW_FILE=".github/workflows/dependencies.yml"
        EVENT="workflow_dispatch"
        ;;
    pr-validation)
        WORKFLOW_FILE=".github/workflows/pr-validation.yml"
        EVENT="pull_request"
        ;;
    release)
        WORKFLOW_FILE=".github/workflows/release.yml"
        EVENT="workflow_dispatch"
        ;;
    *)
        echo -e "${YELLOW}Unknown workflow: $WORKFLOW${NC}"
        echo "Available workflows: ci, security, performance, dependencies, pr-validation, release"
        exit 1
        ;;
esac

if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${YELLOW}Workflow file not found: $WORKFLOW_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Running workflow: $WORKFLOW${NC}"
echo -e "${BLUE}Workflow file: $WORKFLOW_FILE${NC}"
echo -e "${BLUE}Event: $EVENT${NC}"

# Build act command
ACT_CMD="act -W $WORKFLOW_FILE $EVENT"

# Add job filter if specified
if [ -n "$JOB" ]; then
    ACT_CMD="$ACT_CMD -j $JOB"
    echo -e "${BLUE}Job: $JOB${NC}"
fi

# Add secrets file if it exists
if [ -f ".secrets" ]; then
    ACT_CMD="$ACT_CMD --secret-file .secrets"
    echo -e "${BLUE}Using secrets from .secrets file${NC}"
fi

echo ""
echo -e "${GREEN}Executing: $ACT_CMD${NC}"
echo ""

# Execute act command
eval $ACT_CMD

