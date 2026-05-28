# Module 10 — Server Functions

## What you'll learn

Create server functions with `createServerFn` to build a type-safe bridge
between your React components and your server-side database.

## Key Concepts

### The Client-Server Boundary

In a web application, code runs in two places:

- **Client** (browser) — React components, event handlers, state
- **Server** (Node.js) — database queries, file system, environment variables

You **cannot** import database code directly into a React component — it would
be sent to the browser. **Server functions** solve this by providing a type-safe
RPC layer:

```ts
// Server function — runs ONLY on the server
import { createServerFn } from "@tanstack/react-start";

export const getProfile = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    // This code never reaches the browser
    return db.query.profiles.findFirst({
      where: eq(profiles.username, data.username),
    });
  });
```

```tsx
// Client component — calls the server function
import { getProfile } from "../server/functions";

function ProfilePage() {
  const { username } = Route.useParams();
  const profile = await getProfile({ data: { username } });
  // ...
}
```

The build process replaces the server function implementation with an RPC stub
in the client bundle. The actual server code never reaches the browser.

### `createServerFn` API

```ts
import { createServerFn } from "@tanstack/react-start";

export const myFunction = createServerFn({ method: "GET" }) // or 'POST'
  .inputValidator((data: InputType) => data) // optional: validate input
  .handler(async ({ data }) => {
    // required: the actual logic
    // Server-only code here
    return result;
  });
```

- **`method`** — `'GET'` (default, for reads) or `'POST'` (for writes). GET
  requests can be cached; POST requests cannot.
- **`inputValidator`** — a function that validates and types the input. Can use
  Zod for richer validation.
- **`handler`** — the function body. Runs on the server only. Receives
  `{ data }` (validated input).

### Calling Server Functions

From a route **loader** (for initial data):

```tsx
export const Route = createFileRoute("/$username")({
  loader: ({ params }) => getProfile({ data: { username: params.username } }),
  component: ProfilePage,
});
```

From a component **event handler** (for mutations):

```tsx
function AddLinkButton() {
  const handleAdd = async () => {
    await addLink({ data: { title: "GitHub", url: "https://github.com" } });
  };
  return <button onClick={handleAdd}>Add Link</button>;
}
```

### Validation with Zod

For production validation, use Zod schemas instead of simple type assertions:

```ts
import { z } from "zod";

const LinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
});

export const addLink = createServerFn({ method: "POST" })
  .inputValidator(LinkSchema)
  .handler(async ({ data }) => {
    // data is fully validated and typed
    return db.insert(links).values({ id: nanoid(), ...data });
  });
```

### Organizing Server Code

TanStack Start recommends separating concerns:

```
src/
├── server/
│   ├── auth.functions.ts    ← createServerFn wrappers (safe to import anywhere)
│   ├── auth.server.ts       ← Server-only helpers (DB queries)
│   └── schemas.ts           ← Shared validation schemas (client-safe)
```

- **`.functions.ts`** — `createServerFn` wrappers. Can be imported in any file.
  Build process replaces them with RPC stubs in the client bundle.
- **`.server.ts`** — Server-only code (DB queries, file access). Only import
  inside `.functions.ts` handlers.
- **`.ts`** (no suffix) — Shared types, schemas, constants. Safe on both client
  and server.

### Error Handling

Server functions can throw errors, redirects, and not-found responses:

```ts
import { redirect } from "@tanstack/react-router";
import { notFound } from "@tanstack/react-router";

export const getProfile = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, data.username),
    });

    if (!profile) {
      throw notFound(); // Shows the 404 page
    }

    return profile;
  });

export const requireAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    if (!session.data.userId) {
      throw redirect({ to: "/login" }); // Redirects to login
    }
    return session.data;
  },
);
```

## What We Built: Server Functions for DevStack Bio

### Step 1: Installed Zod for validation

```bash
npm install zod
```

### Step 2: Created shared validation schemas

We created `src/server/schemas.ts`:

```ts
import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, hyphens, and underscores",
  );

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: usernameSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  theme: z.enum(["light", "dark"]).optional(),
});

export const addLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
});

export const removeLinkSchema = z.object({
  linkId: z.string().min(1),
});
```

### Step 3: Created server-only helpers

We created `src/server/db.server.ts`:

```ts
import { db } from "../db";
import { users, profiles, links } from "../db/schema";
import { eq } from "drizzle-orm";

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function findProfileByUsername(username: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.username, username),
    with: {
      links: {
        orderBy: (links, { asc }) => [asc(links.order)],
      },
    },
  });
}

export async function findProfileByUserId(userId: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
    with: {
      links: {
        orderBy: (links, { asc }) => [asc(links.order)],
      },
    },
  });
}

export async function createProfile(data: {
  userId: string;
  username: string;
  displayName: string;
}) {
  await db.insert(profiles).values({
    id: crypto.randomUUID(),
    userId: data.userId,
    username: data.username,
    displayName: data.displayName,
  });
}

export async function addLinkToProfile(
  profileId: string,
  data: { title: string; url: string },
) {
  // Get current max order
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
    with: { links: true },
  });
  const maxOrder = profile
    ? Math.max(0, ...profile.links.map((l) => l.order ?? 0))
    : 0;

  await db.insert(links).values({
    id: crypto.randomUUID(),
    profileId,
    title: data.title,
    url: data.url,
    order: maxOrder + 1,
  });
}

export async function removeLinkById(linkId: string) {
  await db.delete(links).where(eq(links.id, linkId));
}
```

