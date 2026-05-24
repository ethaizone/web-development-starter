# Module 04: Control Flow

## What you'll learn
Make your code decide what to do and repeat actions.

## Key concepts

### `if / else if / else`

```ts
function getDiscountLevel(tier: string): number {
  if (tier === "gold") {
    return 20
  } else if (tier === "silver") {
    return 10
  } else {
    return 0
  }
}
```

Use `===` (strict equality) — never `==`. The double-equals performs type coercion (`"1" == 1` is true), which leads to bugs.

### Ternary operator

Short form for simple if/else. Use it for assignments, not for complex logic.

```ts
const discount = tier === "gold" ? 20 : 0
const label = isActive ? "Active" : "Inactive"
```

### `switch`

Useful when checking one value against many options. Cleaner than long `if/else if` chains.

```ts
function getRoleLabel(role: string): string {
  switch (role) {
    case "admin":
      return "Administrator"
    case "moderator":
      return "Moderator"
    case "member":
      return "Member"
    default:
      return "Unknown"
  }
}
```

### `for` loop

Use when you know how many times to repeat.

```ts
const links = ["GitHub", "Blog", "Portfolio"]

for (let index = 0; index < links.length; index++) {
  console.log(`${index + 1}. ${links[index]}`)
}
// Output:
// 1. GitHub
// 2. Blog
// 3. Portfolio
```

### `while` loop

Use when you don't know how many iterations. The condition is checked before each run.

```ts
let remainingAttempts = 3

while (remainingAttempts > 0) {
  console.log(`Attempts left: ${remainingAttempts}`)
  remainingAttempts = remainingAttempts - 1
}
```

⚠️ Always make sure the condition will eventually become `false`, or you get an infinite loop.

### `break` and `continue`

```ts
// break — exit the loop entirely
for (let number = 0; number < 10; number++) {
  if (number === 5) {
    break        // stops at 5
  }
  console.log(number)   // prints 0, 1, 2, 3, 4
}

// continue — skip this iteration, move to the next
for (let number = 0; number < 5; number++) {
  if (number === 2) {
    continue     // skips 2
  }
  console.log(number)   // prints 0, 1, 3, 4
}
```

### Comparison operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `===` | Strict equal | `"a" === "a"` → `true` |
| `!==` | Strict not equal | `"a" !== "b"` → `true` |
| `>` | Greater than | `5 > 3` → `true` |
| `<` | Less than | `3 < 5` → `true` |
| `>=` | Greater or equal | `5 >= 5` → `true` |
| `<=` | Less or equal | `3 <= 5` → `true` |

### Logical operators

```ts
const isAdmin = true
const isActive = false

// AND — both must be true
isAdmin && isActive        // false

// OR — at least one must be true
isAdmin || isActive        // true

// NOT — flips the value
!isActive                  // true
```

## Commands you'll use

| Command | Purpose |
|---------|---------|
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Pattern | When to use |
|---------|------------|
| `if/else` | Two-way decisions |
| `if/else if/else` | Multiple conditions |
| `switch` | One value, many possible matches |
| Ternary `? :` | Simple value assignment based on condition |
| `for` | Known number of iterations |
| `while` | Unknown number of iterations |

## Now build it

Create `control-flow.ts` and write:

1. A function `classifyScore(score: number): string` that returns:
   - "Excellent" for 90+
   - "Good" for 70-89
   - "Fair" for 50-69
   - "Fail" for below 50
2. A function `findFirstAdmin(roles: string[]): number` that loops through an array of role strings and returns the **index** of the first `"admin"`. Return `-1` if not found. Don't use array methods — use a `for` loop.
3. Test both functions with different inputs.

---
📖 **Deep dive:**
- [MDN — Control flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [MDN — Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)
