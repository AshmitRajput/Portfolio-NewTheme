/* ------------------------------------------------------------------
   Shared desktop-background compositor — feeds every window's WebGL
   glass layer (see GlassCanvas.tsx / liquidGlassRenderer.ts).

   Why this exists: a shader that "bends light through glass" needs
   real pixels to bend. Grabbing a live snapshot of the actual DOM
   behind a window on every frame is the thing to avoid (see the
   architecture discussion — html2canvas-style capture is far too
   slow for 60fps drag). Instead, this module keeps ONE offscreen 2D
   canvas that mirrors exactly what .os-root's CSS background paints:
   the wallpaper image with `background-size:cover;
   background-position:center`, plus the theme scrim gradient on top
   (see --os-wallpaper / --os-bg-gradient in PortfolioOS.css).

   It's recomposited only on mount, viewport resize, and theme
   change — cheap, infrequent, plain Canvas2D. Every glass window then
   crops its own on-screen rect out of this single shared canvas and
   uploads just that crop as its WebGL texture (see GlassCanvas.tsx).

   Known limitation, on purpose: this canvas represents the DESKTOP
   background only — not other windows. A window's glass doesn't
   optically refract another window sitting behind it; modeling that
   needs a much heavier back-to-front compositing pipeline (see the
   architecture discussion). The existing CSS `backdrop-filter` base
   layer on .os-window covers that case with a plain, always-correct
   blur of whatever is actually behind it; this WebGL layer adds real
   lens/chromatic-aberration detail on top for the common case of a
   window sitting over open desktop, blended at partial opacity so it
   never shows something *wrong* — just something slightly less
   detailed when another window is behind.
   ------------------------------------------------------------------ */

export type Theme = 'light' | 'dark'
type Listener = () => void

// Scrim colors mirrored from --os-bg-gradient in PortfolioOS.css.
// Kept as plain values (not read from CSS) because parsing an
// arbitrary linear-gradient() string robustly isn't worth it for two
// colors — just keep these two in sync if that gradient ever changes.
const SCRIM: Record<Theme, { top: string; bottom: string }> = {
  dark: { top: 'rgba(11, 10, 9, 0.55)', bottom: 'rgba(11, 10, 9, 0.78)' },
  light: { top: 'rgba(231, 224, 211, 0.55)', bottom: 'rgba(231, 224, 211, 0.8)' },
}

const FALLBACK_FILL: Record<Theme, string> = {
  dark: '#0b0a09',
  light: '#e7e0d3',
}

// This canvas only ever feeds a blur/lens shader as a texture — it
// doesn't need full device resolution. Capping it keeps recomposite
// cheap even on a large/hi-DPI display.
const MAX_DIM = 1600

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let wallpaperImg: HTMLImageElement | null = null
let wallpaperReady = false
let currentUrl: string | null = null
let lastScale = 1
let version = 0
const listeners = new Set<Listener>()

function ensureCanvas(): HTMLCanvasElement {
  if (!canvas) {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')
  }
  return canvas
}

function notify() {
  version += 1
  for (const listener of listeners) listener()
}

function drawComposite(theme: Theme, viewportWidth: number, viewportHeight: number) {
  const c = ensureCanvas()
  if (!ctx || viewportWidth <= 0 || viewportHeight <= 0) return

  const scale = Math.min(1, MAX_DIM / Math.max(viewportWidth, viewportHeight))
  const w = Math.max(1, Math.round(viewportWidth * scale))
  const h = Math.max(1, Math.round(viewportHeight * scale))
  lastScale = scale

  if (c.width !== w || c.height !== h) {
    c.width = w
    c.height = h
  }

  ctx.clearRect(0, 0, w, h)

  if (wallpaperImg && wallpaperReady && wallpaperImg.naturalWidth && wallpaperImg.naturalHeight) {
    // Replicate CSS `background-size: cover; background-position: center`.
    const imgRatio = wallpaperImg.naturalWidth / wallpaperImg.naturalHeight
    const boxRatio = w / h
    let drawW: number
    let drawH: number
    if (imgRatio > boxRatio) {
      drawH = h
      drawW = h * imgRatio
    } else {
      drawW = w
      drawH = w / imgRatio
    }
    ctx.drawImage(wallpaperImg, (w - drawW) / 2, (h - drawH) / 2, drawW, drawH)
  } else {
    // Wallpaper not loaded (yet, or failed) — flat fallback so glass
    // surfaces still have *something* plausible to sample rather than
    // sampling garbage/transparent pixels.
    ctx.fillStyle = FALLBACK_FILL[theme]
    ctx.fillRect(0, 0, w, h)
  }

  const scrim = SCRIM[theme]
  const gradient = ctx.createLinearGradient(0, 0, 0, h)
  gradient.addColorStop(0, scrim.top)
  gradient.addColorStop(1, scrim.bottom)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  notify()
}

/** Call once on mount (e.g. from PortfolioOS.tsx). Safe to call again
 *  with the same URL — it'll just recomposite at the new viewport
 *  size without reloading the image. */
export function initDesktopBackground(
  wallpaperUrl: string,
  theme: Theme,
  viewportWidth: number,
  viewportHeight: number
) {
  ensureCanvas()
  if (currentUrl !== wallpaperUrl) {
    currentUrl = wallpaperUrl
    wallpaperReady = false
    const img = new Image()
    img.onload = () => {
      wallpaperReady = true
      drawComposite(theme, viewportWidth, viewportHeight)
    }
    img.onerror = () => {
      // Fails quietly — drawComposite falls back to a flat fill so
      // glass surfaces never end up sampling nothing.
      wallpaperReady = false
    }
    img.src = wallpaperUrl
    wallpaperImg = img
  }
  drawComposite(theme, viewportWidth, viewportHeight)
}

/** Call on theme change and on viewport resize. */
export function recompositeDesktopBackground(
  theme: Theme,
  viewportWidth: number,
  viewportHeight: number
) {
  drawComposite(theme, viewportWidth, viewportHeight)
}

export function getDesktopBackgroundCanvas(): HTMLCanvasElement | null {
  return canvas
}

/** viewport-px → composite-canvas-px scale factor (≤1, see MAX_DIM). */
export function getDesktopBackgroundScale(): number {
  return lastScale
}

export function getDesktopBackgroundVersion(): number {
  return version
}

export function subscribeDesktopBackground(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}