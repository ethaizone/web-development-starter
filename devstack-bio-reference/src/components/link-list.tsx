import { LinkCard } from './link-card'

type Link = {
  id: string
  title: string
  url: string
  iconName?: string
}

type LinkListProps = {
  links: Link[]
}

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return <p className="text-center text-muted-foreground">No links yet.</p>
  }

  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard
            title={link.title}
            url={link.url}
            iconName={link.iconName}
          />
        </li>
      ))}
    </ul>
  )
}
