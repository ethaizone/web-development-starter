import * as readline from "readline"
import type { DeveloperProfile, LinkCategory } from "./types"
import { createProfile, addLink, removeLink, formatProfile, isValidUrl, isValidUsername } from "./profile" // removeLink: used in Extra Challenges
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
