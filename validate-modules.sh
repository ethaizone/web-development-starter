#!/usr/bin/env bash
#
# validate-modules.sh — Walk through every module and validate README/docs
# against official documentation. Uses pi in non-interactive mode (-p).
#
# Progress is tracked in .validate-progress.json — if pi crashes (quota, etc.),
# re-running the same command skips completed modules and resumes.
#
# Usage:
#   ./validate-modules.sh              # validate all modules (resumes if interrupted)
#   ./validate-modules.sh 11           # validate only module 11 (auth)
#   ./validate-modules.sh ts-03        # validate TS track module 03
#   ./validate-modules.sh wd-05        # validate Web Dev track module 05
#   ./validate-modules.sh pro          # validate Pro Guidelines
#   ./validate-modules.sh root         # validate root docs (README, CONTEXT, demo-app)
#   ./validate-modules.sh ref          # validate reference app
#   ./validate-modules.sh --reset      # clear progress and start fresh
#   ./validate-modules.sh --status     # show progress without running anything

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

PROGRESS_FILE="$REPO_ROOT/.validate-progress.json"

# ─── Progress file helpers ──────────────────────────────────────────
# Format: { "ts-01": "ok", "ts-02": "fail", ... }
# Status values: "ok" | "fail" | "quota" | "running"

progress_init() {
  if [[ ! -f "$PROGRESS_FILE" ]]; then
    echo '{}' > "$PROGRESS_FILE"
  fi
}

progress_get() {
  # Usage: progress_get "ts-03" => "ok" or "" if not set
  local key="$1"
  node -e "
    const d = JSON.parse(require('fs').readFileSync('$PROGRESS_FILE','utf8'));
    console.log(d['$key'] || '');
  " 2>/dev/null
}

progress_set() {
  # Usage: progress_set "ts-03" "ok"
  local key="$1"
  local status="$2"
  node -e "
    const f = '$PROGRESS_FILE';
    const d = JSON.parse(require('fs').readFileSync(f,'utf8'));
    d['$key'] = '$status';
    require('fs').writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
  "
}

progress_remove() {
  local key="$1"
  node -e "
    const f = '$PROGRESS_FILE';
    const d = JSON.parse(require('fs').readFileSync(f,'utf8'));
    delete d['$key'];
    require('fs').writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
  "
}

progress_reset() {
  echo '{}' > "$PROGRESS_FILE"
  echo "Progress cleared."
}

progress_summary() {
  progress_init
  echo ""
  echo "═══ Validation Progress ═══"
  echo ""

  local all_keys=(
    ts-01 ts-02 ts-03 ts-04 ts-05 ts-06 ts-07 ts-08 ts-09 ts-10 ts-11 ts-12
    wd-01 wd-02 wd-03 wd-04 wd-05 wd-06 wd-07 wd-08 wd-09 wd-10 wd-11 wd-12 wd-13 wd-14
    pro root ref
  )

  local ok=0 fail=0 quota=0 running=0 pending=0

  for key in "${all_keys[@]}"; do
    local status
    status=$(progress_get "$key")

    case "$status" in
      ok)      echo "  ✅ $key — passed";      ((ok++)) || true ;;
      fail)    echo "  ❌ $key — failed";       ((fail++)) || true ;;
      quota)   echo "  🛑 $key — quota exceeded"; ((quota++)) || true ;;
      running) echo "  🔄 $key — running (crashed?)"; ((running++)) || true ;;
      "")      echo "  ⬜ $key — pending";      ((pending++)) || true ;;
    esac
  done

  echo ""
  echo "  Total: ${#all_keys[@]} | ✅ $ok | ❌ $fail | 🛑 $quota | 🔄 $running | ⬜ $pending"
  echo ""
}

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

# ─── Prompt builders ────────────────────────────────────────────────

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
  local safeguard_rc=0

  pi -p "You are fixing git state for the repository.

Current branch: ${current_branch}
Uncommitted changes: $([ -n "$has_changes" ] && echo 'yes' || echo 'no')

