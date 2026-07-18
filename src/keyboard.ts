declare global {
  interface Window { webkitAudioContext: typeof AudioContext }
}

interface RawNote { t: number; note: string }

const rawNotes: RawNote[] = [
  { t: 0.00, note: 'C3'  },
  { t: 1.44, note: 'D4'  },
  { t: 1.48, note: 'C#4' },
  { t: 1.53, note: 'D4'  },
  { t: 1.76, note: 'D#4' },
  { t: 1.81, note: 'D4'  },
  { t: 1.95, note: 'D#4' },
  { t: 2.06, note: 'D4'  },
  { t: 2.41, note: 'F#3' },
  { t: 2.46, note: 'G3'  },
]
const clipDuration = 2.9

// ── Frequency table ───────────────────────────────────────────────────────────

const noteFreqs: Record<string, number> = {}
;['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'].forEach((name, i) => {
  for (let oct = 0; oct <= 8; oct++) {
    noteFreqs[name + oct] = 440 * Math.pow(2, ((oct + 1) * 12 + i - 69) / 12)
  }
})

// ── Keyboard builder ──────────────────────────────────────────────────────────

const WHITE_NOTES  = ['C','D','E','F','G','A','B']
const BLACK_AFTER: Record<string, string> = { C:'C#', D:'D#', F:'F#', G:'G#', A:'A#' }
const OCTAVES = [3, 4]
const WHITE_KEY_W = 34

const keyboardEl = document.getElementById('keyboard') as HTMLElement
const keyEls: Record<string, HTMLElement> = {}

OCTAVES.forEach(oct => {
  WHITE_NOTES.forEach(n => {
    const key = document.createElement('div')
    key.className = 'white-key'
    const label = document.createElement('div')
    label.className = 'key-label'
    label.textContent = n + oct
    key.appendChild(label)
    keyboardEl.appendChild(key)
    keyEls[n + oct] = key

    if (BLACK_AFTER[n]) {
      const bk = document.createElement('div')
      bk.className = 'black-key'
      keyboardEl.appendChild(bk)
      keyEls[BLACK_AFTER[n] + oct] = bk
    }
  })
})

// Position black keys after layout paint
requestAnimationFrame(() => {
  let wi = 0
  OCTAVES.forEach(oct => {
    WHITE_NOTES.forEach(n => {
      wi++
      if (BLACK_AFTER[n]) {
        keyEls[BLACK_AFTER[n] + oct].style.left = (wi * WHITE_KEY_W - 11) + 'px'
      }
    })
  })
})

// ── Note order for piano roll y-axis ──────────────────────────────────────────

const noteOrder: string[] = []
OCTAVES.forEach(oct => {
  WHITE_NOTES.forEach(n => {
    noteOrder.push(n + oct)
    if (BLACK_AFTER[n]) noteOrder.push(BLACK_AFTER[n] + oct)
  })
})

// ── Piano roll ────────────────────────────────────────────────────────────────

const roll      = document.getElementById('roll')     as HTMLElement
const playhead  = document.getElementById('playhead') as HTMLElement
const rollEls: HTMLElement[] = []

rawNotes.forEach(n => {
  const el = document.createElement('div')
  el.className = 'roll-note'
  el.style.left  = (n.t / clipDuration * 100) + '%'
  el.style.top   = (100 - (noteOrder.indexOf(n.note) / noteOrder.length) * 100) + '%'
  el.style.width = '3%'
  roll.appendChild(el)
  rollEls.push(el)
})

// ── Stats ─────────────────────────────────────────────────────────────────────

;(document.getElementById('rangeOut') as HTMLElement).textContent = 'C3 – G#4'
;(document.getElementById('countOut') as HTMLElement).textContent = String(rawNotes.length)
;(document.getElementById('durOut')   as HTMLElement).textContent = clipDuration.toFixed(1) + 's'

// ── Audio playback ────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null

function pluck(freq: number, duration: number): void {
  if (!audioCtx) {
    const Ctx = window.AudioContext ?? window.webkitAudioContext
    audioCtx = new Ctx()
  }
  const now  = audioCtx.currentTime
  const osc  = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.22, now + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(now)
  osc.stop(now + duration + 0.05)
}

// ── Playback controls ─────────────────────────────────────────────────────────

let isPlaying = false
let timers: ReturnType<typeof setTimeout>[] = []

const playBtn   = document.getElementById('playBtn')      as HTMLButtonElement
const iconPlay  = document.getElementById('btnIconPlay')  as HTMLElement
const iconPause = document.getElementById('btnIconPause') as HTMLElement
const btnLabel  = document.getElementById('btnLabel')     as HTMLElement

function clearHighlights(): void {
  Object.values(keyEls).forEach(el => el.classList.remove('active'))
  rollEls.forEach(el => el.classList.remove('active'))
}

function stopPlayback(): void {
  timers.forEach(clearTimeout)
  timers = []
  isPlaying = false
  clearHighlights()
  playhead.classList.remove('show')
  iconPlay.style.display  = 'block'
  iconPause.style.display = 'none'
  btnLabel.textContent = 'Play melody'
}

playBtn.addEventListener('click', () => {
  if (isPlaying) { stopPlayback(); return }
  isPlaying = true
  iconPlay.style.display  = 'none'
  iconPause.style.display = 'block'
  btnLabel.textContent = 'Stop'
  playhead.classList.add('show')

  rawNotes.forEach((n, i) => {
    const noteDuration = (rawNotes[i + 1] ? rawNotes[i + 1].t - n.t : 0.4) * 0.9
    timers.push(setTimeout(() => {
      clearHighlights()
      keyEls[n.note]?.classList.add('active')
      rollEls[i].classList.add('active')
      pluck(noteFreqs[n.note] ?? 220, Math.max(noteDuration, 0.15))
    }, n.t * 1000))
  })

  const startTime = performance.now()
  function movePlayhead(): void {
    if (!isPlaying) return
    const elapsed = (performance.now() - startTime) / 1000
    playhead.style.left = Math.min((elapsed / clipDuration) * 100, 100) + '%'
    if (elapsed < clipDuration) requestAnimationFrame(movePlayhead)
  }
  requestAnimationFrame(movePlayhead)

  timers.push(setTimeout(stopPlayback, clipDuration * 1000 + 300))
})

// ── Back button ───────────────────────────────────────────────────────────────

document.getElementById('backBtn')!.addEventListener('click', () => {
  window.location.href = 'tuning.html'
})

export {}
