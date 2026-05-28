# Module 03 — Routing

## What you'll learn

Create multiple pages with file-based routing, add navigation links, and set up
a shared layout.

## Key Concepts

### File-Based Routing

TanStack Start uses **file-based routing** — the file path inside `src/routes/`
determines the URL. You don't write routing configuration. You create files, and
the framework generates the routes automatically.

### Route Types

| File                | URL                           | Type                 |
| ------------------- | ----------------------------- | -------------------- |
| `index.tsx`         | `/`                           | Index route          |
| `about.tsx`         | `/about`                      | Static route         |
| `dashboard.tsx`     | `/dashboard`                  | Static route         |
| `$username.tsx`     | `/:username` (e.g., `/alice`) | Dynamic route        |
| `posts/$postId.tsx` | `/posts/:postId`              | Nested dynamic route |

### The Root Route (`__root.tsx`)

Every TanStack Start app has a root route at `src/routes/__root.tsx`. It:

- Is **always matched** — no matter what URL is requested
- Renders the HTML shell (`<html>`, `<head>`, `<body>`)
- Contains `<Outlet />` — where the matched child route renders
- Is where you import global CSS

```tsx
// src/routes/__root.tsx (simplified)
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevStack Bio" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

Key components from `@tanstack/react-router`:

- **`Outlet`** — renders the matched child route
- **`HeadContent`** — renders `<head>` tags (title, meta, links)
- **`Scripts`** — loads client-side JavaScript

### The Link Component

Use `<Link>` (not `<a>`) for navigation within your app:

```tsx
import { Link } from "@tanstack/react-router";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

`<Link>` uses client-side routing — no full page reload. It also supports
`activeProps` for styling the current link.

### Route Parameters

Dynamic routes use `$` prefix in filenames. Access parameters with
`Route.useParams()`:

```tsx
// src/routes/$username.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$username")({
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  return <h1>Profile: {username}</h1>;
}
```

### Layout Routes (Pathless)

A file named `_authed.tsx` (starting with `_`) is a **layout route** — it groups
routes under a shared layout without adding to the URL path. This is useful for
protecting a group of routes (e.g., requiring login).

```
src/routes/
├── _authed.tsx              ← Layout: checks auth, renders <Outlet />
├── _authed/
│   ├── dashboard.tsx        ← URL: /dashboard (protected)
│   └── settings.tsx         ← URL: /settings (protected)
├── login.tsx                ← URL: /login (public)
└── $username.tsx            ← URL: /:username (public)
```

The `_authed.tsx` layout can check authentication in `beforeLoad` and redirect
unauthenticated users. You'll use this pattern in Module 11.

### Auto-Generated Route Tree

The file `src/routeTree.gen.ts` is generated automatically when you create or
move route files. It:

- Is regenerated on every dev server start
- Provides full TypeScript type safety for route paths
- Should **never be edited by hand**

If routes seem stale, restart the dev server.

## What We Built: Added Routing to DevStack Bio

### Step 1: Updated the root layout

We added navigation to `src/routes/__root.tsx`. The `RootComponent` function was updated with a shared layout:

```tsx
function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Link to="/" className="text-xl font-bold">
              DevStack Bio
            </Link>
            <div className="flex gap-4">
              <Link to="/" activeProps={{ className: "font-bold" }}>
                Home
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </RootDocument>
  );
}
```

We added the `Link` import:

```tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
```

### Step 2: Updated the home page

We updated `src/routes/index.tsx` as a landing page:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold">DevStack Bio</h1>
      <p className="mt-4 text-xl text-gray-600">
        Your developer profile hub — a Linktree alternative you build yourself.
      </p>
      <Link
        to="/register"
        className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Get Started
      </Link>
    </div>
  );
}
```

### Step 3: Created placeholder pages

We created these files in `src/routes/`:

**`src/routes/register.tsx`** — registration page (placeholder for now):

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Create Your Account</h1>
      <p className="mt-2 text-gray-600">
        Registration form coming in Module 11.
      </p>
    </div>
  );
}
```

**`src/routes/login.tsx`** — login page (placeholder):

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Log In</h1>
      <p className="mt-2 text-gray-600">Login form coming in Module 11.</p>
    </div>
  );
}
```

### Step 4: Created the authed layout route

We created `src/routes/_authed.tsx` as the protected layout:

```tsx
import { Outlet, createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <div>
      <div className="mb-6 flex gap-4 border-b pb-4">
        <Link to="/dashboard" activeProps={{ className: "font-bold" }}>
          Dashboard
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
```

We also created the `src/routes/_authed/` directory, then:

**`src/routes/_authed/dashboard.tsx`**:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Profile editing coming in Module 12.</p>
    </div>
  );
}
```

### Step 5: Created the public profile route

**`src/routes/$username.tsx`**:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$username")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { username } = Route.useParams();
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold">{username}'s Profile</h1>
      <p className="mt-2 text-gray-600">
        Public profile page coming in Module 13.
      </p>
    </div>
  );
}
```

### Step 6: Verified everything worked

We started the dev server and tested these URLs:

| URL          | What you should see                    |
| ------------ | -------------------------------------- |
| `/`          | Landing page with "Get Started" button |
| `/register`  | Registration placeholder               |
| `/login`     | Login placeholder                      |
| `/dashboard` | Dashboard placeholder with sub-nav     |
| `/alice`     | "alice's Profile"                      |

We navigated between pages using the links and confirmed:

- Clicking "Get Started" takes you to `/register`
- The nav bar appears on every page
- The dashboard sub-nav only appears on `/dashboard`
- No full page reloads occur when navigating (check the network tab in DevTools)

### Step 7: Committed

```bash
git add .
git commit -m "Add route structure: home, register, login, dashboard, profile"
```

## Commands You'll Use

| Command                     | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| `npm run dev`               | Start dev server (regenerates route tree) |
| `rm -rf node_modules/.vite` | Clear Vite cache if routes seem stale     |

## Common Patterns

| Pattern           | File                                    | URL                               |
| ----------------- | --------------------------------------- | --------------------------------- |
| Home page         | `index.tsx`                             | `/`                               |
| Static page       | `about.tsx`                             | `/about`                          |
| Dynamic parameter | `$username.tsx`                         | `/:username`                      |
| Protected layout  | `_authed.tsx` + `_authed/dashboard.tsx` | `/dashboard`                      |
| Navigation        | `<Link to="/about">`                    | Client-side, no reload            |
| Read URL params   | `Route.useParams()`                     | Get `:username` from `/$username` |

## Deep Dive

- [TanStack Start — Routing Guide](https://tanstack.com/start/latest/docs/framework/react/guide/routing)
- [TanStack Router — File-Based Routing](https://tanstack.com/router/v1/docs/routing/file-based-routing)
- [MDN — Hyperlink (HTML `<a>` vs framework `<Link>`)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)

---

**Next:** [Module 04 — HTML & the DOM](../04-html-and-dom/) → Understand what
HTML elements are and how the browser turns them into a page.
