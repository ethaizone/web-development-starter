# Module 02: Variables & Types

## What you'll learn

Store data in variables and tell TypeScript what kind of data to expect.

## Key concepts

### `const` vs `let`

Use `const` by default. Only use `let` when you need to reassign.

```ts
const name = "Alice"; // cannot be reassigned
let score = 0; // can be reassigned later
score = 10; // OK
```

Never use `var`. It has confusing scoping rules that TypeScript avoids entirely.

### Type annotations

Why does this matter? TypeScript checks your code **before** it runs. If you
accidentally multiply a string by a number, TypeScript catches the error
immediately — instead of producing a confusing bug at runtime. Types are your
safety net.

TypeScript can infer types automatically. You add annotations when inference
isn't clear enough.

```ts
// Inference — TypeScript figures it out
const message = "hello"; // TypeScript knows this is string
const count = 42; // TypeScript knows this is number

// Annotation — you tell TypeScript explicitly
const greeting: string = "hello";
const total: number = 42;
const isActive: boolean = true;
```

Rule of thumb: if the value is right there (a literal), TypeScript infers the
type. Use annotations for function parameters and when the type isn't obvious
from context.

### Primitive types

```ts
const text: string = "hello";
const num: number = 42;
const active: boolean = true;
const empty: null = null;
const unknown: undefined = undefined;
```

| Type        | What it holds                   | Example                                |
| ----------- | ------------------------------- | -------------------------------------- |
| `string`    | Text                            | `"hello"`, `'world'`, `` `template` `` |
| `number`    | Any number (integer or decimal) | `42`, `3.14`, `-1`                     |
| `boolean`   | True or false                   | `true`, `false`                        |
| `null`      | Intentional absence of value    | `null`                                 |
| `undefined` | Value not yet assigned          | `undefined`                            |

### `string` operations

```ts
const firstName = "Alice";
const lastName = "Smith";

// Concatenation
const fullName = firstName + " " + lastName; // "Alice Smith"

// Template literals (backticks)
const greeting = `Hello, ${firstName}!`; // "Hello, Alice!"

// Useful string methods
firstName.toUpperCase(); // "ALICE"
firstName.length; // 5
const input = "  hello  ";
input.trim(); // "hello"
```

### `number` operations

```ts
const a = 10;
const b = 3;

a + b; // 13   addition
a - b; // 7    subtraction
a * b; // 30   multiplication
a / b; // 3.333...  division (always returns decimal)
Math.floor(a / b); // 3    integer division
a % b; // 1    remainder (modulo)
```

### Union types

A variable can hold more than one type.

```ts
let id: string | number;
id = "abc-123"; // OK
id = 42; // OK
```

## Commands you'll use

| Command                      | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `npx tsx file.ts`            | Run a TypeScript file                        |

Note: `tsx` has no built-in watch mode — re-run the command after each change.

## Common patterns

| Pattern                      | When to use                                    |
| ---------------------------- | ---------------------------------------------- |
| `const` with literal value   | Default choice for variables that don't change |
| `let` when reassigning       | Counters, accumulators, values that update     |
| Type annotation on parameter | Functions (covered in Module 03)               |
| Union type `A \| B`          | When a value can be more than one type         |

## What We Built

### `examples/variables.ts`

Variables with `const` and `let`, type annotations, string/number operations,
and union types.

Run with: `npx tsx examples/variables.ts`

### Exercise: `exercises/profile-card.ts`

Declare variables for a profile card and print it with template literals.
Solution: `exercises/solutions/profile-card.ts`.

Run with: `npx tsx exercises/profile-card.ts`

## Deep dive

- [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [MDN — JavaScript data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures)
