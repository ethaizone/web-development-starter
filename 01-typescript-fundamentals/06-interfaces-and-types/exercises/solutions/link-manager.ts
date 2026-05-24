// Solution: link-manager.ts
// Run with: npx tsx exercises/solutions/link-manager.ts

type LinkCategory = "social" | "code" | "writing" | "other"

type ProfileLink = {
  id: string
  title: string
  url: string
  category: LinkCategory
  order: number
  clickCount: number
}

type DevProfile = {
  username: string
  displayName: string
  links: ProfileLink[]
}

const sortByOrder = (links: ProfileLink[]): ProfileLink[] => {
  return [...links].sort((firstLink, secondLink) => firstLink.order - secondLink.order)
}

const getMostPopularLink = (profile: DevProfile): ProfileLink | undefined => {
  if (profile.links.length === 0) {
    return undefined
  }

  return profile.links.reduce((currentTop, link) => {
    if (link.clickCount > currentTop.clickCount) {
      return link
    }
    return currentTop
  })
}

const categorizeLinks = (links: ProfileLink[]): Record<string, number> => {
  const categoryCounts: Record<string, number> = {}

  for (let index = 0; index < links.length; index++) {
    const link = links[index]
    if (categoryCounts[link.category] === undefined) {
      categoryCounts[link.category] = 0
    }
    categoryCounts[link.category] = categoryCounts[link.category] + 1
  }

  return categoryCounts
}

// Test data
const profile: DevProfile = {
  username: "alice_dev",
  displayName: "Alice",
  links: [
    { id: "l1", title: "GitHub", url: "https://github.com/alice", category: "code", order: 2, clickCount: 150 },
    { id: "l2", title: "Twitter", url: "https://x.com/alice", category: "social", order: 1, clickCount: 89 },
    { id: "l3", title: "Dev Blog", url: "https://alice.dev", category: "writing", order: 3, clickCount: 234 },
    { id: "l4", title: "LinkedIn", url: "https://linkedin.com/in/alice", category: "social", order: 4, clickCount: 45 },
  ],
}

console.log("Sorted by order:")
const sorted = sortByOrder(profile.links)
for (let index = 0; index < sorted.length; index++) {
  console.log(`  ${sorted[index].order}. ${sorted[index].title}`)
}

const popularLink = getMostPopularLink(profile)
console.log(`\nMost popular: ${popularLink?.title} (${popularLink?.clickCount} clicks)`)

console.log(`\nCategory counts:`, categorizeLinks(profile.links))
