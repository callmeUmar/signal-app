# 05. Тестирование и критерии приёмки

## Цель

Доказать одновременно четыре свойства:

1. Signal не повреждает проект.
2. Output формально музыкально валиден.
3. Output субъективно полезнее baseline.
4. Workflow достаточно быстрый и понятный для повторного использования.

Одних unit tests недостаточно; одних listening demos тоже недостаточно.

## Test layers

## 1. Schema tests

Проверки:

- required fields;
- schema version;
- valid enum values;
- unique candidate IDs;
- numeric ranges;
- max payload;
- rejection unknown/unsafe operations;
- backward compatibility.

Acceptance:

- 100% invalid fixtures rejected;
- 100% valid fixtures accepted;
- failure не вызывает mutation.

## 2. Musical invariant tests

Для каждого candidate:

- pitch 0–127 либо более узкий configured range;
- duration > 0;
- start >= allowed boundary;
- velocity within supported range;
- no forbidden overlap in monophonic mode;
- max polyphony respected;
- length within requested bars;
- required key/scale constraint respected;
- unselected source content unchanged;
- output not empty unless operation permits.

## 3. Transform-specific tests

### Variation

- similarity остаётся в заданном диапазоне;
- `variation_strength` увеличивает change ratio;
- source не копируется на 100%, кроме strength=0;
- anchors сохраняются по правилам.

### Continue

- начинается после source/selection;
- requested bar count соблюдён;
- motif relationship measurable;
- cadence не обрывает note за boundary;
- no unintended overlap with existing material.

### Simplify

- note count не увеличивается;
- essential anchors сохраняются;
- duration/phrase boundaries остаются валидными.

### Humanize

- pitches не меняются;
- timing/velocity deviation ограничены;
- no negative starts;
- no order inversion за пределами policy.

## 4. Determinism tests

- same input + same version + same seed = same output;
- different seed changes candidate в ожидаемых пределах;
- provenance позволяет воспроизвести result;
- release version change отражается явно.

## 5. FL Studio integration matrix

Матрица уточняется после Phase 0:

| Dimension | Минимум |
|---|---|
| OS | Windows 10/11, текущая macOS + предыдущая поддерживаемая |
| CPU | Intel/AMD, Apple Silicon |
| FL | текущий stable 2026 и выбранная предыдущая версия |
| Project | empty, small, large |
| Score | mono, poly, selected/unselected, edge cases |
| Lifecycle | install, update, disable, uninstall, save/reopen |

Критические сценарии:

- script not found;
- duplicate versions;
- unsupported FL version;
- exception mid-generation;
- user cancels;
- undo/redo;
- save after insert;
- reopen on another machine;
- non-4/4 time signature;
- unusual PPQ;
- thousands of notes.

## 6. Performance tests

Targets MVP:

- p50 local generation < 200 ms;
- p95 < 500 ms для typical 8-bar context;
- 1,000-note input < 2 s;
- no UI freeze > 100 ms beyond unavoidable FL dialog behavior;
- memory growth after 100 runs < defined small threshold;
- no network access.

Targets cloud alpha:

- p95 < 5 s или visible progress;
- timeout <= configured limit;
- cancel stops unnecessary work;
- provider failure falls back или объясняется;
- duplicate request/idempotency handled.

## 7. Musical quality evaluation

### Blind pairwise tests

Сравнивать:

- random in-scale vs rule-based;
- rule-based vs symbolic model;
- generic vs Creator DNA;
- Signal vs выбранный competitor, если terms позволяют.

Респондент не знает источник варианта.

Оценки:

- fit to context;
- coherence;
- novelty;
- editability;
- usefulness;
- likelihood to keep.

### Real-project test

Blind rating не заменяет реальное действие. Главный сигнал:

- inserted;
- retained;
- edited;
- used again.

## 8. Usability tests

Tasks:

1. Install Signal from clean instructions.
2. Generate variation from selected notes.
3. Undo and restore source.
4. Generate continuation.
5. Change only rhythm strength.
6. Remove Signal.

Measure:

- success without help;
- time;
- wrong turns;
- terminology confusion;
- trust concerns;
- understanding of data handling.

## 9. Privacy/security tests

- monitor network: MVP sends nothing;
- inspect filesystem writes;
- path traversal attempts;
- malformed JSON/payload;
- extreme note counts;
- hostile text input;
- local service authentication later;
- export/delete profile;
- deletion verification;
- logs contain no filenames/notes by default.

## Release acceptance checklist

### Must pass

- all P0 functional tests;
- no critical/high known data-loss bug;
- zero unexpected network traffic;
- supported matrix smoke-tested;
- installation/uninstallation verified;
- validator coverage for every insert path;
- crash/error behavior documented;
- known limitations published;
- version/checksum recorded;
- rollback artifact available.

### Can ship with known limitation

- imperfect musical quality for one genre, если обозначен scope;
- no cloud/Creator DNA;
- limited UI;
- manual key selection;
- only current FL stable;
- no direct VST bridge.

### Cannot ship

- score corruption;
- silent replacement of unselected notes;
- nondeterministic crash;
- hidden project upload;
- broken undo without warning;
- output bypassing validator;
- unclear generated-output rights claim;
- installer requiring excessive permissions.

