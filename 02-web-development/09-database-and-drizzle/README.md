# Module 09 — Database & Drizzle

## What you'll learn

Set up SQLite with Drizzle ORM, define your database schema in TypeScript, run migrations, and query data.

## Key Concepts

### What is a Database?

A database is persistent storage for your application's data. When a user creates a profile, adds a link, or views a page — that data lives in the database.

**SQLite** is a file-based database. No server to install, no configuration. One file (`devstack.db`) holds everything. Perfect for learning and small-to-medium applications.

### What is an ORM?

An **ORM** (Object-Relational Mapper) lets you define your database schema in TypeScript and query it with type-safe function calls instead of raw SQL strings.

```ts
// Raw SQL
const result = db.run('SELECT * FROM users WHERE id = ?', ['abc123'])

// Drizzle ORM — fully typed
const user = await db.query.users.findFirst({
  where: eq(users.id, 'abc123'),
})
```

With Drizzle, TypeScript knows your table columns, their types, and catches errors at compile time.

### Drizzle ORM Key Concepts

**Schema definition** — describe your tables in TypeScript:
```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
})
```

**Queries** — read and write data:
```ts
// Insert
await db.insert(users).values({ id: '1', email: 'alice@example.com', displayName: 'Alice' })

// Select all
const allUsers = await db.select().from(users)

// Select with filter
const user = await db.query.users.findFirst({
  where: eq(users.email, 'alice@example.com'),
})

// Update
await db.update(users).set({ displayName: 'Alice Chen' }).where(eq(users.id, '1'))

// Delete
await db.delete(users).where(eq(users.id, '1'))
```

**Migrations** — track schema changes over time:
```bash
npx drizzle-kit generate   # Generate a migration from schema changes
npx drizzle-kit migrate    # Apply pending migrations
```

### Drizzle Kit Configuration

Drizzle Kit reads a `drizzle.config.ts` file to know where your schema and migrations live:

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './devstack.db',
  },
})
```

### Relationships

Drizzle supports relations between tables:

```ts
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}))

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  links: many(links),
}))
```

This enables nested queries:
```ts
const profileWithLinks = await db.query.profiles.findFirst({
  where: eq(profiles.username, 'alice'),
  with: {
    links: true,
    user: true,
  },
})
```

## Now Build It: Set Up the Database

### Step 1: Install dependencies

We'll use `better-sqlite3` as the SQLite driver — it's synchronous, fast, and simple:

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

### Step 2: Create the Drizzle config

Create `drizzle.config.ts` at the project root:

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './devstack.db',
  },
})
```

### Step 3: Create the database schema

Create `src/db/schema.ts`:

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// ─── Tables ───────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  theme: text('theme').default('light'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const links = sqliteTable('links', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  url: text('url').notNull(),
  iconName: text('icon_name'),
  order: integer('order').default(0),
})

export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  viewedAt: text('viewed_at').default(sql`(datetime('now'))`),
})

// ─── Relations ────────────────────────────────────────────

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}))

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  links: many(links),
  analytics: many(analytics),
}))

export const linksRelations = relations(links, ({ one }) => ({
  profile: one(profiles, {
    fields: [links.profileId],
    references: [profiles.id],
  }),
}))

export const analyticsRelations = relations(analytics, ({ one }) => ({
  profile: one(profiles, {
    fields: [analytics.profileId],
    references: [profiles.id],
  }),
}))
```

### Step 4: Create the database connection

Create `src/db/index.ts`:

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('devstack.db')

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL')

// Enable foreign keys
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
```

### Step 5: Generate and run the migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

The first command reads your schema and generates SQL migration files in the `drizzle/` directory. The second command creates the actual tables in `devstack.db`.

Verify the migration worked:

```bash
npx drizzle-kit studio
```

This opens Drizzle Studio in your browser — a visual tool to inspect your database. You should see four empty tables: `users`, `profiles`, `links`, `analytics`.

### Step 6: Add seed data for testing

Create `src/db/seed.ts`:

