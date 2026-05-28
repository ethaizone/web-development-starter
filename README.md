# Web Development Starter

> **Disclaimer:** This repository was created with the help of AI (~99% of the
> content). I cannot guarantee the correctness of everything here, but I'm open
> to accepting PRs with fixes and improvements.

A self-paced learning repository that takes you from zero to building a
full-stack web application. Choose your starting point based on your experience
level, follow the step-by-step guides, and build real projects along the way.

## Quick Start

**Never written code before?** → Start at
[01-typescript-fundamentals/01-setup/](./01-typescript-fundamentals/01-setup/)

**Know programming but new to web development?** → Start at
[02-web-development/01-how-the-web-works/](./02-web-development/01-how-the-web-works/)

**Finished the tracks and wondering what's next?** → Browse
[03-professional-guidelines/](./03-professional-guidelines/)

## Tracks

| Track                   | Folder                                                       | Description                                                                                                                  |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| TypeScript Fundamentals | [01-typescript-fundamentals/](./01-typescript-fundamentals/) | Learn TypeScript from scratch via the command line. 12 modules with runnable examples and exercises.                         |
| Web Development         | [02-web-development/](./02-web-development/)                 | Learn how **DevStack Bio** was built — a developer profile hub, documented step by step. 15 modules covering the full stack. |
| Professional Guidelines | [03-professional-guidelines/](./03-professional-guidelines/) | Pointers to advanced topics: Linux, Docker, CI/CD, deployment. Read anytime.                                                 |

## Tech Stack

The Web Development track uses:

| Tool               | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| **TypeScript**     | Language — strict typing throughout                 |
| **TanStack Start** | Meta-framework — React, file-based routing, SSR/CSR |
| **SQLite**         | Database — zero-config, file-based                  |
| **Drizzle ORM**    | Type-safe database queries                          |
| **Tailwind CSS**   | Styling — utility-first CSS                         |
| **shadcn/ui**      | UI components — accessible, composable              |

The TypeScript Fundamentals track uses only **Node.js** and **tsx** — no
frameworks, no browser.

## Prerequisites

Before starting either track, you need:

- **A computer** — Windows, macOS, or Linux all work
- **Internet connection** — for installing tools and packages
- **A code editor** — [VS Code](https://code.visualstudio.com/) is recommended
- **Node.js** — installation is covered in the first module of each track

No prior programming experience required.

## How This Repo Works

### TypeScript Fundamentals (01)

Each module is a self-contained folder:

```
01-typescript-fundamentals/
├── 01-setup/
│   └── README.md              ← Read this first
├── 02-variables-types/
│   ├── README.md              ← The lesson
│   ├── examples/              ← Runnable code examples
│   └── exercises/             ← Optional practice
│       └── solutions/         ← Reference solutions
...
```

- Read the README
- Run the examples
- Try the exercises (or skip them — your choice)
- Use AI to check your work if you get stuck

### Web Development (02)

One project, documented step by step across 15 modules:

```
02-web-development/
├── README.md                  ← How this track works (read this first)
├── 01-how-the-web-works/
│   └── README.md              ← Concepts only
├── 02-git-basics/
│   └── README.md              ← Concepts only
├── 03-your-first-server/
│   └── README.md              ← Concepts + what we built
...
```

- Each module documents a stage of building **DevStack Bio**
- Read the concepts, study the code, explore the
  [reference app](./devstack-bio-reference/)
- The final module covers deployment

### Professional Guidelines (03)

Not a course. A curated list of topics and links:

```
03-professional-guidelines/
├── README.md                  ← Start here for topic index
├── 01-why-linux-unix.md
├── 02-wsl2-for-windows.md
...
```

Read whatever interests you. Skip the rest.

## Demo App: DevStack Bio

The web development track documents how a self-hosted developer profile hub was
built — a customizable Linktree alternative. See [demo-app.md](./demo-app.md)
for the full specification and
[devstack-bio-reference/](./devstack-bio-reference/) for the finished code.

Features covered:

- User registration and login
- Profile editing with theme selection
- Custom link management (add, edit, reorder, delete)
- Public bio pages with dynamic routing (`/username`)
- View analytics tracking

## FAQ

**Q: Why not Next.js?**

A: I've used Next.js before — that's exactly why I know TanStack Start is the
better choice here.

**Q: Why SQLite?**

A: This repo is called _starter_. If you're asking this question, this repo
isn't for you.

**Q: Why TypeScript?**

A: TypeScript is the only language that lets you build a web app end-to-end, and
its strict type system builds a solid foundation for anyone starting with their
first language.

**Q: I need more.**

A: File an issue, but I don't promise anything — this isn't my day job.

## Feedback

Found a mistake? Have a suggestion?

- Open an issue in this repository
- Describe what's wrong or what could be better
- If a command didn't work as described, include your OS and the error message
