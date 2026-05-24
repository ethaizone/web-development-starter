// Exercise: Build a type-safe link operation system
// Run with: npx tsx exercises/link-operations.ts
//
// You're building the operation handler for DevStack Bio's link manager.
//
// TODO:
//
// 1. Define a generic function:
//    `findByProperty<T>(items: T[], predicate: (item: T) => boolean): T | undefined`
//    It takes an array and a predicate function, returns the first match or undefined
//
// 2. Define a discriminated union `LinkOperation`:
//    - { type: "create", title: string, url: string }
//    - { type: "update", id: string, changes: Partial<LinkUpdateFields> }
//    - { type: "delete", id: string }
//
//    Where LinkUpdateFields = { title: string; url: string; isVisible: boolean }
//
// 3. Write `describeOperation(operation: LinkOperation): string`:
//    - "create" → "Create link: {title} at {url}"
//    - "update" → "Update link {id}: {list changed fields}"
//    - "delete" → "Delete link {id}"
//
// 4. Create an array of LinkOperation objects (at least one of each type)
//    Loop through and print the description for each
//
// Bonus: Write a generic function `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]`
//    that extracts one property from each item in an array.
//    Example: pluck([{name: "A"}, {name: "B"}], "name") → ["A", "B"]
