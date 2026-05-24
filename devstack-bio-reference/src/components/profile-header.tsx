import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ProfileHeaderProps = {
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
}

export function ProfileHeader({ username, displayName, bio, avatarUrl }: ProfileHeaderProps) {
  const initials = displayName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="text-center">
      <Avatar className="w-24 h-24 mx-auto">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
      <h1 className="mt-4 text-3xl font-bold">{displayName}</h1>
      <p className="text-muted-foreground">@{username}</p>
      {bio && <p className="mt-2 text-muted-foreground">{bio}</p>}
    </header>
  )
}
