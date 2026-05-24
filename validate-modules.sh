#!/usr/bin/env bash
#
# validate-modules.sh — Walk through every module and validate README/docs
# against official documentation. Uses pi in non-interactive mode (-p).
#
# For each module:
#   1. Run pi with a validation prompt
#   2. If pi leaves us off main or with uncommitted changes, run pi again
#      as a safeguard to branch + commit + switch back to main
#
# Usage:
#   ./validate-modules.sh              # validate all modules
#   ./validate-modules.sh 11           # validate only module 11 (auth)
#   ./validate-modules.sh ts-03        # validate TS track module 03
#   ./validate-modules.sh wd-05        # validate Web Dev track module 05
#   ./validate-modules.sh pro          # validate Pro Guidelines
#   ./validate-modules.sh root         # validate root docs (README, CONTEXT, demo-app)
#   ./validate-modules.sh ref          # validate reference app

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

# ─── Module lists ───────────────────────────────────────────────────

TS_MODULES=()
for d in 01-typescript-fundamentals/*/; do
  TS_MODULES+=("$d")
done

WD_MODULES=()
for d in 02-web-development/*/; do
  WD_MODULES+=("$d")
done

PRO_FILES=()
for f in 03-professional-guidelines/*.md; do
  PRO_FILES+=("$f")
done

ROOT_FILES=("README.md" "CONTEXT.md" "demo-app.md")

ALL_MODULES=()
for m in "${TS_MODULES[@]}"; do ALL_MODULES+=("$m"); done
for m in "${WD_MODULES[@]}"; do ALL_MODULES+=("$m"); done
ALL_MODULES+=("pro")
ALL_MODULES+=("root")
ALL_MODULES+=("ref")

# ─── Prompt builder ─────────────────────────────────────────────────

build_prompt() {
  local module_path="$1"
  local module_label="$2"

  cat <<PROMPT
You are validating a self-learning web development course repository. Your job is to find and fix mistakes in the documentation.

## Context file
Read CONTEXT.md at the repo root for the project's conventions, glossary, and decisions.

## Your task: Validate ${module_label}

1. Read the README.md (and any example/exercise/solution files if present) in ${module_path}
2. For every URL/link referenced in the documentation:
   - Use web search to verify the URL is valid and points to the correct resource
   - If a URL is broken or incorrect, find the correct URL from official docs
3. For every code example:
   - Verify API usage against official documentation (use web search)
   - Check for typos, incorrect imports, or deprecated APIs
   - Verify import paths match the current version of the packages
4. For conceptual explanations:
   - Cross-check facts against official documentation
   - Fix any technically incorrect statements
5. Check consistency with CONTEXT.md conventions (naming, patterns, stack versions)

## Important rules
- Only fix things you can VERIFY from official documentation or by reading the actual code files
- If you are unsure about something, leave it as-is rather than guessing
- Use search tools to validate URLs and API references against official docs
- Check that all code examples use the correct import paths and API signatures

## If you find mistakes
1. Create a new git branch named "fix/${module_label//\//-}" (replace slashes with dashes)
2. Make the corrections using the edit tool
3. Commit with a descriptive message
4. Switch back to the main branch

## If everything is correct
- Say "No issues found in ${module_label}" and do not create any branches or make any changes

Start by reading CONTEXT.md, then validate ${module_label}.
PROMPT
}

build_pro_prompt() {
  cat <<PROMPT
You are validating a self-learning web development course repository. Your job is to find and fix mistakes in the documentation.

## Context file
Read CONTEXT.md at the repo root for the project's conventions, glossary, and decisions.

## Your task: Validate Pro Guidelines (03-professional-guidelines/)

1. Read ALL markdown files in 03-professional-guidelines/
2. For every URL/link referenced:
   - Use web search to verify the URL is valid and points to the correct resource
   - If a URL is broken or incorrect, find the correct URL from official docs
3. For factual claims about tools, technologies, or practices:
   - Cross-check against official documentation
   - Fix any incorrect statements
4. Check consistency with CONTEXT.md conventions

## Important rules
- Only fix things you can VERIFY from official documentation
- If unsure, leave as-is
- Use search tools to validate URLs against official docs

## If you find mistakes
1. Create a new git branch named "fix/pro-guidelines"
2. Make the corrections
3. Commit with a descriptive message
4. Switch back to main

## If everything is correct
- Say "No issues found in Pro Guidelines" and do not create any branches

Start by reading CONTEXT.md, then validate all Pro Guidelines files.
PROMPT
}

build_root_prompt() {
  cat <<PROMPT
You are validating a self-learning web development course repository. Your job is to find and fix mistakes in the documentation.

## Context file
Read CONTEXT.md at the repo root.

## Your task: Validate root documentation files

1. Read README.md, CONTEXT.md, and demo-app.md
2. For every URL/link referenced:
   - Use web search to verify the URL is valid and points to the correct resource
   - If a URL is broken or incorrect, find the correct URL from official docs
3. Check that README.md accurately describes the repo structure and tracks
4. Check that CONTEXT.md is internally consistent (glossary matches decisions, etc.)
5. Check that demo-app.md matches the actual implementation in devstack-bio-reference/

## Important rules
- Only fix things you can VERIFY
- If unsure, leave as-is

## If you find mistakes
1. Create a new git branch named "fix/root-docs"
2. Make the corrections
3. Commit with a descriptive message
4. Switch back to main

## If everything is correct
- Say "No issues found in root docs" and do not create any branches

Start by reading all three root files.
PROMPT
}

build_ref_prompt() {
  cat <<PROMPT
You are validating a self-learning web development course repository. Your job is to find and fix mistakes in the reference app code.

## Context file
Read CONTEXT.md at the repo root for conventions and decisions.
Also read demo-app.md for the app specification.

## Your task: Validate the reference app (devstack-bio-reference/)

1. Read all source files in devstack-bio-reference/src/
2. Check imports against the actual installed packages:
   - TanStack Start / Router / React Router imports
   - Drizzle ORM API usage (v1 stable, not v2)
   - shadcn/ui component usage
   - Zod schema usage
3. Verify the code follows the patterns documented in CONTEXT.md:
   - Server functions return { success: true } or { error: string } (no throw redirect)
   - Client uses useNavigate() for post-action navigation
   - Theme uses dark class on <html>
   - CSS uses shadcn theme tokens (not hardcoded Tailwind colors)
4. Run TypeScript check: cd devstack-bio-reference && npx tsc --noEmit
5. Run build: cd devstack-bio-reference && npm run build
6. If TypeScript or build fails, fix the issues

## Important rules
- Only fix things you can VERIFY
- If unsure, leave as-is
- Make sure changes are consistent with the Web Dev Track READMEs

## If you find mistakes
1. Create a new git branch named "fix/reference-app"
2. Make the corrections
3. Run tsc and build again to confirm fixes
4. Commit with a descriptive message
5. Switch back to main

## If everything is correct
- Say "No issues found in reference app" and do not create any branches

Start by reading CONTEXT.md and demo-app.md, then validate the reference app.
PROMPT
}

# ─── Safeguard: ensure we're on main with clean state ────────────────

run_safeguard() {
  local module_label="$1"
  local current_branch
  current_branch=$(git branch --show-current)
  local has_changes
  has_changes=$(git status --porcelain | head -1)

  if [[ "$current_branch" == "main" && -z "$has_changes" ]]; then
    return 0
  fi

  echo ""
  echo "⚠️  Safeguard triggered for ${module_label}"
  echo "   Current branch: ${current_branch}"
  echo "   Uncommitted changes: $([ -n "$has_changes" ] && echo 'YES' || echo 'no')"

  local safe_branch="fix/${module_label//\//-}-safeguard"

  pi -p "You are fixing git state for the repository.

Current branch: ${current_branch}
Uncommitted changes: $([ -n "$has_changes" ] && echo 'yes' || echo 'no')

Do the following:
1. If there are uncommitted changes:
   a. If not already on a fix branch, create branch '${safe_branch}'
   b. Stage and commit all changes with a descriptive message
2. If on a branch that is not main, switch back to main
3. Verify you are now on main with a clean working tree

Do NOT modify any file content. Only manage git state."
}

# ─── Run one module ─────────────────────────────────────────────────

run_module() {
  local module_path="$1"
  local module_label="$2"
  local prompt

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: ${module_label}"
  echo "  Path: ${module_path}"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  prompt=$(build_prompt "$module_path" "$module_label")

  # Run pi in non-interactive mode
  pi -p "$prompt" 2>&1 || true

  # Safeguard
  run_safeguard "$module_label"

  echo "✓ Done: ${module_label}"
}

run_pro() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: Pro Guidelines (03-professional-guidelines/)"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pi -p "$(build_pro_prompt)" 2>&1 || true

  run_safeguard "pro-guidelines"

  echo "✓ Done: Pro Guidelines"
}

run_root() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: Root docs (README.md, CONTEXT.md, demo-app.md)"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pi -p "$(build_root_prompt)" 2>&1 || true

  run_safeguard "root-docs"

  echo "✓ Done: Root docs"
}

run_ref() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: Reference app (devstack-bio-reference/)"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pi -p "$(build_ref_prompt)" 2>&1 || true

  run_safeguard "reference-app"

  echo "✓ Done: Reference app"
}

# ─── Filter by argument ─────────────────────────────────────────────

run_selected() {
  local selector="$1"

  # TS track: ts-01 through ts-12
  if [[ "$selector" =~ ^ts-([0-9]+)$ ]]; then
    local num="${BASH_REMATCH[1]}"
    local dir
    dir=$(printf "01-typescript-fundamentals/%02d-"* "$num" 2>/dev/null || true)
    if [[ -z "$dir" || ! -d "$dir" ]]; then
      # Try listing
      for d in "${TS_MODULES[@]}"; do
        if [[ "$d" =~ /${num}- ]]; then
          dir="$d"
          break
        fi
      done
    fi
    if [[ -n "$dir" && -d "$dir" ]]; then
      local label
      label=$(echo "$dir" | sed 's:/$::' | sed 's:/: -: ')
      run_module "$dir" "$label"
    else
      echo "ERROR: TS module ${num} not found"
      exit 1
    fi
    return
  fi

  # Web Dev track: wd-01 through wd-14
  if [[ "$selector" =~ ^wd-([0-9]+)$ ]]; then
    local num="${BASH_REMATCH[1]}"
    local dir=""
    for d in "${WD_MODULES[@]}"; do
      if [[ "$d" =~ /${num}- ]]; then
        dir="$d"
        break
      fi
    done
    if [[ -n "$dir" && -d "$dir" ]]; then
      local label
      label=$(echo "$dir" | sed 's:/$::' | sed 's:/: -: ')
      run_module "$dir" "$label"
    else
      echo "ERROR: Web Dev module ${num} not found"
      exit 1
    fi
    return
  fi

  # Pro guidelines
  if [[ "$selector" == "pro" ]]; then
    run_pro
    return
  fi

  # Root docs
  if [[ "$selector" == "root" ]]; then
    run_root
    return
  fi

  # Reference app
  if [[ "$selector" == "ref" ]]; then
    run_ref
    return
  fi

  # Numeric only: match Web Dev module (most likely needed)
  if [[ "$selector" =~ ^[0-9]+$ ]]; then
    local num="$selector"
    local dir=""
    for d in "${WD_MODULES[@]}"; do
      if [[ "$d" =~ /${num}- ]]; then
        dir="$d"
        break
      fi
    done
    if [[ -n "$dir" && -d "$dir" ]]; then
      local label
      label=$(echo "$dir" | sed 's:/$::' | sed 's:/: -: ')
      run_module "$dir" "$label"
      return
    fi
    echo "ERROR: Module ${num} not found in Web Dev track"
    exit 1
  fi

  echo "ERROR: Unknown selector '${selector}'"
  echo "Use: ts-01..ts-12, wd-01..wd-14, pro, root, ref"
  exit 1
}

# ─── Main ───────────────────────────────────────────────────────────

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       Web Development Starter — Module Validator          ║"
echo "║       Repo: ${REPO_ROOT}"
echo "╚════════════════════════════════════════════════════════════╝"

# Verify we're on main with clean state
current=$(git branch --show-current)
if [[ "$current" != "main" ]]; then
  echo "ERROR: Not on main branch (currently on ${current})"
  exit 1
fi

dirty=$(git status --porcelain | head -1)
if [[ -n "$dirty" ]]; then
  echo "ERROR: Working tree has uncommitted changes"
  git status --short
  exit 1
fi

START_TIME=$(date +%s)

if [[ $# -eq 0 ]]; then
  # No args: run all modules
  echo ""
  echo "Running ALL modules..."
  echo ""

  # TS Track
  echo ""
  echo "═══ Track 01: TypeScript Fundamentals ═══"
  for d in "${TS_MODULES[@]}"; do
    label=$(echo "$d" | sed 's:/$::' | sed 's:/: -: ')
    run_module "$d" "$label"
  done

  # Web Dev Track
  echo ""
  echo "═══ Track 02: Web Development ═══"
  for d in "${WD_MODULES[@]}"; do
    label=$(echo "$d" | sed 's:/$::' | sed 's:/: -: ')
    run_module "$d" "$label"
  done

  # Pro Guidelines
  echo ""
  echo "═══ Track 03: Professional Guidelines ═══"
  run_pro

  # Root docs
  echo ""
  echo "═══ Root Documentation ═══"
  run_root

  # Reference app
  echo ""
  echo "═══ Reference App ═══"
  run_ref

else
  # Run selected modules
  for arg in "$@"; do
    run_selected "$arg"
  done
fi

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Validation Complete                     ║"
echo "║  Elapsed: ${MINUTES}m ${SECONDS}s"
echo "╚════════════════════════════════════════════════════════════╝"

# Final state check
echo ""
echo "Git branches created during validation:"
git branch --list 'fix/*'

echo ""
echo "Current branch: $(git branch --show-current)"
echo "Working tree: $(git diff --quiet 2>/dev/null && echo 'clean' || echo 'DIRTY')"
