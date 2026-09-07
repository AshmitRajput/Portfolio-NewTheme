import { useEffect, useMemo, useRef, useState } from 'react'
import Window from './Window'
import Dock from './Dock'
import DesktopIcon from './DesktopIcon'
import { APP_COMPONENTS } from './apps'
import { APPS } from '../../data/apps'
import type { AppId, WindowState } from './types'
import './PortfolioOS.css'
import './apps/apps.css'

/* ------------------------------------------------------------------ */
/* Menu bar                                                            */
/* ------------------------------------------------------------------ */

function MenuBar({
  activeTitle,
  onExit,
}: {
  activeTitle: string | null
  onExit: () => void
}) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const clock = now.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <header className="os-menubar">
      <div className="os-menubar__left">
        <button
          className="os-menubar__brand"
          onClick={onExit}
          title="Back to landing page"
        >
          Ashmit OS
        </button>
        {activeTitle && (
          <span className="os-menubar__active">{activeTitle}</span>
        )}
        {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
          <span key={item} className="os-menubar__item">
            {item}
          </span>
        ))}
      </div>
      <div className="os-menubar__right">
        <time className="os-menubar__clock">{clock}</time>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Portfolio OS                                                        */
/* ------------------------------------------------------------------ */

export default function PortfolioOS() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null)
  const zCounter = useRef(10)
  const cascade = useRef(0)

  const nextZ = () => ++zCounter.current

  const openApp = (id: AppId) => {
    setSelectedIcon(null)
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id)
      if (existing) {
        // Restore and/or bring to front
        return prev.map((w) =>
          w.id === id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ() }
            : w
        )
      }
      const app = APPS.find((a) => a.id === id)
      if (!app) return prev
      const offset = (cascade.current++ % 6) * 32
      const width = Math.min(app.defaultSize.width, window.innerWidth - 32)
      const height = Math.min(app.defaultSize.height, window.innerHeight - 140)
      const x = Math.max(24, (window.innerWidth - width) / 2 + offset)
      const y = Math.max(56, (window.innerHeight - height) / 2.4 + offset)
      return [
        ...prev,
        {
          id,
          x,
          y,
          width,
          height,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ(),
        },
      ]
    })
  }

  const closeWindow = (id: AppId) =>
    setWindows((prev) => prev.filter((w) => w.id !== id))

  const minimizeWindow = (id: AppId) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    )

  const toggleMaximize = (id: AppId) =>
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZ() }
          : w
      )
    )

  const focusWindow = (id: AppId) =>
    setWindows((prev) => {
      const target = prev.find((w) => w.id === id)
      if (!target || target.zIndex === zCounter.current) return prev
      return prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ() } : w))
    })

  const moveWindow = (id: AppId, x: number, y: number) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    )

  const resizeWindow = (id: AppId, width: number, height: number) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    )

  const focusedId = useMemo(() => {
    const visible = windows.filter((w) => w.isOpen && !w.isMinimized)
    if (visible.length === 0) return null
    return visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id
  }, [windows])

  const focusedTitle =
    APPS.find((a) => a.id === focusedId)?.title ?? null

  const exitToLanding = () => {
    window.location.hash = ''
  }

  return (
    <div className="os-root">
      <MenuBar activeTitle={focusedTitle} onExit={exitToLanding} />

      <main
        className="os-desktop"
        onPointerDown={(e) => {
          // Clicking empty desktop clears icon selection
          if (e.target === e.currentTarget) setSelectedIcon(null)
        }}
      >
        <div className="os-desktop__icons">
          {APPS.filter((a) => a.showOnDesktop).map((app) => (
            <DesktopIcon
              key={app.id}
              icon={app.icon}
              label={app.title}
              isSelected={selectedIcon === app.id}
              onSelect={() => setSelectedIcon(app.id)}
              onOpen={() => openApp(app.id)}
            />
          ))}
        </div>

        {windows
          .filter((w) => w.isOpen && !w.isMinimized)
          .map((w) => {
            const app = APPS.find((a) => a.id === w.id)
            if (!app) return null
            const AppComponent = APP_COMPONENTS[w.id]
            return (
              <Window
                key={w.id}
                title={app.title}
                x={w.x}
                y={w.y}
                width={w.width}
                height={w.height}
                zIndex={w.zIndex}
                isMaximized={w.isMaximized}
                isFocused={focusedId === w.id}
                onClose={() => closeWindow(w.id)}
                onMinimize={() => minimizeWindow(w.id)}
                onToggleMaximize={() => toggleMaximize(w.id)}
                onFocus={() => focusWindow(w.id)}
                onMove={(x, y) => moveWindow(w.id, x, y)}
                onResize={(width, height) => resizeWindow(w.id, width, height)}
              >
                <AppComponent openApp={openApp} />
              </Window>
            )
          })}
      </main>

      <Dock
        apps={APPS.filter((a) => a.showInDock)}
        windows={windows}
        onAppClick={openApp}
      />
    </div>
  )
}
