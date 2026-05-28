# Module 05 — Styling with Tailwind

## What you'll learn

Use Tailwind CSS utility classes to style your DevStack Bio pages — no separate
CSS files needed.

## Key Concepts

### What is Tailwind CSS?

Tailwind CSS is a **utility-first** CSS framework. Instead of writing custom CSS
classes, you compose styles directly in your HTML/JSX using small,
single-purpose classes:

```tsx
// Instead of writing CSS:
// .card { padding: 1rem; border-radius: 0.5rem; background: white; box-shadow: ... }

// You write:
<div className="p-4 rounded-lg bg-white shadow-md">
  <h2 className="text-lg font-bold text-gray-900">Title</h2>
</div>
```

### Why Tailwind?

| Approach          | Example                                | Trade-off                                        |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| Custom CSS        | Write `.card { ... }` in a `.css` file | More files, naming decisions, specificity issues |
| Component library | Use `<Card>` from a library            | Less control, version lock-in                    |
| **Tailwind**      | `className="p-4 rounded-lg bg-white"`  | Verbose but explicit, no naming, co-located      |

Tailwind's approach means:

- You never switch between files (styles are right there)
- No unused CSS in production (Tailwind only generates classes you use)
- Consistent design system (spacing, colors, typography follow a scale)

### How Tailwind CSS v4 Works

Tailwind CSS v4 uses a **Vite plugin** (not a PostCSS plugin like v3). Setup is:

1. Install `tailwindcss` and `@tailwindcss/vite`
2. Add the plugin to `vite.config.ts`
3. Create a CSS file with `@import 'tailwindcss'`
4. Import the CSS file in your root route

No `tailwind.config.js` file is needed in v4.

### The Utility Class Pattern

Tailwind classes follow a pattern: `{property}{value}`

| Class             | CSS equivalent                                | What it does             |
| ----------------- | --------------------------------------------- | ------------------------ |
| `p-4`             | `padding: 1rem`                               | Padding all sides        |
| `px-6`            | `padding-left: 1.5rem; padding-right: 1.5rem` | Horizontal padding       |
| `mt-4`            | `margin-top: 1rem`                            | Top margin               |
| `text-lg`         | `font-size: 1.125rem`                         | Text size                |
| `font-bold`       | `font-weight: 700`                            | Bold text                |
| `bg-white`        | `background-color: white`                     | Background               |
| `rounded-lg`      | `border-radius: 0.5rem`                       | Rounded corners          |
| `border`          | `border-width: 1px`                           | Border                   |
| `shadow-md`       | `box-shadow: ...`                             | Drop shadow              |
| `flex`            | `display: flex`                               | Flexbox                  |
| `items-center`    | `align-items: center`                         | Flex align               |
| `justify-between` | `justify-content: space-between`              | Flex justify             |
| `gap-4`           | `gap: 1rem`                                   | Flex/grid gap            |
| `w-full`          | `width: 100%`                                 | Full width               |
| `max-w-md`        | `max-width: 28rem`                            | Max width                |
| `mx-auto`         | `margin-left: auto; margin-right: auto`       | Center horizontally      |
| `min-h-screen`    | `min-height: 100vh`                           | At least viewport height |

### Responsive Design

Prefix any class with a breakpoint to apply it at that screen size and above:

| Prefix | Min width | Example                                          |
| ------ | --------- | ------------------------------------------------ |
| (none) | 0px       | `text-sm` — always applies                       |
| `sm:`  | 640px     | `sm:text-base` — applies on small screens and up |
| `md:`  | 768px     | `md:text-lg` — applies on medium screens and up  |
| `lg:`  | 1024px    | `lg:text-xl` — applies on large screens and up   |

```tsx
<div className="p-4 md:p-8 lg:p-12">
  {/* Padding increases as screen gets larger */}
</div>
```

### State Variants

Prefix classes with state modifiers:

| Variant     | Example               | When it applies            |
| ----------- | --------------------- | -------------------------- |
| `hover:`    | `hover:bg-blue-700`   | Mouse is over the element  |
| `focus:`    | `focus:ring-2`        | Element has keyboard focus |
| `active:`   | `active:scale-95`     | Element is being pressed   |
| `disabled:` | `disabled:opacity-50` | Element is disabled        |
| `dark:`     | `dark:bg-gray-900`    | User prefers dark mode     |

### Color System

