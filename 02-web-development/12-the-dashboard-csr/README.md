# Module 12 — The Dashboard (CSR)

## What you'll learn

Build a fully interactive dashboard for profile editing and link management with client-side state, loading indicators, and optimistic updates.

## Key Concepts

### Client-Side Rendering in TanStack Start

By default, TanStack Start renders pages on the server (SSR). For the dashboard, the page loads server-rendered HTML, then **hydrates** into a fully interactive client-side app. Subsequent interactions (adding links, editing profile) happen entirely on the client — no full page reload.

### Loading States

Every network call needs a loading state. The pattern:

```tsx
const [isLoading, setIsLoading] = useState(false)

const handleSave = async () => {
  setIsLoading(true)
  try {
    await updateProfile({ data: { ... } })
  } catch (error) {
    // Show error
  } finally {
    setIsLoading(false)
  }
}

return <Button disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
```

### Optimistic Updates

When a user clicks "Delete" on a link, you can remove it from the UI immediately (optimistic) before the server confirms. If the server fails, you add it back:

```tsx
const handleRemove = async (linkId: string) => {
  // Optimistic: remove from UI immediately
  const previous = [...links]
  setLinks(links.filter((l) => l.id !== linkId))

  try {
    await removeLink({ data: { linkId } })
  } catch {
    // Rollback on failure
    setLinks(previous)
  }
}
```

This makes the UI feel faster — the user sees the change before the server responds.

### Revalidation

After a mutation (add, update, delete), you need to refresh the data. TanStack Start provides `router.invalidate()` to re-run all active loaders:

```tsx
const router = useRouter()

const handleAdd = async () => {
  await addLink({ data: { ... } })
  router.invalidate() // Re-fetches the loader data
}
```

Alternatively, use `useRouter().invalidate()` to selectively re-fetch only the current route's loader.

## Now Build It: Complete the Dashboard

### Step 1: Add the profile update server function

Add the following import and function to `src/server/profile.functions.ts` (the file from Module 10):

```ts
// Add these imports if not already present
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { profiles } from '../db/schema'
import { updateProfileSchema } from './schemas'

// Add this server function

export const updateProfileFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      profileId: z.string(),
    }).merge(updateProfileSchema)
  )
  .handler(async ({ data }) => {
    const { profileId, ...updates } = data
    await db
      .update(profiles)
      .set({
        displayName: updates.displayName,
        bio: updates.bio ?? null,
        avatarUrl: updates.avatarUrl ?? null,
        theme: updates.theme,
      })
      .where(eq(profiles.id, profileId))
    return { success: true }
  })
```

### Step 2: Create a profile edit form

Create `src/components/profile-edit-form.tsx`:

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateProfileFn } from '../server/profile.functions'
import { updateProfileSchema } from '../server/schemas'

type ProfileData = {
  id: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  theme: string | null
}

type ProfileEditFormProps = {
  profile: ProfileData
  onSaved: () => void
}

export function ProfileEditForm({ profile, onSaved }: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '')
  const [theme, setTheme] = useState(profile.theme ?? 'light')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleThemeChange = (value: string) => {
    setTheme(value)
    if (value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSave = async () => {
    const result = updateProfileSchema.safeParse({
      displayName,
      bio: bio || undefined,
      avatarUrl: avatarUrl || undefined,
      theme,
    })

    if (!result.success) {
      setMessage(result.error.issues[0].message)
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      await updateProfileFn({
        data: {
          profileId: profile.id,
          ...result.data,
        },
      })
      setMessage('Profile saved!')
      onSaved()
    } catch {
      setMessage('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <p
            className={`text-sm ${
              message.includes('Failed') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the world about yourself..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

> **Note:** Server functions must be top-level exports — never defined inside a component. That's why `updateProfileFn` lives in `profile.functions.ts`.

### Step 3: Create the link editor with optimistic updates

Update `src/components/link-editor.tsx` to support optimistic removal:

The `LinkEditor` from Module 10 already supports removing links. Add optimistic behavior:

```tsx
const handleRemoveLink = async (id: string) => {
  // Optimistic update
  const previous = [...links]
  setLinks(links.filter((link) => link.id !== id))

  try {
    await removeLink({ data: { linkId: id } })
  } catch {
    // Rollback
    setLinks(previous)
  }
}
```

### Step 4: Wire up the full dashboard

Update `src/routes/_authed/dashboard.tsx`:

```tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getMyProfile } from '../../server/profile.functions'
import { ProfileEditForm } from '../../components/profile-edit-form'
import { LinkEditor } from '../../components/link-editor'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authed/dashboard')({
  loader: async () => {
    const profile = await getMyProfile()
    return { profile }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { profile } = Route.useLoaderData()
  const router = useRouter()

  // Apply saved theme on load
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [profile.theme])

  const handleRefresh = () => {
    router.invalidate()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile at{' '}
            <Link
              to="/$username"
              params={{ username: profile.username }}
              className="text-blue-600 hover:underline"
            >
              devstack.bio/{profile.username}
            </Link>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/$username" params={{ username: profile.username }}>
            View Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProfileEditForm
          profile={{
            id: profile.id,
            displayName: profile.displayName,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            theme: profile.theme,
          }}
          onSaved={handleRefresh}
        />
        <LinkEditor
          initialLinks={profile.links.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            order: link.order,
          }))}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
```

### Step 5: Verify

1. Register a new account (if you haven't already)
2. On the dashboard, edit your display name and bio → click Save → see the success message
3. Add and remove links → changes should persist after refresh
4. Click "View Profile" → see your updated public profile
5. Check that loading states appear during saves

### Step 6: Commit

```bash
git add .
git commit -m "Build interactive dashboard with profile editing and link management"
```

## Common Patterns

| Pattern | Code |
|---------|------|
| Loading state | `const [isLoading, setIsLoading] = useState(false)` |
| Disable during loading | `disabled={isLoading}` |
| Success/error message | `const [message, setMessage] = useState('')` |
| Optimistic update | `setItems(newList)` before `await mutation()` |
| Rollback on error | `catch { setItems(previousList) }` |
| Revalidate data | `router.invalidate()` |
| Zod validation | `schema.safeParse(data)` → check `result.success` |

## Deep Dive

- [React — Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [React — Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [TanStack Router — Data Loading](https://tanstack.com/router/v1/docs/framework/react/guide/data-loading)

---

**Next:** [Module 13 — The Public Page (SSR)](../13-the-public-page-ssr/) → Server-side rendering with analytics tracking.
