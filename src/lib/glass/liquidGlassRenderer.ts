/* ------------------------------------------------------------------
   LiquidGlassRenderer — a small, self-contained WebGL2 wrapper that
   draws ONE thing: a lens-distorted, chromatically-aberrated,
   variable-blur pass over a background texture, filling whatever
   canvas it's given.

   This is the real, per-pixel version of "liquid glass" (as opposed
   to the CSS feTurbulence/feDisplacementMap noise-warp already in
   PortfolioOS.css) — same family of math as the SDF-lens shader
   walkthrough this was built from, adapted for this app's case:

   The glass panel here is always exactly the whole canvas (a window
   fills its own canvas, edge to edge) rather than a floating shape
   over an unbounded scene, so there's no "inside vs outside the
   panel" branch or SDF distance-to-rounded-rect test to do — the
   panel's rounded corners are just clipped by the <canvas>'s own CSS
   border-radius (see .os-window__glass-canvas in PortfolioOS.css).
   What's kept from the original technique is the radial
   distance-from-center field driving three effects together:
     - lens displacement (bulge stronger toward the edges)
     - a small 5x5 Gaussian blur, radius varying with that same field
     - edge-only chromatic aberration (R/G/B sampled from slightly
       different points, strongest at the edges)

   One instance = one <canvas>. Render is on-demand (call .render()
   whenever the window's rect, theme, or background changes) — there
   is deliberately no internal rAF loop, so an idle window costs
   nothing after its last render. See GlassCanvas.tsx for the React
   wiring and when render() gets called.
   ------------------------------------------------------------------ */

const VERTEX_SRC = `#version 300 es
// Fullscreen triangle from just the vertex index — no vertex buffer
// needed at all.
const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);

out vec2 vUv;

void main() {
  vec2 pos = POSITIONS[gl_VertexID];
  vUv = pos * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`

const FRAGMENT_SRC = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uBackground;
uniform vec2 uResolution;     // canvas size, device px
uniform float uDistortion;    // 0..1 lens bulge strength
uniform float uAberrationPx;  // max R/B channel shift at the edge, px
uniform float uBlurPx;        // base Gaussian sample spacing, px
uniform vec3 uTint;           // multiplied into the sampled color
uniform float uTintStrength;  // 0..1 mix amount for the tint
uniform float uAlpha;         // output alpha — this layer BLENDS over
                               // the existing CSS backdrop-filter base
                               // layer, it doesn't replace it

vec3 sampleBg(vec2 pxCoord) {
  vec2 uv = clamp(pxCoord / uResolution, 0.0, 1.0);
  return texture(uBackground, uv).rgb;
}

// 5x5 Gaussian, weights recomputed per-call (radius varies across the
// surface) rather than a fixed kernel — the whole point is that blur
// softens progressively toward the edges, not uniformly.
vec3 blurredSample(vec2 pxCoord, float radius) {
  vec3 color = vec3(0.0);
  float totalWeight = 0.0;
  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      vec2 offset = vec2(float(x), float(y)) * radius;
      float weight = exp(-0.5 * float(x * x + y * y) / 2.0);
      color += sampleBg(pxCoord + offset) * weight;
      totalWeight += weight;
    }
  }
  return color / totalWeight;
}

