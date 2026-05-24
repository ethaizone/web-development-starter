// Solution: main.ts — matches the file students create at exercises/src/main.ts
// Run from exercises/ folder: npx tsx src/main.ts

import { nanoid } from "nanoid"

type ProfileLink = {
  id: string
  title: string
  url: string
  order: number
}

const createLink = (title: string, url: string, order: number): ProfileLink => {
  return {
    id: nanoid(10),
    title,
    url,
    order,
  }
}

const links: ProfileLink[] = [
  createLink("GitHub", "https://github.com/alice", 1),
  createLink("Blog", "https://alice.dev", 2),
  createLink("Portfolio", "https://alice.design", 3),
]

console.log("Generated links:\n")
for (let index = 0; index < links.length; index++) {
  const link = links[index]
  console.log(`  ${link.order}. [${link.id}] ${link.title} → ${link.url}`)
}
