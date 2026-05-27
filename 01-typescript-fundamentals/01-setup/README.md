# Module 01 — Setup

## What you'll learn

Install the tools you need and run your first TypeScript file.

## Key Concepts

### What you'll install

| Tool        | What it does                                   | Why we need it                              |
| ----------- | ---------------------------------------------- | ------------------------------------------- |
| **Node.js** | Runs JavaScript/TypeScript outside the browser | We write TypeScript, Node runs it           |
| **npm**     | Installs packages (libraries)                  | Ships with Node.js — no separate install    |
| **VS Code** | Code editor                                    | Free, excellent TypeScript support          |
| **tsx**     | Runs `.ts` files directly                      | No manual compile step — write and run      |
| **Git**     | Version control                                | Tracks changes, required later in the track |

### Node.js and the LTS cycle

Node.js releases a new major version every 6 months:

- **Even-numbered versions** (22, 24, 26...) become **LTS** (Long-Term Support)
  — stable, production-ready, supported for ~30 months.
- **Odd-numbered versions** (23, 25, 27...) are **Current** — experimental,
  short-lived.

Always use an **LTS** version. This track uses **Node.js 24** (codename
"Krypton").

> **Why not a version manager?** Tools like `nvm` (Node Version Manager) let you
> switch between Node.js versions. Useful when you work on multiple projects
> with different requirements. For now, the direct installer is simpler — you
> can install `nvm` later if needed.
>
> - macOS/Linux: [nvm-sh/nvm](https://github.com/nvm-sh/nvm)
> - Windows:
>   [coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

### TypeScript without a compile step

Node.js 24 can run `.ts` files natively by stripping type annotations. This
works for basic code. We'll use **tsx** instead because it handles more
TypeScript features (like module imports with various extensions) and is what
the web framework uses under the hood later in the Web Dev Track.

### The terminal

You'll type commands in a **terminal** (also called "command line" or "shell"):

- **macOS**: Terminal app (or iTerm2). Default shell: zsh.
- **Windows**: PowerShell or Command Prompt. VS Code's integrated terminal works
  too.
- **VS Code**: Open the integrated terminal with `` Ctrl+` `` (backtick) or
  **Terminal → New Terminal** from the menu.

Lines starting with `$` in this track are terminal commands. The `$` is the
prompt — don't type it:

```bash
$ node --version
v24.x.x
```

Just type `node --version` and press Enter.

## Now Install Everything

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version (it should say "LTS" and show v24.x.x)
3. Run the installer — accept all defaults
4. Verify in your terminal:

```bash
node --version
npm --version
```

You should see `v24.x.x` for Node and `xx.x.x` for npm.

**Windows users:** If `node` is not recognized after install, close and reopen
your terminal. If it still doesn't work, check that Node.js was added to your
PATH during installation.

### Step 2: Install VS Code

1. Go to [code.visualstudio.com](https://code.visualstudio.com)
2. Download for your OS
3. Install with default settings

**Recommended setup:**

- Open VS Code
- Open the integrated terminal: `` Ctrl+` `` (backtick) or **Terminal → New
  Terminal**
- You'll use this terminal for all commands in this track

### Step 3: Install Git

**macOS:** Git is likely pre-installed. Check:

```bash
git --version
```

If not installed, macOS will prompt you to install the Xcode Command Line Tools
(which includes Git). Accept the prompt.

**Windows:** Download from [git-scm.com](https://git-scm.com/install/windows)
and run the installer with default settings.

Verify:

```bash
git --version
```

### Step 4: Install tsx

Install tsx globally so you can run TypeScript files from anywhere:

```bash
npm install -g tsx
```

The `-g` flag installs it globally (available in any terminal, not just one
project).

Verify:

```bash
tsx --version
```

### Step 5: Create your first TypeScript file

Create a folder for these tracks and open it in VS Code:

```bash
mkdir web-development-starter
cd web-development-starter
code .
```

> **Note:** `code .` opens VS Code in the current folder. If it doesn't work,
> open VS Code manually and use **File → Open Folder**.

In VS Code, create a new file called `hello.ts`:

```ts
const greeting: string = "Hello, TypeScript!";
console.log(greeting);
```

### Step 6: Run it

In the VS Code terminal:

```bash
tsx hello.ts
```

You should see:

```
Hello, TypeScript!
```

🎉 **You just wrote and ran TypeScript.** Here's what happened:

1. You declared a variable `greeting` with the type `string`
2. `console.log()` printed it to the terminal
3. `tsx` ran your `.ts` file without a separate compile step

## Verify Your Setup

Run each command and confirm the output:

| Command          | Expected output        |
| ---------------- | ---------------------- |
| `node --version` | `v24.x.x` (any 24.x)   |
| `npm --version`  | `xx.x.x` (any version) |
| `tsx --version`  | version number         |
| `git --version`  | `git version x.xx.x`   |
| `tsx hello.ts`   | `Hello, TypeScript!`   |

If all five work, you're ready for
[Module 02 — Variables & Types](../02-variables-types/).

### Troubleshooting

| Problem                                          | Fix                                                                                                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `node` not found                                 | Close and reopen terminal. Reinstall Node.js if needed.                                                                                                                                                                              |
| `tsx` not found                                  | Run `npm install -g tsx` again. Close and reopen terminal.                                                                                                                                                                           |
| `code .` not found                               | Open VS Code → press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) → type "shell command" → click "Shell Command: Install 'code' command in PATH"                                                                                  |
| Permission error on `npm install -g` (Mac/Linux) | Do **not** use `sudo`. Instead, [fix npm permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or install [nvm](https://github.com/nvm-sh/nvm) which avoids the issue entirely. |

## Commands You'll Use

| Command              | Purpose                        |
| -------------------- | ------------------------------ |
| `node --version`     | Check Node.js version          |
| `npm --version`      | Check npm version              |
| `npm install -g tsx` | Install tsx globally           |
| `tsx file.ts`        | Run a TypeScript file          |
| `code .`             | Open VS Code in current folder |
| `git --version`      | Check Git version              |

## Deep Dive

- [Download Node.js](https://nodejs.org/en/download) — official installers for
  all platforms
- [Node.js Releases](https://nodejs.org/en/about/previous-releases) — LTS
  schedule and version status
- [Node.js Native TypeScript](https://nodejs.org/learn/typescript/run-natively)
  — how Node.js runs `.ts` files without extra tools
- [Download VS Code](https://code.visualstudio.com) — free code editor
- [VS Code Terminal](https://code.visualstudio.com/docs/terminal/basics) —
  integrated terminal guide
- [Git — Installing](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  — install guide for all platforms
- [tsx on GitHub](https://github.com/privatenumber/tsx) — the tool that runs
  TypeScript files
- [nvm (macOS/Linux)](https://github.com/nvm-sh/nvm) — Node Version Manager
- [nvm-windows](https://github.com/coreybutler/nvm-windows) — Node Version
  Manager for Windows

---

**Next:** [Module 02 — Variables & Types](../02-variables-types/) → Store data
and tell TypeScript what to expect.
