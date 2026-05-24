# 02 — WSL2 for Windows Users

## The short version

**WSL2** (Windows Subsystem for Linux 2) runs a real Linux kernel inside Windows. You get a Linux terminal, Linux tools, and Linux file system — without dual-booting or running a heavy virtual machine.

## Why WSL2 matters

Many developer tools are designed for Linux/macOS first. WSL2 gives Windows users:

- A **real Bash shell** (not PowerShell or Git Bash)
- **Native Linux file system performance** for Node.js projects
- **Docker** running in Linux mode (faster and more compatible)
- Access to **apt** and other Linux package managers
- Compatibility with tutorials and docs written for Linux/macOS

## Install WSL2

Open **PowerShell as Administrator** (right-click → Run as administrator):

```powershell
wsl --install
```

Then **restart your computer**. WSL2 installs Ubuntu by default.

After restart, a terminal will open and ask you to create a **username and password** for your Linux environment. This is separate from your Windows account.

Verify:

```bash
wsl --list --verbose
```

You should see Ubuntu running on WSL 2.

## Using WSL2

| Task | How |
|------|-----|
| Open Linux terminal | Type `wsl` in PowerShell, or open "Ubuntu" from Start menu |
| Run a Linux command from PowerShell | `wsl ls -la` |
| Access Windows files from Linux | Files are at `/mnt/c/` (C: drive), `/mnt/d/` (D: drive), etc. |
| Access Linux files from Windows | In File Explorer: `\\wsl$\Ubuntu\` |
| Open VS Code in WSL | Run `code .` from inside WSL — VS Code will install the WSL extension automatically |

## Important tips

- **Put your projects in the Linux file system** (e.g., `~/projects/`), not in `/mnt/c/`. File I/O is significantly faster inside the native Linux file system.
- Use **Windows Terminal** (free from Microsoft Store) — it supports tabs, multiple profiles (PowerShell, Ubuntu, etc.), and is much better than the default terminal.
- VS Code's **Remote - WSL extension** lets you edit Linux-hosted files as if they were local. When you open a folder in WSL, VS Code shows "(WSL: Ubuntu)" in the bottom-left corner.

## Do you need WSL2?

| Situation | Recommendation |
|-----------|---------------|
| Just learning TypeScript (Track 01) | **Not needed.** PowerShell works fine for `tsx` commands. |
| Building web apps (Track 02) | **Optional but helpful.** TanStack Start works natively on Windows. |
| Working with Docker, CI/CD, deploying | **Strongly recommended.** Most deployment targets run Linux. |
| Following Linux-focused tutorials | **Yes.** Saves constant translation of commands. |

## Deep dive

- [Install WSL — Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install) — official installation guide
- [WSL Development Environment Setup](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) — best practices from Microsoft
- [Windows Terminal](https://apps.microsoft.com/detail/9N0DX20HK701) — free, tabbed terminal for Windows
- [VS Code Remote - WSL](https://code.visualstudio.com/docs/remote/wsl) — develop in WSL with VS Code

---

**Next:** [Shell Basics](./03-shell-basics.md) → Navigate the command line.
