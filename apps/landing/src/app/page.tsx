import DecisionSpine from "@/components/decision-spine";
import MidiConsole from "@/components/midi-console";
import MidiSculpture from "@/components/midi-sculpture";
import MotionRuntime from "@/components/motion-runtime";

function SignalMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "signal-mark signal-mark--compact" : "signal-mark"} aria-label="Signal">
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M3 18V10M8.5 22V6M14 16V12M19.5 25V3M25 19V9" />
      </svg>
      {!compact && <b>Signal</b>}
    </span>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg className="arrow-icon" viewBox="0 0 18 18" aria-hidden="true">
      {diagonal ? <path d="M4 14 14 4M7 4h7v7" /> : <path d="M3 9h11M10 5l4 4-4 4" />}
    </svg>
  );
}

const operations = [
  { number: "01", name: "Continue", note: "Move the phrase forward without resetting its intent.", pattern: [2, 5, 3, 7, 4, 8, 6] },
  { number: "02", name: "Variation", note: "Change rhythm, pitch or density as separate decisions.", pattern: [6, 2, 8, 4, 5, 1, 7] },
  { number: "03", name: "Simplify", note: "Find the motif hiding inside an overworked loop.", pattern: [4, 4, 7, 7, 3] },
  { number: "04", name: "Humanize", note: "Loosen velocity and timing while the groove stays recognisable.", pattern: [7, 5, 8, 3, 6, 4, 7, 2] },
];