Do the following:
1. If there are uncommitted changes:
   a. If not already on a fix branch, create branch '${safe_branch}'
   b. Stage and commit all changes with a descriptive message
2. If on a branch that is not main, switch back to main
3. Verify you are now on main with a clean working tree

Do NOT modify any file content. Only manage git state." 2>&1 || safeguard_rc=$?

  if [[ $safeguard_rc -ne 0 ]]; then
    echo "🛑 Safeguard also failed (exit code $safeguard_rc). Likely quota issue."
    return 1
  fi
}

# ─── Run pi and check exit code ─────────────────────────────────────

run_pi() {
  local progress_key="$1"
  local prompt="$2"
  local module_label="$3"

  # Mark as running
  progress_set "$progress_key" "running"

  local pi_rc=0
  pi -p "$prompt" 2>&1 || pi_rc=$?

  if [[ $pi_rc -ne 0 ]]; then
    echo ""
    echo "🛑 pi exited with code ${pi_rc} — likely quota exceeded or API error"
    echo "   Module ${module_label} marked as 'quota'. Re-run to retry."
    progress_set "$progress_key" "quota"

    # Try safeguard anyway (best effort)
    run_safeguard "$module_label" || true
    return 1
  fi

  return 0
}

# ─── Run one module ─────────────────────────────────────────────────

run_module() {
  local module_path="$1"
  local module_label="$2"
  local progress_key="$3"

  # Skip if already completed successfully
  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo "⏭  Skipping ${module_label} — already validated ✅"
    return 0
  fi

  # If previously marked quota or fail, clear the "running" leftover and retry
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: ${module_label}"
  echo "  Path: ${module_path}"
  echo "  Key: ${progress_key}"
  case "$status" in
    quota)   echo "  Previous: quota exceeded — retrying" ;;
    fail)    echo "  Previous: failed — retrying" ;;
    running) echo "  Previous: crashed mid-run — retrying" ;;
  esac
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  local prompt
  prompt=$(build_prompt "$module_path" "$module_label")

  if run_pi "$progress_key" "$prompt" "$module_label"; then
    # Safeguard
    run_safeguard "$module_label" || true
    progress_set "$progress_key" "ok"
    echo "✓ Done: ${module_label}"
  fi
}

run_pro() {
  local progress_key="pro"

  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo "⏭  Skipping Pro Guidelines — already validated ✅"
    return 0
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: Pro Guidelines (03-professional-guidelines/)"
  echo "  Key: ${progress_key}"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if run_pi "$progress_key" "$(build_pro_prompt)" "Pro Guidelines"; then
    run_safeguard "pro-guidelines" || true
    progress_set "$progress_key" "ok"
    echo "✓ Done: Pro Guidelines"
  fi
}

run_root() {
  local progress_key="root"

  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo "⏭  Skipping Root docs — already validated ✅"
    return 0
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: Root docs (README.md, CONTEXT.md, demo-app.md)"
  echo "  Key: ${progress_key}"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if run_pi "$progress_key" "$(build_root_prompt)" "Root docs"; then
    run_safeguard "root-docs" || true
    progress_set "$progress_key" "ok"
    echo "✓ Done: Root docs"
  fi
}

run_ref() {
  local progress_key="ref"

  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo "⏭  Skipping Reference app — already validated ✅"
    return 0
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Validating: Reference app (devstack-bio-reference/)"
  echo "  Key: ${progress_key}"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if run_pi "$progress_key" "$(build_ref_prompt)" "Reference app"; then
    run_safeguard "reference-app" || true
    progress_set "$progress_key" "ok"
    echo "✓ Done: Reference app"
  fi
}

# ─── Derive progress key from module directory ──────────────────────

key_from_dir() {
  # "01-typescript-fundamentals/03-functions/" => "ts-03"
  # "02-web-development/11-authentication/" => "wd-11"
  local dir="$1"
  if [[ "$dir" =~ ^01-typescript-fundamentals/([0-9]+) ]]; then
    printf "ts-%02d" "${BASH_REMATCH[1]}"
  elif [[ "$dir" =~ ^02-web-development/([0-9]+) ]]; then
    printf "wd-%02d" "${BASH_REMATCH[1]}"
  else
    echo "$dir" | tr '/' '-' | sed 's/-$//'
  fi
}

