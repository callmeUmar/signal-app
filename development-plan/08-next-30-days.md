# 08. Первые 30 дней

## Цель месяца

К концу 30 дней иметь:

- подтверждённую или опровергнутую проблему;
- работающий безопасный FL Piano Roll proof-of-concept;
- minimum evaluation corpus;
- пять design partners;
- решение Go / Pivot / Stop;
- при `Go` — Script MVP с минимум двумя полезными transforms.

## Week 1 — Discovery и API proof

### День 1

- зафиксировать research brief;
- определить interview screener;
- создать evidence repository;
- выбрать целевые genres для интервью;
- подготовить privacy-safe consent для screen recording.

### День 2

- рекрутировать 15 интервью;
- выбрать 5 design partners;
- установить текущий FL Studio 2026 на тестовую среду;
- зафиксировать supported OS/versions.

### День 3

- создать minimal `.pyscript`;
- прочитать score;
- добавить note;
- проверить error/log output.

### День 4

- проверить selected vs unselected;
- undo/redo;
- save/reopen;
- empty/large score;
- описать API limitations.

### День 5

- провести первые 3 интервью;
- протестировать competitor workflows;
- принять решение: script path feasible / blocked.

Deliverable недели:

- capability matrix;
- 3 интервью;
- note round-trip proof;
- список blockers.

## Week 2 — Problem evidence и baselines

### Дни 6–8

- ещё 7 интервью;
- кодировать pain episodes/workarounds;
- выбрать top 2 operations;
- собрать 15 initial MIDI contexts.

### День 9

- реализовать canonical Note/Context;
- validators;
- random in-scale baseline;
- deterministic seed.

### День 10

- реализовать первый deterministic Variation;
- metrics change ratio/similarity;
- tests edge cases.

Deliverable недели:

- 10 интервью;
- top operations;
- schema + validator;
- baseline + first transform;
- 15 fixtures.

## Week 3 — User-tested vertical slice

### Дни 11–12

- закончить 5 интервью;
- подготовить ScriptDialog;
- insertion mode;
- safe error messages.

### Дни 13–14

- реализовать второй operation: Continue или Simplify по evidence;
- расширить corpus до 30 contexts;
- regression tests.

### День 15

- внутренний release candidate;
- install/uninstall docs;
- network/filesystem audit;
- backup/rollback instructions.

Deliverable недели:

- 15 интервью;
- vertical slice с двумя operations;
- 30 fixtures;
- RC для design partners.

## Week 4 — Design partner sessions и решение

### Дни 16–18

- 5 moderated real-project sessions;
- измерить installation, first result, insertion, undo;
- записать output failures;
- не добавлять features во время sessions.

### День 19

- исправить critical safety/installation defects;
- blind baseline preference test;
- подсчитать gate scorecard.

### День 20

- Go/Pivot/Stop review;
- обновить decisions/assumptions;
- сформировать следующие 4–6 недель;
- при Go — выпустить private MVP v0.1.

Deliverable месяца:

- evidence report;
- working script artifact;
- test report;
- metrics baseline;
- decision memo;
- updated roadmap.

## Go criteria

- ≥10/15 real pain episodes;
- ≥5 committed testers;
- ≥4/5 install without live help;
- safe note insertion in all critical tests;
- ≥30% requests produce inserted candidate;
- contextual result beats random baseline;
- no data-loss/privacy blocker.

## Pivot examples

- users prefer `Bassline from chords` to melody continuation;
- chat is unnecessary, operation buttons win;
- users want standalone/VST bridge because script install fails;
- primary segment should be beginner rather than professional;
- local rule engine is enough; cloud AI adds no value.

## Stop examples

- pain is rare or not costly;
- users refuse new tool in workflow;
- FL Gopher already satisfies use case;
- script cannot mutate safely;
- generated variations are not preferred over simple FL tools;
- no path to differentiation from existing plugins.

