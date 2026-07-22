# 04. Backlog и приоритеты

## Приоритизация

- **P0:** блокирует доказательство core value или безопасность.
- **P1:** повышает качество/retention после working P0.
- **P2:** расширяет продукт после доказанной ценности.
- **Not now:** сознательно исключено.

## P0 — Phase 0 и Script MVP

### Research

- 15 user interviews;
- 5 design partners;
- competitor hands-on matrix;
- top operation selection;
- willingness-to-install test;
- privacy concept test.

### FL integration

- script discovery/install;
- note read/write;
- selection semantics;
- undo behavior;
- save/reopen;
- fail-closed exception handling;
- Windows/macOS capability matrix.

### Core

- canonical note/context schemas;
- validator;
- Variation;
- Continue;
- Simplify;
- Humanize;
- seed/provenance;
- fixture corpus;
- random baseline.

### UX

- ScriptDialog;
- clear controls;
- safe insertion mode;
- actionable errors;
- install/uninstall guide;
- feedback mechanism.

## P1 — Contextual Engine Alpha

- candidate set of four;
- diversity presets;
- chord inference/explicit chords;
- Bassline;
- Harmonize;
- natural-language intent → structured controls;
- local service/library boundary;
- candidate ranking;
- latency/error telemetry;
- profile-free personalization within session;
- alpha dashboard without note content;
- regression release gate.

## P1 — Creator DNA Beta

- opt-in MIDI import;
- melodic/rhythmic/harmonic feature extraction;
- profile inspector;
- multiple profiles;
- profile conditioning;
- generic vs personal A/B;
- export/delete;
- encrypted sync optional;
- profile version migration;
- leakage/similarity tests.

## P2 — VST3 Product

- resizable UI;
- chat/intent field;
- operation palette;
- preview;
- candidate history;
- profile management;
- tempo/transport sync;
- state serialization;
- installers/signing;
- FL bridge/fallback;
- crash reporting;
- subscription/activation;
- accessibility/keyboard navigation.

## P2 — Reference profiles

- audio drag/drop;
- local FFmpeg decode;
- tempo/key confidence;
- dynamics/rhythm/timbre features;
- feature normalization;
- blend UI;
- raw deletion;
- derived profile export/delete;
- rights confirmation;
- similarity tests;
- audio renderer experiment.

## P2 — Growth

- onboarding templates;
- genre starter profiles;
- shareable control presets без source content;
- referral;
- creator education;
- partner profiles with contracts;
- second DAW adapter.

## Not now

- full-song audio generation;
- stem separation;
- instrument recognition;
- streaming catalog integration;
- Spotify-based product dependency;
- whole-playlist averaging;
- flow sequencing;
- mobile app;
- social feed;
- collaboration marketplace;
- automatic mixing/mastering;
- autonomous full-project agent;
- training foundation model from scratch.

## Scope control rule

Функция переходит в текущий sprint только если:

1. связана с текущим gate;
2. имеет owner и acceptance criteria;
3. не увеличивает legal/privacy scope без review;
4. не требует недоказанной инфраструктуры;
5. вытесняет другую задачу явно, а не добавляется сверху.

