import type { AppId } from '../components/os/types'

/* ------------------------------------------------------------------
   "Remember window positions" (Settings > Windows, from the Phase 4
   plan — flagged as deferred when Settings was first built).

   Deliberately separate from useOSSettings.tsx: this is per-app
   geometry data (one entry per AppId, updated on every move/resize),
   not a handful of global preference flags, so it gets its own
   storage key and its own tiny load/save functions rather than
   living in the settings context.
   ------------------------------------------------------------------ */

export type SavedGeometry = {
  x: number
  y: number
  width: number
  height: number
  isMaximized: boolean
}

const STORAGE_KEY = 'ashmit-os-window-geometry'

export function loadWindowGeometry(): Partial<Record<AppId, SavedGeometry>> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function saveWindowGeometry(all: Partial<Record<AppId, SavedGeometry>>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Storage can be unavailable (private mode, quota) — fail quietly,
    // same as useOSSettings.
  }
}