import { nanoid } from "nanoid"
import type { DeveloperProfile, ProfileLink, LinkCategory, LinkId, ProfileId } from "./types"

export function createProfile(username: string, displayName: string, bio: string): DeveloperProfile {
  return {
    id: nanoid(10) as ProfileId,
    username,
    displayName,
    bio,
    links: [],
    githubData: null,
  }
}

export function addLink(profile: DeveloperProfile, title: string, url: string, category: LinkCategory): DeveloperProfile {
  const link: ProfileLink = {
    id: nanoid(8) as LinkId,
    title,
    url,
    category,
  }
  return {
    ...profile,
    links: [...profile.links, link],
  }
}

export function removeLink(profile: DeveloperProfile, linkId: LinkId): DeveloperProfile {
  return {
    ...profile,
    links: profile.links.filter((link) => link.id !== linkId),
  }
}

export function formatProfile(profile: DeveloperProfile): string {
  const lines: string[] = [
    `========================================`,
    `  ${profile.displayName} (@${profile.username})`,
    `  Bio: ${profile.bio}`,
    `  ID: ${profile.id}`,
    `========================================`,
    ``,
    `  Links (${profile.links.length}):`,
  ]

  if (profile.links.length === 0) {
    lines.push(`    (no links yet)`)
  } else {
    for (const link of profile.links) {
      lines.push(`    [${link.category}] ${link.title} — ${link.url}`)
    }
  }

  if (profile.githubData) {
    lines.push(``)
    lines.push(`  GitHub: @${profile.githubData.username}`)
    lines.push(`    Repos: ${profile.githubData.publicRepos} | Followers: ${profile.githubData.followers}`)
  }

  lines.push(`========================================`)
  return lines.join("\n")
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidUsername(username: string): boolean {
  return username.length >= 2 && username.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(username)
}
