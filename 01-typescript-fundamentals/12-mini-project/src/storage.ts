import * as fs from "fs"
import * as path from "path"
import type { DeveloperProfile } from "./types"

const DATA_FILE = path.join(__dirname, "..", "profiles.json")

export function saveProfiles(profiles: DeveloperProfile[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2), "utf-8")
}

export function loadProfiles(): DeveloperProfile[] {
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  return JSON.parse(raw) as DeveloperProfile[]
}
