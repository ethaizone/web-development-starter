# Module 06: Interfaces & Types

## What you'll learn
Define and combine custom types to describe the shape of your data.

## Key concepts

### `type` — name a type

```ts
type User = {
  name: string
  age: number
  isActive: boolean
}

const user: User = {
  name: "Alice",
  age: 25,
  isActive: true,
}
```

### `interface` — another way to name an object shape

```ts
interface User {
  name: string
  age: number
  isActive: boolean
}
```

`type` and `interface` are nearly interchangeable for object shapes. In this course we prefer `type` because it's more flexible (unions, primitives, tuples). Both work — pick one style and be consistent.

### Optional properties

```ts
type Profile = {
  username: string
  bio?: string          // optional — may be undefined
  avatarUrl?: string    // optional — may be undefined
}

const minimalProfile: Profile = {
  username: "alice_dev",
  // bio and avatarUrl can be omitted
}
```

### Union types with named types

```ts
type Status = "active" | "inactive" | "suspended"
type Role = "admin" | "member"

type Account = {
  email: string
  role: Role
  status: Status
}

const account: Account = {
  email: "alice@example.com",
  role: "admin",
  status: "active",
}
```

String literal unions (`"active" | "inactive"`) act like enums but are simpler. TypeScript will catch typos at compile time.

### Extending / combining types

```ts
type BaseEntity = {
  id: string
  createdAt: string
}

type Link = BaseEntity & {
  title: string
  url: string
  order: number
}

const link: Link = {
  id: "link-001",
  createdAt: "2025-01-15",
  title: "GitHub",
  url: "https://github.com/alice",
  order: 1,
}
```

The `&` (intersection) operator combines types. `Link` has all properties from `BaseEntity` plus its own.

### Nested types

```ts
type Address = {
  city: string
  country: string
}

type UserProfile = {
  name: string
  address: Address
}

const profile: UserProfile = {
  name: "Alice",
  address: {
    city: "Bangkok",
    country: "Thailand",
  },
}
```

### Array of a custom type

```ts
type TechItem = {
  name: string
  category: string
}

const techStack: TechItem[] = [
  { name: "TypeScript", category: "language" },
  { name: "React", category: "framework" },
]
```

You've already seen this pattern in Module 05. Now you know how to name the type instead of writing it inline.

### `Record` — object as a map

```ts
// Keys are strings, values are numbers
const linkClicks: Record<string, number> = {
  "github.com": 150,
  "blog.dev": 89,
  "portfolio.design": 234,
}

linkClicks["github.com"]    // 150
```

Useful when you don't know the key names ahead of time.

## Commands you'll use

| Command | Purpose |
|---------|---------|
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Pattern | When to use |
|---------|------------|
| `type` for object shapes | Default choice — flexible, supports unions |
| Optional property `bio?: string` | When a field can be missing |
| String literal union `"a" \| "b"` | Fixed set of string options |
| Intersection `A & B` | Combining types |
| `Record<string, T>` | Object as a lookup map |

## Now build it

Create `interfaces-types.ts` and define types for the DevStack Bio data model:

1. `type Profile` — username, displayName, bio (optional), avatarUrl (optional)
2. `type Link` — title, url, order, isVisible (boolean)
3. `type User` — email, role (`"admin"` | `"member"`), profile (of type `Profile`), links (array of `Link`)
4. Create a `User` object with at least 2 links
5. Write a function `getVisibleLinks(user: User): Link[]` that returns only links where `isVisible` is true
6. Print the visible links

---
📖 **Deep dive:**
- [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook — Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
