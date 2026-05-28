# Web Development Starter — Curriculum Context

A self-paced learning repository that takes complete beginners through
TypeScript fundamentals to building a full-stack web application (DevStack Bio).
Designed for Windows compatibility. All documentation is cheatsheet-style with
links to official resources.

## Language

**Learner**: Anyone using this repository to study. May be a complete beginner
or a developer new to web development. _Avoid_: Student, user, reader

**Module**: One self-contained lesson folder containing a README, optional
runnable examples, and optional exercises with reference solutions. Numbered
sequentially within each track. _Avoid_: Chapter, lesson, section

**Track**: One of the three top-level learning paths (TS Track, Web Dev Track,
Pro Guidelines). _Avoid_: Course, path, level

**TS Track**: Folder `01-typescript-fundamentals/`. Teaches TypeScript via
Node.js CLI — no browser, no frameworks. 12 modules total. _Avoid_:
Fundamentals, basics course, intro

**Web Dev Track**: Folder `02-web-development/`. Documents how the DevStack Bio
app was built incrementally across 14 modules. Each module records what was
added to arrive at the reference app. Learners read through the build journey
— they don't construct from scratch. _Avoid_: Main course, app track, project track

**Pro Guidelines**: Folder `03-professional-guidelines/`. Lightweight pointers
to advanced topics (Linux, Docker, CI/CD, deployment). Not a course — a curated
map of "what to learn next" with links. _Avoid_: Advanced track, professional
track, track 3

**DevStack Bio**: The demo application — a self-hosted developer profile hub
(Linktree alternative). Features: registration, profile editing, link
management, public bio pages, and view analytics. Built throughout the Web Dev
Track. _Avoid_: Demo app, project, the app

**Tiny Example**: A small standalone code file (one function, one concept)
placed inside a module's `examples/` folder. Only created when a concept
benefits from isolated demonstration before being applied to DevStack Bio.
_Avoid_: Mini project, sandbox, playground

## Tech Stack

All choices for the Web Dev Track. The TS Track uses only Node.js + `tsx`.

- **Runtime**: Node.js 24 LTS (codename "Krypton", LTS until April 2028) —
  target version for all tracks. Compatibility with all stack components
  verified against official docs.
- **Language**: TypeScript throughout. Strict mode encouraged.
- **Meta-framework**: TanStack Start (React-based, file-based routing, SSR/CSR).
- **Database**: SQLite — zero-config, file-based, perfect for learning.
- **ORM**: Drizzle ORM — type-safe schema definitions, SQL-like query API.
- **Styling**: Tailwind CSS — utility-first CSS framework.
- **UI Components**: shadcn/ui — accessible, composable React components built
  on Radix UI.
- **Package Manager**: npm (ships with Node.js, cross-platform, no extra
  install).
- **Version Manager**: nvm (macOS/Linux) / nvm-windows (Windows).
- **Editor**: VS Code — recommended but not required.

## Relationships

- A **Learner** follows one or more **Tracks** sequentially (01 → 02 → 03).
- The **TS Track** has 12 **Modules**. Each module is self-contained with its
  own `examples/` and optional `exercises/` with reference `solutions/`.
- The **Web Dev Track** has 14 **Modules**. All modules document how one
  **DevStack Bio** project was built from start to finish. No separate
  exercises — the build record is the learning material.
- Each Web Dev Track **Module** may contain **Tiny Examples** for new concepts,
  plus a "What We Built" section recording the code we wrote.
- No git tags or checkpoints — the build record in each module README is the
guide. If a learner gets stuck, that's where AI assistance comes in.
- The **Pro Guidelines** is independent — a Learner can read it at any time.

## Repository Structure

