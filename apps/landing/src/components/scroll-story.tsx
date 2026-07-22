"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const beats = [
  {
    index: "00",
    eyebrow: "AI MIDI COPILOT / FL STUDIO",
    title: <>Keep the spark.<br /><em>Move it forward.</em></>,
    copy: "Signal starts with the notes already carrying your intent, then turns them into editable next moves.",
    side: "left",
  },
  {
    index: "01",
    eyebrow: "MUSICAL CONTEXT",
    title: <>It reads music.<br /><em>Not prompts.</em></>,
    copy: "Rhythm, contour, key and density become a clear musical map before anything is generated.",
    side: "right",
  },
  {
    index: "02",
    eyebrow: "CONTROLLED EXPLORATION",
    title: <>One motif.<br /><em>Four directions.</em></>,
    copy: "Each route stays connected to the source while changing one meaningful part of the idea.",
    side: "left",
  },
  {
    index: "03",
    eyebrow: "PREVIEW BEFORE INSERT",
    title: <>Hear the change.<br /><em>See every note.</em></>,
    copy: "Compare the candidates against the original before anything reaches your Piano Roll.",
    side: "right",
  },
  {
    index: "04",
    eyebrow: "THE PRODUCER DECIDES",
    title: <>Your direction.<br /><em>Your music.</em></>,
    copy: "Keep one route, edit every note and continue in FL Studio without breaking the flow.",
    side: "center",
  },
];

const sourceNotes = [
  [204, 304, 62], [286, 268, 44], [348, 232, 78], [448, 282, 54],
  [526, 210, 70], [620, 246, 46], [688, 188, 92],
];

