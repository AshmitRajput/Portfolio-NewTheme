import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LiquidGlassRenderer } from '../../lib/glass/liquidGlassRenderer'
import {
  getDesktopBackgroundCanvas,
  getDesktopBackgroundScale,
  subscribeDesktopBackground,
} from '../../lib/glass/desktopBackground'
import type { Theme } from '../../lib/glass/desktopBackground'

/* ------------------------------------------------------------------
   Per-window WebGL glass layer.

   Renders as the first child inside .os-window — behind the titlebar
   and content (see z-index rules in PortfolioOS.css), in front of
   the window's existing CSS `backdrop-filter` background. It draws a
   real lens-distortion + chromatic-aberration + variable-blur pass
   (see liquidGlassRenderer.ts) against a crop of the shared desktop
   background (see desktopBackground.ts) matching this window's own
   on-screen rect, then composites that on top of the CSS base layer
   at partial opacity — see desktopBackground.ts's file header for
   why it's "on top of", not "instead of", that base layer.

   Rendered on demand — geometry/theme/background-change-driven, not
   a continuous rAF loop. An idle, unmoved window costs nothing after
   its last render. The one exception is a short, bounded rAF burst
   during the maximize/restore CSS transition (position AND size
   animate together there, which a ResizeObserver alone can't track
   — see the effect below).

   If WebGL2 isn't available, the renderer simply never draws
   anything: the canvas stays transparent and the CSS base layer
   underneath — the whole glass effect prior to this change — is all
   the person sees. No broken/blank state either way.
   ------------------------------------------------------------------ */

// Must match Window.tsx's own MENUBAR_HEIGHT — window x/y are relative
// to .os-desktop, which starts this many px below the true viewport
// top (see .os-desktop { inset: var(--os-menubar-h) 0 0 0 } in
// PortfolioOS.css), and the shared background canvas is composited
// at full-viewport scale.
const MENUBAR_HEIGHT = 38

// Tuned for "slight blur, real distortion, noticeable but not
// cartoonish" per the brief — not exposed as props since every
// window should look consistent; adjust here if the overall strength
// needs a pass.
const GLASS_TUNING = {
  distortion: 0.30,
  aberrationPx: 1.6,
  blurPx: 1.8,
  alpha: 0.6,
  tint: {
    dark: { rgb: [0.42, 0.39, 0.34] as [number, number, number], strength: 0.22 },
    light: { rgb: [1, 0.98, 0.94] as [number, number, number], strength: 0.14 },
  },
}

let scratchCanvas: HTMLCanvasElement | null = null
function getScratchCanvas(): HTMLCanvasElement {
  if (!scratchCanvas) scratchCanvas = document.createElement('canvas')
  return scratchCanvas
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export type GlassCanvasProps = {
  /** Ref to the .os-window <section> — used to measure the real
   *  rendered box when CSS (not inline x/y/width/height) drives
   *  geometry, i.e. maximized or mobile. */
  containerRef: React.RefObject<HTMLElement | null>
  x: number
  y: number
  width: number
  height: number
  isMaximized: boolean
  isMobile: boolean
  theme: Theme
}

export default function GlassCanvas({
  containerRef,
  x,
  y,
  width,
  height,
  isMaximized,
  isMobile,
  theme,
}: GlassCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<LiquidGlassRenderer | null>(null)
  const rafRef = useRef<number | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new LiquidGlassRenderer(canvas)
    rendererRef.current = renderer
    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  }, [])

  const draw = () => {
    const renderer = rendererRef.current
    const canvas = canvasRef.current
    const container = containerRef.current
    const bg = getDesktopBackgroundCanvas()
    if (!renderer || !renderer.isSupported() || !canvas || !container || !bg) return

    // Maximized/mobile geometry comes from CSS (see .os-window--maximized
    // / --mobile in PortfolioOS.css), not the x/y/width/height props,
    // which go stale in those states — measure the real box instead.
    let rectX: number
    let rectY: number
    let rectW: number
    let rectH: number
    if (isMaximized || isMobile) {
      const box = container.getBoundingClientRect()
      const root = container.closest('.os-root') as HTMLElement | null
      const rootBox = root?.getBoundingClientRect()
      rectX = box.left - (rootBox?.left ?? 0)
      rectY = box.top - (rootBox?.top ?? 0)
      rectW = box.width
      rectH = box.height
    } else {
      rectX = x
      rectY = y + MENUBAR_HEIGHT
      rectW = width
      rectH = height
    }
    if (rectW <= 0 || rectH <= 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const widthPx = Math.max(1, Math.round(rectW * dpr))
    const heightPx = Math.max(1, Math.round(rectH * dpr))
    renderer.resize(widthPx, heightPx)

    const scale = getDesktopBackgroundScale()
    const cropX = Math.max(0, Math.round(rectX * scale))
    const cropY = Math.max(0, Math.round(rectY * scale))
    const cropW = Math.max(1, Math.min(bg.width - cropX, Math.round(rectW * scale)))
    const cropH = Math.max(1, Math.min(bg.height - cropY, Math.round(rectH * scale)))

    // Crop into a small scratch canvas sized to the window itself —
    // keeps the texture upload small regardless of the shared
    // background canvas's own (viewport-scale) resolution.
    const scratch = getScratchCanvas()
    scratch.width = widthPx
    scratch.height = heightPx
    const sctx = scratch.getContext('2d')
    if (!sctx) return
    sctx.clearRect(0, 0, widthPx, heightPx)
    sctx.drawImage(bg, cropX, cropY, cropW, cropH, 0, 0, widthPx, heightPx)
    renderer.setBackgroundSource(scratch)

    const tint = GLASS_TUNING.tint[theme]
    renderer.render({
      widthPx,
      heightPx,
      distortion: GLASS_TUNING.distortion,
      aberrationPx: GLASS_TUNING.aberrationPx * dpr,
      blurPx: GLASS_TUNING.blurPx * dpr,
      tint: tint.rgb,
      tintStrength: tint.strength,
      alpha: GLASS_TUNING.alpha,
    })
  }

  // Re-render whenever geometry or theme changes (covers drag/resize
  // via the x/y/width/height props, and theme toggling). Layout
  // effect so it lands in the same paint as the prop update driving
  // it, not one frame behind.
  useLayoutEffect(() => {
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, width, height, isMaximized, isMobile, theme])

  // Re-render whenever the shared desktop background recomposites
  // (viewport resize, theme change, wallpaper load finishing).
  useEffect(() => {
    return subscribeDesktopBackground(() => draw())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Maximize/restore animates position AND size together via CSS
  // transition (.os-window--maximized in PortfolioOS.css) — a
  // ResizeObserver alone only catches size changes, not position, so
  // it can't track this by itself. A short, bounded rAF burst keeps
  // the glass crop in sync for the duration of that transition, then
  // stops itself — not a continuous loop.
  useEffect(() => {
    if (reducedMotion) {
      draw()
      return
    }
    let frames = 0
    const tick = () => {
      draw()
      frames += 1
      if (frames < 16) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized, reducedMotion])

  return <canvas ref={canvasRef} className="os-window__glass-canvas" aria-hidden="true" />
}