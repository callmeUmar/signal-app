"use client";

import { useRef, useState } from "react";

type Note = { x: number; y: number; w: number; pitch: number };
type Variant = {
  id: string;
  label: string;
  detail: string;
  change: string;
  notes: Note[];
};

const variants: Variant[] = [
  {
    id: "source",
    label: "Source",
    detail: "Your motif",
    change: "0% changed",
    notes: [
      { x: 4, y: 68, w: 11, pitch: 60 }, { x: 18, y: 54, w: 8, pitch: 63 },
      { x: 29, y: 44, w: 15, pitch: 67 }, { x: 47, y: 59, w: 9, pitch: 62 },
      { x: 60, y: 37, w: 12, pitch: 69 }, { x: 76, y: 29, w: 17, pitch: 72 },
    ],
  },
  {
    id: "a",
    label: "A",
    detail: "Conservative",
    change: "18% changed",
    notes: [
      { x: 4, y: 68, w: 11, pitch: 60 }, { x: 18, y: 54, w: 8, pitch: 63 },
      { x: 29, y: 44, w: 12, pitch: 67 }, { x: 43, y: 50, w: 6, pitch: 65 },
      { x: 51, y: 59, w: 10, pitch: 62 }, { x: 64, y: 37, w: 11, pitch: 69 },
      { x: 78, y: 29, w: 15, pitch: 72 },
    ],
  },
  {
    id: "b",
    label: "B",
    detail: "Rhythmic",
    change: "36% changed",
    notes: [
      { x: 4, y: 68, w: 7, pitch: 60 }, { x: 13, y: 68, w: 4, pitch: 60 },
      { x: 20, y: 54, w: 6, pitch: 63 }, { x: 29, y: 44, w: 7, pitch: 67 },
      { x: 38, y: 44, w: 5, pitch: 67 }, { x: 47, y: 59, w: 8, pitch: 62 },
      { x: 58, y: 37, w: 5, pitch: 69 }, { x: 66, y: 45, w: 7, pitch: 67 },
      { x: 76, y: 29, w: 7, pitch: 72 }, { x: 85, y: 29, w: 8, pitch: 72 },
    ],
  },
  {
    id: "c",
    label: "C",
    detail: "Melodic",
    change: "42% changed",
    notes: [
      { x: 4, y: 68, w: 11, pitch: 60 }, { x: 18, y: 54, w: 8, pitch: 63 },
      { x: 29, y: 38, w: 12, pitch: 69 }, { x: 44, y: 25, w: 8, pitch: 74 },
      { x: 55, y: 32, w: 12, pitch: 72 }, { x: 70, y: 45, w: 8, pitch: 67 },
      { x: 81, y: 20, w: 12, pitch: 76 },
    ],
  },
  {
    id: "d",
    label: "D",
    detail: "Adventurous",
    change: "61% changed",
    notes: [
      { x: 4, y: 68, w: 8, pitch: 60 }, { x: 15, y: 37, w: 7, pitch: 69 },
      { x: 25, y: 56, w: 11, pitch: 62 }, { x: 39, y: 24, w: 8, pitch: 74 },
      { x: 50, y: 43, w: 6, pitch: 67 }, { x: 59, y: 16, w: 10, pitch: 77 },
      { x: 72, y: 31, w: 6, pitch: 72 }, { x: 81, y: 9, w: 12, pitch: 79 },
    ],
  },
];

function ArrowIcon() {
  return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25" /></svg>;
}

