#!/usr/bin/env bash
set -euo pipefail

# Fetch latest from remote
echo "Fetching latest from origin..."
git fetch origin

# Ensure we're on main and up to date
echo "Updating main..."
git checkout main
git pull --ff-only

# Find all local fix/* branches
branches=$(git branch --list 'fix/*' --format='%(refname:short)')

if [ -z "$branches" ]; then
  echo "No fix/* branches found."
  exit 0
fi

count=0
rebased=0
uptodate=0
failed=()

for branch in $branches; do
  count=$((count + 1))
  echo ""
  echo "=========================================="
  echo "[$count] Rebasing: $branch"
  echo "=========================================="
  git checkout "$branch" 2>&1

  if git rebase main 2>&1; then
    if git diff --quiet main...HEAD 2>/dev/null; then
      echo "⏭  Already up to date"
      uptodate=$((uptodate + 1))
    else
      echo "✅ Rebased successfully"
      rebased=$((rebased + 1))
    fi
  else
    echo "❌ Rebase failed — conflicts detected"
    git rebase --abort 2>/dev/null
    failed+=("$branch")
  fi
done

# Switch back to main
git checkout main

# Summary
echo ""
echo "=========================================="
echo "Done! Summary:"
echo "  Rebased:    $rebased"
echo "  Up to date: $uptodate"
echo "  Failed:     ${#failed[@]}"
if [ ${#failed[@]} -gt 0 ]; then
  echo ""
  echo "Failed branches (manual resolution needed):"
  for f in "${failed[@]}"; do
    echo "  - $f"
  done
fi
echo "=========================================="
