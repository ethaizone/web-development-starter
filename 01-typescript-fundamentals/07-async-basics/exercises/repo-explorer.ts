// Exercise: Build a repo explorer
// Run with: npx tsx exercises/repo-explorer.ts
//
// You're building a tool to explore GitHub repos for DevStack Bio's
// "featured projects" section.
//
// TODO: Write these functions:
//
// 1. `fetchGitHubRepos(username: string): Promise<any[]>`
//    Fetch from: https://api.github.com/users/${username}/repos
//    Return the parsed JSON (array of repo objects)
//
// 2. `getTopRepos(repos: any[], count: number): any[]`
//    Sort repos by stargazers_count (descending)
//    Return only the top `count` repos
//    This is NOT async — it just processes data
//
// 3. `printRepoReport(username: string, count: number): Promise<void>`
//    - Call fetchGitHubRepos to get the repos
//    - Call getTopRepos to get the top ones
//    - Print each repo: name, stars, and language
//    Format: "  repo-name ★ 123 (TypeScript)"
//
// 4. Call printRepoReport("octocat", 5)
//
// Bonus: Also print the total stars across all repos (not just top ones)
