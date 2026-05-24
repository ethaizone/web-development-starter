import { db } from './index'
import { users, profiles, links } from './schema'
import { eq } from 'drizzle-orm'

async function seed() {
  // Check if data already exists
  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.username, 'alice'),
  })
  if (existing) {
    console.log('Database already seeded. Skipping.')
    return
  }

  // Create a test user
  await db.insert(users).values({
    id: 'user-alice',
    email: 'alice@example.com',
    passwordHash: 'not-a-real-hash',
  })

  // Create a profile for the test user
  await db.insert(profiles).values({
    id: 'profile-alice',
    userId: 'user-alice',
    username: 'alice',
    displayName: 'Alice Chen',
    bio: 'Full-stack developer. Building cool things with TypeScript.',
  })

  // Create links for the profile
  await db.insert(links).values([
    {
      id: 'link-1',
      profileId: 'profile-alice',
      title: 'GitHub',
      url: 'https://github.com/alice',
      order: 0,
    },
    {
      id: 'link-2',
      profileId: 'profile-alice',
      title: 'Portfolio',
      url: 'https://alice.dev',
      order: 1,
    },
    {
      id: 'link-3',
      profileId: 'profile-alice',
      title: 'Blog',
      url: 'https://blog.alice.dev',
      order: 2,
    },
  ])

  console.log('✅ Seed data inserted successfully')
}

seed().catch(console.error)
