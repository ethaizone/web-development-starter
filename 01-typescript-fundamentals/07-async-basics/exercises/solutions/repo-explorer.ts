// Solution: repo-explorer.ts
// Run with: npx tsx exercises/solutions/repo-explorer.ts

type GitHubRepo = {
  name: string
  stargazers_count: number
  language: string | null
  description: string | null
}

const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
  const response = await fetch(`https://api.github.com/users/${username}/repos`)
  const repos: GitHubRepo[] = await response.json()
  return repos
}

const getTopRepos = (repos: GitHubRepo[], count: number): GitHubRepo[] => {
  return [...repos]
    .sort((firstRepo, secondRepo) => secondRepo.stargazers_count - firstRepo.stargazers_count)
    .slice(0, count)
}

const printRepoReport = async (username: string, count: number): Promise<void> => {
  console.log(`Top ${count} repos for ${username}:\n`)

  const allRepos = await fetchGitHubRepos(username)
  const topRepos = getTopRepos(allRepos, count)

  for (let index = 0; index < topRepos.length; index++) {
    const repo = topRepos[index]
    const languageLabel = repo.language ?? "Unknown"
    console.log(`  ${repo.name} ★ ${repo.stargazers_count} (${languageLabel})`)
  }

  // Bonus: total stars across all repos
  const totalStars = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  console.log(`\nTotal repos: ${allRepos.length}`)
  console.log(`Total stars across all repos: ${totalStars}`)
}

printRepoReport("octocat", 5)
