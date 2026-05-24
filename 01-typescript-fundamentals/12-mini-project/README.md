# Module 12 — Mini Project: DevStack Bio CLI

## What you'll learn

Build a complete CLI tool that uses everything from modules 02–11: types, functions, control flow, arrays, async, error handling, modules, and npm packages.

## Key Concepts

### Putting it all together

A real project combines every concept you've learned:

| Module | Used in this project |
|--------|---------------------|
| 02 — Variables & Types | Typed variables for profile data |
| 03 — Functions | Helper functions for formatting, validation |
| 04 — Control Flow | Menu loop, input validation |
| 05 — Arrays & Objects | Profile arrays, link management |
| 06 — Interfaces & Types | `DeveloperProfile`, `ProfileLink` types |
| 07 — Async Basics | Fetching GitHub user data |
| 08 — Error Handling | Network errors, invalid input |
| 09 — Modules | Code split across multiple files |
| 10 — NPM Basics | `nanoid` for unique IDs |
| 11 — Advanced Types | Discriminated unions for link categories |

### Project structure

After setup, your project will look like this:

```
12-mini-project/
├── package.json
├── src/
│   ├── main.ts          ← Entry point: menu loop
│   ├── types.ts         ← Type definitions
│   ├── profile.ts       ← Profile CRUD functions
│   ├── github.ts        ← Fetch GitHub user data
│   └── storage.ts       ← Save/load profiles from JSON file
└── README.md            ← You are here
```

### The readline module

Node.js includes a built-in `readline` module for reading user input from the terminal:

```ts
import * as readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question("What is your name? ", (answer: string) => {
  console.log(`Hello, ${answer}!`)
  rl.close()
})
```

We'll wrap this in a helper to use it with `async/await`.

## Now Build It

### Step 1: Set up the project

```bash
cd 01-typescript-fundamentals/12-mini-project
npm init -y
npm install nanoid
```

Create the `src/` folder:

```bash
mkdir src
```

### Step 2: Define types

Create `src/types.ts`:

```ts
export type LinkId = string
export type ProfileId = string

export type LinkCategory = "social" | "portfolio" | "blog" | "other"

export type ProfileLink = {
  id: LinkId
  title: string
  url: string
  category: LinkCategory
}

export type DeveloperProfile = {
  id: ProfileId
  username: string
  displayName: string
  bio: string
  links: ProfileLink[]
  githubData: GitHubData | null
}

export type GitHubData = {
  username: string
  publicRepos: number
  followers: number
  avatarUrl: string
}
```

### Step 3: Create the profile manager

Create `src/profile.ts`:

```ts
import { nanoid } from "nanoid"
import type { DeveloperProfile, ProfileLink, LinkCategory, LinkId, ProfileId } from "./types"

export function createProfile(username: string, displayName: string, bio: string): DeveloperProfile {
  return {
    id: nanoid(10) as ProfileId,
    username,
    displayName,
    bio,
    links: [],
    githubData: null,
  }
}

export function addLink(profile: DeveloperProfile, title: string, url: string, category: LinkCategory): DeveloperProfile {
  const link: ProfileLink = {
    id: nanoid(8) as LinkId,
    title,
    url,
    category,
  }
  return {
    ...profile,
    links: [...profile.links, link],
  }
}

export function removeLink(profile: DeveloperProfile, linkId: LinkId): DeveloperProfile {
  return {
    ...profile,
    links: profile.links.filter((link) => link.id !== linkId),
  }
}

export function formatProfile(profile: DeveloperProfile): string {
  const lines: string[] = [
    `========================================`,
    `  ${profile.displayName} (@${profile.username})`,
    `  Bio: ${profile.bio}`,
    `  ID: ${profile.id}`,
    `========================================`,
    ``,
    `  Links (${profile.links.length}):`,
  ]

  if (profile.links.length === 0) {
    lines.push(`    (no links yet)`)
  } else {
    for (const link of profile.links) {
      lines.push(`    [${link.category}] ${link.title} — ${link.url}`)
    }
  }

  if (profile.githubData) {
    lines.push(``)
    lines.push(`  GitHub: @${profile.githubData.username}`)
    lines.push(`    Repos: ${profile.githubData.publicRepos} | Followers: ${profile.githubData.followers}`)
  }

  lines.push(`========================================`)
  return lines.join("\n")
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidUsername(username: string): boolean {
  return username.length >= 2 && username.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(username)
}
```

