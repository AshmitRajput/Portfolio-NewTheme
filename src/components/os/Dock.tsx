import type { PointerEvent as ReactPointerEvent } from 'react'
import type { AppDefinition, AppId, WindowState } from './types'

type DockProps = {
  apps: AppDefinition[]
  windows: WindowState[]
  onAppClick: (id: AppId) => void
}

/* ------------------------------------------------------------------
   Dock magnification — deliberately simple.

   An earlier version computed distance-based magnification in JS so
   neighboring icons would bulge too (real macOS behavior, and what
   the Phase 5 plan describes). That was reverted on request: only
   the icon actually under the pointer should scale, nothing next to
   it, and it should return to normal the instant the pointer leaves
   — which is exactly what a plain CSS :hover rule gives for free,
   with no JS state, no ref-tracking, and none of the risk that class
   of code carried last time (the black-screen crash was a bug in
   this exact file's old ref-callback logic).
   ------------------------------------------------------------------ */

export default function Dock({ apps, windows, onAppClick }: DockProps) {
  const isOpen = (id: AppId) => windows.some((w) => w.id === id && w.isOpen)

  // Drives the specular-highlight pseudo-element in PortfolioOS.css
  // (.os-dock__tray::after). A plain imperative style mutation, not
  // React state — it can't cause a re-render loop.
  const handleTrayPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--glass-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--glass-y', `${e.clientY - rect.top}px`)
  }

  return (
    <nav className="os-dock" aria-label="Dock">
      <div className="os-dock__tray" onPointerMove={handleTrayPointerMove}>
        {apps.map((app) => (
          <button
            key={app.id}
            className="os-dock__item"
            onClick={() => onAppClick(app.id)}
            aria-label={`Open ${app.title}`}
          >
            <span className="os-dock__icon" aria-hidden="true">
              {app.icon}
            </span>
            <span className="os-dock__tooltip">{app.title}</span>
            <span
              className={`os-dock__dot${isOpen(app.id) ? ' os-dock__dot--active' : ''}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </nav>
  )
}
