// arrays-objects.ts — Run with: npx tsx examples/arrays-objects.ts

// Array basics
const skills: string[] = ["TypeScript", "React", "Node.js", "SQLite"]
console.log("Skills:", skills)
console.log("First skill:", skills[0])
console.log("Count:", skills.length)

// map — transform each item
const upperCaseSkills = skills.map((skill) => skill.toUpperCase())
console.log("Uppercase:", upperCaseSkills)

// filter — keep items that match
const shortSkills = skills.filter((skill) => skill.length <= 4)
console.log("Short names:", shortSkills)

// find — first match
const longSkill = skills.find((skill) => skill.length > 6)
console.log("First long skill:", longSkill)

// some / every
const hasReact = skills.some((skill) => skill === "React")
const allLong = skills.every((skill) => skill.length > 3)
console.log("Has React?", hasReact)
console.log("All longer than 3 chars?", allLong)

// reduce — combine into one value
const totalCharacters = skills.reduce((total, skill) => total + skill.length, 0)
console.log("Total characters across all skills:", totalCharacters)

// Array of objects — the most common pattern
const links = [
  { title: "GitHub", url: "https://github.com/alice", category: "code" },
  { title: "Dev Blog", url: "https://alice.dev", category: "writing" },
  { title: "Portfolio", url: "https://alice.design", category: "code" },
  { title: "Twitter", url: "https://x.com/alice", category: "social" },
]

// Get all URLs
const allUrls = links.map((link) => link.url)
console.log("All URLs:", allUrls)

// Filter by category
const codeLinks = links.filter((link) => link.category === "code")
console.log("Code links:", codeLinks.map((link) => link.title))

// Sort alphabetically by title (spread first to avoid mutation)
const sortedLinks = [...links].sort((firstLink, secondLink) => {
  return firstLink.title.localeCompare(secondLink.title)
})
console.log("Sorted:", sortedLinks.map((link) => link.title))

// Object basics
const profile = {
  username: "alice_dev",
  displayName: "Alice",
  followerCount: 1200,
  isVerified: true,
}

console.log(`${profile.displayName} (@${profile.username}) — ${profile.followerCount} followers`)
