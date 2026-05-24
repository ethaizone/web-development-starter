// functions.ts — Run with: npx tsx examples/functions.ts

// Basic function with type annotations
function greet(name: string): string {
  return `Hello, ${name}!`
}

// Arrow function — same thing
const greetArrow = (name: string): string => `Hello, ${name}!`

console.log(greet("Alice"))        // "Hello, Alice!"
console.log(greetArrow("Bob"))     // "Hello, Bob!"

// Optional parameter
function formatGreeting(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`
  }
  return `Hello, ${name}!`
}

console.log(formatGreeting("Alice"))         // "Hello, Alice!"
console.log(formatGreeting("Alice", "Dr."))  // "Hello, Dr. Alice!"

// Default parameter
function createEmail(user: string, domain: string = "example.com"): string {
  return `${user}@${domain}`
}

console.log(createEmail("alice"))                  // "alice@example.com"
console.log(createEmail("alice", "devstack.bio"))  // "alice@devstack.bio"

// Void return — function does something but doesn't return a value
function logAction(action: string): void {
  console.log(`[${new Date().toISOString()}] ${action}`)
}

logAction("User logged in")

// Function as a value
function repeatAction(action: () => void, times: number): void {
  for (let iteration = 0; iteration < times; iteration++) {
    action()
  }
}

const cheer = (): void => console.log("🎉")
repeatAction(cheer, 3)