### Step 4: Created server functions

We created `src/server/profile.functions.ts`:

```ts
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import {
  findProfileByUsername,
  findProfileByUserId,
  addLinkToProfile,
  removeLinkById,
} from "./db.server";
import { addLinkSchema, removeLinkSchema } from "./schemas";

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const profile = await findProfileByUsername(data.username);
    if (!profile) {
      throw notFound();
    }
    return profile;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const profile = await findProfileByUserId(data.userId);
    if (!profile) {
      throw notFound();
    }
    return profile;
  });

export const addLink = createServerFn({ method: "POST" })
  .inputValidator(addLinkSchema)
  .handler(async ({ data }) => {
    // TODO: Get profileId from session in Module 12
    // For now, hardcode the test user's profile
    const profile = await findProfileByUsername("alice");
    if (!profile) throw notFound();
    await addLinkToProfile(profile.id, data);
    return { success: true };
  });

export const removeLink = createServerFn({ method: "POST" })
  .inputValidator(removeLinkSchema)
  .handler(async ({ data }) => {
    await removeLinkById(data.linkId);
    return { success: true };
  });
```

### Step 5: Used the server function in the profile route

We updated `src/routes/$username.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { getPublicProfile } from "../server/profile.functions";
import { ProfileHeader } from "../components/profile-header";
import { LinkList } from "../components/link-list";

export const Route = createFileRoute("/$username")({
  loader: ({ params }) =>
    getPublicProfile({ data: { username: params.username } }),
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const profile = Route.useLoaderData();

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
        <LinkList
          links={profile.links.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            iconName: link.iconName ?? undefined,
          }))}
        />
      </section>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Powered by DevStack Bio
      </footer>
    </article>
  );
}
```

Notice: no more direct database import in the route file. The route calls a
server function, and the server function handles the database query.

### Step 6: Updated the link editor to use server functions

We updated `src/components/link-editor.tsx` — replaced the local state with
server function calls:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addLink, removeLink } from "../server/profile.functions";

type Link = {
  id: string;
  title: string;
  url: string;
  order: number | null;
};

type LinkEditorProps = {
  initialLinks: Link[];
  onRefresh: () => void;
};

export function LinkEditor({ initialLinks, onRefresh }: LinkEditorProps) {
  const [links, setLinks] = useState(initialLinks);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setIsLoading(true);
    try {
      await addLink({ data: { title: newTitle.trim(), url: newUrl.trim() } });
      setNewTitle("");
      setNewUrl("");
      setDialogOpen(false);
      onRefresh(); // Re-fetch data from server
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLink = async (id: string) => {
    setIsLoading(true);
    try {
      await removeLink({ data: { linkId: id } });
      setLinks(links.filter((link) => link.id !== id));
      onRefresh();
    } catch (error) {
      console.error("Failed to remove link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Links</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Link</DialogTitle>
              <DialogDescription>
                Add a link to your public profile.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="link-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="link-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., GitHub"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="link-url" className="text-sm font-medium">
                  URL
                </label>
                <Input
                  id="link-url"
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button
                onClick={handleAddLink}
                disabled={!newTitle.trim() || !newUrl.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <p className="mt-4 text-center text-muted-foreground py-8">
          No links yet. Click "Add Link" to get started.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-muted-foreground">{link.url}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveLink(link.id)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Step 7: Verified

We visited `/alice` and confirmed profile data loaded from the server function.
On the dashboard, adding and removing links persisted after page refresh.

### Step 8: Committed

```bash
git add .
git commit -m "Add server functions with validation, replace direct DB calls"
```

## Commands You'll Use

No new CLI commands — server functions are code, not commands.

## Common Patterns

| Pattern              | Code                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| GET server function  | `createServerFn({ method: 'GET' }).handler(async () => { ... })`              |
| POST server function | `createServerFn({ method: 'POST' }).handler(async ({ data }) => { ... })`     |
| With validation      | `.inputValidator(z.object({ ... })).handler(async ({ data }) => { ... })`     |
| Throw 404            | `throw notFound()`                                                            |
| Throw redirect       | `throw redirect({ to: '/login' })`                                            |
| Call from loader     | `loader: ({ params }) => getProfile({ data: { username: params.username } })` |
| Call from handler    | `await addLink({ data: { title: 'GitHub', url: '...' } })`                    |
| Loading state        | `const [isLoading, setIsLoading] = useState(false)`                           |

## Deep Dive

- [TanStack Start — Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [TanStack Start — Middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware)
- [Zod — TypeScript-First Schema Validation](https://zod.dev)

---

**Next:** [Module 12 — Authentication](../12-authentication/) → Add
registration, login, and protected routes.
