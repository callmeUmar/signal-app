# 02. Browser Copilot

## Цель

Дать тот же creative engine, что sidebar, когда FL Studio закрыт или пользователь хочет начать идею в browser.

Ограничение должно быть честным: browser не видит текущий FL Piano Roll без переданного sidebar context.

## Layout desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Project / Conversation / Connected FL status                │
├───────────────────────────────┬──────────────────────────────┤
│ Piano Roll / Context          │ Copilot Chat                 │
│                               │ - messages                   │
│ - MIDI notes                  │ - operation cards            │
│ - playback                    │ - controls                   │
│ - selection                   │ - job progress               │
│ - key/tempo                   │                              │
├───────────────────────────────┴──────────────────────────────┤
│ Candidates: A / B / C / D | Compare | Save | Send | Export │
└──────────────────────────────────────────────────────────────┘
```

## Context creation

### MVP

- upload `.mid`;
- drag/drop `.mid`;
- starter examples;
- draw/edit notes in browser Piano Roll;
- open context previously sent from FL;
- duplicate a saved result as new context.

### Later

- MusicXML;
- audio reference analysis;
- browser MIDI keyboard recording;
- multiple tracks;
- chord/audio detection.

## Operation palette

Buttons remain available even with chat:

- Continue;
- Variation;
- Simplify;
- Humanize;
- Bassline;
- Harmonize.

Chat converts natural-language intent into structured controls and asks only materially necessary clarification.

## Chat request lifecycle

1. User chooses context/selection.
2. Enters request or operation.
3. UI displays interpreted intent/constraints.
4. User can edit controls before run.
5. `POST ChatRequest` returns `job_id`.
6. UI streams progress.
7. CandidateSet passes backend validator.
8. Browser performs client-side defensive validation.
9. User previews candidates.
10. User saves, applies to browser score, sends to FL or exports.

## Streaming/progress

Не стримить unstructured partial MIDI в editor. Стримить этапы:

- understanding context;
- building constraints;
- generating candidates;
- validating;
- preparing previews.

Candidate отображается только после целостной валидации.

## Candidate card

- label: Conservative/Rhythmic/Melodic/Adventurous;
- play/stop;
- visual diff;
- changed pitch/rhythm/density metrics;
- key/scale/length;
- generator/model version drawer;
- Save;
- Apply to browser score;
- Send to FL;
- Export MIDI;
- More like this;
- Reject reason optional.

## Browser Piano Roll MVP

- zoom/pan;
- select/move/resize/add/delete notes;
- velocity minimal editing;
- playback/loop;
- tempo/key/scale controls;
- undo/redo;
- source/candidate layers;
- keyboard shortcuts;
- autosaved draft;
- accessible table/list fallback для notes.

Не пытаться повторить всю FL Piano Roll.

## Audio preview

- Web Audio synth/sample instrument;
- no autoplay;
- one global transport;
- candidate audition uses current tempo;
- visible loading;
- stop on navigation;
- no promise production-quality sound;
- optional user-selected simple presets.

## Send to FL

Если connected device online:

1. User выбирает device/project session.
2. Backend создаёт one-time delivery command.
3. Sidebar получает candidate manifest через authenticated channel.
4. Sidebar показывает local confirmation/preview.
5. FL adapter вставляет notes.
6. Sidebar подтверждает `delivered/inserted/failed`.

Dashboard не может удалённо и молча менять FL project. Финальное подтверждение находится рядом с DAW.

## Offline/draft behavior

- unsent text/context draft хранится локально;
- server-saved conversations доступны после reconnect;
- cloud generation недоступна offline;
- local browser transforms возможны позже;
- conflict resolution использует version/cursor, не last-write-wins для notes без предупреждения.

## Browser/sidebar parity policy

Shared:

- operations;
- schemas;
- conversations;
- candidate/provenance;
- profiles;
- exports.

Surface-specific:

- browser имеет Piano Roll editor/import;
- sidebar получает FL context/insertion;
- browser может управлять devices/billing;
- sidebar имеет compact controls и local bridge states.

