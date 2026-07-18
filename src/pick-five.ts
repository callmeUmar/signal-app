import type { Track } from './types'

const tracks: Track[] = [
  { name: 'Sweater Weather',  artist: 'The Neighbourhood', duration: '4:12', analyzed: true },
  { name: 'Midnight City',    artist: 'M83',               duration: '4:03' },
  { name: 'Electric Feel',    artist: 'MGMT',              duration: '3:49' },
  { name: 'Weight of Living', artist: 'Bastille',          duration: '4:20' },
  { name: 'Sunflower',        artist: 'Rex Orange County', duration: '3:14' },
  { name: 'Time',             artist: 'Hans Zimmer',       duration: '4:35' },
  { name: 'Redbone',          artist: 'Childish Gambino',  duration: '5:27' },
  { name: 'Youth',            artist: 'Daughter',          duration: '4:00' },
  { name: 'Motion Sickness',  artist: 'Phoebe Bridgers',   duration: '3:35' },
  { name: 'Two Slow Dancers', artist: 'Mitski',            duration: '4:20' },
  { name: 'Holocene',         artist: 'Bon Iver',          duration: '5:36' },
  { name: 'Sea of Love',      artist: 'Cat Power',         duration: '2:35' },
]

const MAX_PICKS = 5
const selected = new Set<number>()
let query = ''

const trackList  = document.getElementById('trackList')  as HTMLElement
const counter    = document.getElementById('counter')    as HTMLElement
const counterN   = document.getElementById('counterN')   as HTMLElement
const continueBtn = document.getElementById('continueBtn') as HTMLButtonElement
const searchInput = document.getElementById('searchInput') as HTMLInputElement

function render(): void {
  trackList.innerHTML = ''
  const q = query.trim().toLowerCase()
  const visible = tracks
    .map((_, i) => i)
    .filter(i => !q || tracks[i].name.toLowerCase().includes(q) || tracks[i].artist.toLowerCase().includes(q))

  if (visible.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'track-row'
    empty.style.cursor = 'default'
    empty.innerHTML = `<div class="track-info"><div class="track-artist mono">no tracks match "${query}"</div></div>`
    trackList.appendChild(empty)
  }

  visible.forEach(i => {
    const track = tracks[i]
    const isSelected = selected.has(i)
    const atLimit = selected.size >= MAX_PICKS && !isSelected
    const row = document.createElement('div')
    row.className = 'track-row' + (isSelected ? ' selected' : '') + (atLimit ? ' disabled' : '')
    row.innerHTML = `
      <div class="track-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>
      </div>
      <div class="track-info">
        <div class="track-name">${track.name}</div>
        <div class="track-artist">${track.artist}</div>
      </div>
      ${track.analyzed ? '<span class="track-tag">analyzed</span>' : ''}
      <span class="track-duration mono">${track.duration}</span>
    `
    if (!atLimit) row.addEventListener('click', () => toggleTrack(i))
    trackList.appendChild(row)
  })

  counterN.textContent = String(selected.size)
  counter.classList.toggle('full', selected.size === MAX_PICKS)
  continueBtn.classList.toggle('ready', selected.size === MAX_PICKS)
}

function toggleTrack(i: number): void {
  if (selected.has(i)) {
    selected.delete(i)
  } else if (selected.size < MAX_PICKS) {
    selected.add(i)
  }
  render()
}

searchInput.addEventListener('input', () => { query = searchInput.value; render() })
continueBtn.addEventListener('click', () => { window.location.href = 'tuning.html' })

render()
