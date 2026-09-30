import type { AppId } from '../components/os/types'

export type Tip = {
  id: string
  text: string
  action?: AppId
}

export const tips: Tip[] = [
  {
    id: 'terminal',
    text: "Try the Terminal — type 'help' to see available commands, or 'open projects' to explore my work.",
    action: 'terminal',
  },
  {
    id: 'projects',
    text: 'Explore Projects to see what I have built across AI, backend engineering, cloud infrastructure and DevOps.',
    action: 'projects',
  },
  {
    id: 'resume',
    text: 'Open Resume for a concise overview of my experience, technical skills and achievements.',
    action: 'resume',
  },
  {
    id: 'windows',
    text: 'Windows are fully interactive — drag, resize, minimize or maximize them like a desktop.',
  },
  {
    id: 'shortcuts',
    text: 'Try keyboard shortcuts and the desktop menus — the interface is designed to feel like a real operating system.',
  },
]
