# 08 — Pull Requests

## The short version

A **pull request (PR)** is a proposal to merge changes from one branch into
another. It's how teams review code, discuss approaches, and catch bugs before
they reach `main`.

## What a PR does

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

## The workflow at a glance

1. Create a branch → make changes → commit and push
2. Open a PR on GitHub ("Compare & pull request")
3. Teammates review and comment
4. Push more commits if changes are needed (the PR updates automatically)
5. Merge → delete the branch

## Merging strategies

GitHub offers three merge options:

| Strategy             | What it does                                   | When to use                       |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| **Merge commit**     | Creates a merge commit preserving full history | Default choice, preserves context |
| **Squash and merge** | Combines all commits into one                  | Clean history, good for small PRs |
| **Rebase and merge** | Applies commits one by one on top of `main`    | Linear history, no merge commit   |

Most teams pick one strategy and stick with it. For personal projects, **squash
and merge** keeps the history clean.

## Deep dive

- [GitHub — About Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [GitHub — Creating a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- [GitHub — Reviewing Changes in Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/) — a standard for
  commit messages

---

**Next:** [Further Learning](./09-further-learning.md) → Curated resources to go deeper on any topic.
