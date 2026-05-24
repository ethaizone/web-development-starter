// npm-basics.ts — Run with: npx tsx examples/npm-basics.ts
// After running `npm install nanoid` in the 10-npm-basics folder

import { nanoid } from "nanoid"

// Default: 21-character random ID
const defaultId = nanoid()
console.log(`Default ID: ${defaultId}`)
console.log(`Length: ${defaultId.length}`)

// Custom length
const shortId = nanoid(8)
console.log(`Short ID (8 chars): ${shortId}`)

// Practical use: generating IDs for links
type Link = {
  id: string
  title: string
  url: string
}

const newLink: Link = {
  id: nanoid(10),
  title: "GitHub",
  url: "https://github.com/alice",
}

console.log(`\nNew link created:`)
console.log(`  ID: ${newLink.id}`)
console.log(`  Title: ${newLink.title}`)
console.log(`  URL: ${newLink.url}`)

// Generate multiple IDs
console.log(`\n5 unique link IDs:`)
for (let index = 0; index < 5; index++) {
  console.log(`  ${index + 1}. ${nanoid(10)}`)
}
