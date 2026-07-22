# Signal Landing

Production-oriented marketing prototype for Signal: a personal MIDI copilot for FL Studio.

## Included

- 520vh sticky, scroll-linked product reveal with five narrative states;
- Canvas-driven MIDI particles that explode, branch into four candidates and resolve;
- cinematic black/green visual system;
- paired assembled/exploded Signal Core renders plus Creator DNA artwork;
- interactive browser Piano Roll with five MIDI directions;
- user-triggered Web Audio preview (no autoplay);
- product operations, FL Studio workflow and privacy narrative;
- responsive desktop/mobile layouts;
- `prefers-reduced-motion` fallback;
- static Next.js rendering and optimized local images.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run lint
npm run build
```

## Main files

- `src/app/page.tsx` — page structure and product narrative;
- `src/app/globals.css` — design system, responsive behavior and animations;
- `src/components/signal-demo.tsx` — interactive MIDI candidate demo;
- `src/components/scroll-story.tsx` — scroll progress, Canvas rendering and product state transitions;
- `src/components/ambient-pointer.tsx` — restrained pointer light treatment;
- `public/assets/` — optimized project artwork.
