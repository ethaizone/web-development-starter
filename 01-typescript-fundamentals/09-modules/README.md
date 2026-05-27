# Module 09: Modules

## What you'll learn

Split your code across multiple files and connect them together.

## Key concepts

### Why modules?

As your code grows, one file becomes hard to manage. Modules let you organize
related code into separate files and import only what you need.

### Named exports

Export specific things from a file. You can have multiple exports per file.

```ts
// math-utils.ts
export function add(firstNumber: number, secondNumber: number): number {
  return firstNumber + secondNumber;
}

export function multiply(firstNumber: number, secondNumber: number): number {
  return firstNumber * secondNumber;
}
```

```ts
// main.ts
import { add, multiply } from "./math-utils.js";

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
```

Note the `.js` extension in the import path — TypeScript files use `.ts` but
imports reference the compiled output, which is `.js`. With `tsx` (what we're
using), either `.ts` or no extension works.

### Default export

Each file can have one default export. Useful when a file exports one main
thing.

```ts
// logger.ts
export default function logMessage(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}
```

```ts
// main.ts
import logMessage from "./logger.js";

logMessage("App started");
```

Named imports use `{ braces }`, default imports don't. We prefer named exports
in this course — they're more explicit and support IDE autocomplete better.

### Re-exporting

Forward exports from another file:

```ts
// utils/index.ts
export { add, multiply } from "./math-utils.js";
export { default as logMessage } from "./logger.js";
```

This creates a single entry point. Consumers import from `./utils/` instead of
individual files.

### File structure convention

```
src/
├── types.ts            ← shared type definitions
├── utils/
│   ├── math-utils.ts   ← add, multiply
│   ├── string-utils.ts ← capitalize, truncate
│   └── index.ts        ← re-exports everything
└── main.ts             ← entry point
```

### Barrel exports with types

```ts
// types.ts
export type User = {
  name: string;
  email: string;
};

export type Link = {
  title: string;
  url: string;
};
```

```ts
// main.ts
import type { User, Link } from "./types.js";
```

`import type` tells TypeScript this is a type-only import — it gets erased at
runtime. Always use it when importing types.

### Path resolution

```ts
// Relative to current file
import { add } from "./math-utils.js"; // same folder
import { User } from "../types.js"; // parent folder
import { log } from "./utils/index.js"; // subfolder
```

## Commands you'll use

| Command               | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `npx tsx src/main.ts` | Run a TypeScript file that imports others |

## Common patterns

| Pattern             | When to use                                       |
| ------------------- | ------------------------------------------------- |
| Named exports       | Default — multiple things per file                |
| Default export      | When a file has one main export                   |
| `import type`       | Importing type definitions only                   |
| Barrel `index.ts`   | Simplifying imports for a folder of modules       |
| `./` relative paths | Always — imports are relative to the current file |

## Now build it

You'll need to create multiple files for this exercise. Organize them in the
`exercises/` folder:

1. Create `exercises/link-helpers.ts` with exported functions:
   - `formatLinkDisplay(title: string, url: string): string` — returns
     `"title (url)"`
   - `isValidUrl(url: string): boolean` — returns true if url starts with
     `http://` or `https://`

2. Create `exercises/link-types.ts` with exported types:
   - `ProfileLink` — `{ title: string; url: string; isVisible: boolean }`

3. Create `exercises/modules.ts` as the main file that:
   - Imports the functions from `link-helpers.ts`
   - Imports the type from `link-types.ts`
   - Creates an array of `ProfileLink` objects
   - Filters to only visible, valid links
   - Prints each one using `formatLinkDisplay`

Run with: `npx tsx exercises/modules.ts`

---

📖 **Deep dive:**

- [TypeScript Handbook — Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [MDN — import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN — export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
