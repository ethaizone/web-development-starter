import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getPublicProfile, recordProfileView } from '../server/profile.functions'
import { ProfileHeader } from '../components/profile-header'
import { LinkList } from '../components/link-list'

export const Route = createFileRoute('/$username')({
  head: () => ({
    meta: [
      { title: 'DevStack Bio' },
      { name: 'description', content: 'Developer profile on DevStack Bio' },
    ],
  }),
  loader: async ({ params }) => {
    const profile = await getPublicProfile({ data: { username: params.username } })

    if (!profile) {
      throw notFound()
    }

    // Record the profile view (server-side, reliable)
    await recordProfileView({ data: { profileId: profile.id } }).catch(() => {
      // Don't fail the page load if analytics fails
    })

    return profile
  },
  notFoundComponent: ProfileNotFound,
  component: PublicProfilePage,
})

function ProfileNotFound() {
  const { username } = Route.useParams()
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Profile Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        No one at <strong>@{username}</strong> yet.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Want this username?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Create your profile
        </a>
      </p>
    </div>
  )
}

function PublicProfilePage() {
  const profile = Route.useLoaderData()

  // Apply theme to <html> so the whole page (header, footer) changes
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [profile.theme])

  return (
    <article className="max-w-md mx-auto py-12 min-h-[calc(100vh-200px)]">
      <ProfileHeader
        username={profile.username}
        displayName={profile.displayName}
        bio={profile.bio ?? undefined}
        avatarUrl={profile.avatarUrl ?? undefined}
      />
      <section className="mt-8">
        <h2 className="sr-only">Links</h2>
        <LinkList
          links={profile.links.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            iconName: link.iconName ?? undefined,
          }))}
        />
      </section>
      <footer className="mt-8 text-center text-sm opacity-50">
        Powered by DevStack Bio
      </footer>
    </article>
  )
}
