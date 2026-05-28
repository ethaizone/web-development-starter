# Module 10: NPM Basics

## What you'll learn

Use npm to install and manage third-party packages in your projects.

## Key concepts

### What is npm?

So far you've written every function yourself. But some problems are common enough that others have already solved them and published their solutions as **packages**. npm is how you find, install, and use those packages in your own projects.

npm (Node Package Manager) does two things:

1. **A registry** — a huge collection of open-source packages anyone can publish
   to
2. **A CLI tool** — installs packages, runs scripts, manages dependencies

It ships with Node.js — no separate install needed.

### `package.json` — your project's manifest

Every Node.js project has a `package.json` at its root. It describes:

- Project name and version
- Dependencies (packages your code needs)
- Scripts (shortcuts for common commands)

```bash
# Create a new package.json (interactive prompts)
npm init

# Create with defaults (skip prompts)
npm init -y
```

### Installing packages

```bash
# Install a package and add to dependencies
npm install nanoid

# Install and add to devDependencies (build tools, test frameworks)
npm install --save-dev tsx
```

After installing, a `node_modules/` folder appears — that's where the actual
code lives. **Never edit `node_modules/` directly.** Never commit it to git (add
it to `.gitignore`).

### Using installed packages

```ts
import { nanoid } from "nanoid";

const linkId = nanoid(); // random 21-char ID: "V1StGXR8_Z5jdHi6B-myT"
const shortId = nanoid(8); // 8-char ID: "IrWB8b3p"
```

### `package.json` scripts

Scripts are shortcuts for commands you run frequently.

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
  }
}
```

```bash
# Run a script
npm run dev

# "start" and "test" are special — no "run" needed
npm start
npm test
```

### `tsx` as a dev dependency

You've been using `npx tsx` to run TypeScript files directly. Now that you have
a `package.json`, you can install `tsx` as a dev dependency:

```bash
npm install --save-dev tsx
```

Then use it in scripts without the `npx` prefix.

### devDependencies vs dependencies

| Type              | What goes here                           | Install flag                          |
| ----------------- | ---------------------------------------- | ------------------------------------- |
| `dependencies`    | Packages your app needs at runtime       | `npm install package-name`            |
| `devDependencies` | Build tools, type checkers, test runners | `npm install --save-dev package-name` |

Rule of thumb: if it runs on your machine during development, it's a
devDependency. If it runs in production, it's a dependency.

### Installing from `package.json`

When you clone a repo that has a `package.json`, install everything at once:

```bash
npm install
```

This reads `package.json` and creates `node_modules/`. This is why
`node_modules/` isn't committed — anyone can recreate it from `package.json`.

### `package-lock.json`

Automatically generated when you install packages. Locks exact versions so every
install is identical. **Always commit this file.** Without it, different
installs might get different versions.

### What is `npx`?

`npx` runs a package without installing it globally. You've been using `npx tsx`
— it runs `tsx` on the fly.

```bash
# Run a one-off command
npx tsx script.ts

# After installing tsx as a dev dependency, use it in scripts instead
```

## Commands you'll use

| Command                               | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| `npm init -y`                         | Create `package.json` with defaults      |
| `npm install package-name`            | Install a package                        |
| `npm install --save-dev package-name` | Install as dev dependency                |
| `npm install`                         | Install all packages from `package.json` |
| `npm run script-name`                 | Run a script from `package.json`         |

## Common patterns

| Pattern                               | When to use                              |
| ------------------------------------- | ---------------------------------------- |
| `npm init -y`                         | Starting a new project                   |
| `npm install package-name`            | Adding a package you need                |
| `npm run dev`                         | Running your dev server/watcher          |
| `.gitignore` includes `node_modules/` | Always — never commit installed packages |

## What We Built

This module already has a `package.json` with `nanoid` listed as a dependency.
Run `npm install` in the `10-npm-basics` folder to download it, then try the
example: `npx tsx examples/npm-basics.ts`.

Next, create your own project inside the `exercises/` folder to practice the
full workflow.

1. Navigate to the `exercises/` folder in your terminal
2. Run `npm init -y` to create your own `package.json`
3. Install `nanoid`: `npm install nanoid`
4. Install `tsx` as a dev dependency: `npm install --save-dev tsx`
5. Create `src/main.ts` with the following:
   - Import `nanoid`
   - Define a type `ProfileLink` with `id`, `title`, `url`, `order`
   - Write a function
     `createLink(title: string, url: string, order: number): ProfileLink` that
     generates a `nanoid(10)` for the id
   - Create an array of 3 links using this function and print each one
6. Add a script to `package.json`: `"dev": "tsx src/main.ts"`
7. Run with `npm run dev`
8. Create a `.gitignore` file in the `exercises/` folder and add `node_modules/`

> **Tip:** Your `exercises/` folder will have its own `node_modules/` separate
> from the module root. That's normal — each project has its own dependencies.

---

📖 **Deep dive:**

- [npm docs — Getting started](https://docs.npmjs.com/getting-started)
- [Node.js — Working with packages](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)