export default function Home() {
  return (
    <>
      <MotionRuntime />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header" data-enter="nav">
        <a className="brand-link" href="#top"><SignalMark /></a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#proof">Live proof</a>
          <a href="#decision">How it works</a>
          <a href="#control">Control</a>
        </nav>
        <a className="header-cta" href="mailto:hello@signal.audio?subject=Signal%20FL%20beta">
          FL beta <Arrow diagonal />
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-grid">
            <div className="hero-kicker" data-enter="kicker">
              <span>AI MIDI COPILOT</span>
              <span>FOR FL STUDIO</span>
            </div>

            <h1 data-enter="title">
              Turn the MIDI<br />
              you started into<br />
              <em>the next idea.</em>
            </h1>

            <div className="hero-side" data-enter="body">
              <p>
                Signal reads the notes already carrying your intent, then gives you four controlled ways forward.
                Every result comes back as editable MIDI.
              </p>
              <div className="hero-actions">
                <a className="button button--signal" href="#proof">Try the live proof <Arrow /></a>
                <a className="text-link" href="#decision">See the full flow <span>↓</span></a>
              </div>
            </div>

            <div className="hero-index" data-enter="body">
              <span>CONTEXT</span><b>D MINOR / 128</b>
              <span>OUTPUT</span><b>EDITABLE .MID</b>
            </div>
          </div>

          <div className="hero-proof" id="proof" data-enter="console">
            <MidiConsole />
          </div>
        </section>

        <div className="proof-strip" aria-label="Product principles">
          <span>01 / Your motif first</span>
          <span>02 / Preview before insert</span>
          <span>03 / Every note stays yours</span>
        </div>

        <DecisionSpine />

        <section className="operations section-shell" id="operations">
          <div className="section-heading reveal-block">
            <p className="eyebrow">THE FIRST FOUR MOVES</p>
            <h2>Not magic buttons.<br /><em>Musical decisions.</em></h2>
            <p className="section-intro">
              Signal changes one dimension at a time, so you can hear what happened and decide what deserves to stay.
            </p>
          </div>

          <div className="operation-list">
            {operations.map((operation) => (
              <article className="operation-row reveal-block" key={operation.number}>
                <span className="operation-number">{operation.number}</span>
                <h3>{operation.name}</h3>
                <p>{operation.note}</p>
                <div className="operation-score" aria-hidden="true">
                  {operation.pattern.map((pitch, index) => (
                    <i key={index} style={{ "--note-y": pitch, "--note-i": index } as React.CSSProperties} />
                  ))}
                </div>
                <Arrow diagonal />
              </article>
            ))}
          </div>
        </section>

        <section className="physical-midi" aria-labelledby="physical-title">
          <div className="physical-copy reveal-block">
            <p className="eyebrow">A MUSICAL OBJECT, NOT A BLACK BOX</p>
            <h2 id="physical-title">See what changed.<br /><em>Touch the direction.</em></h2>
            <p>
              Move across the score. The scene is built from the same note events you edit in Piano Roll—pitch,
              position, length and velocity. No decorative AI orb.
            </p>
            <dl>
              <div><dt>INPUT</dt><dd>Selected MIDI only</dd></div>
              <div><dt>PROCESS</dt><dd>Controlled transforms</dd></div>
              <div><dt>RESULT</dt><dd>Open, editable notes</dd></div>
            </dl>
          </div>
          <MidiSculpture />
        </section>

        <section className="bridge section-shell" id="control">
          <div className="bridge-title reveal-block">
            <p className="eyebrow">ONE DECISION / TWO SURFACES</p>
            <h2>Explore in the browser.<br /><em>Finish inside FL.</em></h2>
          </div>

          <div className="bridge-workspace reveal-block">
            <article className="surface surface--browser">
              <header><SignalMark compact /><span>BROWSER / IDEA 07</span><i>CONNECTED</i></header>
              <div className="surface-body">
                <span className="surface-label">COMPARE</span>
                <h3>Four routes.<br />One open project.</h3>
                <div className="mini-score" aria-hidden="true">
                  {[18, 33, 25, 48, 37, 59, 42].map((top, index) => <i key={index} style={{ top: `${top}%` }} />)}
                </div>
                <div className="surface-selection">Direction C selected <span>✓</span></div>
              </div>
            </article>

            <div className="bridge-transfer" aria-hidden="true">
              <span>SAME CONVERSATION</span>
              <i /><b><Arrow /></b><i />
              <span>NO BOUNCED AUDIO</span>
            </div>

            <article className="surface surface--fl">
              <header><span>FL STUDIO / PIANO ROLL</span><i>DEVICE 01</i></header>
              <div className="fl-grid" aria-hidden="true">
                {[20, 31, 26, 43, 35, 54, 38].map((top, index) => <i key={index} style={{ top: `${top}%` }} />)}
                <span />
              </div>
              <footer><b>INSERT AFTER SELECTION</b><span>UNDO READY</span></footer>
            </article>
          </div>

          <ol className="bridge-steps reveal-block">
            <li><span>01</span><b>Select context</b><p>Send only the notes you choose.</p></li>
            <li><span>02</span><b>Compare directions</b><p>Hear and inspect before inserting.</p></li>
            <li><span>03</span><b>Keep editing</b><p>Return to your instruments and workflow.</p></li>
          </ol>
        </section>

        <section className="control-statement">
          <div className="control-sticky">
            <p className="eyebrow">CREATOR CONTROL</p>
            <h2>The producer<br />makes the call.</h2>
          </div>
          <div className="control-points">
            <article className="reveal-block"><span>01</span><h3>Nothing changes silently.</h3><p>Preview every candidate. Insert only the route you choose. Undo remains part of the workflow.</p></article>
            <article className="reveal-block"><span>02</span><h3>Constraints stay visible.</h3><p>Key, rhythm, pitch range, density and variation strength remain explicit controls—not hidden prompt tricks.</p></article>
            <article className="reveal-block"><span>03</span><h3>Your project is not training material.</h3><p>Raw project content is not used for model training without a separate, explicit opt-in.</p></article>
          </div>
        </section>

        <section className="final-cta" id="beta">
          <div className="final-signal" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className="final-copy reveal-block">
            <p className="eyebrow">PRIVATE FL STUDIO BETA</p>
            <h2>Bring the loop.<br /><em>Keep the authorship.</em></h2>
            <p>We are opening Signal with a small group of producers who care about editable ideas more than one-click songs.</p>
            <div>
              <a className="button button--dark" href="mailto:hello@signal.audio?subject=Signal%20FL%20beta">Request beta access <Arrow /></a>
              <a className="text-link text-link--dark" href="#proof">Replay the demo ↑</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <SignalMark />
        <p>Personal MIDI copilot for producers.<br />The idea stays editable. The call stays yours.</p>
        <nav aria-label="Footer navigation">
          <a href="#decision">How it works</a>
          <a href="#control">Privacy</a>
          <a href="mailto:hello@signal.audio">Contact</a>
        </nav>
        <div><span>© 2026 SIGNAL</span><span>PRE-ALPHA / 0.1</span></div>
      </footer>
    </>
  );
}
