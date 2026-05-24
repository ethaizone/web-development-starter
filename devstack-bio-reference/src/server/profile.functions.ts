import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { findProfileByUsername, findProfileByUserId, addLinkToProfile, removeLinkById } from './db.server'
import { addLinkSchema, removeLinkSchema, updateProfileSchema } from './schemas'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { profiles, analytics } from '../db/schema'
import { useAppSession } from './session'

export const getPublicProfile = createServerFn({ method: 'GET' })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const profile = await findProfileByUsername(data.username)
    if (!profile) {
      throw notFound()
    }
    return profile
  })

export const getMyProfile = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await useAppSession()
    const userId = session.data.userId
    if (!userId) throw notFound()

    const profile = await findProfileByUserId(userId)
    if (!profile) {
      throw notFound()
    }
    return profile
  })

export const addLink = createServerFn({ method: 'POST' })
  .inputValidator(addLinkSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    const userId = session.data.userId
    if (!userId) throw notFound()

    const profile = await findProfileByUserId(userId)
    if (!profile) throw notFound()
    await addLinkToProfile(profile.id, data)
    return { success: true }
  })

export const removeLink = createServerFn({ method: 'POST' })
  .inputValidator(removeLinkSchema)
  .handler(async ({ data }) => {
    await removeLinkById(data.linkId)
    return { success: true }
  })

export const updateProfileFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      profileId: z.string(),
    }).merge(updateProfileSchema)
  )
  .handler(async ({ data }) => {
    const { profileId, ...updates } = data
    await db
      .update(profiles)
      .set({
        displayName: updates.displayName,
        bio: updates.bio ?? null,
        avatarUrl: updates.avatarUrl ?? null,
        theme: updates.theme,
      })
      .where(eq(profiles.id, profileId))
    return { success: true }
  })

export const recordProfileView = createServerFn({ method: 'POST' })
  .inputValidator((data: { profileId: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(analytics).values({
      id: crypto.randomUUID(),
      profileId: data.profileId,
    })
    return { success: true }
  })