```
/
├── CONTEXT.md                         ← This file. Glossary, decisions, and handoff.
├── demo-app.md                        ← DevStack Bio project specification.
│
├── 01-typescript-fundamentals/        ← TS Track
│   ├── 01-setup/                      ← No examples/exercises (tool installation)
│   │   └── README.md
│   ├── 02-variables-types/            ← Each module (02-11) has:
│   │   ├── README.md                  ←   Cheatsheet-style lesson
│   │   ├── examples/                  ←   Runnable code (1 .ts file)
│   │   └── exercises/                 ←   Exercise + solutions/
│   ├── ... (modules 03-11)
│   └── 12-mini-project/               ← DevStack Bio CLI (multi-file capstone)
│       ├── README.md
│       ├── package.json               ← nanoid dependency
│       └── src/                        ← types.ts, profile.ts, github.ts, storage.ts, main.ts
│
├── 02-web-development/                ← Web Dev Track (README-only guides)
│   ├── 01-how-the-web-works/
│   │   └── README.md
│   ├── ... (modules 02-13)
│   └── 14-git-and-deployment/
│       └── README.md
│
└── 03-professional-guidelines/        ← Pro Guidelines
    ├── README.md                      ← Overview + index of topics
    ├── 01-why-linux-unix.md
    ├── 02-wsl2-for-windows.md
    ├── 03-shell-basics.md
    ├── 04-ssh-keys.md
    ├── 05-docker-concepts.md
    ├── 06-cicd-awareness.md
    ├── 07-deployment-options.md
    └── 08-further-learning.md
```

Note: The exact module folder structure is a guide. Modules only get an
`examples/` folder when a Tiny Example is needed.

## Design Principles

### 1. Unverified information is never written

If a command, configuration, or API cannot be confirmed from official
documentation, we do not include it. Missing information can be added later with
feedback. Wrong information causes learners to doubt themselves and breaks
trust.

**Applies to:** setup commands, TUI prompts, configuration flags, API
signatures, file paths, version compatibility.

**When in doubt:** Link to official docs and say "follow the prompts" rather
than guessing what the prompts look like.

### 2. Missing > Wrong

Related to principle 1. If we can't verify, we leave a placeholder:
`<!-- TODO: verify with official docs -->`. Learners can report gaps. They
cannot easily unlearn falsehoods.

### 3. Code is a teaching tool

All code in examples and the DevStack Bio project must use:

- Meaningful, descriptive variable names
- No variable shadowing
- Consistent naming conventions
- Comments only where intent isn't obvious from names

This sets an example for learners and makes code references unambiguous.

### 4. Code references by name, not line number

All documentation references code by file path + function/class/variable name.
Line numbers shift on every edit and break references.

Example: "See `src/routes/dashboard.tsx` → `handleSaveProfile()`"

### 5. Cheatsheet-style documentation

Each module README follows a consistent format:

- **What you'll learn** — one sentence
- **Key concepts** — explained with code examples
- **Commands you'll use** — table of command → purpose
- **Common patterns** — table of pattern → when to use
- **What We Built** — code written and commands run to build the feature
- **Deep dive** — link(s) to official documentation

No fluff, no history lessons, no filler. Enough to understand + enough to see
how it was applied + links for the rest.

### 6. One project, documented incrementally

The Web Dev Track documents how a single DevStack Bio project was built from
start to finish. The reference app (`devstack-bio-reference/`) is the end goal.
No multiple demo projects. No git tags or checkpoints — the build record in
each module README is the guide. Tiny Examples are used sparingly for isolated
concept demonstrations only.

### 7. Git taught inline

Git concepts are introduced at the moment of first use. The first time a learner
needs `git init`, that's when we teach `git init`. A short prerequisites section
covers install + absolute minimum (`init`, `add`, `commit`, `push`). Real
learning happens through practice in context.

### 8. Cross-platform without WSL2

Tracks 01-02 must work natively on Windows (PowerShell/cmd). No WSL2 required.
OS-specific commands are shown side-by-side where unavoidable. The Pro
Guidelines introduce WSL2 as an optional professional tool, not a prerequisite.

## Key Decisions Log

| Decision                                               | Choice                               | Rationale                                                                               |
| ------------------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------- |
| Target audience                                        | Complete beginners + devs new to web | Two entry points via progressive tracks                                                 |
| Repo structure                                         | Progressive tracks in one repo       | One checkout, simpler for beginners                                                     |
| TS fundamentals teaching method                        | CLI under Node.js                    | No browser complexity; focus on the language                                            |
| Advanced types module (generics, discriminated unions) | Included as optional Module 11       | Better to have the tool and skip it than need it later                                  |
| DevStack Bio learning approach                         | Read the build record                | Learners read how the app was built, not construct from scratch                          |
| Example code in Web Dev Track                          | Tiny Examples + incremental app      | Tiny for isolated concepts, app for real application                                    |
| Git tags / checkpoints                                 | Dropped entirely                     | Avoids blocking beginners with concepts they don't know yet; reduces maintenance burden |
| Git teaching                                           | Prerequisites doc + inline           | Tied to real actions, not abstract                                                      |
| Node.js version                                        | 24 LTS                               | Confirmed by repo owner                                                                 |
| Windows support                                        | Native, no WSL2                      | Don't block beginners before they start                                                 |
| Documentation language                                 | English                              | Matches code, error messages, and linked official docs                                  |
| Package manager                                        | npm                                  | Ships with Node.js, cross-platform                                                      |
| Code naming                                            | Meaningful, no shadowing             | Teaching tool + unambiguous references                                                  |

