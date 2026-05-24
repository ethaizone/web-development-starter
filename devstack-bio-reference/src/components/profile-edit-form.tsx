import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateProfileFn } from '../server/profile.functions'
import { updateProfileSchema } from '../server/schemas'

type ProfileData = {
  id: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  theme: string | null
}

type ProfileEditFormProps = {
  profile: ProfileData
  onSaved: () => void
}

function applyTheme(theme: string) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function ProfileEditForm({ profile, onSaved }: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '')
  const [theme, setTheme] = useState(profile.theme ?? 'light')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleThemeChange = (value: string) => {
    setTheme(value)
    applyTheme(value)
  }

  const handleSave = async () => {
    const result = updateProfileSchema.safeParse({
      displayName,
      bio: bio || undefined,
      avatarUrl: avatarUrl || undefined,
      theme,
    })

    if (!result.success) {
      setMessage(result.error.issues[0].message)
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      await updateProfileFn({
        data: {
          profileId: profile.id,
          ...result.data,
        },
      })
      setMessage('Profile saved!')
      onSaved()
    } catch {
      setMessage('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <p
            className={`text-sm ${
              message.includes('Failed') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the world about yourself..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
