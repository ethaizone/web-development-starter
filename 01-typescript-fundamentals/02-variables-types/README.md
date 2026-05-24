# Module 02: Variables & Types

## What you'll learn
Store data in variables and tell TypeScript what kind of data to expect.

## Key concepts

### `const` vs `let`

Use `const` by default. Only use `let` when you need to reassign.

```ts
const name = "Alice"   // cannot be reassigned
let score = 0          // can be reassigned later
score = 10             // OK
```

Never use `var`. It has confusing scoping rules that TypeScript avoids entirely.

### Type annotations

TypeScript can infer types automatically. You add annotations when inference isn't clear enough.

```ts
// Inference — TypeScript figures it out
const message = "hello"       // TypeScript knows this is string
const count = 42              // TypeScript knows this is number

// Annotation — you tell TypeScript explicitly
const message: string = "hello"
const count: number = 42
const isActive: boolean = true
```

Rule of thumb: if the value is right there (a literal), TypeScript infers the type. Use annotations for function parameters and when the type isn't obvious from context.

### Primitive types

```ts
const text: string = "hello"
const num: number = 42
const active: boolean = true
const empty: null = null
const unknown: undefined = undefined
```

| Type | What it holds | Example |
|------|--------------|---------|
| `string` | Text | `"hello"`, `'world'`, `` `template` `` |
| `number` | Any number (integer or decimal) | `42`, `3.14`, `-1` |
| `boolean` | True or false | `true`, `false` |
| `null` | Intentional absence of value | `null` |
| `undefined` | Value not yet assigned | `undefined` |

### `string` operations

```ts
const firstName = "Alice"
const lastName = "Smith"

// Concatenation
const fullName = firstName + " " + lastName         // "Alice Smith"

// Template literals (backticks)
const greeting = `Hello, ${firstName}!`              // "Hello, Alice!"

// Useful string methods
firstName.toUpperCase()                               // "ALICE"
firstName.length                                      // 5
const input = "  hello  "
input.trim()                                          // "hello"
```

### `number` operations

```ts
const a = 10
const b = 3

a + b       // 13   addition
a - b       // 7    subtraction
a * b       // 30   multiplication
a / b       // 3.333...  division (always returns decimal)
Math.floor(a / b)  // 3    integer division
a % b       // 1    remainder (modulo)
```

### Union types

A variable can hold more than one type.

```ts
let id: string | number
id = "abc-123"   // OK
id = 42          // OK
```

## Commands you'll use

| Command | Purpose |
|---------|---------|
| `npx tsx file.ts` | Run a TypeScript file |
| `npx tsx file.ts` with watch | No built-in watch — re-run after each change |

## Common patterns

| Pattern | When to use |
|---------|------------|
| `const` with literal value | Default choice for variables that don't change |
| `let` when reassigning | Counters, accumulators, values that update |
| Type annotation on parameter | Functions (covered in Module 03) |
| Union type `A \| B` | When a value can be more than one type |

## Now build it

Create a file called `variables.ts` and declare variables about yourself:

1. Your name (`const`, `string`)
2. Your age (`const`, `number`)
3. Whether you're learning TypeScript (`const`, `boolean`)
4. A favorite hobby that might change later (`let`, `string`)
5. Print them all using template literals: `"My name is Alice, I am 25 years old."`
6. Change your hobby and print again

Run with: `npx tsx variables.ts`

---
📖 **Deep dive:**
- [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [MDN — JavaScript data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
