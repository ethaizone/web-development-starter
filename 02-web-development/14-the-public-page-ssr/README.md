# Module 14 — The Public Page (SSR)

## What you'll learn

Optimize the public profile page for performance and SEO with server-side
rendering, track profile views, and handle 404 pages.

## Key Concepts

### Why SSR for Public Pages?

The public profile page (`/$username`) benefits from SSR because:

| Benefit                | How it helps                                                             |
| ---------------------- | ------------------------------------------------------------------------ |
| **Fast first paint**   | HTML is ready immediately — no waiting for JavaScript to load and render |
| **SEO**                | Search engines can index the full page content                           |
| **Social previews**    | Twitter, Slack, Discord can show link previews (Open Graph meta tags)    |
| **Analytics accuracy** | View is recorded even if JavaScript fails to load                        |

TanStack Start renders route loaders on the server by default. Your `loader`
function runs on the server, fetches data, and the page is rendered to HTML
before being sent to the browser.

### SEO: Meta Tags and Open Graph

The `head` function on a route sets HTML `<head>` content:

```tsx
export const Route = createFileRoute('/$username')({
  head: () => ({
    meta: [
      { title: 'DevStack Bio' },
      { name: 'description', content: 'Developer profile on DevStack Bio' },
    ],
  }),
  loader: ...,
  component: ...,
})
```

When someone shares `devstack.bio/alice` on Slack or Twitter, the meta tags
control what preview card appears.

> **Why not dynamic meta tags?** The `head` function can accept `loaderData` for
> dynamic meta tags (e.g., `{ title: loaderData.displayName }`). However, when
> the loader throws `notFound()`, TypeScript types `loaderData` as `never` — so
> a static `head` is used instead. For routes where the loader always returns
> data, use `head: ({ loaderData }) => ({ meta: [...] })` for richer SEO.

### Analytics Tracking

Record each profile view in the database:

```ts
// In the route loader — runs on every request
await db.insert(analytics).values({
  id: crypto.randomUUID(),
  profileId: profile.id,
});
```

This happens on the server, so it's reliable — no JavaScript needed on the
client.

### Custom 404 Page

When a profile isn't found, `throw notFound()` in the loader. TanStack Start
renders a `notFoundComponent` if you define one:

```tsx
export const Route = createFileRoute("/$username")({
  notFoundComponent: ProfileNotFound,
  // ...
});

function ProfileNotFound() {
  const { username } = Route.useParams();
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Profile Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        No one at <strong>@{username}</strong> yet.
      </p>
    </div>
  );
}
```

## Common Patterns

| Pattern               | Code                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| SSR meta tags         | `head: () => ({ meta: [...] })` (static when loader throws `notFound()`)       |
| Open Graph tags       | `{ property: 'og:title', content: '...' }`                                     |
| Server-side analytics | In the loader: `await recordView({ data: { ... } })`                           |
| Custom 404            | `notFoundComponent: MyComponent` + `throw notFound()` in loader                |
| Theme                 | Toggle `.dark` class on `<html>` — semantic color tokens respond automatically |

## What We Built: Optimized the Public Profile

### Step 1: Created analytics server functions

We added to `src/server/profile.functions.ts`:

```ts
import { analytics } from "../db/schema";

export const recordProfileView = createServerFn({ method: "POST" })
  .inputValidator((data: { profileId: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(analytics).values({
      id: crypto.randomUUID(),
      profileId: data.profileId,
    });
    return { success: true };
  });

export const getViewCount = createServerFn({ method: "GET" })
  .inputValidator((data: { profileId: string }) => data)
  .handler(async ({ data }) => {
    const views = await db
      .select()
      .from(analytics)
      .where(eq(analytics.profileId, data.profileId));
    return { count: views.length };
  });
```

### Step 2: Updated the public profile route with SSR, analytics, SEO, and 404

We updated `src/routes/$username.tsx`:

```tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  getPublicProfile,
  recordProfileView,
} from "../server/profile.functions";
import { ProfileHeader } from "../components/profile-header";
import { LinkList } from "../components/link-list";
import { useEffect } from "react";

export const Route = createFileRoute("/$username")({
  head: () => ({
    meta: [
      { title: "DevStack Bio" },
      { name: "description", content: "Developer profile on DevStack Bio" },
    ],
  }),
  loader: async ({ params }) => {
    const profile = await getPublicProfile({
      data: { username: params.username },
    });

    if (!profile) {
      throw notFound();
    }

    // Record the profile view (server-side, reliable)
    await recordProfileView({ data: { profileId: profile.id } }).catch(() => {
      // Don't fail the page load if analytics fails
    });

    return profile;
  },
  notFoundComponent: ProfileNotFound,
  component: PublicProfilePage,
});

function ProfileNotFound() {
  const { username } = Route.useParams();
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Profile Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        No one at <strong>@{username}</strong> yet.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Want this username?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Create your profile
        </a>
      </p>
    </div>
  );
}

function PublicProfilePage() {
  const profile = Route.useLoaderData();

  // Apply theme to <html> so the whole page (header, footer) changes
  useEffect(() => {
    if (profile.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [profile.theme]);

  return (
    <article className="max-w-md mx-auto py-12 min-h-[calc(100vh-200px)]">
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
  );
}
```

### Step 3: Updated link cards to use semantic color tokens

With the `.dark` theme defined in CSS, we updated the link cards to use
shadcn/ui semantic color tokens (`border-border`, `text-foreground`, etc.) which
automatically respond when the `.dark` class is toggled on `<html>`. We updated
`src/components/link-card.tsx`:

```tsx
type LinkCardProps = {
  title: string;
  url: string;
  iconName?: string;
};

export function LinkCard({ title, url, iconName }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-border p-4 text-foreground font-medium hover:bg-accent hover:border-ring hover:text-accent-foreground transition-colors"
    >
      {iconName && <span className="text-xl">{iconName}</span>}
      <span>{title}</span>
    </a>
  );
}
```

> **Why no `theme` prop?** The shadcn/ui color tokens (`text-foreground`,
> `bg-accent`, `border-border`) automatically change when the `.dark` class is
> on `<html>`. Since the profile page already toggles that class in a
> `useEffect`, the link cards respond automatically — no manual prop threading
> needed.

### Step 4: Verified SSR

We checked the page source at `/alice` and confirmed the full HTML contained
Alice's name and links — no JavaScript required to display the content. Visiting
`/nonexistent` showed the custom 404 page. Drizzle Studio confirmed the
`analytics` table had entries for each profile view.

### Step 5: Committed

```bash
git add .
git commit -m "Add SSR with SEO meta tags, analytics tracking, custom 404, and themes"
```

## Deep Dive

- [TanStack Start — Routing (head/meta)](https://tanstack.com/start/latest/docs/framework/react/guide/routing)
- [TanStack Start — SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)
- [TanStack Start — Error Boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries)
- [MDN — Meta Tag Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)

---

**Next:** [Module 15 — Deployment](../15-deployment/) → Build for production and
deploy.
