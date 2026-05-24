import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
        DevStack Bio
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-lg">
        Your developer profile hub — showcase your links, tech stack, and stats.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/register"
          className="rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
        >
          Create Your Profile
        </Link>
        <Link
          to="/$username"
          params={{ username: 'alice' }}
          className="rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-accent transition-colors"
        >
          See Example
        </Link>
      </div>
    </div>
  )
}
