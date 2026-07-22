"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

type MidiNote = { x: number; y: number; width: number; pitch: number; velocity: number };
type Direction = { id: string; name: string; detail: string; change: string; notes: MidiNote[] };

const directions: Direction[] = [
  {
    id: "a",
    name: "A / Subtle",
    detail: "Contour held",
    change: "Rhythm 18%",
    notes: [
      { x: 4, y: 58, width: 10, pitch: 62, velocity: 66 }, { x: 17, y: 47, width: 8, pitch: 65, velocity: 59 },
      { x: 28, y: 36, width: 13, pitch: 67, velocity: 74 }, { x: 44, y: 51, width: 9, pitch: 64, velocity: 64 },
      { x: 57, y: 29, width: 11, pitch: 69, velocity: 82 }, { x: 71, y: 40, width: 8, pitch: 67, velocity: 67 },
      { x: 82, y: 23, width: 13, pitch: 71, velocity: 79 },
    ],
  },
  {
    id: "b",
    name: "B / Rhythmic",
    detail: "Syncopation +",
    change: "Rhythm 64%",
    notes: [
      { x: 4, y: 58, width: 7, pitch: 62, velocity: 72 }, { x: 14, y: 47, width: 5, pitch: 65, velocity: 52 },
      { x: 23, y: 52, width: 9, pitch: 64, velocity: 78 }, { x: 35, y: 35, width: 6, pitch: 67, velocity: 61 },
      { x: 44, y: 47, width: 8, pitch: 65, velocity: 84 }, { x: 55, y: 28, width: 10, pitch: 69, velocity: 69 },
      { x: 69, y: 39, width: 6, pitch: 67, velocity: 75 }, { x: 78, y: 22, width: 12, pitch: 71, velocity: 86 },
      { x: 92, y: 34, width: 5, pitch: 68, velocity: 58 },
    ],
  },
  {
    id: "c",
    name: "C / Melodic",
    detail: "Register lifted",
    change: "Pitch 42%",
    notes: [
      { x: 4, y: 59, width: 9, pitch: 62, velocity: 68 }, { x: 16, y: 39, width: 8, pitch: 67, velocity: 64 },
      { x: 28, y: 24, width: 12, pitch: 71, velocity: 77 }, { x: 44, y: 43, width: 8, pitch: 66, velocity: 61 },
      { x: 56, y: 16, width: 10, pitch: 74, velocity: 86 }, { x: 70, y: 31, width: 8, pitch: 69, velocity: 70 },
      { x: 82, y: 9, width: 14, pitch: 76, velocity: 82 },
    ],
  },
  {
    id: "d",
    name: "D / Explore",
    detail: "Wide alternative",
    change: "Strength 86%",
    notes: [
      { x: 4, y: 58, width: 8, pitch: 62, velocity: 71 }, { x: 15, y: 29, width: 6, pitch: 69, velocity: 58 },
      { x: 24, y: 66, width: 10, pitch: 60, velocity: 82 }, { x: 38, y: 19, width: 7, pitch: 72, velocity: 67 },
      { x: 48, y: 43, width: 11, pitch: 66, velocity: 79 }, { x: 62, y: 9, width: 8, pitch: 76, velocity: 88 },
      { x: 74, y: 36, width: 7, pitch: 68, velocity: 63 }, { x: 84, y: 15, width: 13, pitch: 74, velocity: 84 },
    ],
  },
];

function frequencyFromMidi(pitch: number) {
  return 440 * 2 ** ((pitch - 69) / 12);
}

