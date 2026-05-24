# Module 08: Error Handling

## What you'll learn
Handle things that go wrong without crashing your program.

## Key concepts

### `try / catch`

Wrap code that might fail in `try`. If it fails, execution jumps to `catch`.

```ts
function divide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    throw new Error("Cannot divide by zero")
  }
  return numerator / denominator
}

try {
  const result = divide(10, 0)
  console.log(result)
} catch (error) {
  console.log("Something went wrong:", error)
}
// Output: "Something went wrong: Error: Cannot divide by zero"
```

### Throwing errors

You can throw any value, but always throw `Error` objects — they include a stack trace.

```ts
throw new Error("Something went wrong")
```

### Error type in catch

TypeScript types the caught error as `unknown`. Use type narrowing to work with it.

```ts
try {
  const response = await fetch("https://api.example.com/data")
  const data = await response.json()
} catch (caughtError: unknown) {
  if (caughtError instanceof Error) {
    console.log(`Error: ${caughtError.message}`)
  } else {
    console.log("Unknown error occurred")
  }
}
```

### `try / catch` with async

Same pattern — `await` inside `try`, errors land in `catch`.

```ts
async function fetchUserData(username: string): Promise<void> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const userData = await response.json()
    console.log(`${userData.login} — ${userData.public_repos} repos`)
  } catch (caughtError: unknown) {
    if (caughtError instanceof Error) {
      console.log(`Failed to fetch user: ${caughtError.message}`)
    }
  }
}
```

### `finally` — runs no matter what

```ts
try {
  // risky operation
} catch (caughtError: unknown) {
  // handle error
} finally {
  // always runs — whether success or failure
  // useful for cleanup (closing files, connections)
}
```

### Creating custom error types

For more specific error handling, extend the `Error` class:

```ts
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

function validateEmail(email: string): string {
  if (!email.includes("@")) {
    throw new ValidationError("email", "Must contain @")
  }
  return email
}

try {
  validateEmail("not-an-email")
} catch (caughtError: unknown) {
  if (caughtError instanceof ValidationError) {
    console.log(`Validation failed on "${caughtError.field}": ${caughtError.message}`)
  }
}
```

### When to throw vs return

| Approach | When to use |
|----------|------------|
| Throw an error | Something unexpected or unrecoverable happened |
| Return a value (like `null`) | An expected case that the caller should handle |

```ts
// Throw — unexpected, caller should catch
function getConfigValue(key: string): string {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Missing required config: ${key}`)
  }
  return value
}

// Return — expected case, caller checks
function findLinkByUrl(links: Link[], targetUrl: string): Link | undefined {
  return links.find((link) => link.url === targetUrl)
}
```

## Commands you'll use

| Command | Purpose |
|---------|---------|
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Pattern | When to use |
|---------|------------|
| `try/catch` around `await` | Any async call that might fail (API, file, DB) |
| `throw new Error(msg)` | When something is wrong and the caller needs to know |
| `instanceof Error` check | Type narrowing in catch blocks |
| `finally` | Cleanup that must run regardless of success/failure |
| Return `undefined` | Expected "not found" cases |

## Now build it

Create `error-handling.ts` and write:

1. A function `parseLinkUrl(input: string): { title: string; url: string }` that:
   - Throws an `Error` if input is empty
   - Throws a `ValidationError` (custom class) if it doesn't start with `http://` or `https://`
   - Returns `{ title: new URL(input).hostname, url: input }` otherwise
2. A function `safeParseLink(input: string)` that calls `parseLinkUrl` in a try/catch and returns the result or a user-friendly error string
3. Test with: `"https://github.com"`, `""`, `"not-a-url"`

---
📖 **Deep dive:**
- [MDN — try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [MDN — Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
