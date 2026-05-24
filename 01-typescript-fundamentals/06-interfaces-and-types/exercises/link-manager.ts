// Exercise: Build a link manager
// Run with: npx tsx exercises/link-manager.ts
//
// You're building the type system for DevStack Bio's link management.
//
// TODO: Define these types and functions:
//
// 1. Define a type `LinkCategory` that can only be "social", "code", "writing", or "other"
//
// 2. Define a type `ProfileLink` with:
//    - id: string
//    - title: string
//    - url: string
//    - category: LinkCategory
//    - order: number
//    - clickCount: number
//
// 3. Define a type `DevProfile` with:
//    - username: string
//    - displayName: string
//    - links: ProfileLink[]
//
// 4. Write function `sortByOrder(links: ProfileLink[]): ProfileLink[]`
//    Return links sorted by the `order` field (ascending). Use [...links].sort()
//
// 5. Write function `getMostPopularLink(profile: DevProfile): ProfileLink | undefined`
//    Return the link with the highest clickCount. Return undefined if no links exist.
//    Hint: use reduce, but handle the empty array case
//
// 6. Write function `categorizeLinks(links: ProfileLink[]): Record<string, number>`
//    Return an object where keys are categories and values are how many links in that category
//    Example: { social: 2, code: 1 }
//    Hint: loop through links, for each one add to the record
//
// Create a DevProfile with 4+ links across different categories.
// Call all functions and print results.
