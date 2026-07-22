import type { CSSProperties } from "react";

const source = [
  { x: 8, y: 52, w: 11 }, { x: 22, y: 42, w: 8 }, { x: 33, y: 31, w: 13 },
  { x: 49, y: 47, w: 9 }, { x: 62, y: 25, w: 11 }, { x: 76, y: 36, w: 8 }, { x: 87, y: 18, w: 10 },
];

const routes = [
  { id: "A", label: "SUBTLE", detail: "RHYTHM 18", y: 13, notes: [[8, 45, 10], [22, 38, 8], [33, 28, 13], [49, 42, 9], [62, 23, 11], [76, 33, 8], [87, 17, 9]] },
  { id: "B", label: "RHYTHMIC", detail: "RHYTHM 64", y: 35, notes: [[8, 52, 7], [18, 42, 5], [26, 47, 9], [39, 31, 6], [48, 42, 8], [59, 25, 10], [73, 35, 6], [82, 18, 12]] },
  { id: "C", label: "MELODIC", detail: "PITCH 42", y: 57, notes: [[8, 52, 9], [21, 34, 8], [33, 21, 12], [49, 38, 8], [61, 13, 10], [75, 27, 8], [87, 8, 10]] },
  { id: "D", label: "EXPLORE", detail: "STRENGTH 86", y: 79, notes: [[8, 52, 8], [19, 27, 6], [28, 60, 10], [42, 18, 7], [52, 39, 11], [66, 8, 8], [78, 32, 7], [88, 13, 9]] },
];

const chapters = [
  { index: "01", overline: "READ THE CONTEXT", title: <>Your notes are<br />the brief.</>, copy: "Signal maps rhythm, contour, key and density before it proposes a change." },
  { index: "02", overline: "SEPARATE THE DECISIONS", title: <>One motif.<br />Four honest routes.</>, copy: "Each candidate declares what it preserved and what it changed." },
  { index: "03", overline: "PREVIEW THE DIFFERENCE", title: <>Hear the move.<br />Inspect the notes.</>, copy: "Compare every route beside the source. Nothing reaches Piano Roll yet." },
  { index: "04", overline: "KEEP AUTHORSHIP", title: <>Choose one.<br />Keep changing it.</>, copy: "The selected direction returns as MIDI, not a flattened audio answer." },
];

export default function DecisionSpine() {
  return (
    <section className="decision-spine" id="decision" aria-labelledby="decision-title">
      <div className="decision-sticky">
        <div className="decision-topline">
          <span>THE DECISION SPINE</span>
          <span>SCROLL / 01—04</span>
        </div>

        <div className="decision-copy">
          <p className="eyebrow">HOW SIGNAL MOVES</p>
          <h2 id="decision-title">From one motif<br />to one decision.</h2>
          <div className="decision-chapters">
            {chapters.map((chapter, index) => (
              <article className={`decision-chapter decision-chapter--${index + 1}`} key={chapter.index}>
                <span>{chapter.index} / 04</span>
                <small>{chapter.overline}</small>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="decision-score" aria-hidden="true">
          <div className="score-meta"><span>D MINOR</span><span>128 BPM</span><span>04 BARS</span></div>
          <div className="score-ruler"><span /><b>01</b><b>02</b><b>03</b><b>04</b></div>
          <div className="decision-source">
            <label>SOURCE / YOUR MOTIF</label>
            <div className="source-lane">
              {source.map((note, index) => (
                <i key={index} style={{ left: `${note.x}%`, top: `${note.y}%`, width: `${note.w}%`, "--source-index": index } as CSSProperties} />
              ))}
            </div>
            <div className="source-analysis"><span>CONTOUR +7</span><span>SYNCOPATION 68</span><span>DENSITY 42</span></div>
          </div>

          <svg className="decision-paths" viewBox="0 0 600 500" preserveAspectRatio="none">
            <path className="path-a" d="M28 66 C160 66 140 76 310 76 S450 73 570 73" />
            <path className="path-b" d="M28 66 C150 66 140 178 310 178 S450 178 570 178" />
            <path className="path-c" d="M28 66 C150 66 140 283 310 283 S450 283 570 283" />
            <path className="path-d" d="M28 66 C150 66 140 388 310 388 S450 388 570 388" />
          </svg>

          <div className="decision-routes">
            {routes.map((route, routeIndex) => (
              <div className={`decision-route decision-route--${routeIndex + 1}`} key={route.id} style={{ "--route-y": `${route.y}%` } as CSSProperties}>
                <div className="route-label"><b>{route.id}</b><span>{route.label}</span><small>{route.detail}</small></div>
                <div className="route-notes">
                  {route.notes.map(([x, y, width], noteIndex) => (
                    <i key={noteIndex} style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, "--route-note-index": noteIndex } as CSSProperties} />
                  ))}
                </div>
                {routeIndex === 2 && <span className="route-selection">SELECTED</span>}
              </div>
            ))}
          </div>

          <div className="decision-resolve">
            <span>DIRECTION C / MELODIC</span>
            <b>A direction<br />worth keeping.</b>
            <small>7 NOTES CHANGED / 100% EDITABLE MIDI</small>
          </div>
        </div>

        <div className="decision-progress"><i /><span>01</span><span>02</span><span>03</span><span>04</span></div>
      </div>
    </section>
  );
}
