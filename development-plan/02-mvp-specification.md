# 02. Спецификация MVP

## Product name

**Signal for FL — Piano Roll Copilot (MVP)**

## Цель MVP

Доказать, что контекстные MIDI transforms прямо в Piano Roll дают повторяемую ценность без cloud audio generation, reference uploads и большого plugin UI.

## Primary user story

> Как FL Studio producer с короткой MIDI-идеей, я хочу получить несколько контролируемых вариантов или продолжение прямо в текущем Piano Roll, чтобы быстрее выйти из творческого тупика и продолжить редактирование своими инструментами.

## Supported operations

### P0

1. `Variation`
2. `Continue`
3. `Simplify`
4. `Humanize`

### P1 после стабильности

5. `Bassline from chords`
6. `Harmonize melody`

## Input

- active Piano Roll score;
- selected notes или явный режим all notes;
- PPQ/time signature, доступные API;
- user controls;
- optional manually selected key/scale;
- random seed.

## Controls

- operation;
- bars: 2/4/8;
- key и scale либо `Auto/Keep`;
- variation strength: 0–100;
- rhythm change: 0–100;
- pitch change: 0–100;
- density: lower/same/higher;
- register low/high;
- seed;
- insertion mode.

## Output

- валидные editable notes;
- не более заданной длины;
- notes в допустимом MIDI range;
- preserved unselected notes;
- deterministic при одинаковом seed/config;
- лог/сообщение при невозможности выполнения.

## Insertion modes

1. `Add after selection` — default для Continue.
2. `Replace selected` — требует явного checkbox/confirmation.
3. `Add variation in empty offset` — если API/workflow позволяет.

MVP никогда молча не очищает весь score.

## UX flow

1. User выделяет notes.
2. `Tools → Scripts → Signal`.
3. Выбирает operation и controls.
4. Нажимает Apply.
5. Signal валидирует input.
6. Генерирует notes локально.
7. Валидирует output.
8. Вставляет либо показывает actionable error.
9. User слушает и undo/редактирует.

## Error states

- no notes selected;
- selection too long;
- unsupported/invalid notes;
- cannot infer key;
- no legal insertion space;
- generation returned empty;
- validation failed;
- incompatible FL version;
- unexpected exception.

Каждая ошибка должна оставлять score неизменённым.

## Functional acceptance

- на supported FL versions script появляется в menu;
- читает selected notes;
- выполняет четыре P0 operations;
- сохраняет unselected notes;
- одинаковый seed воспроизводит результат;
- output проходит validator;
- пользователь может undo;
- project сохраняется и открывается;
- errors не меняют score;
- установка и удаление документированы.

## Non-functional acceptance

- generation p95 < 500 ms на обычном 8-bar контексте;
- нет network requirement;
- нет account requirement;
- нет content telemetry;
- script не пишет за пределы своей разрешённой user-data области;
- поддерживаемые FL versions явно указаны;
- 100-кратный повтор не приводит к progressive slowdown;
- style/format соответствует official scripting examples.

## Out of scope

- VST3 UI;
- чат;
- LLM;
- accounts;
- reference audio;
- Creator DNA;
- cloud sync;
- audio generation;
- stems;
- playlist flow;
- multi-DAW;
- marketplace;
- automatic full-project arrangement.

## Instrumentation MVP

Не собирать notes автоматически. Использовать:

- optional anonymous event counts без content;
- short post-session form;
- screen-recorded moderated sessions с разрешения;
- test build id;
- locally visible debug log.

## Success criteria

- ≥5 design partners завершают реальную session;
- ≥30% requests дают inserted candidate;
- ≤35% inserted variants immediately undone;
- минимум 3/5 используют tool снова в течение недели;
- no data loss;
- contextual outputs предпочитаются random baseline.

