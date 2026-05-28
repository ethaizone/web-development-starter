# Module 05: Arrays & Objects

## What you'll learn

Store collections of data and structured records.

## Key concepts

### Arrays — ordered lists

```ts
// Create an array
const skills: string[] = ["TypeScript", "React", "Node.js"];

// Access by index (starts at 0)
skills[0]; // "TypeScript"
skills[1]; // "React"

// Length
skills.length; // 3

// Add to the end
skills.push("SQLite");

// Remove from the end
skills.pop(); // returns "SQLite"
```

### Array methods — the ones you'll use most

These methods **return a new array** (or a single value). They don't modify the
original.

```ts
const numbers = [1, 2, 3, 4, 5];

// map — transform each item
const doubled = numbers.map((num) => num * 2);
// [2, 4, 6, 8, 10]

// filter — keep items that match
const evenNumbers = numbers.filter((num) => num % 2 === 0);
// [2, 4]

// find — first item that matches (or undefined)
const firstBigNumber = numbers.find((num) => num > 3);
// 4

// some — does ANY item match?
const hasNegativeNumber = numbers.some((num) => num < 0);
// false

// every — do ALL items match?
const allPositive = numbers.every((num) => num > 0);
// true

// includes — does the array contain this value?
numbers.includes(3); // true
numbers.includes(10); // false
```

### `reduce` — combine all items into one value

```ts
const prices = [10, 20, 30];

const total = prices.reduce((runningTotal, currentPrice) => {
  return runningTotal + currentPrice;
}, 0);
// 60
```

The `0` is the starting value. `reduce` is powerful but can be hard to read —
use `for` loops if they're clearer.

### Objects — structured data

```ts
const user = {
  name: "Alice",
  age: 25,
  isActive: true,
};

// Access properties
user.name; // "Alice"
user["age"]; // 25

// Modify a property — works even with `const` (const prevents reassignment, not mutation)
user.isActive = false;
```

### Object types

```ts
// Inline type annotation
function printUser(user: { name: string; age: number }): void {
  console.log(`${user.name} is ${user.age} years old`);
}
```

We'll cover `interface` and `type` for named object shapes in Module 06.

### Array of objects — the most common pattern

```ts
const links = [
  { title: "GitHub", url: "https://github.com/alice", order: 1 },
  { title: "Blog", url: "https://alice.dev", order: 2 },
  { title: "Portfolio", url: "https://alice.design", order: 3 },
];

// Find a link by title
const blogLink = links.find((link) => link.title === "Blog");
// { title: "Blog", url: "https://alice.dev", order: 2 }

// Get all URLs
const allUrls = links.map((link) => link.url);
// ["https://github.com/alice", "https://alice.dev", "https://alice.design"]

// Sort by order
const sortedLinks = [...links].sort((firstLink, secondLink) => {
  return firstLink.order - secondLink.order;
});
```

⚠️ `sort()` modifies the original array. Use `[...links]` (spread operator) to
create a copy first.

### Readonly arrays

When you want to prevent modifications:

```ts
const readonlySkills: readonly string[] = ["TypeScript", "React"] as const;
```

This is advanced — just know it exists. We'll revisit in Module 06.

## Commands you'll use

| Command           | Purpose               |
| ----------------- | --------------------- |
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Pattern             | When to use                                    |
| ------------------- | ---------------------------------------------- |
| `map`               | Transform each item in an array                |
| `filter`            | Keep only items that match a condition         |
| `find`              | Get the first matching item                    |
| `[...array].sort()` | Sort without modifying original                |
| Array of objects    | Lists of structured data (links, users, posts) |

## Practice

Try this on your own before tackling the formal exercise in `exercises/tech-stack-analyzer.ts`.
Create `practice-links.ts` in this module's folder and write:

1. An array of 5 tech links, each with `title`, `url`, and `category` properties
2. A function `filterByCategory(links, category)` that returns only links
   matching the category
3. A function `getTitles(links)` that returns an array of just the titles
4. A function `countByCategory(links, category)` that returns how many links are
   in that category (use `filter` + `length`)
5. Print the results

---

📖 **Deep dive:**

- [TypeScript Handbook — Everyday Types (Arrays)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
- [MDN — Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN — Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
