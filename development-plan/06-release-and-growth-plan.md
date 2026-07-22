# 06. Beta, выпуск и рост

## Release philosophy

Signal не должен начинать с публичного viral launch. Music tools получают доверие медленно и теряют его после одного damaged project или generic result.

Использовать последовательность design partners → private alpha → closed beta → public beta → paid release.

## Stage A — Design partners

**Размер:** 5 пользователей  
**Формат:** наблюдаемые sessions, weekly contact.

Цели:

- найти лучший operation;
- увидеть реальные projects;
- исправить installation;
- понять язык controls;
- собрать qualitative failure cases;
- сформировать evaluation corpus с разрешения.

Не брать оплату. Не обещать roadmap dates как контракт.

Exit criteria:

- 3/5 используют повторно;
- zero data-loss;
- минимум один operation явно полезен;
- top 10 failure modes известны.

## Stage B — Private alpha

**Размер:** 20–30 пользователей.

Цели:

- reliability;
- genre spread;
- latency;
- operation funnel;
- baseline preference;
- support burden.

Distribution:

- invite-only;
- signed/checksummed artifact;
- clear supported FL versions;
- feedback channel;
- automatic content telemetry выключена.

Exit criteria:

- crash-free >99%;
- install success >85%;
- ≥30% request-to-insert;
- W1 return ≥40% guided cohort;
- no unresolved critical privacy/security issue.

## Stage C — Closed Creator DNA beta

**Размер:** 50–100 пользователей.

Цели:

- consent UX;
- profile creation;
- generic vs personal A/B;
- deletion/export;
- retention;
- pricing research.

Не допускать marketing claim «AI learned your style» до доказанного measurable improvement.

Exit criteria:

- personalization wins;
- privacy controls understood;
- no source memorization pattern;
- support process works;
- paid intent подтверждён реальным pre-order/checkout test, а не только словами.

## Stage D — VST3 public beta

Prerequisites:

- script product retention;
- signed installers;
- compatibility matrix;
- crash reporting;
- Terms/Privacy;
- billing sandbox;
- support docs;
- rollback/update path.

Launch promise:

> Turn the MIDI you already wrote into controlled, editable next ideas — inside your DAW.

Не начинать marketing с «AI that writes music». Это помещает Signal в самую переполненную и недоверительную категорию.

## Acquisition channels

### Высокое соответствие

- FL Studio scripting community;
- producer Discords;
- YouTube workflow demonstrations;
- TikTok/shorts с before/after, но с редактированием пользователя;
- partnerships с преподавателями production;
- creator beta cohorts;
- plugin communities.

### Контент

- `Continue a 4-bar melody without losing the motif`;
- `Three ways to vary MIDI while keeping groove`;
- `Why Signal gives editable notes, not finished songs`;
- прозрачные breakdowns controls;
- public failure/evaluation methodology.

Не строить acquisition на artist imitation clips.

## Activation design

Первые пять минут:

1. Install.
2. Open included demo FL project или selected notes.
3. Run `Variation — Conservative`.
4. Undo.
5. Run `Continue — 4 bars`.
6. Сохранить понравившийся result.

Пользователь должен испытать control и reversibility до account/paywall.

## Pricing validation

Последовательность:

1. интервью о прошлых purchases;
2. concept cards: free/local, subscription/cloud, one-time/offline;
3. fake-door внутри beta без списания;
4. refundable pre-order или real checkout only after stable value;
5. cohort analysis conversion/retention/support/cost.

Не использовать только вопрос «сколько вы готовы заплатить?».

## Support readiness

- installation diagnostics;
- collect support bundle без project content;
- FL version/OS/build ID;
- known issues;
- clean uninstall;
- response templates;
- crash severity process;
- public status при cloud features;
- data deletion requests.

## Growth loops

### Healthy loops

- пользователь сохраняет control preset и делится им без нот;
- before/after демонстрирует собственное редактирование;
- profile переносится в новую DAW;
- creator teaches a transformation workflow;
- partner profile лицензирован и прозрачен.

### Loops, которых избегать

- публикация пользовательских projects без opt-in;
- «generate until lucky» credit treadmill;
- imitation challenges;
- hidden training incentives;
- watermark/attribution claims, которые продукт не способен обеспечить.

## Expansion decision

Вторую DAW выбирать по данным:

- waitlist by host;
- paid beta requests;
- adapter feasibility;
- support burden;
- availability of deep MIDI integration;
- strategic independence from FL.

