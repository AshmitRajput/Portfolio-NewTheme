import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { AppDefinition, AppId, WindowState } from './types'

type DockProps = {
  apps: AppDefinition[]
  windows: WindowState[]
  onAppClick: (id: AppId) => void
}

/* ------------------------------------------------------------------
   Phase 5 — Dock magnification.

   Real macOS magnification responds to cursor proximity across the
   WHOLE dock (neighbors bulge too), which needs each icon's live
   position + the pointer's X — hence JS, not a CSS :hover rule.

   IMPORTANT: icon DOM nodes are tracked in a plain useRef, not
   useState. A ref callback (`ref={el => ...}`) is a new function
   every render, so React re-fires it on every render regardless —
   if that callback called setState, it would trigger another
   render → another new callback → another setState → infinite loop
   (this crashed the app to a blank screen in the previous version).
   Mutating a ref doesn't trigger a re-render, so the loop can't start.
   ------------------------------------------------------------------ */

const BASE_SCALE = 1
const MAX_SCALE = 1.55
const MAGNIFY_RADIUS = 110 // px — beyond this an icon is back to base scale

export default function Dock({ apps, windows, onAppClick }: DockProps) {
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [scales, setScales] = useState<Record<string, number>>({})

  // Respect the OS-level reduce-motion preference: skip magnification
  // entirely rather than fight it with `transform: none !important`.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const isOpen = (id: AppId) => windows.some((w) => w.id === id && w.isOpen)

  const updateScales = (pointerX: number) => {
    const next: Record<string, number> = {}
    for (const app of apps) {
      const el = itemRefs.current[app.id]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const distance = Math.abs(pointerX - center)
      const falloff = Math.max(0, 1 - distance / MAGNIFY_RADIUS)
      next[app.id] = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * falloff
    }
    setScales(next)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    updateScales(e.clientX)
  }

  const handlePointerLeave = () => setScales({})

  return (
    <nav className="os-dock" aria-label="Dock">
      <div
        className="os-dock__tray"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {apps.map((app) => {
          const scale = scales[app.id] ?? BASE_SCALE
          // Lift the icon as it grows so it magnifies from the Dock's
          // bottom edge (like macOS) instead of from its own center.
          const lift = (scale - BASE_SCALE) * 24

          return (
            <button
              key={app.id}
              ref={(el) => {
                itemRefs.current[app.id] = el
              }}
              className="os-dock__item"
              style={
                prefersReducedMotion
                  ? undefined
                  : { transform: `translateY(-${lift}px) scale(${scale})` }
              }
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
          )
        })}
      </div>
    </nav>
  )
}