void main() {
  vec2 fragCoord = vUv * uResolution;
  vec2 halfSize = max(uResolution * 0.5, vec2(1.0));

  // -1..1 across each axis, (0,0) at the panel's own center — since
  // the panel IS the canvas here, this doubles as our distance field
  // (no separate SDF-vs-rounded-rect test needed, see file header).
  vec2 rel = (fragCoord - halfSize) / halfSize;
  float dist = clamp(length(rel), 0.0, 1.0);
  vec2 dir = dist > 0.0001 ? rel / max(length(rel), 0.0001) : vec2(0.0);

  // Same lens curve as a quarter-circle profile: ~0 at center, ~1 at
  // the edge, smoothly in between — this is what gives the "glass
  // bulges more toward its rim" look rather than a uniform shift.
  float distortion = 1.0 - sqrt(1.0 - pow(dist, 2.0));
  vec2 offsetPx = distortion * dir * halfSize * uDistortion;
  vec2 sampleCoord = fragCoord - offsetPx;

  // Slightly softer at the edges than dead-center.
  float blurRadius = uBlurPx * mix(1.0, 0.6, dist);

  // Chromatic aberration ramps in only near the edge (smoothstep
  // floor at 0.0 keeps the very center perfectly clean).
  float edge = smoothstep(0.0, 0.45, dist);
  vec2 shift = dir * edge * uAberrationPx;

  vec3 glassColor = vec3(
    blurredSample(sampleCoord - shift, blurRadius).r,
    blurredSample(sampleCoord, blurRadius).g,
    blurredSample(sampleCoord + shift, blurRadius).b
  );

  glassColor = mix(glassColor, glassColor * uTint, uTintStrength);
  outColor = vec4(glassColor, uAlpha);
}
`

export type GlassRenderParams = {
  /** Canvas size in device pixels — call resize() with the same
   *  values first so the drawing buffer actually matches. */
  widthPx: number
  heightPx: number
  distortion: number
  aberrationPx: number
  blurPx: number
  tint: [number, number, number]
  tintStrength: number
  alpha: number
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('liquidGlassRenderer: could not create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`liquidGlassRenderer: shader compile error — ${info}`)
  }
  return shader
}

const UNIFORM_NAMES = [
  'uBackground',
  'uResolution',
  'uDistortion',
  'uAberrationPx',
  'uBlurPx',
  'uTint',
  'uTintStrength',
  'uAlpha',
] as const

type UniformName = (typeof UNIFORM_NAMES)[number]

export class LiquidGlassRenderer {
  private gl: WebGL2RenderingContext | null = null
  private program: WebGLProgram | null = null
  private texture: WebGLTexture | null = null
  private vao: WebGLVertexArrayObject | null = null
  private uniforms: Partial<Record<UniformName, WebGLUniformLocation | null>> = {}

  constructor(canvas: HTMLCanvasElement) {
    // low-power: this is a decorative layer, not the main content —
    // no reason to request the discrete GPU on a laptop for it.
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return // isSupported() will report false; caller no-ops

    try {
      this.gl = gl
      this.setup()
    } catch (err) {
      console.warn('[liquidGlassRenderer]', err)
      this.gl = null
    }
  }

  isSupported(): boolean {
    return this.gl !== null && this.program !== null
  }

  private setup() {
    const gl = this.gl
    if (!gl) return

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)

    const program = gl.createProgram()
    if (!program) throw new Error('liquidGlassRenderer: could not create program')
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw new Error(`liquidGlassRenderer: program link error — ${info}`)
    }
    this.program = program

    for (const name of UNIFORM_NAMES) {
      this.uniforms[name] = gl.getUniformLocation(program, name)
    }

    // No vertex attributes — the fullscreen triangle is generated
    // purely from gl_VertexID in the vertex shader — but WebGL2
    // requires a bound VAO (even an empty one) to draw.
    this.vao = gl.createVertexArray()

    this.texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }

  /** Resize the canvas's actual drawing buffer (device px, not CSS
   *  px) and the GL viewport to match. Cheap no-op if unchanged. */
  resize(widthPx: number, heightPx: number) {
    const gl = this.gl
    if (!gl) return
    const canvas = gl.canvas as HTMLCanvasElement
    if (canvas.width !== widthPx || canvas.height !== heightPx) {
      canvas.width = widthPx
      canvas.height = heightPx
    }
    gl.viewport(0, 0, widthPx, heightPx)
  }

  /** Upload a new background crop. Expected to already be sized to
   *  roughly match the panel (see GlassCanvas's scratch-canvas crop)
   *  — this just uploads whatever it's given. */
  setBackgroundSource(source: TexImageSource) {
    const gl = this.gl
    if (!gl || !this.texture) return
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    // Canvas2D crops are top-left-origin; flip so uv (0,0) matches
    // that instead of WebGL's default bottom-left texture origin.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  }

  render(params: GlassRenderParams) {
    const gl = this.gl
    if (!gl || !this.program) return

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.uniform1i(this.uniforms.uBackground ?? null, 0)

    gl.uniform2f(this.uniforms.uResolution ?? null, params.widthPx, params.heightPx)
    gl.uniform1f(this.uniforms.uDistortion ?? null, params.distortion)
    gl.uniform1f(this.uniforms.uAberrationPx ?? null, params.aberrationPx)
    gl.uniform1f(this.uniforms.uBlurPx ?? null, params.blurPx)
    gl.uniform3f(
      this.uniforms.uTint ?? null,
      params.tint[0],
      params.tint[1],
      params.tint[2]
    )
    gl.uniform1f(this.uniforms.uTintStrength ?? null, params.tintStrength)
    gl.uniform1f(this.uniforms.uAlpha ?? null, params.alpha)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  destroy() {
    const gl = this.gl
    if (!gl) return
    if (this.program) gl.deleteProgram(this.program)
    if (this.texture) gl.deleteTexture(this.texture)
    if (this.vao) gl.deleteVertexArray(this.vao)
    this.gl = null
    this.program = null
    this.texture = null
    this.vao = null
  }
}