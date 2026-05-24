import { createServerFn } from '@tanstack/react-start'
import bcrypt from 'bcryptjs'
import { db } from '../db'
import { users, profiles } from '../db/schema'
import { eq } from 'drizzle-orm'
import { useAppSession } from './session'
import { registerSchema, loginSchema } from './schemas'
import { findUserByEmail } from './db.server'

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {
    // Check if email already exists
    const existingUser = await findUserByEmail(data.email)
    if (existingUser) {
      return { error: 'An account with this email already exists' }
    }

    // Check if username is taken
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.username, data.username),
    })
    if (existingProfile) {
      return { error: 'This username is already taken' }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, 12)

    // Create user
    const userId = crypto.randomUUID()
    await db.insert(users).values({
      id: userId,
      email: data.email,
      passwordHash,
    })

    // Create profile
    await db.insert(profiles).values({
      id: crypto.randomUUID(),
      userId,
      username: data.username,
      displayName: data.username,
    })

    // Create session
    const session = await useAppSession()
    await session.update({ userId })

    return { success: true }
  })

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const user = await findUserByEmail(data.email)
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) {
      return { error: 'Invalid email or password' }
    }

    const session = await useAppSession()
    await session.update({ userId: user.id })

    return { success: true }
  })

export const logoutFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const session = await useAppSession()
    await session.clear()
    return { success: true }
  })

export const getCurrentUserFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await useAppSession()
    const userId = session.data.userId
    if (!userId) return null

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    if (!user) return null

    return { id: user.id, email: user.email }
  })
