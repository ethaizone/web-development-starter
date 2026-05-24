import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'devstack-session',
    password: process.env.SESSION_SECRET ?? 'fallback-dev-secret-change-in-production-32ch',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  })
}
