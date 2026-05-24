# Module 07 — State & Interactivity

## What you'll learn

Make your pages interactive with React state (`useState`), event handlers, and controlled form inputs.

## Key Concepts

### What is State?

**State** is data that changes over time in your component. Unlike props (passed in from outside), state is managed **inside** the component.

When state changes, React re-renders the component — the UI automatically reflects the new value.

### `useState`

The `useState` hook creates a state variable:

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  //        ↑ value   ↑ setter     ↑ initial value

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

- `count` — the current value
- `setCount` — a function to update it
- `0` — the initial value (only used on first render)

When you call `setCount(count + 1)`:
1. React updates the state value
2. React re-renders the component
3. The new count appears on screen

### State Updates Are Asynchronous

React batches state updates for performance. The new value isn't available immediately:

```tsx
// ❌ count is still the old value on the next line
setCount(count + 1)
console.log(count) // still the OLD value

// ✅ Use a callback when new state depends on old state
setCount((previousCount) => previousCount + 1)
```

### Event Handlers

React uses camelCase event names and passes a synthetic event object:

```tsx
function Form() {
  const [username, setUsername] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent page reload
    console.log('Submitted:', username)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

| Event | When it fires | JSX attribute |
|-------|--------------|---------------|
| Click | User clicks an element | `onClick` |
| Change | Input value changes | `onChange` |
| Submit | Form is submitted | `onSubmit` |
| Key down | Key is pressed | `onKeyDown` |
| Focus | Element receives focus | `onFocus` |
| Blur | Element loses focus | `onBlur` |

### Controlled Inputs

A **controlled input** has its value driven by React state:

```tsx
const [email, setEmail] = useState('')

<input
  value={email}                        // value comes from state
  onChange={(e) => setEmail(e.target.value)}  // changes update state
/>
```

Every keystroke: `onChange` fires → `setEmail` updates state → React re-renders → input shows new value.

This pattern gives you full control: validation, formatting, disabling based on state, etc.

### Form Pattern

The standard React form pattern:

```tsx
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Validation
    if (!email || !password) {
      setError('All fields are required')
      return
    }

    // Submit logic (we'll connect to a server function in Module 10)
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('') // Clear error on change
          }}
          className="mt-1 block w-full rounded border p-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          className="mt-1 block w-full rounded border p-2"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Log In
      </button>
    </form>
  )
}
```

### Derived State

Don't put values in state if they can be computed from existing state or props:

```tsx
// ❌ Redundant state
const [firstName, setFirstName] = useState('Alice')
const [lastName, setLastName] = useState('Chen')
const [fullName, setFullName] = useState('Alice Chen') // unnecessary!

// ✅ Derived value — always correct
const [firstName, setFirstName] = useState('Alice')
const [lastName, setLastName] = useState('Chen')
const fullName = `${firstName} ${lastName}`
```

## Now Build It: Add Interactivity to DevStack Bio

### Step 1: Create a registration form component

Create `src/components/register-form.tsx`:

```tsx
import { useState } from 'react'

type RegisterFormProps = {
  onSubmit: (data: { email: string; username: string; password: string }) => void
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    // Validation
    if (!email || !username || !password) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    // Username must be URL-safe
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores')
      return
    }

    onSubmit({ email, username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
          placeholder="your-profile-url"
        />
        <p className="mt-1 text-sm text-gray-500">
          This will be your profile URL: devstack.bio/{username || 'username'}
        </p>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
          placeholder="Min. 8 characters"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Create Account
      </button>
    </form>
  )
}
```

### Step 2: Use the form in the register page

Update `src/routes/register.tsx`:

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RegisterForm } from '../components/register-form'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()

  const handleRegister = (data: { email: string; username: string; password: string }) => {
    // For now, just navigate to the dashboard
    // Real registration will be in Module 11
    console.log('Registration data:', data)
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
      <p className="mt-2 text-gray-600">
        Pick a username — it becomes your public profile URL.
      </p>
      <div className="mt-6">
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  )
}
```

### Step 3: Create a link editor for the dashboard

Create `src/components/link-editor.tsx`:

```tsx
import { useState } from 'react'

type Link = {
  id: string
  title: string
  url: string
  order: number
}

export function LinkEditor() {
  const [links, setLinks] = useState<Link[]>([
    { id: '1', title: 'GitHub', url: 'https://github.com/alice', order: 0 },
    { id: '2', title: 'Portfolio', url: 'https://alice.dev', order: 1 },
  ])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return

    const newLink: Link = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      order: links.length,
    }

    setLinks([...links, newLink])
    setNewTitle('')
    setNewUrl('')
  }

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Your Links</h2>

      {/* Existing links */}
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li
            key={link.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{link.title}</p>
              <p className="text-sm text-gray-500">{link.url}</p>
            </div>
            <button
              onClick={() => handleRemoveLink(link.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Add new link */}
      <div className="mt-4 rounded-lg border border-dashed p-4">
        <h3 className="text-sm font-medium text-gray-700">Add a Link</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (e.g., GitHub)"
            className="flex-1 rounded border p-2 text-sm"
          />
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded border p-2 text-sm"
          />
          <button
            onClick={handleAddLink}
            disabled={!newTitle.trim() || !newUrl.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Step 4: Use the link editor in the dashboard

Update `src/routes/_authed/dashboard.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { LinkEditor } from '../../components/link-editor'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Manage your profile and links.</p>
      </div>
      <LinkEditor />
    </div>
  )
}
```

### Step 5: Verify

1. Visit `/register` — fill in the form, try submitting with invalid data (empty fields, mismatched passwords). Verify error messages appear.
2. Submit valid data — you should be redirected to `/dashboard`.
3. On the dashboard, add and remove links. Changes should appear immediately.
4. Check that all state is local — refreshing the page resets the links (we'll fix this with a database in Module 09).

### Step 6: Commit

```bash
git add .
git commit -m "Add interactive forms: registration form, link editor with state"
```

## Commands You'll Use

No new commands. You're using React hooks, not CLI tools.

## Common Patterns

| Pattern | Code | When to use |
|---------|------|-------------|
| Text state | `const [name, setName] = useState('')` | Input fields |
| Boolean state | `const [isOpen, setIsOpen] = useState(false)` | Modals, toggles |
| Array state | `setItems([...items, newItem])` | Lists (add item) |
| Remove from array | `setItems(items.filter(i => i.id !== id))` | Lists (remove item) |
| Error state | `const [error, setError] = useState('')` | Form validation |
| Form submit | `onSubmit={(e) => { e.preventDefault(); ... }}` | Every form |
| Controlled input | `value={name} onChange={(e) => setName(e.target.value)}` | Every input |
| Disable button | `disabled={!title.trim()}` | Prevent empty submissions |
| Clear error on change | `onChange={(e) => { setName(e.target.value); setError('') }}` | Better UX |

## Deep Dive

- [React — useState](https://react.dev/reference/react/useState)
- [React — Responding to Events](https://react.dev/learn/responding-to-events)
- [React — State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [MDN — FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

---

**Next:** [Module 08 — shadcn/ui](../08-shadcn-ui/) → Replace hand-built inputs with polished, accessible components.
