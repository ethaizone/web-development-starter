## Working on This Repository

This is a **self-paced learning repository** for web development beginners. The
content is primarily markdown documentation (module READMEs) with some runnable
code examples and a reference app. Every change affects what learners read,
type, and understand — treat every edit as a teaching decision.

### Glossary (quick reference — full definitions in `CONTEXT.md`)

| Term           | Meaning                                                     |
| -------------- | ----------------------------------------------------------- |
| Learner        | Anyone using this repository to study                       |
| Module         | One self-contained lesson folder with README (+ examples)   |
| Track          | One of three top-level learning paths (01, 02, 03)          |
| TS Track       | `01-typescript-fundamentals/` — 12 modules, CLI-only        |
| Web Dev Track  | `02-web-development/` — 15 modules, documents DevStack Bio  |
| Pro Guidelines | `03-professional-guidelines/` — curated links, not a course |
| DevStack Bio   | The reference app documented across the Web Dev Track       |
| Tiny Example   | Small standalone code file in a module's `examples/` folder |

---

## 1. Don't Act on Your Own

Ask the repo owner before making any changes. Do not assume, invent, or decide
on behalf of the owner. Present options when unsure and wait for direction.

## 2. Accuracy Over Completeness

- **Verify before deciding.** Use web search or read the actual official
  documentation/URLs to confirm whether something is correct or incorrect. Do
  not decide based on assumption or memory alone.
- **Share findings before acting.** After verifying, present the findings to the
  repo owner and ask for confirmation before making any changes (see Rule 1).
- **Leave placeholders, not guesses.** Use
  `<!-- TODO: verify with official docs -->` when unsure. Do not fabricate
  content to fill gaps.
- **Link to official docs.** Prefer linking to authoritative sources (TanStack
  docs, Drizzle docs, TypeScript handbook, MDN) over paraphrasing them.

## 3. Validate All Code Changes

- **Run before committing.** If you change any code file (examples, exercises,
  reference app), run it:
  - TS Track examples/exercises: `npx tsx <file.ts>` from the module directory
  - Reference app: `npm run build` from `devstack-bio-reference/`
  - Reference app TypeScript check: `npx tsc --noEmit` from
    `devstack-bio-reference/`
- **If it doesn't run, it doesn't ship.** Failing code in a teaching repo is
  worse than no code — learners will blame themselves.

## 4. Follow Existing Module Structure

### TS Track modules (`01-typescript-fundamentals/XX-name/`)

```
XX-name/
├── README.md          ← Cheatsheet-style lesson (always present)
├── examples/          ← Runnable .ts files (1 file per concept)
└── exercises/         ← Practice tasks + solutions/ folder
```

- Module 01 (setup) has no `examples/` or `exercises/`
- Module 12 (mini-project) has `src/` + `package.json` instead

### Web Dev Track modules (`02-web-development/XX-name/`)

```
XX-name/
├── README.md          ← Concepts + build record (always present)
└── examples/          ← Tiny Examples (only when a concept needs isolation)
```

- Most modules are README-only guides — do not add `examples/` unless a concept
  truly benefits from isolated demonstration before being applied to DevStack
  Bio

### Do not invent new folders or files

If a module doesn't have an `examples/` or `exercises/` folder, don't create one
unless explicitly asked. The structure is intentional.

## 5. Follow the Cheatsheet Style

Every module README follows this format (see `CONTEXT.md` → Design Principle 5):

1. **What you'll learn** — one sentence
2. **Key concepts** — explained with inline code examples
3. **Commands you'll use** — table of command → purpose (when applicable)
4. **Common patterns** — table of pattern → when to use (when applicable)
5. **What We Built** — code written and commands run to build the feature
6. **Deep dive** — link(s) to official documentation

Module 01 (How the Web Works) and Module 02 (Git Basics) are concepts-only — no
"What We Built" section.

Rules:

