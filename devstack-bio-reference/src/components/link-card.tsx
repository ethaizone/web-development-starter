type LinkCardProps = {
  title: string
  url: string
  iconName?: string
}

export function LinkCard({ title, url, iconName }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-border p-4 text-foreground font-medium hover:bg-accent hover:border-ring hover:text-accent-foreground transition-colors"
    >
      {iconName && <span className="text-xl">{iconName}</span>}
      <span>{title}</span>
    </a>
  )
}
