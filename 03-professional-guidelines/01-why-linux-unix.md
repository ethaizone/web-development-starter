# 01 — Why Linux/Unix Matters

## The short version

Most web servers run Linux. When you deploy your app, SSH into a server, or debug production issues, you'll be on a Linux (or Unix-like) system. Understanding the basics saves you from being lost when things break.

## Key facts

- **Servers run Linux.** AWS, Google Cloud, Azure, DigitalOcean — nearly all cloud VMs are Linux. Even "managed" platforms like Railway and Fly.io run your code in Linux containers.
- **macOS is Unix-based.** If you're on a Mac, you already use Unix fundamentals daily (terminal, file system, shell).
- **Windows is the exception.** Windows uses a different kernel and shell (PowerShell). That's why WSL2 exists — it lets you run Linux tools on Windows.
- **Linux is free and open source.** No license cost. That's why hosting providers use it.
- **The shell is your IDE for servers.** No GUI on a production server. You navigate, read logs, restart services, and edit config files entirely from the command line.

## What "knowing Linux" means for a web developer

You don't need to be a sysadmin. You need to:

1. **Navigate the file system** — `cd`, `ls`, `pwd`, `find`
2. **Read and edit files** — `cat`, `less`, `nano` or `vim`
3. **Check what's running** — `ps`, `top`, `htop`
4. **Manage processes** — start, stop, restart your app
5. **Read logs** — `tail -f /var/log/...`
6. **Understand file permissions** — why `chmod` and `chown` exist
7. **Use a package manager** — `apt` (Ubuntu/Debian) or `dnf` (Fedora)

## Common Linux distributions

| Distro | Used for |
|--------|----------|
| **Ubuntu** | Most popular for servers and beginners. What WSL2 installs by default. |
| **Debian** | Ubuntu's parent. Extremely stable. |
| **Alpine** | Tiny. Used inside Docker containers. |
| **Amazon Linux** | AWS-optimized. |

You'll almost always use **Ubuntu** as a beginner.

## When this matters

| Scenario | What you'll do on Linux |
|----------|------------------------|
| Deploy DevStack Bio to a VPS | SSH in, install Node.js, configure a reverse proxy |
| Debug a production crash | Read logs, check memory usage, restart the process |
| Set up a database | Install PostgreSQL/SQLite, configure access |
| Write a Dockerfile | Specify a base Linux image, install dependencies |

## Deep dive

- [Linux Journey](https://linuxjourney.com/) — free interactive tutorials from beginner to advanced
- [The Linux Command Line](https://linuxcommand.org/tlcl.php) — free book by William Shotts
- [Ubuntu Server Guide](https://ubuntu.com/server/docs) — official documentation
- [OverTheWire: Bandit](https://overthewire.org/wargames/bandit/) — security wargame that teaches Linux basics

---

**Next:** [WSL2 for Windows Users](./02-wsl2-for-windows.md) → Run Linux on your Windows machine.
