# 01. UX, chat и команды

## Primary job

> Я выделил MIDI в FL Studio и хочу получить связанное продолжение или изменение, не покидая DAW и не импортируя/экспортируя файлы вручную.

## Panel layout

```text
┌──────────────────────────────────────┐
│ Signal   Project/Profile   ● Online │
├──────────────────────────────────────┤
│ Context                             │
│ 8 notes · 2 bars · F# minor · 140  │
│ [Refresh from Piano Roll]           │
├──────────────────────────────────────┤
│ Continue  Variation  Simplify       │
│ Humanize  Bassline   Harmonize      │
├──────────────────────────────────────┤
│ Chat                                │
│ “Keep the rhythm, make it darker”   │
│ ...                                 │
├──────────────────────────────────────┤
│ Candidates A B C D                  │
│ ▶ Compare  Save  Insert             │
├──────────────────────────────────────┤
│ [Send to Piano Roll] [Open Web]     │
└──────────────────────────────────────┘
```

## Compact states

- disconnected;
- connecting browser;
- connected/online;
- offline local mode;
- no context;
- context captured;
- generating;
- candidates ready;
- device/session expired;
- FL bridge unavailable;
- unsupported FL version;
- update required.

## Context card

Показывает только то, что Signal реально получил:

- selected/all notes;
- bars;
- tempo;
- key/scale + confidence/manual;
- monophonic/polyphonic;
- source pattern/session reference;
- timestamp/version.

Если context устарел после edits, sidebar помечает `Context changed — refresh`.

## Operation-first, chat-second

Основные операции всегда доступны кнопками. Chat полезен для уточнения:

- «сохрани ритм, измени ноты»;
- «продолжи на 4 такта»;
- «сделай меньше повторов»;
- «оставь первую и последнюю ноту»;
- «bassline под эти аккорды».

LLM переводит запрос в `Intent + Controls`; пользователь может раскрыть/исправить interpretation.

## Commands MVP

### Context

- `Use selected notes`;
- `Use all notes in active Piano Roll`;
- `Refresh context`;
- `Clear context`.

### Generation

- Continue 2/4/8 bars;
- Variation;
- Simplify;
- Humanize;
- Retry same seed/new seed;
- More/less like source.

### Result

- Preview;
- Compare;
- Save;
- Insert after selection;
- Replace selection;
- Open in dashboard;
- Export MIDI;
- Send feedback.

### Later

- Bassline/Harmonize;
- multi-track context;
- use Creator DNA;
- reference profile blend;
- send browser result into current project;
- branch conversation.

## Candidate differences

Каждый candidate имеет distinct axis:

- A Conservative;
- B Rhythmic;
- C Melodic;
- D Adventurous.

Показывать:

- changed notes ratio;
- rhythm change;
- density;
- range;
- key compliance;
- model/seed in details.

Не показывать meaningless «AI confidence 93%».

## Insert confirmation

Перед mutation:

- destination pattern/channel;
- insertion position;
- replace/add mode;
- note count;
- conflict warning;
- local backup/undo availability;
- Confirm/Cancel.

`Replace selection` требует более сильного подтверждения, чем `Add after`.

## Conversation continuity

- FL conversation появляется в dashboard;
- `Open in browser` открывает точный conversation/request;
- browser-added request появляется в sidebar после resync;
- selected result имеет status `saved`, `delivered`, `inserted`, `failed`;
- user может скрыть conversation sync и работать local-only для basic transforms.

## Failure UX

### Network/provider failure

- сохранить draft;
- предложить local deterministic transform;
- retry without duplicate insert;
- status link.

### Stale context

- не вставлять автоматически;
- предложить refresh/rebase;
- можно export без insertion.

### Validation failure

- candidate не показывается как usable;
- понятное сообщение;
- retry/fallback;
- request ID для support.

### Bridge unavailable

- candidate остаётся saved;
- export MIDI;
- reconnect helper;
- no silent mutation attempt.

