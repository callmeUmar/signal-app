export interface Track {
  name: string
  artist: string
  duration: string
  analyzed?: boolean
}

export interface NoteEvent {
  time_sec: number
  note: string
}

export interface AnalysisResult {
  duration_sec: number
  tempo_bpm: number
  key: string
  key_confidence: number
  energy_pct: number
  brightness_pct: number
  density_pct: number
  electronic_pct: number
  melody_sample: NoteEvent[]
  source: string
  vocals_url?: string
  instrumental_url?: string
}

export interface MasterSlider {
  id: string
  unit: string
}

export interface RefTrack {
  name: string
  key: string
  tempo: number
  real?: boolean
  w: number
}
