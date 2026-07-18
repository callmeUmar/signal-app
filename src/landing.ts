// ── Wave helpers ──────────────────────────────────────────────────────────────

function buildWave(seed: number, amp: number): string {
  let d = 'M0,80 '
  for (let x = 0; x <= 1000; x += 5) {
    const y =
      80 +
      Math.sin(x * 0.02 + seed) * amp +
      Math.sin(x * 0.05 + seed * 2) * (amp * 0.4) +
      Math.sin(x * 0.11 + seed * 0.5) * (amp * 0.2)
    d += `L${x},${y.toFixed(1)} `
  }
  return d
}

function buildFullWave(seed: number, amp: number, yBase: number, freq: number): string {
  let d = `M0,${yBase} `
  for (let x = 0; x <= 1000; x += 8) {
    const y =
      yBase +
      Math.sin(x * freq + seed) * amp +
      Math.sin(x * freq * 2.3 + seed * 1.7) * (amp * 0.35)
    d += `L${x},${y.toFixed(1)} `
  }
  return d
}

const waveMain = document.querySelector<SVGPathElement>('#waveMain')!
const waveDim  = document.querySelector<SVGPathElement>('#waveDim')!
waveMain.setAttribute('d', buildWave(0, 40))
waveDim.setAttribute('d',  buildWave(1.4, 55))

// ── Song playback ─────────────────────────────────────────────────────────────

const audio = new Audio('/sweater_weather.mp3')
audio.loop = false

let isPlaying = false

const playerBtn = document.getElementById('playerBtn')!
const iconPlay  = document.getElementById('iconPlay')  as HTMLElement
const iconPause = document.getElementById('iconPause') as HTMLElement

playerBtn.addEventListener('click', () => {
  isPlaying = !isPlaying
  if (isPlaying) {
    audio.play()
    iconPlay.style.display  = 'none'
    iconPause.style.display = 'block'
    playerBtn.setAttribute('aria-label', 'Pause')
  } else {
    audio.pause()
    iconPlay.style.display  = 'block'
    iconPause.style.display = 'none'
    playerBtn.setAttribute('aria-label', 'Play')
  }
})

// ── Animations ────────────────────────────────────────────────────────────────

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let t = 0
function animateHero(): void {
  t += 0.04
  waveMain.setAttribute('d', buildWave(t, 40))
  waveDim.setAttribute('d',  buildWave(t * 0.7 + 1.4, 55))
  if (!reduced) requestAnimationFrame(animateHero)
}
requestAnimationFrame(animateHero)

interface BgLine { el: SVGPathElement; y: number; amp: number; freq: number; speed: number }
let bgT = 0
const bgLines: BgLine[] = [
  { el: document.querySelector<SVGPathElement>('#bg1')!, y: 140, amp: 60,  freq: 0.006,  speed: 0.030 },
  { el: document.querySelector<SVGPathElement>('#bg2')!, y: 380, amp: 90,  freq: 0.004,  speed: 0.024 },
  { el: document.querySelector<SVGPathElement>('#bg3')!, y: 640, amp: 70,  freq: 0.005,  speed: 0.036 },
  { el: document.querySelector<SVGPathElement>('#bg4')!, y: 880, amp: 100, freq: 0.0035, speed: 0.018 },
]

function animateBg(): void {
  bgT += 1
  bgLines.forEach(line => {
    const d = buildFullWave(bgT * line.speed, line.amp, line.y, line.freq)
    line.el.setAttribute('d', d)
    document.querySelector<SVGPathElement>('#' + line.el.id + 'glow')?.setAttribute('d', d)
  })
  if (!reduced) requestAnimationFrame(animateBg)
}
requestAnimationFrame(animateBg)

// ── Cursor glow ───────────────────────────────────────────────────────────────

const topHalf    = document.querySelector('.top-half') as HTMLElement
const glowCircle = document.querySelector<SVGCircleElement>('#glowCircle')!

topHalf.addEventListener('mousemove', (e: MouseEvent) => {
  const r = topHalf.getBoundingClientRect()
  glowCircle.setAttribute('cx', (((e.clientX - r.left) / r.width)  * 1000).toFixed(1))
  glowCircle.setAttribute('cy', (((e.clientY - r.top)  / r.height) * 1000).toFixed(1))
})
topHalf.addEventListener('mouseleave', () => {
  glowCircle.setAttribute('cx', '-500')
  glowCircle.setAttribute('cy', '-500')
})

document.getElementById('startBtn')!.addEventListener('click', () => {
  window.location.href = 'upload.html'
})

export {}
