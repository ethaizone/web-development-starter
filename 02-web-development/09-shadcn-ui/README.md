# Module 09 — shadcn/ui

## What you'll learn

Install shadcn/ui and replace hand-built form inputs and cards with polished,
accessible components.

## Key Concepts

### What is shadcn/ui?

shadcn/ui is **not a component library** in the traditional sense. It's a
collection of reusable React components that you **copy into your project**. You
own the code — you can edit it, style it, and extend it.

- Built on **Radix UI** (accessible, unstyled primitives)
- Styled with **Tailwind CSS** (matches your existing setup)
- Components live in `src/components/ui/` — you can modify them
- Add components one at a time: `npx shadcn@latest add button`

### How It Differs from a Traditional Library

| Traditional library (e.g., MUI)    | shadcn/ui                            |
| ---------------------------------- | ------------------------------------ |
| `npm install @mui/material`        | `npx shadcn@latest add button`       |
| Components live in `node_modules/` | Components live in your `src/`       |
| Update by changing version         | Update by re-running the add command |
| Customize via theme API            | Customize by editing the source code |

### The Component File Pattern

When you add a component, shadcn/ui creates a file like
`src/components/ui/button.tsx`:

```tsx
// src/components/ui/button.tsx (simplified)
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva("inline-flex items-center justify-center ...", {
  variants: {
    variant: {
      default: "bg-primary text-white ...",
      destructive: "bg-red-500 text-white ...",
      outline: "border border-gray-300 ...",
      ghost: "hover:bg-gray-100 ...",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    },
  },
});

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

You don't need to understand every line. What matters:

- **Variants** — pre-defined styles (`default`, `outline`, `destructive`)
- **Sizes** — `sm`, `default`, `lg`
- **Full HTML button props** — `onClick`, `disabled`, `type`, etc. all work
- **Editable** — you own the file, modify it to match your design

### Using shadcn/ui Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function MyForm() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button className="w-full">Create Account</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Commands You'll Use

| Command                                   | Purpose                            |
| ----------------------------------------- | ---------------------------------- |
| `npx shadcn@latest init`                  | Initialize shadcn/ui configuration |
| `npx shadcn@latest add button`            | Add a single component             |
| `npx shadcn@latest add button input card` | Add multiple components at once    |

## Common Patterns

| Pattern              | Code                                                  |
| -------------------- | ----------------------------------------------------- |
| Primary button       | `<Button>Save</Button>`                               |
| Outline button       | `<Button variant="outline">Cancel</Button>`           |
| Destructive button   | `<Button variant="destructive">Delete</Button>`       |
| Small button         | `<Button size="sm">Edit</Button>`                     |
| Full-width button    | `<Button className="w-full">Submit</Button>`          |
| Card with sections   | `<Card><CardHeader /><CardContent /></Card>`          |
| Input with label     | `<Label htmlFor="x"/><Input id="x" />`                |
| Dialog (modal)       | `<Dialog><DialogTrigger /><DialogContent /></Dialog>` |
| Avatar with fallback | `<Avatar><AvatarImage /><AvatarFallback /></Avatar>`  |

## What We Built: Added shadcn/ui to DevStack Bio

### Step 1: Initialized shadcn/ui

We ran the init command in the project directory:

```bash
npx shadcn@latest init -t start -b radix
```

Follow the prompts to select a preset theme. If the prompts don't appear or the
command fails, create the configuration manually:

- **Style:** Choose `new-york` (or whichever you prefer)
- **Base color:** Choose `slate` (neutral, professional)
- **CSS variables:** Yes

This creates:

- `components.json` — configuration file
- `src/lib/utils.ts` — utility function for class merging
- `src/components/ui/` — directory for components
- Installs required dependencies (`clsx`, `tailwind-merge`,
  `class-variance-authority`)

If the interactive init doesn't work, create these files manually:

**`components.json`:**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**`src/lib/utils.ts`:**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Then install the dependencies:

```bash
npm install clsx tailwind-merge class-variance-authority
```

**`src/styles.css` (theme variables for shadcn/ui):**

If `npx shadcn@latest init` ran successfully, it updated your CSS file
automatically. If you created the config manually, you **must** add the theme
variables. Without them, components like `<Button>` will have no background
color and look invisible.

The CSS file needs two things:

1. **`@theme inline`** — tells Tailwind v4 to map `bg-primary` →
   `var(--color-primary)` → `var(--primary)` → your oklch color
2. **`:root` / `.dark`** — defines the actual color values

```css
@import "tailwindcss";