export default function MidiConsole() {
  const [activeId, setActiveId] = useState("b");
  const [strength, setStrength] = useState(58);
  const [playing, setPlaying] = useState(false);
  const [generated, setGenerated] = useState(4);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [keptDirection, setKeptDirection] = useState<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rollRectRef = useRef<DOMRect | null>(null);
  const active = directions.find((direction) => direction.id === activeId) ?? directions[1];

  useEffect(() => () => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    void audioRef.current?.close();
  }, []);

  const play = () => {
    if (playing) return;
    const AudioContextClass = window.AudioContext;
    const context = audioRef.current?.state === "closed" || !audioRef.current
      ? new AudioContextClass()
      : audioRef.current;
    audioRef.current = context;
    const now = context.currentTime + 0.04;
    const totalDuration = 2.65;

    active.notes.forEach((note) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + (note.x / 100) * totalDuration;
      const duration = Math.max(0.1, (note.width / 100) * totalDuration);
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequencyFromMidi(note.pitch), start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime((note.velocity / 127) * 0.11, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    });

    setPlaying(true);
    stopTimerRef.current = setTimeout(() => setPlaying(false), totalDuration * 1000 + 140);
  };

  const changeDirection = (id: string) => {
    setActiveId(id);
    setSelectedNote(null);
    setKeptDirection(null);
    setPlaying(false);
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
  };

  const handleRollPointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    rollRectRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handleRollPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = rollRectRef.current;
    if (!rect || event.pointerType === "touch") return;
    const progress = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    event.currentTarget.style.setProperty("--pointer-progress", progress.toFixed(3));
  };

  return (
    <div className="midi-console">
      <div className="console-topbar">
        <div className="console-file">
          <i aria-hidden="true" /><span><b>MIDNIGHT_SKETCH.MID</b><small>04 BARS / D MINOR / 128 BPM</small></span>
        </div>
        <div className="console-state"><i /><span>CONTEXT READY</span><b>LOCAL DEMO</b></div>
      </div>

      <div className="console-main">
        <div className="console-roll">
          <div className="roll-ruler"><span /><b>01</b><b>02</b><b>03</b><b>04</b><i>1/16</i></div>
          <div className="roll-content">
            <div className="roll-keys" aria-hidden="true">
              {["C5", "A4", "F4", "D4", "C4", "A3", "F3", "D3"].map((key, index) => <span className={index % 3 === 1 ? "is-dark" : ""} key={key}>{key}</span>)}
            </div>
            <div
              className={playing ? "roll-grid is-playing" : "roll-grid"}
              onPointerEnter={handleRollPointerEnter}
              onPointerMove={handleRollPointerMove}
              onPointerLeave={(event) => event.currentTarget.style.removeProperty("--pointer-progress")}
            >
              <div className="roll-pointer" />
              <div className="roll-playhead" />
              {active.notes.map((note, index) => (
                <button
                  className={selectedNote === index ? "midi-note is-selected" : "midi-note"}
                  key={`${active.id}-${index}`}
                  type="button"
                  aria-label={`MIDI note ${note.pitch}, velocity ${note.velocity}`}
                  aria-pressed={selectedNote === index}
                  onClick={() => setSelectedNote(selectedNote === index ? null : index)}
                  style={{
                    left: `${note.x}%`, top: `${note.y}%`, width: `${note.width}%`,
                    "--note-delay": `${index * 26}ms`, "--velocity": note.velocity / 127,
                  } as CSSProperties}
                ><i /></button>
              ))}
            </div>
          </div>
          <div className="velocity-row" aria-hidden="true">
            <span>VEL</span><div>{active.notes.map((note, index) => <i key={index} style={{ left: `${note.x + note.width / 2}%`, height: `${20 + note.velocity * 0.48}%` }} />)}</div>
          </div>
          <div className="transport">
            <button className={playing ? "transport-play is-active" : "transport-play"} type="button" onClick={play} aria-label={playing ? "Playing preview" : "Play MIDI preview"}>
              {playing ? <span><i /><i /><i /></span> : <svg viewBox="0 0 18 18" aria-hidden="true"><path d="m6 4 8 5-8 5Z" /></svg>}
            </button>
            <span>00:0{playing ? "2" : "0"}:000</span>
            <small>{active.name.toUpperCase()}</small>
          </div>
        </div>

        <aside className="console-panel">
          <div className="panel-heading"><span><i /> SIGNAL</span><b>VARIATION</b></div>
          <p className="panel-prompt">Make it move more, but keep the melodic shape.</p>
          <div className="intent-readout">
            <span>INTERPRETED INTENT</span>
            <dl><div><dt>PRESERVE</dt><dd>Contour / Key</dd></div><div><dt>CHANGE</dt><dd>Rhythm / Velocity</dd></div></dl>
          </div>
          <label className="strength-slider">
            <span><b>VARIATION STRENGTH</b><output>{strength}%</output></span>
            <input type="range" min="0" max="100" value={strength} onChange={(event) => setStrength(Number(event.target.value))} />
            <i style={{ width: `${strength}%` }} />
          </label>
          <div className="panel-controls"><div>RHYTHM <b>72</b></div><div>PITCH <b>38</b></div><div>DENSITY <b>KEEP</b></div></div>
          <button className="generate-action" type="button" onClick={() => { setGenerated((value) => value + 4); changeDirection(directions[(directions.findIndex((item) => item.id === activeId) + 1) % directions.length].id); }}>
            Generate four directions <span>↗</span>
          </button>
          <small className="generated-state" aria-live="polite">{generated} precomputed candidates / no upload</small>
        </aside>
      </div>

      <div className="direction-bar">
        <div className="direction-label"><span>04</span><p><b>COMPARE ROUTES</b><small>Choose the next musical decision</small></p></div>
        <div className="direction-tabs" role="group" aria-label="MIDI directions">
          {directions.map((direction) => (
            <button className={direction.id === activeId ? "is-active" : ""} type="button" key={direction.id} onClick={() => changeDirection(direction.id)} aria-pressed={direction.id === activeId}>
              <span>{direction.name}</span><b>{direction.detail}</b><small>{direction.change}</small>
            </button>
          ))}
        </div>
        <button className={keptDirection === active.id ? "keep-direction is-kept" : "keep-direction"} type="button" onClick={() => setKeptDirection(active.id)}>
          {keptDirection === active.id ? `${active.id.toUpperCase()} kept / undo ready` : `Keep ${active.id.toUpperCase()}`} <span>{keptDirection === active.id ? "✓" : "→"}</span>
        </button>
      </div>
    </div>
  );
}
