# Module 11 — Authentication

## What you'll learn

Implement registration, login, cookie-based sessions, and route protection using TanStack Start's built-in session support.

## Key Concepts

### How Web Authentication Works

1. **Register** — user submits email + password → server hashes the password → stores in database
2. **Login** — user submits email + password → server compares against stored hash → creates a session
3. **Session** — server sends a cookie to the browser → browser sends it back on every request → server reads the cookie to identify the user
4. **Logout** — server clears the session → cookie is removed

### Password Hashing

**Never store plain-text passwords.** Use a one-way hash function:

```ts
import bcrypt from 'bcryptjs'

// Hashing (registration)
const hash = await bcrypt.hash(password, 12) // 12 = salt rounds (cost factor)

// Verifying (login)
const isValid = await bcrypt.compare(password, hash) // → true or false
```

- `bcrypt.hash()` turns a password into an irreversible hash
- `bcrypt.compare()` checks if a password matches a stored hash
- The salt rounds (12) make brute-force attacks slower

### Cookie-Based Sessions

TanStack Start provides `useSession()` for secure HTTP-only cookies:

```ts
import { useSession } from '@tanstack/react-start/server'

export function useAppSession() {
  return useSession({
    name: 'devstack-session',
    password: process.env.SESSION_SECRET!, // Must be 32+ characters
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,  // JavaScript cannot read this cookie (XSS protection)
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  })
}
```

Key cookie options:
- **`httpOnly: true`** — prevents JavaScript from reading the cookie (protects against XSS)
- **`secure: true`** — only sent over HTTPS in production
- **`sameSite: 'lax'`** — protects against CSRF attacks
- **`maxAge`** — how long the session lasts

### Route Protection with `beforeLoad`

Use a layout route's `beforeLoad` to check authentication before rendering:

```tsx
// src/routes/_authed.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '../server/auth.functions'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return { user }
  },
  component: AuthedLayout,
})
```

Child routes access the user via route context:

```tsx
function DashboardPage() {
  const { user } = Route.useRouteContext()
  return <p>Welcome, {user.email}</p>
}
```

> **Important:** Route protection is a **UX concern** — it redirects users who aren't logged in. For **security**, always enforce auth in the server function itself (auth middleware or in-handler checks). A server function is an RPC endpoint that can be called directly.

## Now Build It: Add Authentication

### Step 1: Install bcryptjs

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

### Step 2: Create a session secret

Create `.env` at the project root (this file should NOT be committed):

```
SESSION_SECRET=change-this-to-a-random-32-character-string-in-production
```

Add `.env` to `.gitignore`:
```
.env
```

### Step 3: Create the session utility

Create `src/server/session.ts`:

```ts
import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId?: string
}

export function useAppSession() {
  return useSession({
    name: 'devstack-session',
    password: process.env.SESSION_SECRET ?? 'fallback-dev-secret-change-in-production-32ch',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  })
}
```

### Step 4: Create auth server functions

Create `src/server/auth.functions.ts`:

```ts
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import bcrypt from 'bcryptjs'
import { db } from '../db'
import { users, profiles } from '../db/schema'
import { eq } from 'drizzle-orm'
import { useAppSession } from './session'
import { registerSchema, loginSchema } from './schemas'
import { findUserByEmail } from './db.server'

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {
    // Check if email already exists
    const existingUser = await findUserByEmail(data.email)
    if (existingUser) {
      return { error: 'An account with this email already exists' }
    }

    // Check if username is taken
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.username, data.username),
    })
    if (existingProfile) {
      return { error: 'This username is already taken' }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, 12)

    // Create user
    const userId = crypto.randomUUID()
    await db.insert(users).values({
      id: userId,
      email: data.email,
      passwordHash,
    })

    // Create profile
    await db.insert(profiles).values({
      id: crypto.randomUUID(),
      userId,
      username: data.username,
      displayName: data.username, // Default to username; can be changed later
    })

    // Create session
    const session = await useAppSession()
    await session.update({ userId })

    return { success: true }
  })

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const user = await findUserByEmail(data.email)
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) {
      return { error: 'Invalid email or password' }
    }

    const session = await useAppSession()
    await session.update({ userId: user.id })

    return { success: true }
  })

export const logoutFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const session = await useAppSession()
    await session.clear()
    return { success: true }
  })

export const getCurrentUserFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await useAppSession()
    const userId = session.data.userId
    if (!userId) return null

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    if (!user) return null

    // Don't expose the password hash
    return { id: user.id, email: user.email }
  })
```

### Step 5: Update the registration form to use the real server function

