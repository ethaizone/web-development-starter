# Module 02 — Your First Server

## What you'll learn

Create a new TanStack Start project, start the dev server, and see a page render
in your browser.

## Prerequisites

- You completed the TypeScript Track (Modules 01–10 minimum)
- Node.js 24 LTS is installed (`node -v` should print `v24.x.x`)
- npm is available (`npm -v` should print a version number)
- A code editor is installed (VS Code recommended)

## Key Concepts

### What is a Meta-Framework?

You wrote TypeScript in the TS Track using `tsx` — that's a runtime tool. A
**meta-framework** layers on top of a runtime to give you everything a real web
app needs: routing, server-side rendering, API endpoints, and build
optimization.

TanStack Start is a meta-framework built on:

- **React** — the UI library (components, state, events)
- **Vite** — the build tool (fast dev server, bundling)
- **TanStack Router** — file-based routing with full type safety

### The Dev Server

When you run `npm run dev`, Vite starts a **dev server** on your machine. It:

1. Watches your files for changes
2. Rebuilds instantly when you save
3. Serves your app at `http://localhost:3000`
4. Provides hot module replacement (HMR) — changes appear without a full page
   reload

### Project Structure

A fresh TanStack Start project looks like this:

```
my-app/
├── package.json          ← Dependencies and scripts
├── app.config.ts         ← App configuration (optional)
├── vite.config.ts        ← Build tool configuration
├── tsconfig.json         ← TypeScript configuration
├── src/
│   ├── router.tsx        ← Router setup
│   ├── routeTree.gen.ts  ← Auto-generated route tree (don't edit)
│   ├── routes/
│   │   ├── __root.tsx    ← Root layout (always rendered)
│   │   └── index.tsx     ← Home page (matches /)
│   ├── client.tsx        ← Client entry point
│   └── server.ts         ← Server entry point (optional)
```

You'll add files to `src/routes/` throughout the Web Dev Track. The
`routeTree.gen.ts` file is auto-generated — never edit it by hand.

### Route Files

Every file in `src/routes/` becomes a URL path:

| File path             | URL            | Purpose                          |
| --------------------- | -------------- | -------------------------------- |
| `__root.tsx`          | —              | Layout wrapper (always rendered) |
| `index.tsx`           | `/`            | Home page                        |
| `about.tsx`           | `/about`       | About page                       |
| `users/$username.tsx` | `/users/alice` | Dynamic route                    |

## Now Build It: Create DevStack Bio

### Step 1: Create the project

Open a terminal and navigate to where you want the project. Then run:

```bash
npx @tanstack/cli@latest create
```

Follow the interactive prompts:

- **Framework:** `React`
- **Project name:** `devstack-bio`
- **Toolchain:** `None`
- **Deployment adapter:** `Nitro (agnostic)`
- **Demo/example pages:** `No`
- **Add-ons:** Do **not** select any add-ons
- **Git:** `Yes`

> ⚠️ Do **not** add the `shadcn` add-on when prompted. We'll set up shadcn/ui
> manually in Module 08 so you understand each step.

### Step 2: Install dependencies

```bash
cd devstack-bio
npm install
```

> If you used a different project name in Step 1, `cd` into that directory
> instead.

### Step 3: Open the project in your editor

```bash
code .
```

### Step 4: Explore the generated files

Read through these files to understand the scaffold:

1. **`package.json`** — notice the `dev`, `build`, and `start` scripts
2. **`vite.config.ts`** — plugins for TanStack Start and React
3. **`src/router.tsx`** — the `getRouter()` function that creates the router
4. **`src/routes/__root.tsx`** — the root layout with `<HeadContent>`,
   `<Outlet>`, and `<Scripts>`
5. **`src/routes/index.tsx`** — the home page component

### Step 5: Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. You should see the default
TanStack Start page.

### Step 6: Make your first change

Open `src/routes/index.tsx` and change the content. For example:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">DevStack Bio</h1>
      <p className="mt-4 text-gray-600">
        Your developer profile hub — coming soon.
      </p>
    </div>
  );
}
```

Save the file. The browser should update automatically (HMR). If you see your
changes reflected without refreshing, everything is working.

### Step 7: Commit your initial project

This is your first checkpoint. Initialize git and commit:

```bash
git init
git add .
git commit -m "Initial TanStack Start project scaffold"
```

## Commands You'll Use

| Command         | Purpose                      |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production         |
| `npm run start` | Serve the production build   |

## Common Patterns

| Pattern                                              | Description                                         |
| ---------------------------------------------------- | --------------------------------------------------- |
| `createFileRoute('/path')`                           | Define a route component for a URL path             |
| `export const Route = createFileRoute(...)({ ... })` | Standard route export — every route file needs this |
| `component: MyComponent`                             | The React component to render for this route        |

## Troubleshooting

| Problem                       | Fix                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `node -v` shows wrong version | Use `nvm use 24` or install Node.js 24                                       |
| Port 3000 already in use      | TanStack Start will try the next available port — check your terminal output |
| Changes not showing           | Hard refresh (Ctrl+Shift+R / Cmd+Shift+R), or restart the dev server         |
| TypeScript errors in editor   | Run `npm install` again, then restart VS Code                                |

## Deep Dive

- [TanStack Start — Getting Started](https://tanstack.com/start/latest/docs/framework/react/getting-started)
- [TanStack Start — Routing Guide](https://tanstack.com/start/latest/docs/framework/react/guide/routing)
- [MDN — What is a Web Server?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_web_server)

---

**Next:** [Module 03 — Routing](../03-routing/) → Add multiple pages and
navigate between them.
