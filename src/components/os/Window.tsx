import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

const MENUBAR_HEIGHT = 38
const EDGE_MARGIN = 80
const MIN_WIDTH = 320
const MIN_HEIGHT = 220
const VIEWPORT_PADDING = 8

type WindowProps = {
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMaximized: boolean
  isFocused: boolean
  onClose: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  children: ReactNode
}

export default function Window({
  title,
  x,
  y,
  width,
  height,
  zIndex,
  isMaximized,
  isFocused,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const dragState = useRef<{
    pointerId: number
    offsetX: number
    offsetY: number
  } | null>(null)

  const handleTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Don't start a drag from the traffic-light buttons
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
    // Keep at least part of the window reachable
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

  /* ---------------- Resize (bottom-right corner) ---------------- */

  const resizeState = useRef<{
    pointerId: number
    startWidth: number
    startHeight: number
    startClientX: number
    startClientY: number
  } | null>(null)

  const handleResizePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isMaximized) return
    resizeState.current = {
      pointerId: e.pointerId,
      startWidth: width,
      startHeight: height,
      startClientX: e.clientX,
      startClientY: e.clientY,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleResizePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const resize = resizeState.current
    if (!resize || resize.pointerId !== e.pointerId) return
    // Never grow past the viewport edge from the window's current origin
    const maxWidth = window.innerWidth - x - VIEWPORT_PADDING
    const maxHeight = window.innerHeight - y - VIEWPORT_PADDING
    const nextWidth = Math.min(
      Math.max(resize.startWidth + (e.clientX - resize.startClientX), MIN_WIDTH),
      maxWidth
    )
    const nextHeight = Math.min(
      Math.max(resize.startHeight + (e.clientY - resize.startClientY), MIN_HEIGHT),
      maxHeight
    )
    onResize(nextWidth, nextHeight)
  }

  const handleResizePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (resizeState.current?.pointerId === e.pointerId) {
      resizeState.current = null
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <section
      className={[
        'os-window',
        isMaximized ? 'os-window--maximized' : '',
        isFocused ? 'os-window--focused' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        isMaximized
          ? { zIndex }
          : { left: x, top: y, width, height, zIndex }
      }
      onPointerDown={onFocus}
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
          />
          <button
            className="os-traffic__btn os-traffic__btn--min"
            onClick={onMinimize}
            aria-label={`Minimize ${title}`}
          />
          <button
            className="os-traffic__btn os-traffic__btn--max"
            onClick={onToggleMaximize}
            aria-label={`Maximize ${title}`}
          />
        </div>
        <span className="os-window__title">{title}</span>
        <span className="os-window__titlebar-spacer" aria-hidden="true" />
      </div>
      <div className="os-window__content">{children}</div>
      {!isMaximized && (
        <div
          className="os-window__resize"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          aria-hidden="true"
        />
      )}
    </section>
  )
}
