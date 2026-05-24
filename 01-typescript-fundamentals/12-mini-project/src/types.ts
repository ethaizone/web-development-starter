export type LinkId = string
export type ProfileId = string

export type LinkCategory = "social" | "portfolio" | "blog" | "other"

export type ProfileLink = {
  id: LinkId
  title: string
  url: string
  category: LinkCategory
}

export type DeveloperProfile = {
  id: ProfileId
  username: string
  displayName: string
  bio: string
  links: ProfileLink[]
  githubData: GitHubData | null
}

export type GitHubData = {
  username: string
  publicRepos: number
  followers: number
  avatarUrl: string
}
