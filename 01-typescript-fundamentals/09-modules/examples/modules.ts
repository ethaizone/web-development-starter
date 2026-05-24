// modules.ts — Run with: npx tsx examples/modules.ts
// Demonstrates importing from multiple files

import { formatLinkDisplay, isValidUrl } from "./link-helpers.ts"
import type { ProfileLink } from "./link-types.ts"

// Create data using the imported type
const links: ProfileLink[] = [
  { title: "GitHub", url: "https://github.com/alice", isVisible: true },
  { title: "Secret", url: "ftp://bad-url.com", isVisible: true },
  { title: "Blog", url: "https://alice.dev", isVisible: false },
  { title: "Portfolio", url: "https://alice.design", isVisible: true },
]

// Use imported functions to process the data
const visibleValidLinks = links.filter((link) => {
  return link.isVisible && isValidUrl(link.url)
})

console.log(`Visible, valid links (${visibleValidLinks.length}):`)
for (let index = 0; index < visibleValidLinks.length; index++) {
  const link = visibleValidLinks[index]
  console.log(`  ${index + 1}. ${formatLinkDisplay(link.title, link.url)}`)
}

// Show which links were filtered out
const filteredOut = links.filter((link) => {
  return !link.isVisible || !isValidUrl(link.url)
})

console.log(`\nFiltered out (${filteredOut.length}):`)
for (let index = 0; index < filteredOut.length; index++) {
  const link = filteredOut[index]
  const reasons: string[] = []
  if (!link.isVisible) reasons.push("hidden")
  if (!isValidUrl(link.url)) reasons.push("invalid URL")
  console.log(`  ${link.title} — ${reasons.join(", ")}`)
}