- No fluff, no history lessons, no filler
- **Explain "why" for major new concepts.** When introducing something
  significant that learners haven't seen before (e.g. why we need git, why types
  matter, why we use a framework), add a brief explanation of the benefit —
  answer the "why should I care?" question. Not every concept needs this (e.g.
  generics can stay practical), but major ones do.
- Code examples inline in markdown, not in separate files (unless it's a Tiny
  Example that needs to be runnable)
- Reference code by **file path + function/variable name**, never by line number

## 6. Terminology Matters

Use the terms defined in `CONTEXT.md` consistently:

- **Learner** (not "student", "user", "reader")
- **Module** (not "chapter", "lesson", "section")
- **Track** (not "course", "path", "level")
- **DevStack Bio** (not "demo app", "the project", "the app")
- **Tiny Example** (not "mini project", "sandbox", "playground")

When in doubt, read `CONTEXT.md` first — it is the source of truth for
conventions, decisions, and glossary.

## 7. Cross-Platform Awareness

- All instructions in Tracks 01–02 must work natively on **Windows**
  (PowerShell/cmd), macOS, and Linux
- Show OS-specific commands side-by-side when they differ
- Do not require WSL2 — it's introduced only in Pro Guidelines as optional
- Use `npm` as the package manager (ships with Node.js, cross-platform)

## 8. Tech Stack Boundaries

- **TS Track**: Only Node.js + `tsx`. No browser, no frameworks, no React
- **Web Dev Track**: TanStack Start, React, TypeScript, SQLite, Drizzle ORM,
  Tailwind CSS, shadcn/ui. Do not introduce alternative tools or libraries
  unless they are part of the DevStack Bio spec (`demo-app.md`)
- **Pro Guidelines**: Links and pointers only. No deep teaching, no code
  tutorials

Do not add concepts or tools outside these boundaries. See `CONTEXT.md` →
Example Dialogue for the rationale.

## 9. Reference App (`devstack-bio-reference/`)

- The reference app is the **end goal** — the complete application that the Web
  Dev Track's journey arrives at
- The Web Dev Track (`02-web-development/`) is a **record of what we did**, step
  by step, to arrive at the reference app. It is NOT instructions telling
  learners to construct from scratch — it documents the journey
- Both must stay in sync:
  - If you change a Web Dev Track README, verify the reference app still builds
    (`npm run build` from `devstack-bio-reference/`)
  - If you change the reference app code, verify the corresponding README still
    accurately records what was done
- The reference app has its own `AGENTS.md` — read it when working inside that
  directory

## 10. Git Workflow

- Always work on a **feature branch** (e.g. `fix/wd-05-tailwind-commands`),
  never directly on `main`
- **Get user review before committing.** Present the changes to the repo owner
  and wait for approval before running `git commit`
- **Do not run `git add` on your own.** The owner will review changes before
  staging — wait for them to decide what to stage
- Commit messages should be descriptive: what module and what was changed
- Before merging, ensure:
  - `main` is clean with no uncommitted changes
  - The branch builds/runs correctly
  - No unrelated files are included in the commit

## 11. Validation Script

The repo includes `validate-modules.sh` for automated validation of all modules
against official documentation. Use it:

```bash
./validate-modules.sh              # validate all (resumes if interrupted)
./validate-modules.sh ts-03        # validate TS Track module 03
./validate-modules.sh wd-05        # validate Web Dev Track module 05
./validate-modules.sh pro          # validate Pro Guidelines
./validate-modules.sh --status     # show progress
```

After making changes, run validation on the affected module(s) to catch issues.

## 12. Before Starting Any Task

1. Read `CONTEXT.md` for conventions and decisions
2. Read the relevant module README(s) to understand current state
3. Check `demo-app.md` if working on the Web Dev Track (for feature spec)
4. Verify the change fits within the tech stack and design principles
5. Make the change, then validate it runs/renders correctly
