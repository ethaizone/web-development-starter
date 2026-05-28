# 09 — Pull Requests

## The short version

A **pull request (PR)** is a proposal to merge changes from one branch into
another. It's how teams review code, discuss approaches, and catch bugs before
they reach `main`.

## What a PR is

When you push a branch to GitHub, you can open a pull request that says: "Here
are my changes. Please review them before merging."

A PR shows:

- **The diff** — every line that changed, added, or removed
- **Commit history** — the individual commits on the branch
- **Comments** — teammates can leave feedback on specific lines or the overall
  approach
- **Checks** — automated tests and linters can run on the PR (see
  [CI/CD Awareness](./06-cicd-awareness.md))

## Why PRs matter

- **Code review** — a second pair of eyes catches bugs, suggests improvements,
  and shares knowledge across the team
- **Safety net** — changes don't reach `main` until at least one person approves
- **Documentation** — the PR discussion becomes a record of **why** a decision
  was made
- **CI triggers** — automated tests run on every PR, catching regressions before
  merge

## The workflow

```
1. Create a branch      git checkout -b fix/login-bug
2. Make changes          ...edit files...
3. Commit and push       git add . && git commit -m "Fix login redirect"
                         git push origin fix/login-bug
4. Open a PR             On GitHub → "Compare & pull request"
5. Review                Teammates comment, suggest changes
6. Update (if needed)    Push more commits to the same branch — the PR updates
7. Merge                 Click "Merge pull request" on GitHub
8. Clean up              Delete the branch (optional, GitHub can do this)
```

## Writing a good PR

A good PR is small, focused, and easy to review:

**Title:** Summarize the change in one line

```
❌ "fix stuff"
❌ "updates"
✅ "Fix login redirect after registration"
✅ "Add password hashing with bcrypt"
```

**Description:** Explain the **what** and **why**:

```markdown
## What

Adds bcrypt password hashing to the registration and login flow.

## Why

Passwords were stored in plain text — a security risk if the database is
compromised.

## How to test

1. Register a new account
2. Check that the stored password in the DB is hashed
3. Log in with the same credentials — should succeed
```

## Best practices

| Practice                           | Why                                                      |
| ---------------------------------- | -------------------------------------------------------- |
| Small, focused PRs                 | Easier to review, faster to merge                        |
| Descriptive title and description  | Reviewers understand the intent before reading code      |
| Self-review before requesting      | Catch your own typos and mistakes first                  |
| Respond to all comments            | Even a simple "done" confirms you addressed the feedback |
| Keep PRs open briefly              | Stale PRs cause merge conflicts and lose context         |
| Use draft PRs for work-in-progress | Signals "not ready for review" while still tracking work |

## Merging strategies

GitHub offers three merge options:

| Strategy             | What it does                                   | When to use                       |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| **Merge commit**     | Creates a merge commit preserving full history | Default choice, preserves context |
| **Squash and merge** | Combines all commits into one                  | Clean history, good for small PRs |
| **Rebase and merge** | Applies commits one by one on top of `main`    | Linear history, no merge commit   |

Most teams pick one strategy and stick with it. For personal projects, **squash
and merge** keeps the history clean.

## Deep Dive

- [GitHub — About Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [GitHub — Creating a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- [GitHub — Reviewing Changes in Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/) — a standard for
  commit messages
