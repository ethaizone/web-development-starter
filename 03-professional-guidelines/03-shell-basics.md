# 03 — Shell Basics

## The short version

The **shell** is the program that reads your commands and executes them.
Learning a few dozen commands lets you navigate any Linux/macOS system,
manipulate files, and chain operations together.

## The shell you'll use

- **Bash** — the default on most Linux systems and older macOS. The most
  widely-documented.
- **Zsh** — the default on modern macOS. Nearly identical to Bash for basic
  commands.
- **PowerShell** — Windows default. Different syntax, but can do similar things.

This guide focuses on **Bash/Zsh** (Linux/macOS/WSL2). The concepts transfer to
PowerShell.

## What you'll encounter

These are the command categories you'll use most often. You don't need to
memorize them — bookmark this page and refer back as needed.

| Category              | What you'll do                                          |
| --------------------- | ------------------------------------------------------- |
| **Navigation**        | `pwd`, `ls`, `cd` — move between directories            |
| **Files & dirs**      | `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `less`      |
| **Searching**         | `grep`, `find` — search file contents and names         |
| **Permissions**       | `chmod` — control who can read/write/execute files      |
| **Pipes & redirects** | `|`, `>`, `>>` — chain commands, save output to files   |
| **Processes**         | `ps`, `top`, `kill`, `Ctrl+C` — manage running programs |

## Deep dive

- [The Linux Command Line](https://linuxcommand.org/tlcl.php) — free
  comprehensive book
- [Linux Journey: Shell](https://linuxjourney.com/) — interactive shell tutorial
- [Bash manual](https://www.gnu.org/software/bash/manual/) — official reference
- [explainshell.com](https://explainshell.com/) — paste any command, see what
  each part does

---

**Next:** [SSH Keys](./04-ssh-keys.md) → Connect to servers securely.
