# Module 06 — Components & Props

## What you'll learn

Break your UI into reusable React components and pass data between them using
props.

## Key Concepts

### What is a Component?

A **component** is a function that returns JSX. It's a reusable piece of UI:

```tsx
function LinkCard({ title, url }: { title: string; url: string }) {
  return (
    <a href={url} className="block rounded-lg border p-4 hover:bg-blue-50">
      {title}
    </a>
  );
}
```

You use it like an HTML tag:

```tsx
<LinkCard title="GitHub" url="https://github.com/alice" />
```

### Props: Passing Data to Components

**Props** (properties) are arguments you pass to a component. They work like
function parameters:

```tsx
// Define what props the component accepts
type ProfileHeaderProps = {
  username: string;
  displayName: string;
  bio: string;
};

// Use the props inside the component
function ProfileHeader({ username, displayName, bio }: ProfileHeaderProps) {
  return (
    <header className="text-center">
      <h1>{displayName}</h1>
      <p>@{username}</p>
      <p>{bio}</p>
    </header>
  );
}

// Pass props when using the component
<ProfileHeader
  username="alice"
  displayName="Alice Chen"
  bio="Full-stack developer"
/>;
```

### The `children` Prop

Every component can accept `children` — content placed between the opening and
closing tags:

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">{children}</div>
  );
}

// Usage:
<Card>
  <h2>Any content here</h2>
  <p>This gets passed as children</p>
</Card>;
```

This is the **composition** pattern — building complex UIs from simple,
composable pieces.

### Component Naming Conventions

| Convention      | Example                               | Rule               |
| --------------- | ------------------------------------- | ------------------ |
| Component names | `LinkCard`, `ProfileHeader`           | PascalCase, always |
| Prop names      | `displayName`, `onClick`              | camelCase          |
| File names      | `link-card.tsx`, `profile-header.tsx` | kebab-case         |

### Where to Put Components

```
src/
├── routes/               ← Route components (one per URL)
│   ├── $username.tsx
│   └── _authed/
│       └── dashboard.tsx
└── components/           ← Reusable components (shared across routes)
    ├── link-card.tsx
    ├── profile-header.tsx
    └── ui/               ← shadcn/ui components will go here (Module 09)
```

Rule of thumb:

- If a component is used in **one route only**, define it in the same file
- If a component is used in **multiple routes**, move it to `src/components/`

### Component Composition

Build complex UIs by nesting components:

```tsx
function PublicProfilePage() {
  const profile = { username: "alice", displayName: "Alice Chen", bio: "Dev" };
  const links = [
    { id: "1", title: "GitHub", url: "https://github.com/alice" },
    { id: "2", title: "Blog", url: "https://alice.dev" },
  ];

  return (
    <article>
      <ProfileHeader
        username={profile.username}
        displayName={profile.displayName}
        bio={profile.bio}
      />
      <LinkList links={links} />
    </article>
  );
}

function LinkList({
  links,
}: {
  links: Array<{ id: string; title: string; url: string }>;
}) {
  return (
    <ul className="space-y-3 mt-6">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard title={link.title} url={link.url} />
        </li>
      ))}
    </ul>
  );
}
```

Notice the `key` prop on `<li>` — React requires a unique `key` for every
element in a list. Use the item's ID, never the array index.

### Rendering Lists

The `.map()` pattern is how you render lists in React:

```tsx
const links = [
  { id: "1", title: "GitHub", url: "https://github.com/alice" },
  { id: "2", title: "Blog", url: "https://alice.dev" },
];

// In JSX:
{
  links.map((link) => (
    <LinkCard key={link.id} title={link.title} url={link.url} />
  ));
}
```

### Conditional Rendering

Show different UI based on conditions:

```tsx
// Pattern 1: && (show/hide)
{
  isLoggedIn && <DashboardLink />;
}

// Pattern 2: ternary (either/or)
{
  isLoading ? <Spinner /> : <Content data={data} />;
}

