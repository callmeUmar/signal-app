# 03. Технический план поставки

## Принцип

Сначала построить малое vertical slice, затем повышать музыкальное качество. Не начинать с инфраструктуры, которая не нужна локальному script.

## Sprint 0 — repository foundation, 2–3 дня

- выбрать license/repository visibility;
- добавить `AGENTS.md`/contribution rules;
- создать source/test/docs structure;
- определить supported FL version;
- зафиксировать canonical note model;
- CI для pure Python core, если scripting runtime совместим;
- versioning policy;
- changelog.

Definition of done:

- один command запускает core tests;
- sample context round-trip проходит;
- code не зависит от установленного FL для unit tests.

## Sprint 1 — FL API probe, 3–5 дней

- minimal script installation;
- read notes;
- add one note;
- modify selected;
- exception behavior;
- undo test;
- Windows/macOS smoke test;
- capability matrix.

Definition of done:

- все unknowns из Phase 0 задокументированы;
- найден safe mutation pattern;
- no-go ограничения отражены в MVP spec.

## Sprint 2 — canonical model + validator, 1 неделя

- `MusicalContext`;
- `Note`;
- `Controls`;
- `CandidateSet`;
- input/output validators;
- conversion FL ↔ canonical;
- fixtures;
- property/edge tests.

Definition of done:

- invalid output невозможно вставить через public adapter path;
- 30+ fixtures проходят;
- schema version included.

## Sprint 3 — deterministic transforms, 1 неделя

- Variation;
- Simplify;
- Humanize;
- seed control;
- preservation metrics;
- exact-copy and excessive-change checks.

Definition of done:

- controls имеют monotonic/predictable effect;
- same seed reproducible;
- transformation reports changes.

## Sprint 4 — Continue engine, 1 неделя

- motif extraction;
- rhythm vocabulary;
- interval transitions;
- key/scale constraints;
- phrase boundary;
- 2/4/8 bars;
- conservative/adventurous presets.

Definition of done:

- output не просто копирует source;
- continuation начинается после selection;
- cadence/length constraints соблюдаются;
- blind test превосходит random baseline.

## Sprint 5 — UX, packaging, beta instrumentation, 1 неделя

- ScriptDialog controls;
- presets;
- error messages;
- installer/copy instructions;
- version checker if feasible;
- debug logs;
- optional feedback link;
- uninstall instructions;
- release artifact checksums.

Definition of done:

- unmoderated install success ≥80%;
- user reaches result without developer tools;
- no project-content telemetry.

## После MVP — Core service extraction

Только после workflow gate:

- move generation behind stable interface;
- add async request state;
- local sidecar feasibility;
- API auth/session token;
- structured LLM intent parser optional;
- model adapters;
- candidate ranking;
- cost/latency metrics;
- offline fallback.

## Testing pyramid

### Unit

- transforms;
- schema;
- constraints;
- profile features;
- deterministic seeds.

### Property/invariant

- no invalid pitches;
- no negative durations;
- bounds preserved;
- unselected notes unchanged;
- density/range controls respected.

### Golden fixtures

- versioned input/expected properties;
- not exact notes unless deterministic requirement;
- regression snapshots of metrics.

### FL integration

- supported versions/OS;
- install/scan;
- mutation/undo;
- save/reopen;
- exception handling;
- large score.

### Human musical evaluation

- blind A/B;
- usefulness, coherence, novelty, fit;
- acceptance in real project;
- edits and undo behavior.

## Release engineering later for VST

- reproducible Windows/macOS builds;
- notarization/signing;
- pluginval or equivalent validation;
- FL scan matrix;
- sample-rate/block-size matrix;
- state migration tests;
- offline install/activation plan;
- safe updater;
- symbolized crash reports with privacy filtering.

## Definition of done для любой AI-функции

- documented input/output schema;
- validator;
- baseline comparison;
- regression tests;
- latency/cost budget;
- failure fallback;
- model/prompt versioning;
- privacy impact noted;
- user-visible control;
- acceptance metric.

