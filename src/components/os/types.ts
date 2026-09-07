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
  defaultSize: { width: number; height: number }
}

export type WindowState = {
  id: AppId
  x: number
  y: number
  width: number
  height: number
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}
