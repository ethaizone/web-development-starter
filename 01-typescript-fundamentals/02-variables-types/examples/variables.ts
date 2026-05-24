// variables.ts — Run with: npx tsx examples/variables.ts

// const = cannot be reassigned (use this by default)
const firstName: string = "Alice"
const age: number = 25
const isLearning: boolean = true

// let = can be reassigned (only use when you need this)
let favoriteHobby: string = "reading"
favoriteHobby = "coding"

// Template literals combine text and variables
console.log(`My name is ${firstName}, I am ${age} years old.`)
console.log(`Am I learning TypeScript? ${isLearning}`)
console.log(`My favorite hobby is ${favoriteHobby}`)

// String operations
const fullName: string = `${firstName} Smith`
console.log(`Full name: ${fullName}`)
console.log(`Uppercase: ${fullName.toUpperCase()}`)
console.log(`Length: ${fullName.length}`)

// Number operations
const birthYear: number = 2000
const currentYear: number = 2025
console.log(`Approximate age from math: ${currentYear - birthYear}`)

// Union type — a value that can be more than one type
let userId: string | number
userId = "abc-123"
console.log(`User ID (string): ${userId}`)
userId = 42
console.log(`User ID (number): ${userId}`)
