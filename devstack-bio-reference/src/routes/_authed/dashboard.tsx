import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getMyProfile } from '../../server/profile.functions'
import { ProfileEditForm } from '../../components/profile-edit-form'
import { LinkEditor } from '../../components/link-editor'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authed/dashboard')({
  loader: async () => {
    const profile = await getMyProfile()
    return { profile }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { profile } = Route.useLoaderData()
  const router = useRouter()

  // Apply saved theme on load
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [profile.theme])

  const handleRefresh = () => {
    router.invalidate()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile at{' '}
            <Link
              to="/$username"
              params={{ username: profile.username }}
              className="text-blue-600 hover:underline"
            >
              devstack.bio/{profile.username}
            </Link>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/$username" params={{ username: profile.username }}>
            View Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProfileEditForm
          profile={{
            id: profile.id,
            displayName: profile.displayName,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            theme: profile.theme,
          }}
          onSaved={handleRefresh}
        />
        <LinkEditor
          key={profile.links.map(l => l.id).join(',')}
          initialLinks={profile.links.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            order: link.order,
          }))}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
