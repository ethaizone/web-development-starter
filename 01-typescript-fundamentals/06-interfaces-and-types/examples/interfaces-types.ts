// interfaces-types.ts — Run with: npx tsx examples/interfaces-types.ts

// Custom types for our data model
type Profile = {
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
}

type Link = {
  title: string
  url: string
  order: number
  isVisible: boolean
}

type Role = "admin" | "member"

type User = {
  email: string
  role: Role
  profile: Profile
  links: Link[]
}

// Create a user
const aliceUser: User = {
  email: "alice@example.com",
  role: "admin",
  profile: {
    username: "alice_dev",
    displayName: "Alice",
    bio: "Full-stack developer",
    avatarUrl: "https://example.com/alice.jpg",
  },
  links: [
    { title: "GitHub", url: "https://github.com/alice", order: 1, isVisible: true },
    { title: "Secret Project", url: "https://secret.dev", order: 2, isVisible: false },
    { title: "Blog", url: "https://alice.dev", order: 3, isVisible: true },
  ],
}

// Filter visible links
const getVisibleLinks = (user: User): Link[] => {
  return user.links.filter((link) => link.isVisible)
}

console.log(`User: ${aliceUser.profile.displayName} (@${aliceUser.profile.username})`)
console.log(`Role: ${aliceUser.role}`)
console.log(`Bio: ${aliceUser.profile.bio ?? "No bio set"}`)

const visibleLinks = getVisibleLinks(aliceUser)
console.log(`\nVisible links (${visibleLinks.length}):`)
for (let index = 0; index < visibleLinks.length; index++) {
  const link = visibleLinks[index]
  console.log(`  ${link.order}. ${link.title} → ${link.url}`)
}

// Record — object as a map
const linkClickCounts: Record<string, number> = {
  "github.com": 150,
  "alice.dev": 89,
}

console.log(`\nClick counts:`)
const domains = Object.keys(linkClickCounts)
for (let index = 0; index < domains.length; index++) {
  const domain = domains[index]
  console.log(`  ${domain}: ${linkClickCounts[domain]} clicks`)
}

// Union type with string literals
type Status = "active" | "inactive" | "suspended"

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case "active":
      return "✅ Active"
    case "inactive":
      return "💤 Inactive"
    case "suspended":
      return "🚫 Suspended"
  }
}

console.log(`\nAccount status: ${getStatusLabel("active")}`)
