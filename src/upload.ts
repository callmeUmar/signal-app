import type { AnalysisResult } from './types'

// ── Wave animation ────────────────────────────────────────────────────────────

function buildWave(seed: number, amp: number): string {
  let d = 'M0,55 '
  for (let x = 0; x <= 1000; x += 6) {
    const y =
      55 +
      Math.sin(x * 0.02 + seed) * amp +
      Math.sin(x * 0.05 + seed * 2) * (amp * 0.4) +
      Math.sin(x * 0.11 + seed * 0.5) * (amp * 0.2)
    d += `L${x},${y.toFixed(1)} `
  }
  return d
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let t = 0
let waveActive = false

function animateWave(): void {
  if (waveActive) {
    t += 0.05
    document.querySelector<SVGPathElement>('#waveMain')?.setAttribute('d', buildWave(t, 26))
    document.querySelector<SVGPathElement>('#waveDim')?.setAttribute('d', buildWave(t * 0.7 + 1.4, 36))
  }
  if (!reduced) requestAnimationFrame(animateWave)
}
requestAnimationFrame(animateWave)

// ── DOM refs ──────────────────────────────────────────────────────────────────

const dropzone   = document.getElementById('dropzone')   as HTMLElement
const fileInput  = document.getElementById('fileInput')  as HTMLInputElement
const fileList   = document.getElementById('fileList')   as HTMLElement
const scope      = document.getElementById('scope')      as HTMLElement
const scopeLabel = document.getElementById('scopeLabel') as HTMLElement
const progressVal = document.getElementById('progressVal') as HTMLElement
const continueBtn = document.getElementById('continueBtn') as HTMLButtonElement

// ── Dropzone ──────────────────────────────────────────────────────────────────

dropzone.addEventListener('click', () => fileInput.click())

;(['dragover', 'dragenter'] as const).forEach(evt =>
  dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add('drag-over') })
)
;(['dragleave', 'drop'] as const).forEach(evt =>
  dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove('drag-over') })
)
dropzone.addEventListener('drop', (e: DragEvent) => {
  if (e.dataTransfer?.files.length) handleFiles(e.dataTransfer.files)
})
fileInput.addEventListener('change', () => {
  if (fileInput.files?.length) handleFiles(fileInput.files)
})

// ── File handling ─────────────────────────────────────────────────────────────

function handleFiles(files: FileList | File[]): void {
  const first = files[0]
  scopeLabel.textContent = 'ANALYZING — ' + first.name
  scope.classList.add('show')
  waveActive = true
  fileList.innerHTML = ''

  Array.from(files).forEach(f => {
    const row = document.createElement('div')
    row.className = 'file-row'
    row.innerHTML = `<span class="name">${f.name}</span><span class="status mono">queued</span>`
    fileList.appendChild(row)
  })

  let pct = 0
  const timer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 6 + 2, 90)
    progressVal.textContent = Math.floor(pct) + '%'
  }, 260)

  const formData = new FormData()
  formData.append('file', first)

  fetch('/analyze', { method: 'POST', body: formData })
    .then(r => r.json())
    .then((data: AnalysisResult) => {
      clearInterval(timer)
      progressVal.textContent = '100%'
      waveActive = false
      localStorage.setItem('signalAnalysis', JSON.stringify(data))
      markDone()
    })
    .catch(() => {
      clearInterval(timer)
      progressVal.textContent = '100%'
      waveActive = false
      markDone()
    })
}

function markDone(): void {
  document.querySelectorAll<HTMLElement>('.file-row .status').forEach(s => {
    s.textContent = 'analyzed'
    s.classList.add('done')
  })
  continueBtn.classList.add('ready')
}

continueBtn.addEventListener('click', () => { window.location.href = 'pick-five.html' })

// ── Streaming service buttons (demo simulation) ───────────────────────────────

function simulateAnalysis(name: string): void {
  scopeLabel.textContent = 'ANALYZING — ' + name
  scope.classList.add('show')
  waveActive = true
  fileList.innerHTML = ''
  const row = document.createElement('div')
  row.className = 'file-row'
  row.innerHTML = `<span class="name">${name}</span><span class="status mono">queued</span>`
  fileList.appendChild(row)

  let pct = 0
  const timer = setInterval(() => {
    pct += Math.random() * 12 + 6
    if (pct >= 100) {
      pct = 100
      clearInterval(timer)
      waveActive = false
      markDone()
    }
    progressVal.textContent = Math.floor(pct) + '%'
  }, 260)
}

document.getElementById('connectSpotify')!.addEventListener('click', () => simulateAnalysis('spotify_playlist_export.json'))
document.getElementById('connectApple')!.addEventListener('click',   () => simulateAnalysis('apple_music_library.xml'))
