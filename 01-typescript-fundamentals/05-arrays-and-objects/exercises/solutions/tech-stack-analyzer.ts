// Solution: tech-stack-analyzer.ts
// Run with: npx tsx exercises/solutions/tech-stack-analyzer.ts

type TechItem = { name: string; category: string; experienceYears: number }

const stack: TechItem[] = [
  { name: "TypeScript", category: "language", experienceYears: 3 },
  { name: "React", category: "framework", experienceYears: 2 },
  { name: "Node.js", category: "runtime", experienceYears: 3 },
  { name: "Python", category: "language", experienceYears: 1 },
  { name: "Tailwind", category: "framework", experienceYears: 1 },
  { name: "PostgreSQL", category: "database", experienceYears: 2 },
]

const getNames = (items: TechItem[]): string[] => {
  return items.map((item) => item.name)
}

const filterByCategory = (items: TechItem[], category: string): TechItem[] => {
  return items.filter((item) => item.category === category)
}

const totalExperience = (items: TechItem[]): number => {
  return items.reduce((sum, item) => sum + item.experienceYears, 0)
}

const mostExperienced = (items: TechItem[]): TechItem => {
  return items.reduce((currentTop, item) => {
    if (item.experienceYears > currentTop.experienceYears) {
      return item
    }
    return currentTop
  })
}

// Tests
console.log("All names:", getNames(stack))
console.log("Languages:", getNames(filterByCategory(stack, "language")))
console.log("Frameworks:", getNames(filterByCategory(stack, "framework")))
console.log("Total experience (years):", totalExperience(stack))
console.log("Most experienced:", mostExperienced(stack).name)
