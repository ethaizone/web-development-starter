#!/usr/bin/env bash
#
# lint-content.sh — Walk every file (deepest first) checking for AGENTS.md
# rule violations and learner-proofing issues. Edits in-place; no commits.
#
# Unlike validate-modules.sh (which verifies URLs/APIs against official docs),
# this script focuses on:
#   - Terminology violations (AGENTS.md Rule 6 / CONTEXT.md glossary)
#   - Cheatsheet style compliance (AGENTS.md Rule 5)
#   - Cross-platform awareness (AGENTS.md Rule 7)
#   - Tech stack boundaries (AGENTS.md Rule 8)
#   - Code quality as teaching tool (CONTEXT.md Principle 3)
#   - Code references by name not line number (CONTEXT.md Principle 4)
#   - Ambiguous/missing content learners could exploit to blame the repo
#   - Fluff, filler, history lessons violating the style guide
#
# Edits files directly on current branch. Does NOT create branches, does NOT
# commit, does NOT run git add.
#
# Progress is tracked in .lint-progress.json — if interrupted, re-running
# skips completed items and resumes.
#
# Usage:
#   ./lint-content.sh              # check all files (resumes if interrupted)
#   ./lint-content.sh ts-03        # check TS track module 03
#   ./lint-content.sh wd-05        # check Web Dev track module 05
#   ./lint-content.sh pro          # check Pro Guidelines
#   ./lint-content.sh root         # check root docs (CONTEXT.md, AGENTS.md, etc.)
#   ./lint-content.sh --reset      # clear progress and start fresh
#   ./lint-content.sh --status     # show progress without running anything

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

PROGRESS_FILE="$REPO_ROOT/.lint-progress.json"

# ─── Colors ─────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ─── Progress file helpers ──────────────────────────────────────────

progress_init() {
  if [[ ! -f "$PROGRESS_FILE" ]]; then
    echo '{}' > "$PROGRESS_FILE"
  fi
}

progress_get() {
  local key="$1"
  node -e "
    const d = JSON.parse(require('fs').readFileSync('$PROGRESS_FILE','utf8'));
    console.log(d['$key'] || '');
  " 2>/dev/null
}

progress_set() {
  local key="$1"
  local status="$2"
  node -e "
    const f = '$PROGRESS_FILE';
    const d = JSON.parse(require('fs').readFileSync(f,'utf8'));
    d['$key'] = '$status';
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
  echo "═══════════════════════════════════════════════════════════"
  echo "  Content Lint Progress"
  echo "═══════════════════════════════════════════════════════════"

  local all_keys=(
    lint-ts-01 lint-ts-02 lint-ts-03 lint-ts-04 lint-ts-05 lint-ts-06
    lint-ts-07 lint-ts-08 lint-ts-09 lint-ts-10 lint-ts-11 lint-ts-12
    lint-wd-01 lint-wd-02 lint-wd-03 lint-wd-04 lint-wd-05 lint-wd-06
    lint-wd-07 lint-wd-08 lint-wd-09 lint-wd-10 lint-wd-11 lint-wd-12
    lint-wd-13 lint-wd-14 lint-wd-15
    lint-pro lint-root
  )

  local ok=0 fail=0 quota=0 running=0 pending=0

  for key in "${all_keys[@]}"; do
    local status
    status=$(progress_get "$key")

    case "$status" in
      ok)      echo "  ✅ $key — passed";                ((ok++)) || true ;;
      fail)    echo "  ❌ $key — issues found (fixed)";   ((fail++)) || true ;;
      quota)   echo "  🛑 $key — quota exceeded";         ((quota++)) || true ;;
      running) echo "  🔄 $key — running (crashed?)";     ((running++)) || true ;;
      "")      echo "  ⬜ $key — pending";                ((pending++)) || true ;;
    esac
  done

  echo ""
  echo "  Total: ${#all_keys[@]} | ✅ $ok | ❌ $fail | 🛑 $quota | 🔄 $running | ⬜ $pending"
  echo "═══════════════════════════════════════════════════════════"
  echo ""
}

# ─── File enumeration (deepest first) ───────────────────────────────