## Verification Checklist

All items verified against official documentation:

- [x] Node.js 24 LTS compatibility with TanStack Start
- [x] Node.js 24 LTS compatibility with Drizzle ORM (drizzle-orm@0.45.2,
      better-sqlite3 driver)
- [x] Node.js 24 LTS compatibility with better-sqlite3 (prebuilds available)
- [x] Node.js 24 LTS compatibility with shadcn/ui
- [x] TanStack Start project scaffolding (`npx @tanstack/cli@latest create`)
- [x] TanStack Start minimum Node.js version requirement
- [x] TanStack Start current file-based routing conventions
- [x] TanStack Start `createServerFn` current API
- [x] TanStack Start current installation steps
- [x] Drizzle ORM SQLite setup with better-sqlite3 driver
- [x] Drizzle Kit migration commands
- [x] shadcn/ui current installation and initialization
      (`npx shadcn@latest init`)
- [x] shadcn/ui component installation commands
- [x] Tailwind CSS v4 setup with TanStack Start (`@tailwindcss/vite` plugin)
- [x] nvm-windows current installation method
      (github.com/coreybutler/nvm-windows)
- [x] `tsx` current installation and usage (`npm i -g tsx`)
- [x] VS Code recommended extensions for this stack
- [x] Pro Guidelines: WSL2 installation steps (learn.microsoft.com)
- [x] Pro Guidelines: Docker current beginner resources (docs.docker.com)
- [x] Pro Guidelines: CI/CD current tool landscape (GitHub Actions)
- [x] Pro Guidelines: deployment platform current options (Railway, Fly.io, VPS)

## TS Track Module Outline