Tailwind provides a consistent color palette. Each color has shades from 50
(lightest) to 950 (darkest):

```
blue-50   blue-100   blue-200   ...   blue-900   blue-950
(light)                                        (dark)
```

Common colors you'll use:

- `gray-{n}` — neutral, backgrounds, borders, text
- `blue-{n}` — primary actions, links
- `red-{n}` — errors, destructive actions
- `green-{n}` — success states

## What We Built: Styled DevStack Bio

### Step 1: Installed Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2: Configured the Vite plugin

We updated `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
```

### Step 3: Created the CSS file

We created `src/styles.css`:

```css
@import "tailwindcss";
```

### Step 4: Imported the CSS in the root route

We updated `src/routes/__root.tsx` — added the CSS import and link:

```tsx
// Add this import at the top (with other imports):
import appCss from "../styles.css?url";

// In the Route definition, add the links array to head:
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevStack Bio" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});
```

### Step 5: Verified Tailwind was working

We updated `src/routes/index.tsx` with Tailwind classes:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        DevStack Bio
      </h1>
      <p className="mt-4 text-xl text-gray-600 max-w-lg">
        Your developer profile hub — showcase your links, tech stack, and stats.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/register"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Create Your Profile
        </Link>
        <Link
          to="/$username"
          params={{ username: "alice" }}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          See Example
        </Link>
      </div>
    </div>
  );
}
```

We visited `http://localhost:3000` and confirmed styled text was visible (large
bold title, blue button, centered layout) — Tailwind was working.

### Step 6: Styled the profile page

We updated `src/routes/$username.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$username")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { username } = Route.useParams();

  return (
    <article className="max-w-md mx-auto text-center py-12">
      <header>
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
          alt={`${username}'s avatar`}
          className="w-24 h-24 rounded-full mx-auto bg-gray-100"
        />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{username}</h1>
        <p className="mt-2 text-gray-600">
          Full-stack developer. Building cool things.
        </p>
      </header>
      <section className="mt-8">
        <h2 className="sr-only">Links</h2>
        <ul className="space-y-3">
          {["GitHub", "Portfolio", "Blog"].map((linkName) => (
            <li key={linkName}>
              <a
                href="#"
                className="block rounded-lg border border-gray-200 p-4 text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {linkName}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <footer className="mt-8 text-sm text-gray-400">
        Powered by DevStack Bio
      </footer>
    </article>
  );
}
```

> Note: `<h2 className="sr-only">` is visually hidden but accessible to screen
> readers. Good for structure without visual noise.

### Step 7: Styled the dashboard

We updated `src/routes/_authed/dashboard.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-600">Manage your profile and links.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            Edit your display name, bio, and theme.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Links</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add, reorder, and remove your links.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            View your profile visit stats.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 8: Committed

```bash
git add .
git commit -m "Install and configure Tailwind CSS v4, style all pages"
```

## Commands You'll Use

| Command                                     | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `npm install tailwindcss @tailwindcss/vite` | Install Tailwind CSS v4 and Vite plugin |

## Common Patterns

| Pattern            | Classes                                                         | When to use                               |
| ------------------ | --------------------------------------------------------------- | ----------------------------------------- |
| Center content     | `max-w-md mx-auto`                                              | Cards, forms, profiles                    |
| Card               | `rounded-lg border p-6`                                         | Content blocks                            |
| Button (primary)   | `bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700` | Main actions                              |
| Button (secondary) | `border px-4 py-2 rounded-lg hover:bg-gray-50`                  | Alternative actions                       |
| Flex row with gap  | `flex items-center gap-4`                                       | Nav bars, form rows                       |
| Responsive grid    | `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`                      | Card layouts                              |
| Visually hidden    | `sr-only`                                                       | Accessible headers you don't want visible |

## Deep Dive

- [Tailwind CSS — Install with TanStack Start](https://tailwindcss.com/docs/installation/framework-guides/tanstack-start)
- [TanStack Start — Tailwind CSS Integration](https://tanstack.com/start/latest/docs/framework/react/guide/tailwind-integration)
- [Tailwind CSS — Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Tailwind CSS — Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind CSS — Hover, Focus, & Other States](https://tailwindcss.com/docs/hover-focus-and-other-states)

---

**Next:** [Module 07 — Components & Props](../07-components-and-props/) → Break
your UI into reusable pieces.
