import type { AppDefinition } from '../components/os/types'

/**
 * Phase 2 — application registry.
 *
 * Every app declares its own natural size instead of sharing one
 * generic default. A dense app like Projects or Resume wants more
 * room to breathe than a short one like Contact; the WindowManager
 * (PortfolioOS.tsx) reads these values when it opens a window, and
 * refuses to resize below minWidth/minHeight.
 */
export const APPS: AppDefinition[] = [
  {
    id: 'about',
    title: 'About Me',
    icon: '🧑‍💻',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 850, height: 600 },
    minWidth: 420,
    minHeight: 380,
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 950, height: 650 },
    minWidth: 460,
    minHeight: 400,
  },
  {
    id: 'experience',
    title: 'Experience',
    icon: '🧭',
    showOnDesktop: true,
    showInDock: false,
    defaultSize: { width: 800, height: 600 },
    minWidth: 420,
    minHeight: 380,
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: '🛠️',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 700, height: 560 },
    minWidth: 380,
    minHeight: 340,
  },
  {
    id: 'resume',
    title: 'Resume',
    icon: '📄',
    showOnDesktop: true,
    showInDock: true,
    defaultSize: { width: 850, height: 700 },
    minWidth: 420,
    minHeight: 420,
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '✉️',
    showOnDesktop: true,
    showInDock: false,
    defaultSize: { width: 650, height: 500 },
    minWidth: 380,
    minHeight: 340,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '💻',
    showOnDesktop: false,
    showInDock: true,
    defaultSize: { width: 760, height: 480 },
    minWidth: 420,
    minHeight: 300,
  },
]