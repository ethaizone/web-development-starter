// Solution: profile-card.ts
// Run with: npx tsx exercises/solutions/profile-card.ts

const username: string = "alice_dev"
const followersCount: number = 1200
const isVerified: boolean = true

// Bonus: union type with string literal types
let status: "online" | "away" | "offline" = "online"
status = "away"

const verifiedBadge = isVerified ? "✓ Verified" : "Not verified"
console.log(`@${username} | Followers: ${followersCount} | ${verifiedBadge} | Status: ${status}`)