export default function SignalDemo() {
  const [activeId, setActiveId] = useState("b");
  const [strength, setStrength] = useState(58);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = variants.find((variant) => variant.id === activeId) ?? variants[0];

  const play = () => {
    if (isPlaying) return;
    const context = new AudioContext();
    const now = context.currentTime + 0.04;
    const duration = 3.2;

    active.notes.forEach((note) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + (note.x / 100) * duration;
      const noteDuration = Math.max(0.12, (note.w / 100) * duration);
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(440 * Math.pow(2, (note.pitch - 69) / 12), start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + noteDuration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + noteDuration + 0.03);
    });

    setIsPlaying(true);
    if (playTimer.current) clearTimeout(playTimer.current);
    playTimer.current = setTimeout(() => {
      setIsPlaying(false);
      void context.close();
    }, duration * 1000 + 250);
  };

  return (
    <div className="signal-demo">
      <div className="demo-toolbar">
        <div className="demo-file"><span className="demo-file-icon">♪</span><div><strong>midnight-sketch.mid</strong><small>4 bars · D minor · 128 BPM</small></div></div>
        <div className="demo-history"><button aria-label="Undo">↶</button><button aria-label="Redo">↷</button><span>Saved locally</span></div>
      </div>
      <div className="demo-main">
        <div className="roll-panel">
          <div className="roll-toolbar">
            <button className={`demo-play ${isPlaying ? "demo-play--active" : ""}`} onClick={play} aria-label={isPlaying ? "Playing" : "Play active MIDI variant"}>
              {isPlaying ? <span className="equalizer"><i /><i /><i /></span> : "▶"}
            </button>
            <span>1</span><span>2</span><span>3</span><span>4</span>
            <div className="roll-tools"><button aria-label="Select tool">↖</button><button aria-label="Draw tool">✎</button><button aria-label="Loop">↻</button></div>
          </div>
          <div className="piano-layout">
            <div className="piano-keys">
              {["B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3"].map((key, index) => <span className={index % 2 ? "key key--dark" : "key"} key={key}>{key}</span>)}
            </div>
            <div className={`piano-grid ${isPlaying ? "piano-grid--playing" : ""}`}>
              <div className="demo-playhead" />
              {active.notes.map((note, index) => (
                <button
                  className="demo-note"
                  aria-label={`MIDI note ${note.pitch}`}
                  key={`${active.id}-${index}`}
                  style={{ left: `${note.x}%`, top: `${note.y}%`, width: `${note.w}%`, "--note-delay": `${index * 38}ms` } as React.CSSProperties}
                ><i /></button>
              ))}
            </div>
          </div>
          <div className="velocity-lane">
            <span>VELOCITY</span>
            <div>{active.notes.map((note, index) => <i key={index} style={{ left: `${note.x + note.w / 2}%`, height: `${30 + ((index * 17) % 45)}%` }} />)}</div>
          </div>
        </div>

        <aside className="copilot-panel">
          <div className="copilot-title"><span><i /> SIGNAL COPILOT</span><small>CONTEXT READY</small></div>
          <div className="chat-bubble">Make it more syncopated, but keep the melodic shape.</div>
          <div className="intent-card">
            <div><span>Interpreted intent</span><i>EDIT</i></div>
            <p><strong>Operation</strong><span>Variation</span></p>
            <p><strong>Preserve</strong><span>Contour · Key · Length</span></p>
            <p><strong>Change</strong><span>Rhythm · Velocity</span></p>
          </div>
          <label className="strength-control">
            <span><strong>Variation strength</strong><output>{strength}%</output></span>
            <input type="range" min="0" max="100" value={strength} onChange={(event) => setStrength(Number(event.target.value))} />
            <i style={{ width: `${strength}%` }} />
          </label>
          <div className="copilot-actions"><button>Rhythm <span>72</span></button><button>Pitch <span>38</span></button><button>Density <span>Keep</span></button></div>
          <button className="generate-button">Generate 4 directions <ArrowIcon /></button>
          <small className="local-note"><i /> Precomputed demo · no MIDI uploaded</small>
        </aside>
      </div>
      <div className="candidate-bar">
        <div className="candidate-label"><span>5</span><p><strong>Compare directions</strong><small>Every result stays editable</small></p></div>
        <div className="candidate-tabs">
          {variants.map((variant) => (
            <button className={variant.id === activeId ? "candidate-tab candidate-tab--active" : "candidate-tab"} key={variant.id} onClick={() => setActiveId(variant.id)} aria-pressed={variant.id === activeId}>
              <span>{variant.label}</span><p><strong>{variant.detail}</strong><small>{variant.change}</small></p><i>▶</i>
            </button>
          ))}
        </div>
        <button className="keep-button">Keep {active.label} <ArrowIcon /></button>
      </div>
    </div>
  );
}
