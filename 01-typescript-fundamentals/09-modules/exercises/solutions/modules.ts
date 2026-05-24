// Solution: modules.ts — Run with: npx tsx exercises/solutions/modules.ts
import { formatLinkDisplay, isValidUrl } from "./link-helpers.ts"
import type { ProfileLink } from "./link-types.ts"

const links: ProfileLink[] = [
  { title: "GitHub", url: "https://github.com/alice", category: "code", isVisible: true },
  { title: "Twitter", url: "https://x.com/alice", category: "social", isVisible: true },
  { title: "Secret Project", url: "ftp://bad.com", category: "other", isVisible: true },
  { title: "Dev Blog", url: "https://alice.dev", category: "writing", isVisible: false },
  { title: "Portfolio", url: "https://alice.design", category: "code", isVisible: true },
]

// Filter to visible + valid
const validLinks = links.filter((link) => link.isVisible && isValidUrl(link.url))

// Group by category
const groupedByCategory: Record<string, ProfileLink[]> = {}

for (let index = 0; index < validLinks.length; index++) {
  const link = validLinks[index]
  if (groupedByCategory[link.category] === undefined) {
    groupedByCategory[link.category] = []
  }
  groupedByCategory[link.category].push(link)
}

// Print grouped results
const categories = Object.keys(groupedByCategory)
for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
  const category = categories[categoryIndex]
  const categoryLinks = groupedByCategory[category]
  console.log(`\n${category.toUpperCase()} (${categoryLinks.length}):`)
  for (let linkIndex = 0; linkIndex < categoryLinks.length; linkIndex++) {
    console.log(`  ${formatLinkDisplay(categoryLinks[linkIndex].title, categoryLinks[linkIndex].url)}`)
  }
}
