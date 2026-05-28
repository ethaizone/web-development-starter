## Here is a comprehensive project requirement handoff document tailored for your curriculum. It integrates TanStack Start, Drizzle ORM, SQLite, Tailwind CSS, and shadcn/ui, structured clearly for you to hand off to your learners or use as a syllabus plan.

## 📝 Project Specification: DevStack Bio## 1. Project Overview

DevStack Bio is a self-hosted, developer-focused profile hub (a customizable
"Linktree" alternative). Users can register an account, set up a public profile
matching their developer handles, display custom links, showcase their
technology stack, and track profile view analytics. This project explicitly
demonstrates the boundary between Client-Side Rendering (CSR) for the
interactive management dashboard and Server-Side Rendering (SSR) for the fast,
SEO-friendly public profile pages.

---

## 2. Core Tech Stack

- Meta-Framework: TanStack Start (React, TypeScript)
- Database & ORM: SQLite (better-sqlite3 or @libsql/client) managed via Drizzle
  ORM
- Styling & UI: Tailwind CSS & shadcn/ui
- Authentication: Cookie-based sessions handled via stateful server functions

---

## 3. Database Schema (Drizzle ORM Layout)

Your database architecture will consist of four relational tables. Learners will
define these schemas using TypeScript and execute migrations via drizzle-kit.

```ts
// Conceptual schema overview for learners
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // NanoID or UUID string
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(), // Used for custom routing (e.g., /$username)
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  theme: text("theme").default("light"), // e.g., 'light', 'dark', 'matrix'
});

export const links = sqliteTable("links", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(), // e.g., "My GitHub"
  url: text("url").notNull(),
  iconName: text("icon_name"), // Optional string representation for lucide icons
  order: integer("order").default(0),
});

export const analytics = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  viewedAt: text("viewed_at").default(sql`CURRENT_TIMESTAMP`),
});
```

---

## 4. Feature Requirements## Module 1: Authentication & Layout (SSR Core)

- Registration: Users can sign up with an email and a unique username.
- Validation: The username must be safe for URL parameters (no spaces or special
  characters).
- Session Management: Valid logins generate a cryptographically secure token
  stored in an httpOnly cookie.
- Security Guard: Implement a TanStack Router layout middleware that blocks
  unauthenticated visitors from accessing the dashboard routes.

## Module 2: The Interactive Admin Dashboard (CSR & Server Functions)

- Route: /dashboard
- Profile Editing: Form inputs using shadcn Input, Textarea, and a theme
  selection Select component. Clicking "Save Changes" invokes a type-safe
  updateProfile server function.
- Dynamic Link Builder: A full CRUD system managing user links.
- Clicking "Add Link" opens a shadcn Dialog.
  - Links are displayed in a clean list format utilizing shadcn Card styling.
  - CSR Teaching Goal: Removing or appending links must run entirely client-side
    via native React asynchronous states, interacting seamlessly through
    createServerFn endpoints without a full page refresh.

## Module 3: The Public Bio Page (SSR & Analytics)

- Route: /$username (Dynamic File Route)
- Behavior: When a guest navigates to this URL, TanStack Start uses a route
  Loader to execute a Drizzle query targeting the specific username.
- Server-Side Rendering: If the user is found, the server updates the analytics
  view log table and completely pre-renders the developer page HTML before
  sending it down to the client.
- Error Boundaries: If the query returns empty, the route automatically throws a
  clean redirect or exhibits a custom shadcn 404 block page.

---

## 5. Key Learning Objectives for Learners

1.  Type Safety Execution: Understand how changing a column definition inside
    schema.ts instantly generates compilation feedback inside frontend React
    files via Drizzle and TypeScript.
2.  State vs Network Syncing: Learn how to implement simple native state
    wrappers (isLoading, error) around standard async/await server function
    transactions.
3.  Network Borders: Distinguish code blocks that run on the client from
    securely executed SQL operations running within the .handler() ecosystem of
    the server.