# ─── Filter by argument ─────────────────────────────────────────────

run_selected() {
  local selector="$1"

  # TS track: ts-01 through ts-12
  if [[ "$selector" =~ ^ts-([0-9]+)$ ]]; then
    local num="${BASH_REMATCH[1]}"
    local dir=""
    for d in "${TS_MODULES[@]}"; do
      if [[ "$d" =~ /${num}- ]]; then
        dir="$d"
        break
      fi
    done
    if [[ -n "$dir" && -d "$dir" ]]; then
      local label
      label=$(echo "$dir" | sed 's:/$::' | sed 's:/: -: ')
      run_module "$dir" "$label" "$selector"
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
      run_module "$dir" "$label" "$selector"
    else
      echo "ERROR: Web Dev module ${num} not found"
      exit 1
    fi
    return
  fi

  # Special selectors
  case "$selector" in
    pro)  run_pro;  return ;;
    root) run_root; return ;;
    ref)  run_ref;  return ;;
  esac

  # Numeric only: match Web Dev module
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
      local key
      key=$(key_from_dir "$dir")
      run_module "$dir" "$label" "$key"
      return
    fi
    echo "ERROR: Module ${num} not found in Web Dev track"
    exit 1
  fi

  echo "ERROR: Unknown selector '${selector}'"
  echo "Use: ts-01..ts-12, wd-01..wd-14, pro, root, ref"
  exit 1
}

# ─── Handle special flags ───────────────────────────────────────────

case "${1:-}" in
  --reset)
    progress_reset
    exit 0
    ;;
  --status)
    progress_summary
    exit 0
    ;;
esac

# ─── Main ───────────────────────────────────────────────────────────

progress_init

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
HALTED=false

if [[ $# -eq 0 ]]; then
  # No args: run all modules in order
  echo ""
  echo "Running ALL modules (skipping already-validated)..."
  echo ""

  # TS Track
  echo ""
  echo "═══ Track 01: TypeScript Fundamentals ═══"
  for d in "${TS_MODULES[@]}"; do
    if [[ "$HALTED" == "true" ]]; then break; fi
    label=$(echo "$d" | sed 's:/$::' | sed 's:/: -: ')
    key=$(key_from_dir "$d")
    run_module "$d" "$label" "$key" || HALTED=true
  done

  # Web Dev Track
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo "═══ Track 02: Web Development ═══"
    for d in "${WD_MODULES[@]}"; do
      if [[ "$HALTED" == "true" ]]; then break; fi
    label=$(echo "$d" | sed 's:/$::' | sed 's:/: -: ')
    key=$(key_from_dir "$d")
    run_module "$d" "$label" "$key" || HALTED=true
    done
  fi

  # Pro Guidelines
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo "═══ Track 03: Professional Guidelines ═══"
    run_pro || HALTED=true
  fi

  # Root docs
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo "═══ Root Documentation ═══"
    run_root || HALTED=true
  fi

  # Reference app
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo "═══ Reference App ═══"
    run_ref || HALTED=true
  fi

else
  # Run selected modules
  for arg in "$@"; do
    if [[ "$HALTED" == "true" ]]; then break; fi
    run_selected "$arg" || HALTED=true
  done
fi

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
if [[ "$HALTED" == "true" ]]; then
  echo "║              ⚠️  Validation Halted (quota/error)           ║"
  echo "║  Re-run to resume from where it stopped.                  ║"
else
  echo "║                    Validation Complete                     ║"
fi
echo "║  Elapsed: ${MINUTES}m ${SECONDS}s"
echo "╚════════════════════════════════════════════════════════════╝"

# Final summary
progress_summary

echo "Git branches created during validation:"
git branch --list 'fix/*'

echo ""
echo "Current branch: $(git branch --show-current)"
echo "Working tree: $(git diff --quiet 2>/dev/null && echo 'clean' || echo 'DIRTY')"

if [[ "$HALTED" == "true" ]]; then
  exit 1
fi
