// Solution: link-operations.ts
// Run with: npx tsx exercises/solutions/link-operations.ts

// Generic findByProperty
const findByProperty = <T>(items: T[], predicate: (item: T) => boolean): T | undefined => {
  return items.find(predicate)
}

// Types for the link operation system
type LinkUpdateFields = {
  title: string
  url: string
  isVisible: boolean
}

type LinkOperation =
  | { type: "create"; title: string; url: string }
  | { type: "update"; id: string; changes: Partial<LinkUpdateFields> }
  | { type: "delete"; id: string }

// Describe an operation using discriminated union narrowing
const describeOperation = (operation: LinkOperation): string => {
  switch (operation.type) {
    case "create":
      return `Create link: ${operation.title} at ${operation.url}`
    case "update": {
      const changedFields = Object.keys(operation.changes).join(", ")
      return `Update link ${operation.id}: ${changedFields}`
    }
    case "delete":
      return `Delete link ${operation.id}`
  }
}

// Bonus: pluck
const pluck = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
  return items.map((item) => item[key])
}

// Tests
const operations: LinkOperation[] = [
  { type: "create", title: "GitHub", url: "https://github.com/alice" },
  { type: "update", id: "l2", changes: { title: "Updated Blog", isVisible: false } },
  { type: "delete", id: "l5" },
]

console.log("Operations:")
for (let index = 0; index < operations.length; index++) {
  console.log(`  ${index + 1}. ${describeOperation(operations[index])}`)
}

// Bonus test
type SimpleLink = { id: string; title: string }
const simpleLinks: SimpleLink[] = [
  { id: "l1", title: "GitHub" },
  { id: "l2", title: "Blog" },
]

const titles = pluck(simpleLinks, "title")
console.log(`\nPlucked titles: ${titles.join(", ")}`)

// Generic findByProperty test
type Item = { id: string; name: string }
const sampleItems: Item[] = [
  { id: "a1", name: "First" },
  { id: "a2", name: "Second" },
]

const foundItem = findByProperty(sampleItems, (item) => item.id === "a2")
console.log(`Found: ${foundItem?.name}`)
