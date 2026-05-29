# Module 11: Advanced Types (Optional)

> **This module is optional.** It covers advanced TypeScript features you'll
> encounter in real codebases. Come back here when you see types you don't
> recognize. You don't need this to continue to the Web Dev Track.

## What you'll learn

Write types that adapt, transform, and narrow — making TypeScript work harder
for you.

## Key concepts

### Generics — types that take parameters

A generic lets you write a function or type that works with any type, while
keeping type safety.

```ts
// Without generics — separate functions for each type
function getFirstString(items: string[]): string | undefined {
  return items[0];
}

function getFirstNumber(items: number[]): number | undefined {
  return items[0];
}

// With generics — one function for all types
function getFirstElement<T>(items: T[]): T | undefined {
  return items[0];
}

const firstString = getFirstElement<string>(["a", "b"]); // string | undefined
const firstNumber = getFirstElement<number>([1, 2]); // number | undefined
```

`<T>` is a type parameter. You can name it anything, but `T` is convention
(short for "Type"). When you call the function, you provide the concrete type.

### TypeScript often infers the generic

```ts
// Explicit type parameter
const firstItem = getFirstElement<string>(["a", "b"]);

// TypeScript infers it — same result, no type parameter needed
const firstItemInferred = getFirstElement(["a", "b"]);
```

Provide the type parameter when inference isn't clear enough (complex cases).

### Generic constraints

Limit what types a generic accepts:

```ts
type HasId = {
  id: string;
};

function findById<T extends HasId>(
  items: T[],
  targetId: string,
): T | undefined {
  return items.find((item) => item.id === targetId);
}
```

`T extends HasId` means "T can be any type, as long as it has an `id: string`
property."

### Multiple type parameters

```ts
function createPair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const nameAndAge = createPair("Alice", 25); // [string, number]
```

### Built-in utility types

TypeScript ships with utility types that transform existing types.

#### `Partial<T>` — make all properties optional

```ts
type User = {
  name: string;
  email: string;
  age: number;
};

type PartialUser = Partial<User>;
// Equivalent to: { name?: string; email?: string; age?: number }

// Useful for update functions
function updateUser(updates: Partial<User>): void {
  // Only the fields being changed are provided
}

updateUser({ name: "New Name" }); // OK — only name
updateUser({ email: "a@b.com", age: 30 }); // OK — email and age
```

#### `Pick<T, K>` — choose specific properties

```ts
type UserPreview = Pick<User, "name" | "email">;
// Equivalent to: { name: string; email: string }
```

#### `Omit<T, K>` — exclude specific properties

```ts
type UserWithoutAge = Omit<User, "age">;
// Equivalent to: { name: string; email: string }
```

#### `Record<K, V>` — object as a map (you've seen this before)

```ts
const userRoles: Record<string, "admin" | "member"> = {
  alice: "admin",
  bob: "member",
};
```

#### `ReturnType<T>` — extract return type of a function

```ts
function getUser() {
  return { name: "Alice", age: 25 };
}

type UserData = ReturnType<typeof getUser>;
// { name: string; age: number }
```

### Type guards — narrowing types at runtime

```ts
function processValue(value: string | number): string {
  if (typeof value === "string") {
    // TypeScript knows `value` is string here
    return value.toUpperCase();
  }
  // TypeScript knows `value` is number here
  return value.toFixed(2);
}
```

`typeof` is a type guard. TypeScript narrows the type within each branch.

### Discriminated unions — type-safe state modeling

A discriminated union uses a shared property (the "discriminant") to distinguish
between types.

```ts
type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: string[];
};

type ErrorState = {
  status: "error";
  message: string;
};

type ApiState = LoadingState | SuccessState | ErrorState;

function renderState(state: ApiState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Got ${state.data.length} items`;
    case "error":
      return `Error: ${state.message}`;
  }
}
```

TypeScript narrows the type based on `state.status`. In the `"success"` case,
`state.data` is available. In the `"error"` case, `state.message` is available.
No type assertions needed.

## Commands you'll use

| Command           | Purpose               |
| ----------------- | --------------------- |
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Feature              | When to use                                              |
| -------------------- | -------------------------------------------------------- |
| Generics             | Functions/types that work with multiple types            |
| `Partial<T>`         | Update functions, partial configurations                 |
| `Pick<T, K>`         | Creating a subset type from a larger one                 |
| `Omit<T, K>`         | Removing fields you don't want to expose                 |
| `Record<K, V>`       | Object maps with dynamic keys                            |
| `ReturnType<T>`      | Deriving types from function signatures                  |
| Type guards          | Narrowing union types with `typeof`, `instanceof`        |
| Discriminated unions | Modeling states (loading/success/error), events, actions |

## Now build it

Create `advanced-types.ts` and write:

1. A generic function
   `findByProperty<T>(items: T[], predicate: (item: T) => boolean): T | undefined`
   that takes an array and a predicate function, returns the first match or
   `undefined`.

2. A discriminated union `LinkOperation` with three states:
   - `{ type: "create", title: string, url: string }`
   - `{ type: "update", id: string, changes: Partial<LinkUpdateFields> }`
   - `{ type: "delete", id: string }`

   Where `LinkUpdateFields = { title: string; url: string; isVisible: boolean }`

3. A function `describeOperation(operation: LinkOperation): string` that returns
   a human-readable description using a switch on `type`.

4. Create an array of `LinkOperation` objects (at least one of each type) and
   loop through, printing the description for each.

**Bonus:** Write a generic function `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]`
that extracts one property from each item. Example:
`pluck([{name: "A"}, {name: "B"}], "name")` → `["A", "B"]`

---

📖 **Deep dive:**

- [TypeScript Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook — Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
