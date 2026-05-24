import { HeadContent, Scripts, createRootRoute, Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

import appCss from '../styles.css?url'
import { getCurrentUserFn, logoutFn } from '../server/auth.functions'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale= 1' },
      { title: 'DevStack Bio' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [checked, setChecked] = useState(false)

  // Re-check auth on every navigation
  const locationHref = useRouterState({ select: (s) => s.location.href })

  const refreshUser = useCallback(() => {
    getCurrentUserFn()
      .then((result) => setUser(result))
      .catch(() => setUser(null))
      .finally(() => setChecked(true))
  }, [])

  useEffect(() => {
    refreshUser()
  }, [locationHref, refreshUser])

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutFn()
    setUser(null)
    navigate({ to: '/' })
  }

  return (
    <RootDocument>
      <div className="min-h-screen bg-background flex flex-col">
        <header>
          <nav className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Link to="/" className="text-xl font-bold">
                DevStack Bio
              </Link>
              {checked && (
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        activeProps={{ className: 'font-bold' }}
                      >
                        Dashboard
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Log In</Link>
                      <Link to="/register">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
          <Outlet />
        </main>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          DevStack Bio — A learning project
        </footer>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
