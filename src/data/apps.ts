import type { AppDefinition } from '../components/os/types'

/**
 * App registry. Adding an app here makes it appear on the desktop / Dock
 * automatically — you also need a component for it in
 * components/os/apps/index.ts.
 */
export const APPS: AppDefinition[] = [
  {
    id: 'about',
    title: 'About Me',
    icon: '👤',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 620, height: 520 },
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 720, height: 540 },
  },
  {
    id: 'experience',
    title: 'Experience',
    icon: '💼',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 620, height: 520 },
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: '🛠️',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 600, height: 480 },
  },
  {
    id: 'resume',
    title: 'Resume',
    icon: '📄',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 720, height: 620 },
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '✉️',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 520, height: 400 },
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '⌨️',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 600, height: 380 },
  },
]
