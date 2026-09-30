import type { AppId } from '../components/os/types'

export type Shortcut = {
  id: string
  title: string
  icon: string
  /** Every shortcut opens a real app — no placeholders for apps that
   *  don't exist yet (Rule 5: nothing decorative). */
  action: AppId
}

export const shortcuts: Shortcut[] = [
  { id: 'files', title: 'Files', icon: '📁', action: 'projects' },
  { id: 'notes', title: 'Resume', icon: '📄', action: 'resume' },
  { id: 'code', title: 'Terminal', icon: '💻', action: 'terminal' },
  { id: 'contact', title: 'Contact', icon: '✉️', action: 'contact' },
]