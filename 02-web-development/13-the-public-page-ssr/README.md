# Module 13 — The Public Page (SSR)

## What you'll learn

Optimize the public profile page for performance and SEO with server-side rendering, track profile views, and handle 404 pages.

## Key Concepts

### Why SSR for Public Pages?

The public profile page (`/$username`) benefits from SSR because:

| Benefit | How it helps |
|---------|-------------|
| **Fast first paint** | HTML is ready immediately — no waiting for JavaScript to load and render |
| **SEO** | Search engines can index the full page content |
| **Social previews** | Twitter, Slack, Discord can show link previews (Open Graph meta tags) |
| **Analytics accuracy** | View is recorded even if JavaScript fails to load |

TanStack Start renders route loaders on the server by default. Your `loader` function runs on the server, fetches data, and the page is rendered to HTML before being sent to the browser.

### SEO: Meta Tags and Open Graph

The `head` function on a route sets HTML `<head>` content:

```tsx
export const Route = createFileRoute('/$username')({
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.displayName} — DevStack Bio` },
      { name: 'description', content: loaderData.bio ?? 'Developer profile' },
      // Open Graph (social previews)
      { property: 'og:title', content: loaderData.displayName },
      { property: 'og:description', content: loaderData.bio ?? '' },
      { property: 'og:image', content: loaderData.avatarUrl ?? '' },
      { property: 'og:type', content: 'profile' },
    ],
  }),
  loader: ...,
  component: ...,
})
```

When someone shares `devstack.bio/alice` on Slack or Twitter, the meta tags control what preview card appears.

### Analytics Tracking

Record each profile view in the database:

```ts
// In the route loader — runs on every request
await db.insert(analytics).values({
  id: crypto.randomUUID(),
  profileId: profile.id,
})
```

This happens on the server, so it's reliable — no JavaScript needed on the client.

### Custom 404 Page

When a profile isn't found, `throw notFound()` in the loader. TanStack Start renders a `notFoundComponent` if you define one:

```tsx
export const Route = createFileRoute('/$username')({
  notFoundComponent: ProfileNotFound,
  // ...
})

function ProfileNotFound() {
  const { username } = Route.useParams()
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Profile Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        No one at <strong>@{username}</strong> yet.
      </p>
    </div>
  )
}
```

## Now Build It: Optimize the Public Profile

### Step 1: Create an analytics server function

Add to `src/server/profile.functions.ts`:

```ts
import { analytics } from '../db/schema'

export const recordProfileView = createServerFn({ method: 'POST' })
  .inputValidator((data: { profileId: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(analytics).values({
      id: crypto.randomUUID(),
      profileId: data.profileId,
    })
    return { success: true }
  })

export const getViewCount = createServerFn({ method: 'GET' })
  .inputValidator((data: { profileId: string }) => data)
  .handler(async ({ data }) => {
    const views = await db
      .select()
      .from(analytics)
      .where(eq(analytics.profileId, data.profileId))
    return { count: views.length }
  })
```

### Step 2: Update the public profile route with SSR, analytics, SEO, and 404

Update `src/routes/$username.tsx`:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPublicProfile, recordProfileView } from '../server/profile.functions'
import { ProfileHeader } from '../components/profile-header'
import { LinkList } from '../components/link-list'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/$username')({
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: 'Profile Not Found — DevStack Bio' }],
      }
    }
    return {
      meta: [
        { title: `${loaderData.displayName} — DevStack Bio` },
        {
          name: 'description',
          content: loaderData.bio ?? `Check out ${loaderData.displayName}'s developer profile`,
        },
        { property: 'og:title', content: loaderData.displayName },
        {
          property: 'og:description',
          content: loaderData.bio ?? `Developer profile on DevStack Bio`,
        },
        { property: 'og:type', content: 'profile' },
        ...(loaderData.avatarUrl
          ? [{ property: 'og:image' as const, content: loaderData.avatarUrl }]
          : []),
      ],
    }
  },
  loader: async ({ params }) => {
    const profile = await getPublicProfile({ data: { username: params.username } })

    if (!profile) {
      throw notFound()
    }

    // Record the profile view (server-side, reliable)
    await recordProfileView({ data: { profileId: profile.id } }).catch(() => {
      // Don't fail the page load if analytics fails
    })

    return profile
  },
  notFoundComponent: ProfileNotFound,
  component: PublicProfilePage,
})

function ProfileNotFound() {
  const { username } = Route.useParams()
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Profile Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        No one at <strong>@{username}</strong> yet.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Want this username?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Create your profile
        </a>
      </p>
    </div>
  )
}

function PublicProfilePage() {
  const profile = Route.useLoaderData()

  // Theme classes
  const themeClasses = {
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    matrix: 'bg-black text-green-400',
  }

  const theme = (profile.theme as keyof typeof themeClasses) ?? 'light'

  return (
    <article
      className={`max-w-md mx-auto py-12 min-h-[calc(100vh-200px)] ${themeClasses[theme]}`}
    >
      <ProfileHeader
        username={profile.username}
        displayName={profile.displayName}
        bio={profile.bio ?? undefined}
        avatarUrl={profile.avatarUrl ?? undefined}
      />
      <section className="mt-8">
        <h2 className="sr-only">Links</h2>
        <LinkList
          links={profile.links.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            iconName: link.iconName ?? undefined,
          }))}
        />
      </section>
      <footer className="mt-8 text-center text-sm opacity-50">
        Powered by DevStack Bio
      </footer>
    </article>
  )
}
```

### Step 3: Add theme styles for the profile page

The profile themes need different styling for links. Update `src/components/link-card.tsx` to accept an optional theme prop:

```tsx
type LinkCardProps = {
  title: string
  url: string
  iconName?: string
  theme?: 'light' | 'dark' | 'matrix'
}

export function LinkCard({ title, url, iconName, theme = 'light' }: LinkCardProps) {
  const themeStyles = {
    light:
      'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700',
    dark:
      'border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-gray-600',
    matrix:
      'border-green-900 text-green-400 hover:bg-green-950 hover:border-green-500',
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 rounded-lg border p-4 font-medium transition-colors ${themeStyles[theme]}`}
    >
      {iconName && <span className="text-xl">{iconName}</span>}
      <span>{title}</span>
    </a>
  )
}
```

### Step 4: Verify SSR

1. Visit `/alice` — check the page source (right-click → View Page Source). You should see the full HTML with Alice's name and links — no JavaScript required to display the content.
2. Use the browser's Network tab to verify that the initial HTML response contains the profile data.
3. Visit `/nonexistent` — should see the custom 404 page.
4. Check Drizzle Studio (`npx drizzle-kit studio`) — the `analytics` table should have entries for each profile view.

### Step 5: Commit

```bash
git add .
git commit -m "Add SSR with SEO meta tags, analytics tracking, custom 404, and themes"
```

## Common Patterns

| Pattern | Code |
|---------|------|
| SSR meta tags | `head: ({ loaderData }) => ({ meta: [...] })` |
| Open Graph tags | `{ property: 'og:title', content: '...' }` |
| Server-side analytics | In the loader: `await recordView({ data: { ... } })` |
| Custom 404 | `notFoundComponent: MyComponent` + `throw notFound()` in loader |
| Theme classes | Conditional Tailwind classes based on a theme variable |

## Deep Dive

- [TanStack Start — Routing (head/meta)](https://tanstack.com/start/latest/docs/framework/react/guide/routing)
- [TanStack Start — SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)
- [TanStack Start — Error Boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries)
- [MDN — Meta Tag Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)

---

**Next:** [Module 14 — Git & Deployment](../14-git-and-deployment/) → Build for production and deploy.