### Step 4: Create the GitHub fetcher

Create `src/github.ts`:

```ts
import type { GitHubData } from "./types"

const GITHUB_API = "https://api.github.com/users"

export async function fetchGitHubUser(username: string): Promise<GitHubData> {
  const response = await fetch(`${GITHUB_API}/${username}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" not found`)
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as {
    login: string
    public_repos: number
    followers: number
    avatar_url: string
  }

  return {
    username: data.login,
    publicRepos: data.public_repos,
    followers: data.followers,
    avatarUrl: data.avatar_url,
  }
}
```

### Step 5: Create the storage module

Create `src/storage.ts`:

```ts
import * as fs from "fs"
import * as path from "path"
import type { DeveloperProfile } from "./types"

const DATA_FILE = path.join(__dirname, "..", "profiles.json")

export function saveProfiles(profiles: DeveloperProfile[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2), "utf-8")
}

export function loadProfiles(): DeveloperProfile[] {
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  return JSON.parse(raw) as DeveloperProfile[]
}
```

### Step 6: Build the main CLI

Create `src/main.ts`:

```ts
import * as readline from "readline"
import type { DeveloperProfile, LinkCategory } from "./types"
import { createProfile, addLink, removeLink, formatProfile, isValidUrl, isValidUsername } from "./profile"
import { fetchGitHubUser } from "./github"
import { saveProfiles, loadProfiles } from "./storage"

// --- Async readline helper ---

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

// --- State ---

let profiles: DeveloperProfile[] = loadProfiles()

// --- Menu actions ---

async function createNewProfile(): Promise<void> {
  const username = await ask("Username: ")
  if (!isValidUsername(username)) {
    console.log("Invalid username. Use 2-30 characters: letters, numbers, _ or -")
    return
  }

  const existing = profiles.find((p) => p.username === username)
  if (existing) {
    console.log(`Profile "@${username}" already exists!`)
    return
  }

  const displayName = await ask("Display name: ")
  const bio = await ask("Bio: ")

  const profile = createProfile(username, displayName, bio)
  profiles.push(profile)
  saveProfiles(profiles)

  console.log(`\nProfile created for @${username}!`)
}

async function addLinkToProfile(): Promise<void> {
  if (profiles.length === 0) {
    console.log("No profiles yet. Create one first.")
    return
  }

  const username = await ask("Profile username: ")
  const profile = profiles.find((p) => p.username === username)
  if (!profile) {
    console.log(`Profile "@${username}" not found.`)
    return
  }

  const title = await ask("Link title: ")
  const url = await ask("Link URL: ")
  if (!isValidUrl(url)) {
    console.log("Invalid URL. Must start with http:// or https://")
    return
  }

  console.log("Categories: social, portfolio, blog, other")
  const categoryInput = await ask("Category: ")
  const validCategories: LinkCategory[] = ["social", "portfolio", "blog", "other"]
  const category = validCategories.find(
    (c) => c === categoryInput.toLowerCase()
  )
  if (!category) {
    console.log("Invalid category. Use: social, portfolio, blog, or other")
    return
  }

  const updated = addLink(profile, title, url, category)
  profiles = profiles.map((p) => (p.id === updated.id ? updated : p))
  saveProfiles(profiles)

  console.log(`Link "${title}" added to @${username}!`)
}

async function fetchGitHub(): Promise<void> {
  if (profiles.length === 0) {
    console.log("No profiles yet. Create one first.")
    return
  }

  const username = await ask("Profile username: ")
  const profile = profiles.find((p) => p.username === username)
  if (!profile) {
    console.log(`Profile "@${username}" not found.`)
    return
  }

  const githubUser = await ask("GitHub username: ")
  console.log(`Fetching GitHub profile for @${githubUser}...`)

  try {
    const githubData = await fetchGitHubUser(githubUser)
    const updated: DeveloperProfile = { ...profile, githubData }
    profiles = profiles.map((p) => (p.id === updated.id ? updated : p))
    saveProfiles(profiles)

    console.log(`GitHub data loaded: ${githubData.publicRepos} repos, ${githubData.followers} followers`)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.log(`Error: ${message}`)
  }
}

