import type { GitHubData } from "./types"

const GITHUB_API = "https://api.github.com/users"

export async function fetchGitHubUser(username: string): Promise<GitHubData> {
  const response = await fetch(`${GITHUB_API}/${username}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" not found`)
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as {
    login: string
    public_repos: number
    followers: number
    avatar_url: string
  }

  return {
    username: data.login,
    publicRepos: data.public_repos,
    followers: data.followers,
    avatarUrl: data.avatar_url,
  }
}
