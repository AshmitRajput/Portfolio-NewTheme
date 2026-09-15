import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------
   Phase 4 — theme + widget-visibility settings.

   A single small context instead of prop-drilling: PortfolioOS.tsx
   reads `resolvedTheme` to set data-theme on .os-root and to draw the
   ☀/☾ toggle, SettingsApp.tsx reads/writes the same state, and
   RightRail/View-menu both read `showWidgets`. Everything is
   persisted to localStorage so it survives a refresh.
   ------------------------------------------------------------------ */

export type ThemeMode = 'light' | 'dark' | 'system'

type OSSettingsValue = {
  theme: ThemeMode
  /** 'light' | 'dark' — theme with 'system' already resolved against
   *  the OS-level prefers-color-scheme media query. */
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
  cycleTheme: () => void
  showWidgets: boolean
  setShowWidgets: (value: boolean | ((prev: boolean) => boolean)) => void
  /** Settings > Windows > "Remember window positions". */
  rememberWindowPositions: boolean
  setRememberWindowPositions: (value: boolean | ((prev: boolean) => boolean)) => void
}

const STORAGE_KEY = 'ashmit-os-settings'
const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'system']

type StoredSettings = {
  theme: ThemeMode
  showWidgets: boolean
  rememberWindowPositions: boolean
}

function loadStored(): StoredSettings {
  const fallback: StoredSettings = {
    theme: 'system',
    showWidgets: true,
    rememberWindowPositions: true,
  }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    const theme: ThemeMode =
      parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system'
        ? parsed.theme
        : fallback.theme
    const showWidgets =
      typeof parsed.showWidgets === 'boolean' ? parsed.showWidgets : fallback.showWidgets
    const rememberWindowPositions =
      typeof parsed.rememberWindowPositions === 'boolean'
        ? parsed.rememberWindowPositions
        : fallback.rememberWindowPositions
    return { theme, showWidgets, rememberWindowPositions }
  } catch {
    return fallback
  }
}

const OSSettingsContext = createContext<OSSettingsValue | null>(null)

export function OSSettingsProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadStored, [])
  const [theme, setTheme] = useState<ThemeMode>(initial.theme)
  const [showWidgets, setShowWidgets] = useState<boolean>(initial.showWidgets)
  const [rememberWindowPositions, setRememberWindowPositions] = useState<boolean>(
    initial.rememberWindowPositions
  )
  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true
  )

  // Track the OS-level color scheme live, so 'system' mode updates
  // without a refresh if the person flips their OS theme mid-session.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemPrefersDark(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ theme, showWidgets, rememberWindowPositions })
      )
    } catch {
      // Storage can be unavailable (private mode, quota) — fail quietly.
    }
  }, [theme, showWidgets, rememberWindowPositions])

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme

  const cycleTheme = () =>
    setTheme((prev) => THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length])

  const value = useMemo<OSSettingsValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      cycleTheme,
      showWidgets,
      setShowWidgets,
      rememberWindowPositions,
      setRememberWindowPositions,
    }),
    [theme, resolvedTheme, showWidgets, rememberWindowPositions]
  )

  return <OSSettingsContext.Provider value={value}>{children}</OSSettingsContext.Provider>
}

export function useOSSettings(): OSSettingsValue {
  const ctx = useContext(OSSettingsContext)
  if (!ctx) {
    throw new Error('useOSSettings must be used inside an <OSSettingsProvider>')
  }
  return ctx
}