Update `src/routes/register.tsx`:

```tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { RegisterForm } from '../components/register-form'
import { registerFn } from '../server/auth.functions'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (data: {
    email: string
    username: string
    password: string
  }) => {
    setServerError('')
    const result = await registerFn({ data })
    if (result?.error) {
      setServerError(result.error)
    } else if (result?.success) {
      navigate({ to: '/dashboard' })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Pick a username — it becomes your public profile URL.
        </p>
        {serverError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}
        <div className="mt-6">
          <RegisterForm onSubmit={handleRegister} />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
```

### Step 6: Create the login page

Update `src/routes/login.tsx`:

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { loginFn } from '../server/auth.functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await loginFn({ data: { email, password } })
    if (result?.error) {
      setError(result.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 7: Protect the authed layout route

Update `src/routes/_authed.tsx`:

The `_authed` layout's only job is **route protection** — checking if the user is logged in. If not, redirect to login. The nav bar is handled by the root layout.

```tsx
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '../server/auth.functions'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return { user }
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  return <Outlet />
}
```

### Step 8: Make the root nav auth-aware

Update `src/routes/__root.tsx` to show different nav links depending on login state:

```tsx
import { HeadContent, Scripts, createRootRoute, Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

import appCss from '../styles.css?url'
import { getCurrentUserFn, logoutFn } from '../server/auth.functions'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale= 1' },
      { title: 'DevStack Bio' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [checked, setChecked] = useState(false)

  const locationHref = useRouterState({ select: (s) => s.location.href })

  const refreshUser = useCallback(() => {
    getCurrentUserFn()
      .then((result) => setUser(result))
      .catch(() => setUser(null))
      .finally(() => setChecked(true))
  }, [])

  useEffect(() => {
    refreshUser()
  }, [locationHref, refreshUser])

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutFn()
    setUser(null)
    navigate({ to: '/' })
  }

  return (
    <RootDocument>
      <div className="min-h-screen bg-background flex flex-col">
        <header>
          <nav className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Link to="/" className="text-xl font-bold">
                DevStack Bio
              </Link>
              {checked && (
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        activeProps={{ className: 'font-bold' }}
                      >
                        Dashboard
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Log In</Link>
                      <Link to="/register">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
          <Outlet />
        </main>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          DevStack Bio — A learning project
        </footer>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

> **How it works:** `useRouterState` gives us the current URL. Every time the URL changes (navigation), the `useEffect` re-calls `getCurrentUserFn()` to check the session. After login, the session cookie is set — the next navigation triggers a refresh and the nav updates to show Dashboard/Log Out.

### Step 9: Update the dashboard to use real data

Update `src/routes/_authed/dashboard.tsx`:

```tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getMyProfile } from '../../server/profile.functions'
import { LinkEditor } from '../../components/link-editor'

export const Route = createFileRoute('/_authed/dashboard')({
  loader: async ({ context }) => {
    const profile = await getMyProfile({ data: { userId: context.user.id } })
    return { profile }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { profile } = Route.useLoaderData()
  const router = useRouter()

  const handleRefresh = () => {
    router.invalidate() // Re-run loaders
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {profile.displayName}
        </p>
      </div>
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
  )
}
```

### Step 10: Verify the full auth flow

1. Visit `/dashboard` without being logged in → should redirect to `/login`
2. Click "Create one" → go to `/register`
3. Register with a new email and username → should redirect to `/dashboard`
4. See the dashboard with your profile data
5. Click "Log Out" → should redirect to home page
6. Log back in with the same credentials → should work
7. Visit `/your-username` → should see your public profile

### Step 11: Commit

```bash
git add .
git commit -m "Add authentication: register, login, sessions, route protection"
```

## Commands You'll Use

No new commands — authentication is implemented in code.

## Common Patterns

| Pattern | Code |
|---------|------|
| Hash password | `await bcrypt.hash(password, 12)` |
| Verify password | `await bcrypt.compare(password, hash)` |
| Create session | `await session.update({ userId })` |
| Read session | `const userId = session.data.userId` |
| Clear session | `await session.clear()` |
| Protect a route | `beforeLoad: async () => { ... throw redirect(...) }` |
| Read route context | `const { user } = Route.useRouteContext()` |
| Invalidate data | `router.invalidate()` |

## Deep Dive

- [TanStack Start — Authentication](https://tanstack.com/start/latest/docs/framework/react/guide/authentication)
- [TanStack Start — Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [MDN — HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP — Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

**Next:** [Module 12 — The Dashboard (CSR)](../12-the-dashboard-csr/) → Build the full interactive dashboard.
