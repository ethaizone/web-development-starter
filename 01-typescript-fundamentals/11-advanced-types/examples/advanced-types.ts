// advanced-types.ts — Run with: npx tsx examples/advanced-types.ts

// === Generics ===

function getFirstElement<T>(items: T[]): T | undefined {
  return items[0]
}

const firstString = getFirstElement(["a", "b", "c"])
const firstNumber = getFirstElement([1, 2, 3])
console.log(`First string: ${firstString}`)
console.log(`First number: ${firstNumber}`)

// Generic with constraint
type HasId = { id: string }

function findById<T extends HasId>(items: T[], targetId: string): T | undefined {
  return items.find((item) => item.id === targetId)
}

type Link = { id: string; title: string; url: string }
const links: Link[] = [
  { id: "l1", title: "GitHub", url: "https://github.com" },
  { id: "l2", title: "Blog", url: "https://alice.dev" },
]

const foundLink = findById(links, "l2")
console.log(`Found: ${foundLink?.title}`)

// === Utility Types ===

type User = {
  name: string
  email: string
  age: number
}

// Partial — all properties optional
function updateUser(currentUser: User, updates: Partial<User>): User {
  return { ...currentUser, ...updates }
}

const originalUser: User = { name: "Alice", email: "alice@dev.bio", age: 25 }
const updatedUser = updateUser(originalUser, { age: 26 })
console.log(`Updated age: ${updatedUser.age}`)

// Pick — select specific properties
type UserPreview = Pick<User, "name" | "email">
const preview: UserPreview = { name: "Alice", email: "alice@dev.bio" }
console.log(`Preview: ${preview.name} (${preview.email})`)

// Omit — exclude specific properties
type UserWithoutAge = Omit<User, "age">
const publicUser: UserWithoutAge = { name: "Alice", email: "alice@dev.bio" }
console.log(`Public: ${publicUser.name}`)

// ReturnType — derive type from function
function getDefaultSettings() {
  return { theme: "dark", language: "en", notifications: true }
}

type Settings = ReturnType<typeof getDefaultSettings>
const userSettings: Settings = { theme: "light", language: "th", notifications: false }
console.log(`Settings: ${userSettings.theme}, ${userSettings.language}`)

// === Type Guards ===

function processValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

console.log(processValue("hello"))    // "HELLO"
console.log(processValue(3.14159))    // "3.14"

// === Discriminated Unions ===

type LoadingState = { status: "loading" }
type SuccessState = { status: "success"; data: string[] }
type ErrorState = { status: "error"; message: string }
type ApiState = LoadingState | SuccessState | ErrorState

function renderState(state: ApiState): string {
  switch (state.status) {
    case "loading":
      return "⏳ Loading..."
    case "success":
      return `✅ Got ${state.data.length} items: ${state.data.join(", ")}`
    case "error":
      return `❌ ${state.message}`
  }
}

const states: ApiState[] = [
  { status: "loading" },
  { status: "success", data: ["GitHub", "Blog"] },
  { status: "error", message: "Network failure" },
]

for (let index = 0; index < states.length; index++) {
  console.log(renderState(states[index]))
}
