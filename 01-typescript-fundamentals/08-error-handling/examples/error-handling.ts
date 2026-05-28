// error-handling.ts — Run with: npx tsx examples/error-handling.ts

// Basic try/catch
function divide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    throw new Error("Cannot divide by zero")
  }
  return numerator / denominator
}

try {
  const result = divide(10, 0)
  console.log(`Result: ${result}`)
} catch (caughtError: unknown) {
  if (caughtError instanceof Error) {
    console.log(`Error: ${caughtError.message}`)
  } else {
    console.log("Unknown error occurred")
  }
}

// Custom error type
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

// Function that can throw different error types
function parseLinkUrl(input: string): { title: string; url: string } {
  if (input === "") {
    throw new Error("URL cannot be empty")
  }

  if (!input.startsWith("http://") && !input.startsWith("https://")) {
    throw new ValidationError("url", "URL must start with http:// or https://")
  }

  const parsedUrl = new URL(input)
  return { title: parsedUrl.hostname, url: input }
}

// Safe wrapper — catches errors and returns a string
function safeParseLink(input: string): string {
  try {
    const result = parseLinkUrl(input)
    return `✅ ${result.title} → ${result.url}`
  } catch (caughtError: unknown) {
    if (caughtError instanceof ValidationError) {
      return `❌ Validation error on "${caughtError.field}": ${caughtError.message}`
    }
    if (caughtError instanceof Error) {
      return `❌ Error: ${caughtError.message}`
    }
    return "❌ Unknown error"
  }
}

// Async error handling
async function fetchUserData(username: string): Promise<void> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const userData = await response.json()
    console.log(`\n✅ ${userData.login} — ${userData.public_repos} repos`)
  } catch (caughtError: unknown) {
    if (caughtError instanceof Error) {
      console.log(`\n❌ Failed to fetch ${username}: ${caughtError.message}`)
    }
  }
}

// Run everything
async function main(): Promise<void> {
  const testInputs = ["https://github.com", "", "not-a-url"]
  for (let index = 0; index < testInputs.length; index++) {
    const input = testInputs[index] || "(empty)"
    console.log(`\nInput: "${input}"`)
    console.log(safeParseLink(testInputs[index]))
  }

  await fetchUserData("octocat")
  await fetchUserData("this-user-definitely-does-not-exist-xyz-123")
}

main()
