import type { AnalysisResult, MasterSlider, RefTrack } from './types'

const pitchClasses = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// ── Load real analysis from previous step ─────────────────────────────────────

const raw = localStorage.getItem('signalAnalysis')
const analysis: AnalysisResult | null = raw ? (JSON.parse(raw) as AnalysisResult) : null

// Pre-populate sliders from analysis before rendering key grid
const sliderDefaults: Record<string, number> = {
  tempo: 123, energy: 65, brightness: 36, acoustic: 18, density: 37,
}
if (analysis) {
  if (analysis.tempo_bpm      != null) sliderDefaults.tempo      = analysis.tempo_bpm
  if (analysis.energy_pct     != null) sliderDefaults.energy     = analysis.energy_pct
  if (analysis.brightness_pct != null) sliderDefaults.brightness = analysis.brightness_pct
  if (analysis.electronic_pct != null) sliderDefaults.acoustic   = analysis.electronic_pct
  if (analysis.density_pct    != null) sliderDefaults.density    = analysis.density_pct
}

// ── Key detection from analysis ───────────────────────────────────────────────

let selectedKeyIndex = 7  // G
let selectedMode = 'minor'

if (analysis?.key) {
  const parts = analysis.key.split(' ')
  const ki = pitchClasses.indexOf(parts[0])
  if (ki !== -1) { selectedKeyIndex = ki; selectedMode = parts[1] ?? 'minor' }
}

// ── Key grid ──────────────────────────────────────────────────────────────────

const keyGrid = document.getElementById('keyGrid') as HTMLElement
pitchClasses.forEach((pc, i) => {
  const chip = document.createElement('div')
  chip.className = 'key-chip' + (i === selectedKeyIndex ? ' active' : '')
  chip.textContent = pc
  chip.addEventListener('click', () => {
    selectedKeyIndex = i
    document.querySelectorAll('.key-chip').forEach((c, idx) => c.classList.toggle('active', idx === i))
    updatePrompt()
  })
  keyGrid.appendChild(chip)
})

// ── Mode toggle ───────────────────────────────────────────────────────────────

document.querySelectorAll<HTMLButtonElement>('.mode-btn').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.mode === selectedMode)
  btn.addEventListener('click', () => {
    if (btn.dataset.mode) selectedMode = btn.dataset.mode
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b === btn))
    updatePrompt()
  })
})

// ── Master sliders ────────────────────────────────────────────────────────────

const masterDefs: MasterSlider[] = [
  { id: 'tempo', unit: 'bpm' },
  { id: 'energy', unit: '%' },
  { id: 'brightness', unit: '%' },
  { id: 'acoustic', unit: '%' },
  { id: 'density', unit: '%' },
]

masterDefs.forEach(m => {
  const slider = document.getElementById('m-' + m.id) as HTMLInputElement
  const output = document.getElementById('m-' + m.id + '-out') as HTMLElement
  slider.value = String(Math.round(sliderDefaults[m.id]))
  output.textContent = slider.value + m.unit
  slider.addEventListener('input', () => {
    output.textContent = slider.value + m.unit
    updatePrompt()
  })
})

// ── Reference blend grid ──────────────────────────────────────────────────────

const refs: RefTrack[] = [
  { name: 'Sweater Weather', key: 'G minor', tempo: 123, real: true, w: 53 },
  { name: 'Midnight City',   key: 'C major', tempo: 105, w: 20 },
  { name: 'Electric Feel',   key: 'A minor', tempo: 111, w: 0  },
  { name: 'Sunflower',       key: 'F major', tempo: 145, w: 0  },
  { name: 'Holocene',        key: 'C major', tempo: 82,  w: 0  },
]