const variations = [
  { key: "A", label: "SUBTLE", y: 146, notes: [[230, 0, 62], [312, -18, 44], [374, -36, 78], [474, 4, 54], [552, -52, 70], [646, -24, 46], [714, -70, 70]] },
  { key: "B", label: "RHYTHMIC", y: 252, notes: [[208, 0, 38], [262, -22, 28], [308, -8, 52], [378, -38, 32], [430, -16, 44], [492, -55, 60], [570, -26, 34], [620, -68, 76], [716, -42, 48]] },
  { key: "C", label: "MELODIC", y: 358, notes: [[218, 0, 54], [292, -42, 52], [364, -72, 70], [454, -32, 44], [518, -86, 62], [600, -112, 52], [672, -76, 90]] },
  { key: "D", label: "EXPLORE", y: 464, notes: [[212, 0, 46], [278, -58, 34], [330, 18, 64], [414, -92, 42], [476, -34, 70], [566, -118, 50], [636, -56, 38], [694, -138, 88]] },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (start: number, end: number, value: number) => {
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};

function StoryMark() {
  return <span className="story-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25" /></svg>;
}

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastBeat = -1;
    let sectionTop = 0;
    let scrollDistance = 1;
    let needsMeasure = true;

    const update = () => {
      if (needsMeasure) {
        sectionTop = section.getBoundingClientRect().top + window.scrollY;
        scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
        needsMeasure = false;
      }
      const progress = reducedMotion.matches ? 0 : clamp((window.scrollY - sectionTop) / scrollDistance);
      const analyse = smooth(0.13, 0.34, progress);
      const branch = smooth(0.33, 0.61, progress);
      const inspect = smooth(0.58, 0.79, progress);
      const resolve = smooth(0.78, 0.98, progress);

      sticky.style.setProperty("--story-progress", progress.toFixed(4));
      sticky.style.setProperty("--story-analyse", analyse.toFixed(4));
      sticky.style.setProperty("--story-branch", branch.toFixed(4));
      sticky.style.setProperty("--story-inspect", inspect.toFixed(4));
      sticky.style.setProperty("--story-resolve", resolve.toFixed(4));
      sticky.style.setProperty("--source-y", `${(-54 * analyse).toFixed(2)}px`);
      sticky.style.setProperty("--source-opacity", (1 - branch * 0.82).toFixed(4));
      sticky.style.setProperty("--final-opacity", resolve.toFixed(4));
      sticky.style.setProperty("--analysis-opacity", (analyse * (1 - branch)).toFixed(4));
      sticky.style.setProperty("--context-opacity", (1 - resolve).toFixed(4));
      sticky.style.setProperty("--selection-opacity", (inspect * (1 - resolve * 0.35)).toFixed(4));

      variations.forEach((_, index) => {
        const lane = smooth(0.36 + index * 0.035, 0.57 + index * 0.035, progress);
        const fade = index === 2 ? 1 : 1 - resolve * 0.92;
        sticky.style.setProperty(`--lane-${index}-opacity`, (lane * fade).toFixed(4));
        sticky.style.setProperty(`--lane-${index}-x`, `${((1 - lane) * 38).toFixed(2)}px`);
      });

      const nextBeat = progress < 0.17 ? 0 : progress < 0.38 ? 1 : progress < 0.61 ? 2 : progress < 0.82 ? 3 : 4;
      sticky.style.setProperty("--stage-x", ["15vw", "-14vw", "14vw", "-14vw", "0vw"][nextBeat]);
      sticky.style.setProperty("--stage-opacity", nextBeat === 4 ? "0.46" : "0.9");
      if (nextBeat !== lastBeat) {
        lastBeat = nextBeat;
        setActiveBeat(nextBeat);
      }
      frame = 0;
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const scheduleMeasure = () => {
      needsMeasure = true;
      scheduleUpdate();
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleMeasure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="scroll-story" id="top" ref={sectionRef}>
      <div className="story-sticky" ref={stickyRef}>
        <div className="story-wash" aria-hidden="true" />

        <div className="story-hud story-hud--top">
          <span><StoryMark /> SIGNAL / MIDI CONTEXT</span>
          <span className="story-status">FL STUDIO · CONNECTED</span>
        </div>

        <div className="story-stage" aria-hidden="true">
          <svg className="story-roll" viewBox="0 0 1000 640" role="presentation">
            <defs>
              <pattern id="minorGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M24 0H0V24" className="story-grid-minor" />
              </pattern>
              <pattern id="majorGrid" width="96" height="96" patternUnits="userSpaceOnUse">
                <rect width="96" height="96" fill="url(#minorGrid)" />
                <path d="M96 0H0V96" className="story-grid-major" />
              </pattern>
            </defs>

            <rect className="story-roll-shell" x="1" y="1" width="998" height="638" rx="18" />
            <rect className="story-roll-grid" x="116" y="72" width="834" height="510" fill="url(#majorGrid)" />
            <path className="story-roll-rule" d="M116 72V582M116 112H950M116 528H950" />
            <g className="story-ruler">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => <text key={bar} x={142 + (bar - 1) * 96} y="98">{bar}</text>)}
            </g>
            <g className="story-keys">
              {["D5", "A4", "F4", "D4", "A3", "D3"].map((key, index) => <text key={key} x="52" y={150 + index * 82}>{key}</text>)}
            </g>

            <g className="story-source-motif">
              <text className="story-motif-label" x="202" y="170">SOURCE / 04 BARS</text>
              <path className="story-contour" d="M206 318 C298 280 352 236 422 258 S546 198 606 236 S704 174 786 198" />
              {sourceNotes.map(([x, y, width], index) => (
                <rect className="story-note story-note--source" key={index} x={x} y={y} width={width} height="16" rx="3" />
              ))}
            </g>

            <g className="story-analysis-map">
              <path d="M222 214H412M222 246H356M222 278H450" />
              <text x="222" y="204">RHYTHM</text><text x="420" y="218">68 / SYNCOPATED</text>
              <text x="222" y="236">CONTOUR</text><text x="364" y="250">+7 / RISING</text>
              <text x="222" y="268">DENSITY</text><text x="458" y="282">42 / OPEN</text>
              <circle cx="702" cy="248" r="72" /><path d="M702 176V320M630 248H774M651 202L753 294M753 202L651 294" />
              <text x="672" y="253">D MINOR</text>
            </g>

            <g className="story-variants">
              {variations.map((variant, index) => (
                <g
                  className={`story-variant story-variant--${index}`}
                  key={variant.key}
                  style={{ "--lane-opacity": `var(--lane-${index}-opacity)`, "--lane-x": `var(--lane-${index}-x)` } as CSSProperties}
                >
                  <text x="154" y={variant.y + 5}>{variant.key}</text>
                  <text className="story-variant-label" x="178" y={variant.y + 5}>{variant.label}</text>
                  <path className="story-variant-line" d={`M210 ${variant.y + 20}H850`} />
                  {variant.notes.map(([x, offset, width], noteIndex) => (
                    <rect className="story-note" key={noteIndex} x={x} y={variant.y + offset} width={width} height="13" rx="2" />
                  ))}
                  {index === 2 && <path className="story-selected-bracket" d={`M198 ${variant.y - 132}V${variant.y + 38}M198 ${variant.y - 132}H210M198 ${variant.y + 38}H210`} />}
                </g>
              ))}
            </g>

            <g className="story-final-motif">
              <text className="story-motif-label" x="220" y="180">SELECTED / MELODIC</text>
              <text className="story-final-title" x="220" y="230">A direction worth keeping.</text>
              {variations[2].notes.map(([x, offset, width], index) => (
                <rect className="story-note story-note--final" key={index} x={x} y={334 + offset} width={width} height="17" rx="3" />
              ))}
              <path className="story-playhead" d="M596 258V456" />
              <text className="story-final-meta" x="220" y="474">7 NOTES CHANGED · 100% EDITABLE MIDI</text>
            </g>
          </svg>

          <div className="story-context-readout">
            <span>KEY<strong>D MINOR</strong></span>
            <span>TEMPO<strong>128 BPM</strong></span>
            <span>LENGTH<strong>04 BARS</strong></span>
          </div>
          <div className="story-selection-tag"><i /> C · MELODIC</div>
        </div>

        <div className="story-copy-layer container">
          {beats.map((beat, index) => (
            <article className={`story-beat story-beat--${beat.side} ${activeBeat === index ? "story-beat--active" : ""}`} key={beat.index} aria-hidden={activeBeat !== index}>
              <span className="story-beat-index">{beat.index} / 04</span>
              <small>{beat.eyebrow}</small>
              {index === 0 ? <h1>{beat.title}</h1> : <h2>{beat.title}</h2>}
              <p>{beat.copy}</p>
              {index === 0 && <div className="story-proof"><span>Editable MIDI</span><i /><span>Preview first</span><i /><span>Local-first</span></div>}
              {index === 4 && <div className="story-actions"><a className="button button--primary" href="#demo">Try the live demo <ArrowIcon /></a><a className="button button--ghost" href="#workflow">See FL workflow</a></div>}
            </article>
          ))}
        </div>

        <div className="story-hud story-hud--bottom">
          <span className="story-scroll">Scroll to explore</span>
          <div className="story-progress"><i /></div>
          <span className="story-percent">00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100</span>
        </div>
      </div>
    </section>
  );
}
