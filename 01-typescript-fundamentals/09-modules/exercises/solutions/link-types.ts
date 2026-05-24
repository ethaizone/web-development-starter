// Solution: link-types.ts
export type ProfileLink = {
  title: string
  url: string
  category: "social" | "code" | "writing" | "other"
  isVisible: boolean
}
