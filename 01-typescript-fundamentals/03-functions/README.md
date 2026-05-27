# Module 03: Functions

## What you'll learn

Write reusable blocks of code that accept inputs and return outputs.

## Key concepts

### Basic function with type annotations

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

greet("Alice"); // "Hello, Alice!"
```

- `name: string` — parameter type (what goes in)
- `: string` after the parentheses — return type (what comes out)

### Arrow functions

Same thing, different syntax. Arrow functions are more common in modern
codebases.

```ts
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

// Short form — when the body is a single expression
const greet = (name: string): string => `Hello, ${name}!`;
```

Both forms do the same thing. You'll see arrow functions everywhere in React.

### Optional and default parameters

```ts
// Optional — caller can skip it (becomes undefined)
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

greet("Alice"); // "Hello, Alice!"
greet("Alice", "Dr."); // "Hello, Dr. Alice!"

// Default — caller can skip it (uses the default value)
function createUser(name: string, role: string = "member"): string {
  return `${name} (${role})`;
}

createUser("Alice"); // "Alice (member)"
createUser("Alice", "admin"); // "Alice (admin)"
```

### Return type `void`

When a function doesn't return anything, its return type is `void`.

```ts
function logMessage(message: string): void {
  console.log(`[LOG] ${message}`);
}
```

You rarely need to write `: void` explicitly — TypeScript infers it. But you'll
see it in type definitions.

### Functions as values

Functions can be stored in variables, passed as arguments, and returned from
other functions.

```ts
// A function that takes another function as an argument
function runTwice(action: () => void): void {
  action();
  action();
}

function sayHi(): void {
  console.log("Hi!");
}

runTwice(sayHi);
// Output:
// Hi!
// Hi!
```

The type `() => void` means "a function with no parameters that returns
nothing." You'll see this pattern in event handlers later.

### Multiple parameters

```ts
function buildProfile(name: string, age: number, isActive: boolean): string {
  const status = isActive ? "active" : "inactive";
  return `${name}, age ${age}, ${status}`;
}
```

When a function has many parameters, put each on its own line for readability.

## Commands you'll use

| Command           | Purpose               |
| ----------------- | --------------------- |
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Pattern                             | When to use                                      |
| ----------------------------------- | ------------------------------------------------ |
| Arrow function with explicit return | Multi-line function body                         |
| Arrow function with implicit return | Single-expression function                       |
| Optional parameter `title?: string` | When caller might not provide it                 |
| Default parameter `role = "member"` | When there's a sensible default                  |
| `void` return type                  | Functions that do side effects (logging, saving) |

## Now build it

Create `functions.ts` and write these functions:

1. `add(a, b)` — takes two numbers, returns their sum
2. `formatUserName(name, lowercase)` — takes a string and an optional boolean.
   If `lowercase` is true, return the name in lowercase. Otherwise return it
   as-is.
3. `createEmail(user, domain)` — takes two strings with a default domain of
   `"example.com"`. Returns `user@domain`.
4. Call each function and print the results.

---

📖 **Deep dive:**

- [TypeScript Handbook — More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [MDN — Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
