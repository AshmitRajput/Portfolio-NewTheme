export type AppId =
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'resume'
  | 'contact'
  | 'terminal'

export type AppDefinition = {
  id: AppId
  title: string
  /** Emoji for now — swap for SVG icons in the polish phase */
  icon: string
  showOnDesktop: boolean
  showInDock: boolean
  /** Intelligent default geometry — see data/apps.ts for the actual
   *  per-app values (About gets more room than Contact, etc). */
  defaultSize: { width: number; height: number }
  /** Per-app minimum window size. Below this the app's content can no
   *  longer reasonably reflow, so the WindowManager refuses to shrink
   *  the window further. Falls back to the OS-wide minimum in
   *  PortfolioOS.tsx when omitted. */
  minWidth?: number
  minHeight?: number
}

export type WindowState = {
  id: AppId
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}