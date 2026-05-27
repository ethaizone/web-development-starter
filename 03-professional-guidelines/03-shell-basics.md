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

## Essential commands

### Navigation

| Command       | What it does                                   |
| ------------- | ---------------------------------------------- |
| `pwd`         | Print current directory ("where am I?")        |
| `ls`          | List files in current directory                |
| `ls -la`      | List all files (including hidden) with details |
| `cd projects` | Change to `projects/` directory                |
| `cd ..`       | Go up one directory                            |
| `cd ~`        | Go to your home directory                      |

### Files and directories

| Command                | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `mkdir my-app`         | Create directory `my-app/`                           |
| `touch index.ts`       | Create empty file `index.ts`                         |
| `cp file.ts backup.ts` | Copy `file.ts` to `backup.ts`                        |
| `mv old.ts new.ts`     | Rename or move a file                                |
| `rm file.ts`           | Delete a file (**no undo**)                          |
| `rm -r folder/`        | Delete a folder and everything in it (**dangerous**) |
| `cat file.ts`          | Print file contents to terminal                      |
| `less file.ts`         | View file with scrolling (press `q` to quit)         |

### Searching and finding

| Command                | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `grep "error" app.log` | Find lines containing "error" in `app.log`                   |
| `find . -name "*.ts"`  | Find all `.ts` files in current directory and subdirectories |
| `grep -r "TODO" src/`  | Search for "TODO" in all files under `src/`                  |

### File permissions

Every file has three permission levels: **owner**, **group**, **everyone**.

```
-rw-r--r--  1 alice  staff  1234 Jun 1 10:00 file.ts
│├──┤├──┤├──┤
│ │    │    └── others: read only
│ │    └── group: read only
│ └── owner: read + write
└── file type (- = regular file, d = directory)
```

| Command               | What it does                                       |
| --------------------- | -------------------------------------------------- |
| `chmod +x script.sh`  | Make a file executable                             |
| `chmod 644 file.ts`   | Set permissions: owner read/write, others read     |
| `chmod 755 script.sh` | Set permissions: owner full, others read + execute |

### Piping and redirection

**Pipes** (`|`) send output from one command as input to another.
**Redirection** (`>`, `>>`) sends output to a file.

| Command                     | What it does                             |
| --------------------------- | ---------------------------------------- | --------------------------------- | ------------------------------ |
| `ls                         | grep ".ts"`                              | List files, show only `.ts` files |
| `cat log.txt                | grep "error"                             | wc -l`                            | Count lines containing "error" |
| `echo "hello" > file.txt`   | Write "hello" to `file.txt` (overwrites) |
| `echo "world" >> file.txt`  | Append "world" to `file.txt`             |
| `node app.js 2> errors.log` | Run app, redirect errors to a log file   |

### Process management

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `ps aux`        | List all running processes                    |
| `top` or `htop` | Show live process monitor                     |
| `kill 1234`     | Stop process with PID 1234                    |
| `Ctrl+C`        | Stop the currently running foreground process |

## Common patterns

```bash
# Find all TypeScript files that import 'drizzle'
grep -r "from 'drizzle'" src/ --include="*.ts"

# Count lines of code in your project
find src/ -name "*.ts" | xargs wc -l

# Watch a log file in real time
tail -f /var/log/app.log

# Run a process in the background
node server.js &
```

## Deep dive

- [The Linux Command Line](https://linuxcommand.org/tlcl.php) — free
  comprehensive book
- [Linux Journey: Shell](https://linuxjourney.com/) — interactive shell tutorial
- [Bash manual](https://www.gnu.org/software/bash/manual/) — official reference
- [explainshell.com](https://explainshell.com/) — paste any command, see what
  each part does

---

**Next:** [SSH Keys](./04-ssh-keys.md) → Connect to servers securely.
