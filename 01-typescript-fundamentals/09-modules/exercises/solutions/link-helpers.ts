// Solution: link-helpers.ts
export const formatLinkDisplay = (title: string, url: string): string => {
  return `${title} → ${url}`
}

export const isValidUrl = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://")
}