@theme inline {
  --font-sans: ui-sans-serif, system-ui, sans-serif;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 265.755);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 265.755);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 265.755);
  --primary: oklch(0.205 0.042 265.755);
  --primary-foreground: oklch(0.985 0.002 247.839);
  --secondary: oklch(0.968 0.007 247.839);
  --secondary-foreground: oklch(0.205 0.042 265.755);
  --muted: oklch(0.968 0.007 247.839);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.839);
  --accent-foreground: oklch(0.205 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.129 0.042 265.755);
  --foreground: oklch(0.985 0.002 247.839);
  --card: oklch(0.129 0.042 265.755);
  --card-foreground: oklch(0.985 0.002 247.839);
  --popover: oklch(0.129 0.042 265.755);
  --popover-foreground: oklch(0.985 0.002 247.839);
  --primary: oklch(0.985 0.002 247.839);
  --primary-foreground: oklch(0.205 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.985 0.002 247.839);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.985 0.002 247.839);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.279 0.041 260.031);
  --input: oklch(0.279 0.041 260.031);
  --ring: oklch(0.446 0.043 257.281);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

> **Why the double indirection?** Tailwind v4 expects `--color-*` variables in
> `@theme`. shadcn/ui uses `--primary`, `--secondary`, etc. The `@theme inline`
> block bridges them: `--color-primary: var(--primary)` lets `bg-primary` work
> while keeping shadcn/ui's naming convention.

### Step 2: Added the components we needed

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add separator
```

Each command adds one component file to `src/components/ui/`.

### Step 3: Updated the registration form with shadcn/ui components

We updated `src/components/register-form.tsx`:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RegisterFormProps = {
  onSubmit: (data: {
    email: string;
    username: string;
    password: string;
  }) => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !username || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError(
        "Username can only contain letters, numbers, hyphens, and underscores",
      );
      return;
    }

    onSubmit({ email, username, password });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-profile-url"
            />
            <p className="text-sm text-muted-foreground">
              Your profile URL: devstack.bio/{username || "username"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Step 4: Updated the link editor with shadcn/ui components

We updated `src/components/link-editor.tsx`:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Link = {
  id: string;
  title: string;
  url: string;
  order: number;
};

export function LinkEditor() {
  const [links, setLinks] = useState<Link[]>([
    { id: "1", title: "GitHub", url: "https://github.com/alice", order: 0 },
    { id: "2", title: "Portfolio", url: "https://alice.dev", order: 1 },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newLink: Link = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      order: links.length,
    };

    setLinks([...links, newLink]);
    setNewTitle("");
    setNewUrl("");
    setDialogOpen(false);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
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
                disabled={!newTitle.trim() || !newUrl.trim()}
                className="w-full"
              >
                Add Link
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

### Step 5: Updated the profile header with Avatar

We updated `src/components/profile-header.tsx`:

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileHeaderProps = {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
};

export function ProfileHeader({
  username,
  displayName,
  bio,
  avatarUrl,
}: ProfileHeaderProps) {
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="text-center">
      <Avatar className="w-24 h-24 mx-auto">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
      <h1 className="mt-4 text-3xl font-bold">{displayName}</h1>
      <p className="text-muted-foreground">@{username}</p>
      {bio && <p className="mt-2 text-gray-600">{bio}</p>}
    </header>
  );
}
```

### Step 6: Verified

We confirmed: the registration form used shadcn/ui Card, Input, Label, and
Button; the link editor used Card, Dialog, Button; the avatar used shadcn/ui
Avatar with initials fallback.

### Step 7: Committed

```bash
git add .
git commit -m "Install shadcn/ui, replace custom inputs with accessible components"
```

## Deep Dive

- [shadcn/ui — Installation (TanStack Start)](https://ui.shadcn.com/docs/installation/tanstack)
- [shadcn/ui — Components](https://ui.shadcn.com/docs/components)
- [Radix UI — Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [shadcn/ui — Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)

---

**Next:** [Module 10 — Database & Drizzle](../10-database-and-drizzle/) → Store
your data in SQLite with type-safe queries.
