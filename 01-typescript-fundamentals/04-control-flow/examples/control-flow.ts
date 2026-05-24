// control-flow.ts — Run with: npx tsx examples/control-flow.ts

// if / else if / else
function classifyScore(score: number): string {
  if (score >= 90) {
    return "Excellent"
  } else if (score >= 70) {
    return "Good"
  } else if (score >= 50) {
    return "Fair"
  } else {
    return "Fail"
  }
}

console.log(classifyScore(95))   // "Excellent"
console.log(classifyScore(75))   // "Good"
console.log(classifyScore(55))   // "Fair"
console.log(classifyScore(30))   // "Fail"

// switch
function getRoleLabel(role: string): string {
  switch (role) {
    case "admin":
      return "Administrator"
    case "moderator":
      return "Moderator"
    case "member":
      return "Member"
    default:
      return "Unknown"
  }
}

console.log(getRoleLabel("admin"))      // "Administrator"
console.log(getRoleLabel("member"))     // "Member"
console.log(getRoleLabel("guest"))      // "Unknown"

// for loop
const techStack = ["TypeScript", "React", "SQLite"]

for (let index = 0; index < techStack.length; index++) {
  console.log(`${index + 1}. ${techStack[index]}`)
}

// while loop — retry simulation
let remainingAttempts = 3

while (remainingAttempts > 0) {
  console.log(`Attempts remaining: ${remainingAttempts}`)
  remainingAttempts = remainingAttempts - 1
}

// break — find first match
const roles = ["member", "member", "admin", "moderator"]

for (let index = 0; index < roles.length; index++) {
  if (roles[index] === "admin") {
    console.log(`Found admin at index ${index}`)
    break
  }
}

// Logical operators
const isAdmin = true
const isActive = true

if (isAdmin && isActive) {
  console.log("Active admin — full access granted")
}

if (!isAdmin || !isActive) {
  console.log("Limited access")
}