const refGrid = document.getElementById('refGrid') as HTMLElement
refs.forEach((r, i) => {
  const card = document.createElement('div')
  card.className = 'ref-card' + (r.real ? ' real' : '')
  card.innerHTML = `
    <div class="ref-name">${r.name}${r.real ? ' <span class="tag">real analysis</span>' : ''}</div>
    <div class="ref-meta">${r.key} · ${r.tempo}bpm</div>
    <div class="ref-weight">
      <input type="range" id="r-${i}" min="0" max="100" value="${r.w}">
      <span class="val" id="r-${i}-out">${r.w}%</span>
    </div>
  `
  refGrid.appendChild(card)
  ;(document.getElementById(`r-${i}`) as HTMLInputElement).addEventListener('input', e => {
    ;(document.getElementById(`r-${i}-out`) as HTMLElement).textContent =
      (e.target as HTMLInputElement).value + '%'
    updatePrompt()
  })
})

// ── Prompt builder ────────────────────────────────────────────────────────────

function updatePrompt(): void {
  const vals: Record<string, string> = {}
  masterDefs.forEach(m => {
    vals[m.id] = (document.getElementById('m-' + m.id) as HTMLInputElement).value
  })
  const key = pitchClasses[selectedKeyIndex] + ' ' + selectedMode
  const weighted = refs
    .map((r, i) => ({ ...r, w: (document.getElementById(`r-${i}`) as HTMLInputElement).value }))
    .filter(r => Number(r.w) > 0)
    .sort((a, b) => Number(b.w) - Number(a.w))
    .map(r => `${r.name} (${r.w}%)`)
    .join(', ') || 'none'

  const autoVector =
    `tempo ${vals.tempo}bpm, key ${key}, energy ${vals.energy}%, ` +
    `brightness ${vals.brightness}%, acoustic-electronic ${vals.acoustic}%, ` +
    `density ${vals.density}% — blended from: ${weighted}`

  ;(document.getElementById('promptOut') as HTMLElement).textContent = autoVector

  const direction = (document.getElementById('directionInput') as HTMLTextAreaElement).value.trim()
  ;(document.getElementById('finalPrompt') as HTMLElement).textContent = direction
    ? `${autoVector}. Direction: "${direction}"`
    : autoVector
}

;(document.getElementById('directionInput') as HTMLTextAreaElement).addEventListener('input', updatePrompt)
updatePrompt()

// ── Generate animation ────────────────────────────────────────────────────────

const genOverlay  = document.getElementById('genOverlay')  as HTMLElement
const continueBtn = document.getElementById('continueBtn') as HTMLButtonElement

const petalColors = ['#3EFF8B','#8fe6ab','#39d97a','#1c7a3c','#2f6b3a','#5fe89c','#28c46a']
const petalCount  = 20
const genPetals   = document.getElementById('genPetals') as HTMLElement
const clusterSize = Math.min(window.innerWidth * 0.7, window.innerHeight * 0.7, 640)
const coreRadiusPx = clusterSize * 0.17

for (let i = 0; i < petalCount; i++) {
  const angle       = (360 / petalCount) * i
  const stalkWidth  = clusterSize * (0.045 + Math.random() * 0.035)
  const stalkHeight = clusterSize * (0.16  + Math.random() * 0.16)
  const color       = petalColors[i % petalColors.length]
  const beatDelay   = (Math.random() * 1.1).toFixed(2)

  const anchor = document.createElement('div')
  anchor.className = 'gen-stalk-anchor'
  anchor.style.transform = `rotate(${angle}deg) translateY(-${coreRadiusPx * 0.55}px)`

  const stalk = document.createElement('div')
  stalk.className = 'gen-stalk'
  stalk.style.cssText = `
    width:${stalkWidth}px;height:${stalkHeight}px;background:${color};
    animation-delay:${beatDelay}s;box-shadow:0 0 ${stalkWidth}px 0 ${color}40;
  `
  anchor.appendChild(stalk)
  genPetals.appendChild(anchor)
}

continueBtn.addEventListener('click', () => {
  genOverlay.classList.add('active')
  requestAnimationFrame(() => setTimeout(() => genOverlay.classList.add('grown'), 30))
  setTimeout(() => genOverlay.classList.remove('grown'), 3600)
  setTimeout(() => { window.location.href = 'keyboard.html' }, 4550)
})
