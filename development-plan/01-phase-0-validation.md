# 01. Phase 0 — проверка проблемы и feasibility

## Цель

За 2–3 недели убрать самые опасные неизвестные до серьёзной разработки.

## Гипотезы

1. Пользователи регулярно застревают на развитии существующего MIDI.
2. Текущие generators дают слишком generic или disconnected material.
3. Прямое изменение Piano Roll ценнее отдельного web output.
4. Пользователи готовы устанавливать script.
5. FL scripting позволяет безопасный workflow.
6. Operation-first UI полезнее пустого чата.

## Research cohort

15 пользователей:

- 8 beginner/intermediate FL producers;
- 4 experienced/semi-pro;
- 3 users существующих AI/MIDI plugins;
- минимум 5 активно создают проекты каждую неделю;
- разные genres, но не пытаться покрыть весь рынок.

## Interview protocol, 30–45 минут

### Часть 1 — поведение

- покажите последний незавершённый project;
- где именно вы застряли;
- что сделали дальше;
- сколько времени потеряли;
- какие tools открыли;
- какой результат сохранили.

### Часть 2 — существующие решения

- plugins/MIDI packs/YouTube/LLM/friends;
- что раздражает;
- что вызывает недоверие;
- когда случайная генерация полезна;
- что считается «слишком похоже» или «слишком generic».

### Часть 3 — concept test

Показать три flow без продажи идеи:

1. blank prompt;
2. selected MIDI + action buttons;
3. selected MIDI + Creator DNA.

Попросить выбрать, объяснить и указать опасения.

## Competitive hands-on test

На одинаковом brief протестировать:

- FL Gopher/script path;
- Scaler 3 demo/trial, если доступен;
- LANDR Composer;
- Captain Plugins;
- Lemonaide;
- random/rule baseline.

Фиксировать:

- time-to-result;
- installation friction;
- context required;
- editability;
- number of clicks;
- quality notes;
- pricing/limits;
- privacy posture;
- unique strengths.

Не сравнивать по marketing copy.

## Technical spikes

### Spike A — note round-trip

1. Прочитать active Piano Roll notes.
2. Сериализовать canonical context.
3. Создать variation локально.
4. Вставить как safe result.
5. Проверить undo и project reopen.

### Spike B — selection safety

- изменить только selected notes;
- не тронуть unselected;
- обработать empty selection;
- обработать overlapping notes;
- fail closed при exception.

### Spike C — bridge feasibility

Проверить и документировать:

- filesystem read/write;
- `json` и standard library;
- localhost access;
- clipboard;
- temp MIDI;
- OS differences.

### Spike D — performance

- 8 тактов;
- 100/1,000/10,000 notes;
- UI responsiveness;
- error/log behavior.

## Baseline corpus

Создать минимум 30 контекстов:

- 10 melodies;
- 5 chord progressions;
- 5 basslines;
- 5 rhythmic motifs;
- 5 edge cases.

Для каждого: expected constraints и 2–3 human reference variations, если возможно.

## Deliverables

- interview notes с anonymized IDs;
- evidence table;
- top 3 operations;
- rejected assumptions;
- feasibility report;
- working `.pyscript` proof;
- baseline corpus;
- decision memo Go / Pivot / Stop.

## Gate scorecard

| Критерий | Pass | Evidence |
|---|---|---|
| Concrete problem | ≥10/15 недавних эпизодов | интервью |
| Existing workaround | ≥8/15 | интервью |
| Test commitment | ≥5 active testers | список cohort |
| Installation | ≥4/5 без live help | usability test |
| Safe insertion | 100% spike cases | automated/manual tests |
| Differentiated value | selected-MIDI flow предпочитают ≥8/15 | concept test |

## Решения после Phase 0

### Go

Все critical criteria пройдены. Начать Phase 1.

### Pivot

Проблема есть, но interface/operation/segment неверны. Исправить thesis и повторить ограниченный test.

### Stop

Проблема редкая, users не меняют workflow, API небезопасен или baseline уже достаточен. Не компенсировать это большим VST.

