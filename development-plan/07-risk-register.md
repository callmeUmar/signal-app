# 07. Реестр рисков

## Шкала

- Probability: Low / Medium / High
- Impact: Low / Medium / High / Critical
- Owner назначается при начале реализации.

| ID | Риск | Probability | Impact | Early signal | Mitigation |
|---|---|---|---|---|---|
| R-001 | Gopher добавляет такой же workflow | High | High | новые personal MIDI actions | Creator DNA, cross-DAW core, quarterly review |
| R-002 | Output валиден, но generic | High | Critical | много generate, мало insert | baselines, human eval, narrow genres, context transforms |
| R-003 | Personalization не улучшает качество | Medium | High | A/B без выигрыша | оставить profiles как controls presets, не строить дорогой ML |
| R-004 | FL script повреждает score | Low/Medium | Critical | undo/save inconsistencies | fail-closed, copies, fixtures, limited mutation path |
| R-005 | Script installation слишком сложна | High | High | support-heavy onboarding | installer, unmoderated tests, VST/standalone fallback |
| R-006 | Script API не поддерживает bridge | Medium | High | filesystem/network spike fails | temp MIDI/drag-drop, VST MIDI output, standalone app |
| R-007 | VST crashes host | Medium | Critical | scan/crash reports | mature framework, no blocking audio thread, validation matrix |
| R-008 | Cloud latency ломает creative flow | Medium | High | p95 >5s, abandonment | local baseline, async progress, small candidate count |
| R-009 | Inference cost слишком высок | Medium | High | cost/accepted candidate растёт | local transforms, routing, limits, cache safe calls |
| R-010 | Reference uploads вызывают legal risk | Medium | Critical | takedowns/provider flags | delay feature, local analysis, delete raw, counsel, terms |
| R-011 | Style marketing вызывает претензии | Medium | High | complaints/cease-and-desist | user-centered profiles, licensed partners, claim review |
| R-012 | Пользователи не доверяют profiling | High | High | opt-in low, churn | local-first, inspector, export/delete, no training default |
| R-013 | User data leaks through logs | Medium | Critical | filenames/notes in support logs | data classification, redaction tests, minimal telemetry |
| R-014 | Cold start делает Creator DNA бесполезным | High | Medium | users quit before profile | project context first, starter presets, progressive profiling |
| R-015 | Слишком широкий genre scope | High | High | inconsistent eval | выбрать 1–2 launch genres, publish limits |
| R-016 | Один builder перегружен дисциплинами | High | High | stalled releases, bugs | gates, narrow scope, specialist reviews, no parallel products |
| R-017 | Пользователи хотят audio, а не MIDI | Medium | High | low MIDI retention, audio requests | validate early, add optional preview/renderer after core |
| R-018 | Subscription вызывает отторжение | Medium | Medium/High | conversion low | local one-time option, annual plan, transparent cloud costs |
| R-019 | Competitor копирует controls/profile | Medium | High | feature announcements | feedback/evaluation moat, distribution, execution speed |
| R-020 | Trademark `Signal` недоступен | Medium | High | clearance conflict | early trademark search before public brand spend |
| R-021 | Generated output слишком похож на source | Medium | Critical | high exact/motif match | similarity threshold, conservative labels, source-aware tests |
| R-022 | Model/provider changes policy or availability | Medium | High | deprecation/price change | adapter layer, local fallback, no provider-specific contract |
| R-023 | Analytics оптимизируют engagement, не творчество | High | High | generations растут, retention нет | accepted actions north star, undo/retention signals |
| R-024 | Flow sequencing отвлекает core team | Medium | High | shared backlog scope growth | separate thesis/team/gate; not-now rule |

## Top 5 рисков для еженедельного контроля

1. R-002 — musical usefulness.
2. R-001 — FL platform absorption.
3. R-004 — project safety.
4. R-012 — privacy trust.
5. R-016 — scope/solo-builder overload.

## Escalation rules

### Немедленно остановить distribution

- подтверждённая потеря/повреждение проекта;
- hidden upload;
- remote code execution/path traversal;
- raw user content exposed;
- generated output bypasses validator;
- installer compromise.

### Остановить feature development и исследовать

- acceptance rate падает два релиза подряд;
- baseline consistently beats new model;
- p95 latency превышает budget неделю;
- cloud cost per accepted candidate выходит за target;
- privacy opt-out/delete не работает;
- platform update ломает adapter.

## Review cadence

- weekly: top 5 + incidents;
- before each release: полный register;
- monthly: probability/impact update;
- quarterly: competitors/platform/legal assumptions;
- после incident: отдельный postmortem и тест против повторения.

