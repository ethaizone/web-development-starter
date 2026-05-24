import { db } from '../db'
import { users, profiles, links } from '../db/schema'
import { eq } from 'drizzle-orm'

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function findProfileByUsername(username: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.username, username),
    with: {
      links: {
        orderBy: (links, { asc }) => [asc(links.order)],
      },
    },
  })
}

export async function findProfileByUserId(userId: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
    with: {
      links: {
        orderBy: (links, { asc }) => [asc(links.order)],
      },
    },
  })
}

export async function createProfile(data: {
  userId: string
  username: string
  displayName: string
}) {
  await db.insert(profiles).values({
    id: crypto.randomUUID(),
    userId: data.userId,
    username: data.username,
    displayName: data.displayName,
  })
}

export async function addLinkToProfile(
  profileId: string,
  data: { title: string; url: string }
) {
  // Get current max order
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
    with: { links: true },
  })
  const maxOrder = profile ? Math.max(0, ...profile.links.map((l) => l.order ?? 0)) : 0

  await db.insert(links).values({
    id: crypto.randomUUID(),
    profileId,
    title: data.title,
    url: data.url,
    order: maxOrder + 1,
  })
}

export async function removeLinkById(linkId: string) {
  await db.delete(links).where(eq(links.id, linkId))
}