```ts
import { db } from './index'
import { users, profiles, links } from './schema'
import { eq } from 'drizzle-orm'

async function seed() {
  // Check if data already exists
  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.username, 'alice'),
  })
  if (existing) {
    console.log('Database already seeded. Skipping.')
    return
  }

  // Create a test user
  await db.insert(users).values({
    id: 'user-alice',
    email: 'alice@example.com',
    passwordHash: 'not-a-real-hash', // Will be replaced in Module 11
  })

  // Create a profile for the test user
  await db.insert(profiles).values({
    id: 'profile-alice',
    userId: 'user-alice',
    username: 'alice',
    displayName: 'Alice Chen',
    bio: 'Full-stack developer. Building cool things with TypeScript.',
  })

  // Create links for the profile
  await db.insert(links).values([
    {
      id: 'link-1',
      profileId: 'profile-alice',
      title: 'GitHub',
      url: 'https://github.com/alice',
      order: 0,
    },
    {
      id: 'link-2',
      profileId: 'profile-alice',
      title: 'Portfolio',
      url: 'https://alice.dev',
      order: 1,
    },
    {
      id: 'link-3',
      profileId: 'profile-alice',
      title: 'Blog',
      url: 'https://blog.alice.dev',
      order: 2,
    },
  ])

  console.log('✅ Seed data inserted successfully')
}

seed().catch(console.error)
```

Run the seed script:

```bash
npx tsx src/db/seed.ts
```

> **Note:** If `tsx` isn't installed globally, you can add it to your project: `npm install -D tsx`

Verify with Drizzle Studio: `npx drizzle-kit studio` — you should see the test data.

### Step 7: Update the profile page to use real data

Update `src/routes/$username.tsx`:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'
import { db } from '../db'
import { profiles } from '../db/schema'
import { eq } from 'drizzle-orm'
import { ProfileHeader } from '../components/profile-header'
import { LinkList } from '../components/link-list'

export const Route = createFileRoute('/$username')({
  loader: async ({ params: { username } }) => {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
      with: {
        links: true,
      },
    })

    if (!profile) {
      throw notFound()
    }

    return { profile }
  },
  component: PublicProfilePage,
})

function PublicProfilePage() {
  const { profile } = Route.useLoaderData()

  return (
    <article className="max-w-md mx-auto py-12">
      <ProfileHeader
        username={profile.username}
        displayName={profile.displayName}
        bio={profile.bio ?? undefined}
        avatarUrl={profile.avatarUrl ?? undefined}
      />
      <section className="mt-8">
        <h2 className="sr-only">Links</h2>
        <LinkList links={profile.links.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          iconName: link.iconName ?? undefined,
        }))} />
      </section>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Powered by DevStack Bio
      </footer>
    </article>
  )
}
```

### Step 8: Add a `.gitignore` entry for the database

Add to `.gitignore`:
```
devstack.db
devstack.db-wal
devstack.db-shm
```

The database file should not be committed — it's generated data. The schema and migrations (in `drizzle/`) are committed.

### Step 9: Verify

1. Visit `/alice` — you should see real data from the database
2. Visit `/nonexistent` — you should get a 404 page
3. Check Drizzle Studio (`npx drizzle-kit studio`) — data matches what's on the page

### Step 10: Commit

```bash
git add .
git commit -m "Set up SQLite + Drizzle ORM, define schema, add seed data, load profile from DB"
```

## Commands You'll Use

| Command | Purpose |
|---------|---------|
| `npx drizzle-kit generate` | Generate migration SQL from schema changes |
| `npx drizzle-kit migrate` | Apply pending migrations to the database |
| `npx drizzle-kit studio` | Open Drizzle Studio (visual database browser) |
| `npx tsx src/db/seed.ts` | Run the seed script |

## Common Patterns

| Pattern | Code |
|---------|------|
| Insert one row | `await db.insert(table).values({ ... })` |
| Insert multiple rows | `await db.insert(table).values([{ ... }, { ... }])` |
| Select all | `await db.select().from(table)` |
| Select with filter | `await db.query.table.findFirst({ where: eq(table.col, val) })` |
| Select with relations | `await db.query.table.findFirst({ with: { relation: true } })` |
| Update rows | `await db.update(table).set({ col: val }).where(eq(table.id, id))` |
| Delete rows | `await db.delete(table).where(eq(table.id, id))` |
| Loader (route) | `loader: async ({ params }) => { ... }` |
| Use loader data | `const data = Route.useLoaderData()` |

## Deep Dive

- [Drizzle ORM — SQLite Getting Started](https://orm.drizzle.team/docs/get-started-sqlite)
- [Drizzle ORM — Queries](https://orm.drizzle.team/docs/rqb)
- [Drizzle ORM — Migrations](https://orm.drizzle.team/docs/migrations)
- [Drizzle Kit — Configuration](https://orm.drizzle.team/kit-docs/config-reference)
- [SQLite — Documentation](https://www.sqlite.org/docs.html)

---

**Next:** [Module 10 — Server Functions](../10-server-functions/) → Create a full-stack boundary between client and server.