| #   | Module                    | Scope                                                                                                          |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 01  | Setup                     | Install Node.js, VS Code, run `tsx script.ts`                                                                  |
| 02  | Variables & Types         | `string`, `number`, `boolean`, `const`, `let`, type annotations                                                |
| 03  | Functions                 | Parameters, return types, arrow functions                                                                      |
| 04  | Control Flow              | `if/else`, `for`, `while`, `switch`                                                                            |
| 05  | Arrays & Objects          | Creating, accessing, array methods (`map`, `filter`, `find`)                                                   |
| 06  | Interfaces & Types        | Defining shapes, optional properties, union types                                                              |
| 07  | Async Basics              | Promises, `async/await`, `fetch()` (CLI only, calling a public API)                                            |
| 08  | Error Handling            | `try/catch`, throwing                                                                                          |
| 09  | Modules                   | `import/export`, organizing code across files                                                                  |
| 10  | NPM Basics                | Installing packages, `package.json`, scripts                                                                   |
| 11  | Advanced Types (optional) | Generics, utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`), type guards, discriminated unions |
| 12  | Mini Project              | DevStack Bio CLI — multi-file capstone using types, async, modules, npm, GitHub API                            |

Bar: After completing this track, a learner can read a Drizzle schema file and
understand every line.

Each module (except Setup) may include **exercises** with reference
**solutions**. Learners can skip exercises or use AI to verify their work before
comparing with the solution.

## Web Dev Track Module Outline

| #   | Module                | What they learn                                             | Key concept        |
| --- | --------------------- | ----------------------------------------------------------- | ------------------ |
| 01  | How the Web Works     | HTTP, request/response, client vs server, browsers, DNS     | Mental model       |
| 02  | Your First Server     | TanStack Start setup, run dev server, see a page render     | "It works!" moment |
| 03  | Routing               | File-based routing, dynamic routes (`/$username`), layouts  | Navigation         |
| 04  | HTML & the DOM        | Elements, semantic HTML, how browsers parse HTML            | Foundation         |
| 05  | Styling with Tailwind | Utility classes, responsive design, dark mode               | Visual polish      |
| 06  | Components & Props    | React components, JSX, props, composition                   | React basics       |
| 07  | State & Interactivity | `useState`, event handlers, forms, controlled inputs        | Interactivity      |
| 08  | shadcn/ui             | Install, use components, customize theme                    | UI library         |
| 09  | Database & Drizzle    | SQLite, schema definition, migrations, queries              | Persistence        |
| 10  | Server Functions      | `createServerFn`, client vs server boundary, loading states | Full-stack glue    |
| 11  | Authentication        | Registration, login, sessions, cookies, route guards        | Security           |
| 12  | The Dashboard (CSR)   | Profile editing, link CRUD, optimistic UI                   | Complex client     |
| 13  | The Public Page (SSR) | Route loaders, SEO, analytics tracking, 404 handling        | Production SSR     |
| 14  | Git & Deployment      | Git workflow review, build for production, deploy           | Ship it            |

## Pro Guidelines Topics

| #   | Topic                  | Scope                                                            |
| --- | ---------------------- | ---------------------------------------------------------------- |
| 01  | Why Linux/Unix Matters | Servers run Linux, deployment targets, shell scripting           |
| 02  | WSL2 for Windows Users | What it is, why it helps, how to install (link to official docs) |
| 03  | Shell Basics           | Common commands, file permissions, piping (link, not teach)      |
| 04  | SSH Keys               | What they are, why GitHub needs them, how to generate one        |
| 05  | Docker Concepts        | What containers are, why they matter, "learn this next"          |
| 06  | CI/CD Awareness        | What it means, common tools (GitHub Actions), "learn this next"  |
| 07  | Deployment Options     | VPS, managed platforms (Vercel, Railway), trade-offs             |
| 08  | Further Learning       | Curated links for each topic                                     |

Note: Pro Guidelines topics are pointers with links to official docs. No deep
teaching. All 8 topics written and link-verified.

## Example Dialogue

> **Contributor:** "Should we include a CSS-in-JS section in the Web Dev Track?"
> **Maintainer:** "No — the stack uses Tailwind. We don't teach alternatives
> unless they're part of DevStack Bio. Keep the scope tight."

> **Contributor:** "The TanStack Start setup TUI changed — the prompts are
> different now." **Maintainer:** "Update the docs but don't guess the new
> prompts. Verify against official docs first. If docs don't cover it, use a
> placeholder and say 'follow the prompts.'"

> **Contributor:** "Should we teach `useEffect` in Module 07?" **Maintainer:**
> "Only if DevStack Bio needs it. We teach concepts when they're needed, not
> because they exist."

## Flagged Ambiguities

- "student" was used early in discussion — resolved: use **Learner** everywhere.
  More inclusive, less academic.
- "example repo" was used to mean both Tiny Examples and the full DevStack Bio
  project — resolved: **Tiny Example** for isolated demos, **DevStack Bio** for
  the main project. No separate "example repo."
- "course" was used interchangeably with "track" — resolved: use **Track** for
  the three top-level paths.

## Remaining Work

None. All three tracks complete, all code validated end-to-end.

## Validation Results

The DevStack Bio reference app (`devstack-bio-reference/`) is the end goal of
the Web Dev Track. All module READMEs document the steps taken to build it.
Issues found and fixed in READMEs:

1. **Module 05**: `to="/alice"` →
   `to="/$username" params={{ username: 'alice' }}` (TanStack Router type-safe
   routes)
2. **Module 08**: `npx shadcn@latest init` is interactive; added manual
   `components.json` + `utils.ts` fallback
3. **Module 10**: `profile?.links.map(...)` spread fails TypeScript; fixed to
   `profile ? Math.max(...) : 0`
4. **Module 11**: `Route.useRouter()` doesn't exist; changed to `useRouter()`
   from `@tanstack/react-router`
5. **Module 12**: Same `Route.useRouter()` fix
6. **Module 13**: `head: ({ loaderData })` returns `never` when loader throws
   `notFound()`; simplified to static head

The reference app builds successfully (`npm run build`) and all routes return
correct HTTP status codes.
