# Signal landing — implementation spec

## Product sentence

Signal turns the MIDI a producer already wrote into controlled, editable next moves. It does not promise a finished song and never hides the notes behind generated audio.

## Chosen direction

**Sequencer as editorial instrument.** A studio-black surface, warm paper typography and one electric green signal. The composition borrows from music software, Swiss editorial layouts and physical control panels—not from generic AI SaaS sites.

### Signature element

The **Decision Spine** begins as one four-bar motif, separates into four labelled routes during scroll, then resolves into one selected, still-editable MIDI phrase.

## Layout concepts considered

### A — Neon dashboard

```text
[nav]
[copy][dashboard]
[cards][cards][cards]
```

Rejected: too close to familiar streaming/AI templates.

### B — Sci-fi HUD

```text
[telemetry around centered orb]
[dense panels + radial controls]
```

Rejected: spectacle outruns the product and adds avoidable rendering cost.

### C — Editorial sequencer (selected)

```text
[quiet nav]
[oversized promise........][live MIDI proof]
[sticky decision spine: 1 motif -> 4 routes -> 1 choice]
[operations as score rows, not cards]
[browser workflow] === [FL workflow]
[creator control / privacy]
[final invitation]
```

## Tokens

| Role | Token | Value |
|---|---|---|
| Main surface | `--ink` | `#070907` |
| Raised surface | `--ink-2` | `#101410` |
| Warm foreground | `--paper` | `#edeee7` |
| Secondary foreground | `--muted` | `#979e94` |
| Signal accent | `--signal` | `#a8ff38` |
| Structural line | `--line` | `#2a3129` |

Use the accent for decisions, active notes and focus—not for ambient glow.

## Type roles

- Geist: editorial display, body copy and controls.
- Geist Mono: transport data, bar counts, keys, labels and state.

## Motion language

- One 720ms entry score after first paint; transform and opacity only.
- CSS scroll timelines for the Decision Spine; no continuous JavaScript scroll handler.
- IntersectionObserver for active states and lazy loading.
- Anime.js for finite entrance and candidate-change choreography.
- Three.js is below the fold, capability-gated and rendered on demand only.
- All motion has a complete `prefers-reduced-motion` fallback.

## Content framework

BAB: the producer has a promising loop, gets stuck at the next musical decision, then compares four editable routes without giving up authorship.

## Acceptance

- Product understood in five seconds.
- Useful without animation, WebGL or audio permission.
- Full keyboard operation and visible focus.
- No fabricated testimonials, metrics or integrations.
- 375, 768, 1024 and 1440px layouts remain intentional.
- Initial client bundle does not include Three.js.
