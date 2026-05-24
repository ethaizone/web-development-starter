import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, hyphens, and underscores'
  )

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: usernameSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  theme: z.enum(['light', 'dark']).optional(),
})

export const addLinkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
})

export const removeLinkSchema = z.object({
  linkId: z.string().min(1),
})
