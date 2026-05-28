# Module 02 — Git Basics

## What you'll learn

What Git is, why every developer uses it, and the core commands you'll need for
every project.

## Why Git?

Imagine writing a 10-page essay in a word processor with no undo button. Every
time you make a change, it's permanent. If you delete a paragraph by mistake,
it's gone. If you want to see what you wrote yesterday, you can't.

That's what coding without **version control** is like.

**Git** is a version control system — it tracks every change you make to your
code. It gives you:

- **Save points** (commits) — snapshot your project at any moment. If something
  breaks, go back to a working state.
- **Branches** — try an experiment without risking your working code. If it
  works, merge it in. If it doesn't, delete the branch.
- **Collaboration** — multiple people can work on the same project without
  overwriting each other's changes.
- **History** — see exactly what changed, when, and by whom. Every project
  becomes a timeline you can search.

Git is not optional in professional development. Every company, every
open-source project, and every team uses it. Learning these fundamentals now
means you'll use them in every module going forward.

## Key Concepts

### Repository (repo)

A folder that Git tracks. Creating one is called **initializing** — it adds a
hidden `.git` folder inside your project that stores all the history.

```bash
git init
```

This turns a normal folder into a Git repository. You only do this once per
project.

### The staging area

Git doesn't automatically save every file change. You choose what to save:

1. You edit files (working directory)
2. You **stage** the files you want to include (`git add`)
3. You **commit** the staged files as a snapshot (`git commit`)

Think of it like packing a box: you choose what goes in (stage), then seal it
(commit).

### Commits

A commit is a **snapshot** of your project at a point in time. Each commit has:

- A unique ID (hash)
- A message describing what changed
- The author and timestamp

```bash
git add .                        # Stage all changes
git add src/app.tsx              # Stage a specific file
git commit -m "Add login page"   # Commit with a message
```

**Good commit messages** explain **why**, not just what:

```
❌ "fix stuff"
❌ "updates"
✅ "Add password hashing with bcrypt for secure auth"
✅ "Fix profile page 404 when username contains uppercase"
```

### Viewing history

```bash
git status          # What files changed (staged, unstaged, untracked)
git log --oneline   # Compact view of commit history
git diff            # See exactly what lines changed (unstaged)
```

Use `git status` frequently — it tells you the current state of your project.

### Branches

A branch is a **parallel version** of your project. The default branch is
`main`. You create branches to work on features or fixes without affecting
`main`.

```bash
git branch                      # List all branches (current branch has *)
git checkout -b add-login       # Create and switch to a new branch
git checkout main               # Switch back to main
```

When the feature is done, you **merge** the branch back into `main`. For this
project we'll work directly on `main` — branches become essential when you work
on a team.

### Remotes and GitHub

Your local repository lives on your machine. A **remote** is a copy hosted
somewhere else (usually GitHub). This lets you:

- **Back up** your code off your machine
- **Share** code with others
- **Deploy** from the remote

```bash
git remote add origin https://github.com/USERNAME/repo.git   # Connect to a remote
git push origin main                                          # Upload commits to GitHub
git pull origin main                                          # Download new commits from GitHub
```

### Cloning

If a project already exists on GitHub, you don't `git init` — you **clone** it:

```bash
git clone https://github.com/USERNAME/repo.git
```

This downloads the entire repository including its full history.

### Tags (versioning)

A tag is a **named reference** to a specific commit — like a bookmark. Teams use
tags to mark releases:

```bash
git tag v1.0.0                    # Tag the current commit as v1.0.0
git tag                           # List all tags
git push origin v1.0.0            # Push a tag to GitHub
```

Tags answer the question: "What code was in version 1.0?" — you can always go
back to that exact snapshot.

## Commands You'll Use

| Command                     | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `git init`                  | Create a new repository in the current folder |
| `git status`                | See what files changed                        |
| `git add .`                 | Stage all changes                             |
| `git add file.ts`           | Stage a specific file                         |
| `git commit -m "message"`   | Commit staged changes with a message          |
| `git log --oneline`         | View compact commit history                   |
| `git diff`                  | See unstaged changes                          |
| `git branch`                | List branches                                 |
| `git checkout -b name`      | Create and switch to a new branch             |
| `git checkout main`         | Switch to the main branch                     |
| `git remote add origin URL` | Connect local repo to a remote (e.g., GitHub) |
| `git push origin main`      | Upload commits to the remote                  |
| `git pull origin main`      | Download new commits from the remote          |
| `git clone URL`             | Download an existing repository               |
| `git tag v1.0.0`            | Tag the current commit with a version label   |
| `git tag`                   | List all tags                                 |
| `git push origin v1.0.0`    | Push a specific tag to the remote             |

## Common Patterns

| Pattern                          | When                                       |
| -------------------------------- | ------------------------------------------ |
| `git status` before every commit | Always know what you're saving             |
| Small, focused commits           | Easier to understand history and undo      |
| Descriptive commit messages      | Future-you will thank present-you          |
| `.gitignore` for generated files | Never commit `node_modules/`, `.env`, etc. |
| Tag releases with `v` prefix     | `v1.0.0`, `v1.1.0` — clear and standard    |

## Deep Dive

- [Git — Official Documentation](https://git-scm.com/docs)
- [GitHub — About Git](https://docs.github.com/en/get-started/using-git/about-git)
- [GitHub — Git Cheat Sheet](https://docs.github.com/en/get-started/git-basics/git-cheatsheet)
