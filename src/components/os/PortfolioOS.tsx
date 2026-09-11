import { useEffect, useMemo, useRef, useState } from 'react'
import Window from './Window'
import type { WindowAnimationPhase } from './Window'
import Dock from './Dock'
import DesktopIcon from './DesktopIcon'
import { APP_COMPONENTS } from './apps'
import { APPS } from '../../data/apps'
import { profile } from '../../data/about'
import type { AppId, WindowState } from './types'
import './PortfolioOS.css'
import './apps/apps.css'

/* Bump every app's default window size by this factor without touching
   data/apps.ts. Tweak here if you want windows even bigger/smaller. */
const DEFAULT_SIZE_SCALE = 1.22

/* OS-wide fallback minimums, used whenever an AppDefinition doesn't
   specify its own minWidth/minHeight in data/apps.ts. Below this a
   window's content can no longer reasonably reflow. */
const MIN_WINDOW_WIDTH = 380
const MIN_WINDOW_HEIGHT = 300

/* Must match the CSS animation-duration for .os-window--minimizing /
   .os-window--restoring in PortfolioOS.css. Used only as a safety-net
   timeout in case onAnimationEnd doesn't fire (e.g. tab backgrounded). */
const MINIMIZE_ANIMATION_MS = 260

/* ------------------------------------------------------------------ */
/* Menu definitions (Phase 3)                                          */
/* ------------------------------------------------------------------ */

type MenuAction = {
  label: string
  shortcut?: string
  action?: () => void
  external?: string
  disabled?: boolean
  checked?: boolean
}

type MenuEntry = MenuAction | 'separator'

type MenuDef = { id: string; label: string; items: MenuEntry[] }

function isSeparator(entry: MenuEntry): entry is 'separator' {
  return entry === 'separator'
}

