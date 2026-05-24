// Solution: profile-helper.ts
// Run with: npx tsx exercises/solutions/profile-helper.ts

const getInitials = (name: string): string => {
  const nameParts = name.split(" ")
  const firstInitial = nameParts[0][0]
  const lastInitial = nameParts[1][0]
  return `${firstInitial}.${lastInitial}.`
}

const maskEmail = (email: string, visibleCount: number = 2): string => {
  const [user, domain] = email.split("@")
  const visiblePart = user.slice(0, visibleCount)
  return `${visiblePart}***@${domain}`
}

const formatBio = (text: string, maxLength: number = 100): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..."
  }
  return text
}

// Tests
console.log(getInitials("Alice Smith"))        // "A.S."
console.log(getInitials("Bob Jones"))          // "B.J."

console.log(maskEmail("alice@example.com"))            // "al***@example.com"
console.log(maskEmail("longemail@dev.bio", 4))         // "long***@dev.bio"

console.log(formatBio("Short bio"))                              // "Short bio"
console.log(formatBio("This is a very long bio that definitely exceeds the tiny limit of twenty chars", 20))
// "This is a very long ..."