function viewAllProfiles(): void {
  if (profiles.length === 0) {
    console.log("No profiles yet. Create one first.")
    return
  }

  for (const profile of profiles) {
    console.log(formatProfile(profile))
    console.log("")
  }
}

// --- Main loop ---

function printMenu(): void {
  console.log("")
  console.log("=== DevStack Bio CLI ===")
  console.log("1. Create new profile")
  console.log("2. Add link to profile")
  console.log("3. Fetch GitHub data")
  console.log("4. View all profiles")
  console.log("5. Exit")
  console.log("")
}

async function main(): Promise<void> {
  console.log("Welcome to DevStack Bio CLI!")
  console.log(`Loaded ${profiles.length} profile(s) from storage.`)

  let running = true
  while (running) {
    printMenu()
    const choice = await ask("Choose an option (1-5): ")

    switch (choice) {
      case "1":
        await createNewProfile()
        break
      case "2":
        await addLinkToProfile()
        break
      case "3":
        await fetchGitHub()
        break
      case "4":
        viewAllProfiles()
        break
      case "5":
        running = false
        console.log("Goodbye!")
        break
      default:
        console.log("Invalid option. Choose 1-5.")
    }
  }
}

main()
```

### Step 7: Run it

```bash
tsx src/main.ts
```

Try this flow:

1. Choose **1** → Create a profile for yourself
2. Choose **2** → Add a link (e.g., your GitHub URL, category: "social")
3. Choose **3** → Fetch your GitHub data
4. Choose **4** → View your complete profile
5. Choose **5** → Exit

Run it again — your profiles are saved to `profiles.json` and loaded on startup.

### Step 8: Commit

```bash
git add .
git commit -m "Build DevStack Bio CLI: mini project using types, async, modules, and npm"
```

## Concepts Used

| Concept | Where |
|---------|-------|
| Variables & types | Every file — typed variables, `string`, `number`, `null` |
| Functions | `createProfile()`, `addLink()`, `formatProfile()`, `fetchGitHubUser()` |
| Control flow | `switch` menu, `if/else` validation, `for...of` loop |
| Arrays | `profiles.filter()`, `profiles.find()`, `profiles.map()`, spread `[...arr]` |
| Interfaces & types | `DeveloperProfile`, `ProfileLink`, `GitHubData`, `LinkCategory` |
| Async/await | `fetchGitHubUser()`, `ask()` (Promise wrapper for readline) |
| Error handling | `try/catch` for GitHub API, `try/catch` for URL validation |
| Modules | `import/export` across 5 files |
| NPM | `nanoid` for generating unique IDs |
| Advanced types | `LinkCategory` union type |

## Extra Challenges

Want to go further? Try these:

- **Remove link**: Add menu option 6 to remove a link by ID
- **Search profiles**: Add a function to search profiles by display name
- **Link stats**: Count links by category and display a summary
- **Import/export**: Export profiles as a Markdown file instead of JSON
- **Validate on load**: When loading `profiles.json`, validate the data matches your types

## Deep Dive

- [Node.js — readline module](https://nodejs.org/api/readline.html)
- [Node.js — fs module](https://nodejs.org/api/fs.html)
- [GitHub REST API — Users](https://docs.github.com/en/rest/users/users)
- [nanoid on npm](https://www.npmjs.com/package/nanoid)

---

**Congratulations!** You've completed the TypeScript Fundamentals track. You can now:

- Write TypeScript with confidence
- Structure code across multiple files
- Use npm packages
- Handle async operations and errors
- Build a complete CLI application

**Next:** [Web Development Track](../../02-web-development/01-how-the-web-works/) → Build a real web application with TanStack Start.
