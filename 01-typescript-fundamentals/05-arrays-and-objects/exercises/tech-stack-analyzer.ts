// Exercise: Build a tech stack analyzer
// Run with: npx tsx exercises/tech-stack-analyzer.ts
//
// You're building analysis tools for DevStack Bio's tech stack showcase feature.
//
// TODO: Given this data:
//
type TechItem = { name: string; category: string; experienceYears: number }
//
// const stack: TechItem[] = [
//   { name: "TypeScript", category: "language", experienceYears: 3 },
//   { name: "React", category: "framework", experienceYears: 2 },
//   { name: "Node.js", category: "runtime", experienceYears: 3 },
//   { name: "Python", category: "language", experienceYears: 1 },
//   { name: "Tailwind", category: "framework", experienceYears: 1 },
//   { name: "PostgreSQL", category: "database", experienceYears: 2 },
// ]
//
// Write these functions:
//
// 1. `getNames(stack: TechItem[]): string[]`
//    Return an array of just the names
//
// 2. `filterByCategory(stack: TechItem[], category: string): TechItem[]`
//    Return only items matching the given category
//
// 3. `totalExperience(stack: TechItem[]): number`
//    Return the sum of all experienceYears using reduce
//
// 4. `mostExperienced(stack: TechItem[]): TechItem`
//    Return the item with the highest experienceYears
//    Hint: use reduce, compare experienceYears in each step
//
// Print the results of each function.