// Pattern 3: early return
function ProfilePage({ profile }: Props) {
  if (!profile) {
    return <p>Profile not found.</p>;
  }
  return <ProfileHeader {...profile} />;
}
```

## What We Built: Reusable Components

### Step 1: Created the components directory

```bash
mkdir -p src/components
```

### Step 2: Created `src/components/link-card.tsx`

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
      className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
    >
      {iconName && <span className="text-xl">{iconName}</span>}
      <span>{title}</span>
    </a>
  );
}
```

### Step 3: Created `src/components/profile-header.tsx`

```tsx
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
  return (
    <header className="text-center">
      <img
        src={
          avatarUrl ??
          `https://api.dicebear.com/9.x/initials/svg?seed=${username}`
        }
        alt={`${displayName}'s avatar`}
        className="w-24 h-24 rounded-full mx-auto bg-gray-100"
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{displayName}</h1>
      <p className="text-gray-500">@{username}</p>
      {bio && <p className="mt-2 text-gray-600">{bio}</p>}
    </header>
  );
}
```

### Step 4: Created `src/components/link-list.tsx`

```tsx
import { LinkCard } from "./link-card";

type Link = {
  id: string;
  title: string;
  url: string;
  iconName?: string;
};

type LinkListProps = {
  links: Link[];
};

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return <p className="text-center text-gray-400">No links yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard
            title={link.title}
            url={link.url}
            iconName={link.iconName}
          />
        </li>
      ))}
    </ul>
  );
}
```

### Step 5: Updated `src/routes/$username.tsx` to use the components

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ProfileHeader } from "../components/profile-header";
import { LinkList } from "../components/link-list";

export const Route = createFileRoute("/$username")({
  component: PublicProfilePage,
});

// Placeholder data — will come from the database in Module 10
const PLACEHOLDER_PROFILE = {
  username: "",
  displayName: "Alice Chen",
  bio: "Full-stack developer. Building cool things with TypeScript.",
  avatarUrl: "",
};

const PLACEHOLDER_LINKS = [
  { id: "1", title: "GitHub", url: "https://github.com/alice" },
  { id: "2", title: "Portfolio", url: "https://alice.dev" },
  { id: "3", title: "Blog", url: "https://blog.alice.dev" },
];

function PublicProfilePage() {
  const { username } = Route.useParams();
  const profile = { ...PLACEHOLDER_PROFILE, username };

  return (
    <article className="max-w-md mx-auto py-12">
      <ProfileHeader
        username={profile.username}
        displayName={profile.displayName}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl}
      />
      <section className="mt-8">
        <h2 className="sr-only">Links</h2>
        <LinkList links={PLACEHOLDER_LINKS} />
      </section>
      <footer className="mt-8 text-center text-sm text-gray-400">
        Powered by DevStack Bio
      </footer>
    </article>
  );
}
```

### Step 6: Verified

We visited `/alice` and saw the same profile page but now built from three
reusable components. The visual result was the same; the code structure was
cleaner and more maintainable.

### Step 7: Committed

```bash
git add .
git commit -m "Extract reusable components: ProfileHeader, LinkCard, LinkList"
```

## Commands You'll Use

No new commands. You're creating files and the dev server picks up changes.

## Common Patterns

| Pattern              | Code                                          | When to use                           |
| -------------------- | --------------------------------------------- | ------------------------------------- |
| Component with props | `function Card({ title }: { title: string })` | Every component that needs data       |
| Children prop        | `{ children }: { children: React.ReactNode }` | Wrapper/layout components             |
| Optional prop        | `bio?: string`                                | Props that may not always be provided |
| Default value        | `{ count = 0 }: { count?: number }`           | Provide a fallback                    |
| Spread props         | `<ProfileHeader {...profile} />`              | Pass all object properties as props   |
| List rendering       | `items.map(item => <Card key={item.id} />)`   | Display arrays of data                |
| Conditional render   | `{condition && <Component />}`                | Show/hide based on state              |
| Component file       | `src/components/my-component.tsx`             | Shared across routes                  |

## Deep Dive

- [React — Your First Component](https://react.dev/learn/your-first-component)
- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React — Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [React — Rendering Lists](https://react.dev/learn/rendering-lists)

---

**Next:** [Module 08 — State & Interactivity](../08-state-and-interactivity/) →
Add interactivity with user input, forms, and state.
