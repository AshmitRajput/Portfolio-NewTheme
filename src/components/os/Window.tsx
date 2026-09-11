import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

const MENUBAR_HEIGHT = 38
const EDGE_MARGIN = 80
const VIEWPORT_PADDING = 8

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/** Transient animation state driven by the WindowManager — not part of
 *  WindowState because it's purely visual and self-clears. */
export type WindowAnimationPhase = 'minimizing' | 'restoring' | null

type WindowProps = {
  title: string
  x: number
  y: number
  width: number
  height: number
  /** Per-app minimum size, owned by the WindowManager (PortfolioOS.tsx). */
  minWidth: number
  minHeight: number
  zIndex: number
  isMaximized: boolean
  isFocused: boolean
  animationPhase?: WindowAnimationPhase
  onClose: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  /** Called for edges that also move the window's origin (n/w/nw/ne/sw) */
  onResizeAndMove?: (x: number, y: number, width: number, height: number) => void
  /** Fires when the minimize/restore CSS animation finishes, so the
   *  WindowManager can flip isMinimized / clear the animation phase. */
  onAnimationPhaseEnd?: () => void
  children: ReactNode
}

export default function Window({
  title,
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  zIndex,
  isMaximized,
  isFocused,
  animationPhase = null,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onMove,
  onResize,
  onResizeAndMove,
  onAnimationPhaseEnd,
  children,
}: WindowProps) {
  const dragState = useRef<{
    pointerId: number
    offsetX: number
    offsetY: number
  } | null>(null)

  const handleTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.os-traffic')) return
    if (isMaximized) return
    dragState.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - x,
      offsetY: e.clientY - y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleTitlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const nextX = e.clientX - drag.offsetX
    const nextY = e.clientY - drag.offsetY
    const clampedX = Math.min(
      Math.max(nextX, EDGE_MARGIN - width),
      window.innerWidth - EDGE_MARGIN
    )
    const clampedY = Math.min(
      Math.max(nextY, MENUBAR_HEIGHT),
      window.innerHeight - EDGE_MARGIN
    )
    onMove(clampedX, clampedY)
  }

  const handleTitlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  /* ---------------- Resize (all edges + corners) ---------------- */

  const resizeState = useRef<{
    pointerId: number
    dir: ResizeDir
    startX: number
    startY: number
    startWidth: number
    startHeight: number
    startClientX: number
    startClientY: number
  } | null>(null)

  const beginResize = (dir: ResizeDir) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isMaximized) return
    e.stopPropagation()
    resizeState.current = {
      pointerId: e.pointerId,
      dir,
      startX: x,
      startY: y,
      startWidth: width,
      startHeight: height,
      startClientX: e.clientX,
      startClientY: e.clientY,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const moveResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = resizeState.current
    if (!r || r.pointerId !== e.pointerId) return

    const dx = e.clientX - r.startClientX
    const dy = e.clientY - r.startClientY

    let newX = r.startX
    let newY = r.startY
    let newWidth = r.startWidth
    let newHeight = r.startHeight

    const growsRight = r.dir.includes('e')
    const growsLeft = r.dir.includes('w')
    const growsDown = r.dir.includes('s')
    const growsUp = r.dir.includes('n')

    if (growsRight) {
      const maxWidth = window.innerWidth - r.startX - VIEWPORT_PADDING
      newWidth = Math.min(Math.max(r.startWidth + dx, minWidth), maxWidth)
    }
    if (growsDown) {
      const maxHeight = window.innerHeight - r.startY - VIEWPORT_PADDING
      newHeight = Math.min(Math.max(r.startHeight + dy, minHeight), maxHeight)
    }
    if (growsLeft) {
      const proposedWidth = Math.max(r.startWidth - dx, minWidth)
      const maxWidthFromRight = r.startX + r.startWidth - VIEWPORT_PADDING
      newWidth = Math.min(proposedWidth, maxWidthFromRight)
      newX = r.startX + (r.startWidth - newWidth)
    }
    if (growsUp) {
      const proposedHeight = Math.max(r.startHeight - dy, minHeight)
      const maxHeightFromBottom = r.startY + r.startHeight - MENUBAR_HEIGHT
      newHeight = Math.min(proposedHeight, maxHeightFromBottom)
      newY = r.startY + (r.startHeight - newHeight)
    }

    if ((growsLeft || growsUp) && onResizeAndMove) {
      onResizeAndMove(newX, newY, newWidth, newHeight)
    } else {
      onResize(newWidth, newHeight)
    }
  }

  const endResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (resizeState.current?.pointerId === e.pointerId) {
      resizeState.current = null
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const edgeHandle = (dir: ResizeDir, className: string) => (
    <div
      className={`os-window__edge os-window__edge--${className}`}
      onPointerDown={beginResize(dir)}
      onPointerMove={moveResize}
      onPointerUp={endResize}
      aria-hidden="true"
    />
  )

  return (
    <section
      className={[
        'os-window',
        isMaximized ? 'os-window--maximized' : '',
        isFocused ? 'os-window--focused' : '',
        animationPhase === 'minimizing' ? 'os-window--minimizing' : '',
        animationPhase === 'restoring' ? 'os-window--restoring' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        isMaximized
          ? { zIndex }
          : { left: x, top: y, width, height, zIndex }
      }
      onPointerDown={onFocus}
      onAnimationEnd={(e) => {
        // Only react to the animation on this element itself, not a
        // bubbled child animation (e.g. the dock dot pulse).
        if (e.target === e.currentTarget) onAnimationPhaseEnd?.()
      }}
      role="dialog"
      aria-label={title}
    >
      <div
        className="os-window__titlebar"
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onDoubleClick={onToggleMaximize}
      >
        <div
          className="os-traffic"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            className="os-traffic__btn os-traffic__btn--close"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            <svg viewBox="0 0 10 10" className="os-traffic__glyph">
              <path
                d="M2.2 2.2 L7.8 7.8 M7.8 2.2 L2.2 7.8"
                stroke="#5c0e0a"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            className="os-traffic__btn os-traffic__btn--min"
            onClick={onMinimize}
            aria-label={`Minimize ${title}`}
          >
            <svg viewBox="0 0 10 10" className="os-traffic__glyph">
              <path
                d="M2 5 H8"
                stroke="#5c4405"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            className="os-traffic__btn os-traffic__btn--max"
            onClick={onToggleMaximize}
            aria-label={`Maximize ${title}`}
          >
            <svg viewBox="0 0 10 10" className="os-traffic__glyph">
              <path
                d="M2.4 6.6 L4.6 4.4 M4.6 4.4 H2.9 M4.6 4.4 V6.1 M7.6 3.4 L5.4 5.6 M5.4 5.6 H7.1 M5.4 5.6 V3.9"
                stroke="#0d5b1a"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <span className="os-window__title">{title}</span>
        <span className="os-window__titlebar-spacer" aria-hidden="true" />
      </div>

      {/*
        `os-window__content` is the container-query root (see
        `container-type: inline-size` in PortfolioOS.css). Every app inside
        reflows off ITS width, not the browser's — so About/Projects/etc.
        can switch between 1-column and multi-column layouts purely in CSS.
      */}
      <div className="os-window__content">{children}</div>

      {!isMaximized && (
        <>
          {edgeHandle('n', 'n')}
          {edgeHandle('s', 's')}
          {edgeHandle('e', 'e')}
          {edgeHandle('w', 'w')}
          {edgeHandle('ne', 'ne')}
          {edgeHandle('nw', 'nw')}
          {edgeHandle('se', 'se')}
          {edgeHandle('sw', 'sw')}
        </>
      )}
    </section>
  )
}