function MenuDropdown({
  menu,
  isOpen,
  onToggle,
}: {
  menu: MenuDef
  isOpen: boolean
  onToggle: (id: string | null) => void
}) {
  return (
    <div className="os-menu">
      <button
        className={`os-menubar__item${isOpen ? ' os-menubar__item--open' : ''}`}
        onClick={() => onToggle(isOpen ? null : menu.id)}
      >
        {menu.label}
      </button>
      {isOpen && (
        <div className="os-menu__dropdown" role="menu">
          {menu.items.map((entry, i) =>
            isSeparator(entry) ? (
              <div key={i} className="os-menu__separator" />
            ) : (
              <button
                key={entry.label}
                className="os-menu__option"
                role="menuitem"
                disabled={entry.disabled}
                onClick={() => {
                  if (entry.external) {
                    window.open(entry.external, '_blank', 'noreferrer')
                  }
                  entry.action?.()
                  onToggle(null)
                }}
              >
                <span className="os-menu__option-label">
                  {entry.checked !== undefined && (
                    <span className="os-menu__check" aria-hidden="true">
                      {entry.checked ? '✓' : ''}
                    </span>
                  )}
                  {entry.label}
                </span>
                {entry.shortcut && (
                  <span className="os-menu__shortcut">{entry.shortcut}</span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

function MenuBar({
  activeTitle,
  onExit,
  menus,
}: {
  activeTitle: string | null
  onExit: () => void
  menus: MenuDef[]
}) {
  const [now, setNow] = useState(() => new Date())
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  // Close an open dropdown on any click outside the menu bar.
  useEffect(() => {
    if (!openMenuId) return
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [openMenuId])

  const clock = now.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <header className="os-menubar">
      <div className="os-menubar__left" ref={navRef}>
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
        {menus.map((menu) => (
          <MenuDropdown
            key={menu.id}
            menu={menu}
            isOpen={openMenuId === menu.id}
            onToggle={setOpenMenuId}
          />
        ))}
      </div>
      <div className="os-menubar__right">
        <time className="os-menubar__clock">{clock}</time>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Portfolio OS — Window Manager (Phase 2) + Menu system (Phase 3)     */
/* ------------------------------------------------------------------ */

export default function PortfolioOS() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null)

  /* Transient per-window animation phase. Kept OUT of WindowState
     because it's purely visual, self-clearing, and never needs to be
     restored/serialized — see Window.tsx's WindowAnimationPhase type. */
  const [animationPhases, setAnimationPhases] = useState<
    Partial<Record<AppId, WindowAnimationPhase>>
  >({})

  /* Bumped on "Reload content" (View menu / Cmd+R) to force a fresh
     mount of that app's component without reloading the whole page. */
  const [reloadKeys, setReloadKeys] = useState<Partial<Record<AppId, number>>>({})

  /* View-menu toggles. No right rail / mascot exists yet (Phase 4), so
     these are wired as real, persisted-in-state toggles with a visible
     checkmark — not dead buttons — even though nothing else reads them
     yet. */
  const [showResident, setShowResident] = useState(true)
  const [showWidgets, setShowWidgets] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const zCounter = useRef(10)
  const cascade = useRef(0)
  const animationTimers = useRef<Partial<Record<AppId, number>>>({})
  const rootRef = useRef<HTMLDivElement>(null)

  const nextZ = () => ++zCounter.current

  const clearAnimationTimer = (id: AppId) => {
    const handle = animationTimers.current[id]
    if (handle) {
      window.clearTimeout(handle)
      delete animationTimers.current[id]
    }
  }

  const setPhase = (id: AppId, phase: WindowAnimationPhase) => {
    setAnimationPhases((prev) => ({ ...prev, [id]: phase }))
  }

  /* ---------------- Core window actions ---------------- */

  const openWindow = (id: AppId) => {
    setSelectedIcon(null)
    setWindows((prev) => {
      const app = APPS.find((a) => a.id === id)
      if (!app) return prev

      const minWidth = app.minWidth ?? MIN_WINDOW_WIDTH
      const minHeight = app.minHeight ?? MIN_WINDOW_HEIGHT

      const offset = (cascade.current++ % 6) * 32
      const rawWidth = app.defaultSize.width * DEFAULT_SIZE_SCALE
      const rawHeight = app.defaultSize.height * DEFAULT_SIZE_SCALE

      // Never open smaller than the app's own minimum, and never larger
      // than the viewport allows.
      const width = Math.min(
        Math.max(rawWidth, minWidth),
        window.innerWidth - 32
      )
      const height = Math.min(
        Math.max(rawHeight, minHeight),
        window.innerHeight - 140
      )
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
          minWidth,
          minHeight,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ(),
        },
      ]
    })
  }

  /** Un-minimizes an already-open window and plays the restore animation. */
  const restoreWindow = (id: AppId) => {
    clearAnimationTimer(id)
    setPhase(id, 'restoring')
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZ() } : w
      )
    )
    // Safety net: clear the phase even if onAnimationEnd never fires.
    animationTimers.current[id] = window.setTimeout(() => {
      setPhase(id, null)
    }, MINIMIZE_ANIMATION_MS)
  }

  /** Dock/desktop-icon entry point: opens a new window, focuses an
   *  already-open one, or restores a minimized one. */
  const openApp = (id: AppId) => {
    const existing = windows.find((w) => w.id === id)
    if (!existing) {
      openWindow(id)
      return
    }
    if (existing.isMinimized) {
      restoreWindow(id)
      return
    }
    focusWindow(id)
  }

  const closeWindow = (id: AppId) => {
    clearAnimationTimer(id)
    setPhase(id, null)
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const minimizeWindow = (id: AppId) => {
    clearAnimationTimer(id)
    setPhase(id, 'minimizing')
    // The window stays mounted (isMinimized flips only once the
    // shrink animation actually finishes) so it can visibly animate
    // away instead of vanishing instantly.
    animationTimers.current[id] = window.setTimeout(() => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      )
      setPhase(id, null)
    }, MINIMIZE_ANIMATION_MS)
  }

  /** Called by Window.tsx when the CSS minimize/restore animation ends. */
  const handleAnimationPhaseEnd = (id: AppId) => {
    const phase = animationPhases[id]
    clearAnimationTimer(id)
    if (phase === 'minimizing') {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      )
    }
    setPhase(id, null)
  }

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

  /** For resize handles on the top/left edges, which also shift the origin. */
  const resizeAndMoveWindow = (
    id: AppId,
    x: number,
    y: number,
    width: number,
    height: number
  ) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y, width, height } : w))
    )

  /** View > Reload content (Cmd/Ctrl+R). Remounts just that app's
   *  component with a fresh key instead of reloading the page. */
  const reloadWindow = (id: AppId) =>
    setReloadKeys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  /** File > Close Window / Window menu. */
  const closeActiveWindow = () => {
    if (focusedId) closeWindow(focusedId)
  }

  /** Window > Next window (Cmd/Ctrl+`). Cycles focus through every
   *  open, non-minimized window in stacking order. */
  const focusNextWindow = () => {
    const visible = [...windows]
      .filter((w) => w.isOpen && !w.isMinimized)
      .sort((a, b) => a.zIndex - b.zIndex)
    if (visible.length < 2) return
    const currentIndex = visible.findIndex((w) => w.id === focusedId)
    const next = visible[(currentIndex + 1) % visible.length]
    focusWindow(next.id)
  }

  /** Edit > Select content / Copy content. Operates on the currently
   *  focused window's content, like a real OS edit menu would. */
  const getFocusedContentEl = () =>
    rootRef.current?.querySelector<HTMLElement>(
      '.os-window--focused .os-window__content'
    ) ?? null

  const selectFocusedContent = () => {
    const el = getFocusedContentEl()
    if (!el) return
    const selection = window.getSelection()
    if (!selection) return
    const range = document.createRange()
    range.selectNodeContents(el)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const copyFocusedContent = async () => {
    const el = getFocusedContentEl()
    if (!el) return
    try {
      await navigator.clipboard.writeText(el.innerText)
    } catch {
      // Clipboard permissions can be denied by the browser — fail quietly.
    }
  }

  /** View > Enter Full Screen (Cmd/Ctrl+Shift+F), via the real
   *  Fullscreen API on the OS root element. */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    // Clean up any pending timers on unmount.
    const timers = animationTimers.current
    return () => {
      Object.values(timers).forEach((handle) => {
        if (handle) window.clearTimeout(handle)
      })
    }
  }, [])

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

  /* ---------------- Menu bar definitions ---------------- */

  const menus: MenuDef[] = useMemo(
    () => [
      {
        id: 'file',
        label: 'File',
        items: [
          { label: 'New Window', shortcut: '⌘N', action: () => openApp('about') },
          { label: 'Open…', shortcut: '⌘O', action: () => openApp('projects') },
          'separator',
          {
            label: 'Close Window',
            shortcut: '⌘W',
            action: closeActiveWindow,
            disabled: !focusedId,
          },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          {
            label: 'Select content',
            shortcut: '⌘A',
            action: selectFocusedContent,
            disabled: !focusedId,
          },
          {
            label: 'Copy content',
            shortcut: '⌘C',
            action: copyFocusedContent,
            disabled: !focusedId,
          },
        ],
      },
      {
        id: 'view',
        label: 'View',
        items: [
          {
            label: 'Reload content',
            shortcut: '⌘R',
            action: () => focusedId && reloadWindow(focusedId),
            disabled: !focusedId,
          },
          {
            label: 'Enter Full Screen',
            shortcut: '⌘⇧F',
            action: toggleFullscreen,
            checked: isFullscreen,
          },
          'separator',
          {
            label: 'Disable RI Resident',
            action: () => setShowResident((v) => !v),
            checked: !showResident,
          },
          {
            label: 'Hide widgets',
            action: () => setShowWidgets((v) => !v),
            checked: !showWidgets,
          },
        ],
      },
      {
        id: 'window',
        label: 'Window',
        items: [
          {
            label: 'Minimize',
            shortcut: '⌘M',
            action: () => focusedId && minimizeWindow(focusedId),
            disabled: !focusedId,
          },
          {
            label: 'Maximize or restore',
            shortcut: '⌘⇧C',
            action: () => focusedId && toggleMaximize(focusedId),
            disabled: !focusedId,
          },
          'separator',
          {
            label: 'Next window',
            shortcut: '⌘`',
            action: focusNextWindow,
            disabled: windows.filter((w) => w.isOpen && !w.isMinimized).length < 2,
          },
        ],
      },
      {
        id: 'help',
        label: 'Help',
        items: [
          { label: 'LinkedIn profile ↗', external: profile.linkedin },
          { label: 'About RI/OS', action: () => openApp('about') },
          'separator',
          { label: 'How RI/OS was made', action: () => openApp('terminal') },
          'separator',
          { label: 'Privacy Policy', disabled: true },
          { label: 'Cookie Policy', disabled: true },
          { label: 'Legal Notice', disabled: true },
        ],
      },
    ],
    [focusedId, isFullscreen, showResident, showWidgets, windows]
  )

  // Keyboard shortcuts: Cmd/Ctrl+W closes the focused window,
  // Cmd/Ctrl+M minimizes it, Cmd/Ctrl+Shift+C maximizes/restores it,
  // Cmd/Ctrl+R reloads its content, Cmd/Ctrl+Shift+F toggles
  // fullscreen, Cmd/Ctrl+` cycles focus, Esc un-maximizes it.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const typingInField = ['INPUT', 'TEXTAREA'].includes(
        (e.target as HTMLElement)?.tagName
      )

      if (meta && e.key === '`') {
        e.preventDefault()
        focusNextWindow()
        return
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        toggleFullscreen()
        return
      }

      if (!focusedId) return

      if (meta && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        closeWindow(focusedId)
      } else if (meta && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        minimizeWindow(focusedId)
      } else if (meta && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        toggleMaximize(focusedId)
      } else if (meta && !e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        reloadWindow(focusedId)
      } else if (meta && !typingInField && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        selectFocusedContent()
      } else if (meta && !typingInField && e.key.toLowerCase() === 'c') {
        copyFocusedContent()
      } else if (e.key === 'Escape') {
        const win = windows.find((w) => w.id === focusedId)
        if (win?.isMaximized) toggleMaximize(focusedId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusedId, windows])

  return (
    <div className="os-root" ref={rootRef}>
      <MenuBar activeTitle={focusedTitle} onExit={exitToLanding} menus={menus} />

      <main
        className="os-desktop"
        onPointerDown={(e) => {
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
          // Keep rendering a window while it's mid-minimize so the
          // shrink animation is actually visible, even though
          // isMinimized will flip to true once it finishes.
          .filter(
            (w) =>
              w.isOpen &&
              (!w.isMinimized || animationPhases[w.id] === 'minimizing')
          )
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
                minWidth={w.minWidth}
                minHeight={w.minHeight}
                zIndex={w.zIndex}
                isMaximized={w.isMaximized}
                isFocused={focusedId === w.id}
                animationPhase={animationPhases[w.id] ?? null}
                onClose={() => closeWindow(w.id)}
                onMinimize={() => minimizeWindow(w.id)}
                onToggleMaximize={() => toggleMaximize(w.id)}
                onFocus={() => focusWindow(w.id)}
                onMove={(x, y) => moveWindow(w.id, x, y)}
                onResize={(width, height) => resizeWindow(w.id, width, height)}
                onResizeAndMove={(x, y, width, height) =>
                  resizeAndMoveWindow(w.id, x, y, width, height)
                }
                onAnimationPhaseEnd={() => handleAnimationPhaseEnd(w.id)}
              >
                {/* keyed by reloadKeys so View > Reload content / Cmd+R
                    forces a fresh mount without a full page reload */}
                <AppComponent key={reloadKeys[w.id] ?? 0} openApp={openApp} />
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
