import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addLink, removeLink } from '../server/profile.functions'

type Link = {
  id: string
  title: string
  url: string
  order: number | null
}

type LinkEditorProps = {
  initialLinks: Link[]
  onRefresh: () => void
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function LinkEditor({ initialLinks, onRefresh }: LinkEditorProps) {
  const [links, setLinks] = useState(initialLinks)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleAddLink = async () => {
    setValidationError('')

    if (!newTitle.trim()) {
      setValidationError('Title is required')
      return
    }

    if (!newUrl.trim()) {
      setValidationError('URL is required')
      return
    }

    if (!isValidUrl(newUrl.trim())) {
      setValidationError('Please enter a valid URL starting with http:// or https://')
      return
    }

    setIsLoading(true)
    try {
      await addLink({ data: { title: newTitle.trim(), url: newUrl.trim() } })
      setNewTitle('')
      setNewUrl('')
      setDialogOpen(false)
      onRefresh()
    } catch (error) {
      console.error('Failed to add link:', error)
      setValidationError('Failed to add link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveLink = async (id: string) => {
    const previous = [...links]
    setLinks(links.filter((link) => link.id !== id))
    try {
      await removeLink({ data: { linkId: id } })
      onRefresh()
    } catch (error) {
      setLinks(previous)
      console.error('Failed to remove link:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Links</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setValidationError('')
            setNewTitle('')
            setNewUrl('')
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm">Add Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Link</DialogTitle>
              <DialogDescription>
                Add a link to your public profile. It will appear in your link list.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {validationError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {validationError}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="link-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="link-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., GitHub"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="link-url" className="text-sm font-medium">
                  URL
                </label>
                <Input
                  id="link-url"
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button
                onClick={handleAddLink}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Adding...' : 'Add Link'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <p className="mt-4 text-center text-muted-foreground py-8">
          No links yet. Click &quot;Add Link&quot; to get started.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-muted-foreground">{link.url}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveLink(link.id)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