build_file_list() {
  # List all content files in a directory, sorted deepest-first.
  # Excludes node_modules/, package-lock.json, lock files.
  local dir="$1"
  find "$dir" -type f \( -name "*.md" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
    ! -path "*/node_modules/*" \
    ! -name "package-lock.json" \
    ! -name ".package-lock.json" \
    2>/dev/null \
    | awk -F/ '{print NF, $0}' | sort -rn | cut -d' ' -f2-
}

# ─── Module lists ───────────────────────────────────────────────────

TS_MODULES=()
for d in 01-typescript-fundamentals/*/; do
  [[ -d "$d" ]] && TS_MODULES+=("$d")
done

WD_MODULES=()
for d in 02-web-development/*/; do
  [[ -d "$d" ]] && WD_MODULES+=("$d")
done

WD_TRACK_README="02-web-development/README.md"

PRO_DIR="03-professional-guidelines"

ROOT_FILES=("README.md" "CONTEXT.md" "AGENTS.md" "demo-app.md")

# ─── Derive progress key from module directory ──────────────────────

key_from_dir() {
  local dir="$1"
  if [[ "$dir" =~ ^01-typescript-fundamentals/([0-9]+) ]]; then
    local num=$((10#${BASH_REMATCH[1]}))
    printf "lint-ts-%02d" "$num"
  elif [[ "$dir" =~ ^02-web-development/([0-9]+) ]]; then
    local num=$((10#${BASH_REMATCH[1]}))
    printf "lint-wd-%02d" "$num"
  else
    echo "lint-$(echo "$dir" | tr '/' '-' | sed 's/-$//')"
  fi
}

# ─── Prompt builders ────────────────────────────────────────────────

build_module_prompt() {
  local module_path="$1"
  local module_label="$2"
  local file_list
  file_list=$(build_file_list "$module_path")

  if [[ -z "$file_list" ]]; then
    echo "No files found in ${module_path}"
    return 1
  fi

  # Determine track-specific style rules
  local track_style=""
  if [[ "$module_path" =~ ^01-typescript-fundamentals ]]; then
    track_style="
CRITICAL — This is a TS Track module. The exercise section MUST use:
  - Heading: \`## Now build it\` (NOT \"What We Built\")
  - Style: Hands-on — instruct the learner to CREATE files and WRITE code
    themselves. Examples: \"Create variables.ts and declare...\",
    \"Create control-flow.ts and write...\"
  - Never replace hands-on instructions with a description of existing
    example/exercise files. The learner should create their own file.
  - If exercise stub files already exist (with TODO comments), use \"Open\"
    instead of \"Create\" for those specific files.
"
  elif [[ "$module_path" =~ ^02-web-development ]]; then
    track_style="
This is a Web Dev Track module. The build record section MUST use:
  - Heading: \`## What We Built\` (NOT \"Now build it\")
  - Style: Narrative — document what was built as a build record
  - Module 01 (How the Web Works) and Module 02 (Git Basics) are
    concepts-only — no \"What We Built\" section needed
"
  fi

  cat <<PROMPT
You are reviewing a self-learning web development course repository for rule
violations and learner-proofing issues. Your job is to find problems that break
the rules in AGENTS.md, plus anything a confused or adversarial learner could
use to blame the repo for their confusion.

## Reference files — read these FIRST
1. AGENTS.md (at repo root) — the rules you are enforcing
2. CONTEXT.md (at repo root) — glossary, conventions, design principles

## Your task: Lint ${module_label}

Process files in this exact order (deepest first, surface last):

${file_list}

For EACH file, check for these categories of violations:

### 1. Terminology (AGENTS.md Rule 6, CONTEXT.md Glossary)
Wrong → Right:
- "student", "user", "reader" → "learner"
- "chapter", "lesson", "section" → "module"
- "course", "path", "level" → "track"
- "demo app", "the project", "the app" → "DevStack Bio"
- "mini project", "sandbox", "playground" → "Tiny Example"

Check the FULL file — headings, body text, code comments, table headers.

### 2. Cheatsheet Style (AGENTS.md Rule 5) — README.md files only
${track_style}
General style rules:
- No fluff, no history lessons, no filler paragraphs
- Major new concepts should explain "why" (answer "why should I care?")
- Code examples should be inline in markdown, not separate files
  (unless it is a Tiny Example that needs to be runnable)

### 3. Code References (CONTEXT.md Principle 4)
- Must reference code by file path + function/variable name
- NEVER reference code by line number
- Example: "See \`src/routes/dashboard.tsx\` → \`handleSaveProfile()\`"

### 4. Cross-Platform (AGENTS.md Rule 7)
- Instructions must work on Windows natively (PowerShell/cmd)
- OS-specific commands must be shown side-by-side when they differ
- No WSL2 requirement in Tracks 01–02
- Use npm as package manager (not yarn, pnpm, etc.)

### 5. Tech Stack Boundaries (AGENTS.md Rule 8)
- TS Track: ONLY Node.js + tsx. No browser, no frameworks, no React
- Web Dev Track: ONLY TanStack Start, React, TypeScript, SQLite, Drizzle ORM,
  Tailwind CSS, shadcn/ui. No alternative tools/libraries.
- Pro Guidelines: Links and pointers only. No deep teaching, no code tutorials.

### 6. Code Quality (CONTEXT.md Principle 3) — .ts/.tsx files only
- Meaningful, descriptive variable names (no x, y, temp, foo, bar, baz)
- No variable shadowing
- Consistent naming conventions (camelCase for variables/functions, PascalCase for types/interfaces)
- Comments only where intent is not obvious from names

### 7. Learner-Proofing — the most important check
Look for anything a confused, frustrated, or adversarial learner could use to
blame the repo:
- Ambiguous instructions that could be interpreted multiple ways
- Missing prerequisites (e.g., "run this command" without saying where)
- Commands that assume specific OS without noting it
- Code snippets that don't show necessary imports
- Steps that skip important context ("just do X" without explaining why)
- Missing expected outputs or success indicators after commands
- Instructions that say "you should see X" but X might look different
- Broken markdown formatting (unclosed code blocks, malformed tables)
- Empty sections or placeholders that look accidental
- Inconsistent formatting compared to other modules
- TODO comments that should have been resolved
- References to files/concepts not yet introduced in the track sequence
- Exercise instructions that are vague or have multiple valid interpretations
- Solution code that doesn't match the exercise requirements
- Missing edge cases in code examples (e.g., empty array, null input)

### 8. Structural (AGENTS.md Rule 4)
- TS Track modules should have: README.md, examples/, exercises/ with solutions/
  (except Module 01: no examples/exercises, Module 12: src/ + package.json)
- Web Dev Track modules should have: README.md only (examples/ only when needed)
- Do NOT flag missing folders — just flag unexpected files that violate structure

## Rules for fixing
- Edit files directly using the edit tool
- Do NOT create branches, do NOT commit, do NOT run git add, do NOT run git checkout
- Only fix what you can VERIFY is clearly wrong per the rules above
- If you are unsure whether something violates a rule, leave it as-is
- Make minimal changes — fix the violation, don't rewrite the file
- Preserve the author's voice and intent — fix the problem, not the style
- If a file has no issues, say so and move on

## Output format
For each file:
- State the file path
- If issues found: list each issue with the category number and what was wrong
- If fixed: describe the fix briefly
- If no issues: "✓ No issues"

At the end, provide a summary:
- Total files checked
- Total issues found
- Total fixes applied
- Any files you chose not to fix (and why)

Start by reading AGENTS.md and CONTEXT.md, then process the files listed above.
PROMPT
}

build_pro_prompt() {
  local file_list
  file_list=$(build_file_list "$PRO_DIR")

  cat <<PROMPT
You are reviewing a self-learning web development course repository for rule
violations and learner-proofing issues.

## Reference files — read these FIRST
1. AGENTS.md (at repo root)
2. CONTEXT.md (at repo root)

## Your task: Lint Pro Guidelines (03-professional-guidelines/)

Process files deepest first:
${file_list}

For EACH file, check:

### 1. Terminology (AGENTS.md Rule 6)
- "student", "user", "reader" → "learner"
- "chapter", "lesson", "section" → "module"
- "course", "path", "level" → "track"
- Pro Guidelines is NOT a "course" or "track" — it is "curated pointers" or "guidelines"

### 2. Tech Stack Boundaries (AGENTS.md Rule 8)
- Pro Guidelines: Links and pointers only. No deep teaching, no code tutorials.
- If a file teaches a concept in depth or has code tutorials, flag it.

### 3. Cross-Platform (AGENTS.md Rule 7)
- Not required for Pro Guidelines (it targets professional awareness)
- But don't give Linux-only instructions without noting it

### 4. Learner-Proofing
- Broken links or malformed markdown
- Ambiguous descriptions of tools/concepts
- Missing context on why a tool matters
- Unclear ordering (which resource to start with?)
- Empty sections or accidental placeholders

### 5. Code References
- Never reference by line number — use path + name

## Rules for fixing
- Edit files directly using the edit tool
- Do NOT create branches, do NOT commit, do NOT run git add
- Only fix clear violations
- Minimal changes

## Output format
Same as module linting: per-file issues + summary.

Start by reading AGENTS.md and CONTEXT.md.
PROMPT
}

build_root_prompt() {
  local file_list=""
  for f in "${ROOT_FILES[@]}"; do
    [[ -f "$f" ]] && file_list="${file_list}${f}"$'\n'
  done

  cat <<PROMPT
You are reviewing a self-learning web development course repository for rule
violations and learner-proofing issues.

## Reference files — read these FIRST
1. AGENTS.md (at repo root) — the rules
2. CONTEXT.md (at repo root) — glossary, conventions, design principles

## Your task: Lint root documentation files

Process these files:
${file_list}

For EACH file, check:

### 1. Terminology (AGENTS.md Rule 6, CONTEXT.md Glossary)
- "student", "user", "reader" → "learner"
- "chapter", "lesson", "section" → "module"
- "course", "path", "level" → "track"
- "demo app", "the project", "the app" → "DevStack Bio"
- "mini project", "sandbox", "playground" → "Tiny Example"

### 2. Internal Consistency
- CONTEXT.md glossary should match actual usage across the repo
- README.md should accurately describe the repo structure
- demo-app.md should match CONTEXT.md tech stack
- Cross-references between root files should be correct

### 3. Code References (CONTEXT.md Principle 4)
- Never reference by line number

### 4. Learner-Proofing
- README.md: Is it clear where to start? Are all tracks mentioned?
- CONTEXT.md: Is the glossary complete? Any ambiguous definitions?
- demo-app.md: Are all features clearly specified?
- Any broken markdown, empty sections, or confusing descriptions

### 5. Cross-Platform (AGENTS.md Rule 7)
- README.md should mention Windows compatibility if it mentions setup

## Rules for fixing
- Edit files directly using the edit tool
- Do NOT create branches, do NOT commit, do NOT run git add
- Minimal changes, fix only clear violations

## Output format
Per-file issues + summary.

Start by reading AGENTS.md and CONTEXT.md.
PROMPT
}

# ─── Run pi and check exit code ─────────────────────────────────────

run_pi() {
  local progress_key="$1"
  local prompt="$2"
  local module_label="$3"

  progress_set "$progress_key" "running"

  local pi_rc=0
  pi -p "$prompt" 2>&1 || pi_rc=$?

  if [[ $pi_rc -ne 0 ]]; then
    echo ""
    echo -e "  ${RED}🛑 pi exited with code ${pi_rc} — likely quota exceeded or API error${NC}"
    echo "  Module ${module_label} marked as 'quota'. Re-run to retry."
    progress_set "$progress_key" "quota"
    return 1
  fi

  return 0
}

# ─── Run one module ─────────────────────────────────────────────────

run_module() {
  local module_path="$1"
  local module_label="$2"
  local progress_key="$3"

  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo -e "  ${CYAN}⏭  Skipping ${module_label} — already linted ✅${NC}"
    return 0
  fi

  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}▶ Linting: ${module_label}${NC}"
  echo "  Path: ${module_path}"
  echo "  Key: ${progress_key}"
  case "$status" in
    quota)   echo -e "  ${YELLOW}Previous: quota exceeded — retrying${NC}" ;;
    fail)    echo -e "  ${YELLOW}Previous: had issues — retrying${NC}" ;;
    running) echo -e "  ${YELLOW}Previous: crashed mid-run — retrying${NC}" ;;
  esac
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  echo -e "  Files (deepest first):"
  build_file_list "$module_path" | sed 's/^/    /'
  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  local prompt
  prompt=$(build_module_prompt "$module_path" "$module_label")

  if run_pi "$progress_key" "$prompt" "$module_label"; then
    progress_set "$progress_key" "ok"
    echo -e "  ${GREEN}✓ Done: ${module_label}${NC}"
  fi
}

run_pro() {
  local progress_key="lint-pro"

  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo -e "  ${CYAN}⏭  Skipping Pro Guidelines — already linted ✅${NC}"
    return 0
  fi

  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}▶ Linting: Pro Guidelines (03-professional-guidelines/)${NC}"
  echo "  Key: ${progress_key}"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  echo -e "  Files (deepest first):"
  build_file_list "$PRO_DIR" | sed 's/^/    /'
  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  if run_pi "$progress_key" "$(build_pro_prompt)" "Pro Guidelines"; then
    progress_set "$progress_key" "ok"
    echo -e "  ${GREEN}✓ Done: Pro Guidelines${NC}"
  fi
}

run_root() {
  local progress_key="lint-root"

  local status
  status=$(progress_get "$progress_key")
  if [[ "$status" == "ok" ]]; then
    echo ""
    echo -e "  ${CYAN}⏭  Skipping Root docs — already linted ✅${NC}"
    return 0
  fi

  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}▶ Linting: Root docs (README.md, CONTEXT.md, AGENTS.md, demo-app.md)${NC}"
  echo "  Key: ${progress_key}"
  echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  echo -e "  Files:"
  for f in "${ROOT_FILES[@]}"; do
    if [[ -f "$f" ]]; then
      echo "    $f"
    fi
  done
  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  if run_pi "$progress_key" "$(build_root_prompt)" "Root docs"; then
    progress_set "$progress_key" "ok"
    echo -e "  ${GREEN}✓ Done: Root docs${NC}"
  fi
}

# ─── Filter by argument ─────────────────────────────────────────────

run_selected() {
  local selector="$1"

  # TS track: lint-ts-01 through lint-ts-12
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
      run_module "$dir" "$label" "lint-ts-${num}"
    else
      echo "ERROR: TS module ${num} not found"
      exit 1
    fi
    return
  fi

  # Web Dev track: lint-wd-01 through lint-wd-15
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
      run_module "$dir" "$label" "lint-wd-${num}"
    else
      echo "ERROR: Web Dev module ${num} not found"
      exit 1
    fi
    return
  fi

  case "$selector" in
    pro)  run_pro;  return ;;
    root) run_root; return ;;
  esac

  echo "ERROR: Unknown selector '${selector}'"
  echo "Use: ts-01..ts-12, wd-01..wd-15, pro, root"
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

echo ""
echo -e "${BOLD}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║        Content Linter — AGENTS.md Rules + Learner-Proofing     ║${NC}"
echo -e "${BOLD}║        Repo: ${REPO_ROOT} ${NC}"
echo -e "${BOLD}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show current state
CURRENT_BRANCH=$(git branch --show-current)
echo "  Branch: ${CURRENT_BRANCH}"
echo "  Progress: ${PROGRESS_FILE}"
echo ""

# Warn (but don't block) if there are uncommitted changes
DIRTY=$(git status --porcelain 2>/dev/null | grep -v '^??' | head -1 || true)
if [[ -n "$DIRTY" ]]; then
  echo -e "  ${YELLOW}⚠️  Working tree has uncommitted changes. Edits will be made on top.${NC}"
  echo -e "  ${YELLOW}   Run \`git status\` to see current state.${NC}"
  echo ""
fi

START_TIME=$(date +%s)
HALTED=false

if [[ $# -eq 0 ]]; then
  echo -e "${CYAN}Running ALL modules (skipping already-linted)...${NC}"
  echo ""

  # ── Track 01: TypeScript Fundamentals ──
  echo -e "${BOLD}═══ Track 01: TypeScript Fundamentals ═══${NC}"
  for d in "${TS_MODULES[@]}"; do
    if [[ "$HALTED" == "true" ]]; then break; fi
    label=$(echo "$d" | sed 's:/$::' | sed 's:/: -: ')
    key=$(key_from_dir "$d")
    run_module "$d" "$label" "$key" || HALTED=true
  done

  # ── Track 02: Web Development ──
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo -e "${BOLD}═══ Track 02: Web Development ═══${NC}"
    for d in "${WD_MODULES[@]}"; do
      if [[ "$HALTED" == "true" ]]; then break; fi
      label=$(echo "$d" | sed 's:/$::' | sed 's:/: -: ')
      key=$(key_from_dir "$d")
      run_module "$d" "$label" "$key" || HALTED=true
    done

    # Web Dev Track parent README (after all modules)
    if [[ "$HALTED" == "false" ]]; then
      echo ""
      echo -e "${BOLD}── Web Dev Track README ──${NC}"
      # Include track README as part of the last module's context
      # by running a focused check on it
      local_wd_readme_key="lint-wd-track-readme"
      status=$(progress_get "$local_wd_readme_key")
      if [[ "$status" != "ok" ]]; then
        echo -e "  ${CYAN}Checking: ${WD_TRACK_README}${NC}"
        WD_README_PROMPT=$(cat <<PROMPT
You are reviewing a self-learning web development course repository for rule
violations and learner-proofing issues.

## Reference files — read these FIRST
1. AGENTS.md (at repo root)
2. CONTEXT.md (at repo root)

## Your task: Lint the Web Dev Track README (02-web-development/README.md)

Read 02-web-development/README.md and check:

1. **Terminology**: No "student", "user", "chapter", "course" etc.
2. **Accuracy**: Module list matches CONTEXT.md Web Dev Track outline
3. **Clarity**: Is it clear this is a "read the build record" approach, not a tutorial?
4. **Prerequisites**: Are they accurate per CONTEXT.md?
5. **Learner-proofing**: Any ambiguity a learner could exploit?

Also read 03-professional-guidelines/README.md and do the same checks.

Rules: Edit directly, no branches, no commits, no git add. Minimal fixes only.
PROMPT
)
        if run_pi "$local_wd_readme_key" "$WD_README_PROMPT" "WD Track README"; then
          progress_set "$local_wd_readme_key" "ok"
          echo -e "  ${GREEN}✓ Done: WD Track README${NC}"
        fi
      else
        echo -e "  ${CYAN}⏭  Skipping WD Track README — already linted ✅${NC}"
      fi
    fi
  fi

  # ── Track 03: Pro Guidelines ──
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo -e "${BOLD}═══ Track 03: Professional Guidelines ═══${NC}"
    run_pro || HALTED=true
  fi

  # ── Root docs ──
  if [[ "$HALTED" == "false" ]]; then
    echo ""
    echo -e "${BOLD}═══ Root Documentation ═══${NC}"
    run_root || HALTED=true
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
echo -e "${BOLD}╔════════════════════════════════════════════════════════════════╗${NC}"
if [[ "$HALTED" == "true" ]]; then
  echo -e "${BOLD}║          ${YELLOW}⚠️  Content Lint Halted (quota/error)${NC}${BOLD}                        ║${NC}"
  echo -e "${BOLD}║  Re-run to resume from where it stopped.                       ║${NC}"
else
  echo -e "${BOLD}║                    Content Lint Complete                        ║${NC}"
fi
echo -e "${BOLD}║  Elapsed: ${MINUTES}m ${SECONDS}s"
echo -e "${BOLD}╚════════════════════════════════════════════════════════════════╝${NC}"

# Final summary
progress_summary

echo "Uncommitted changes (edits made during this run):"
git diff --stat 2>/dev/null || echo "  (none)"
echo ""
echo "Current branch: $(git branch --show-current)"

if [[ "$HALTED" == "true" ]]; then
  exit 1
fi
