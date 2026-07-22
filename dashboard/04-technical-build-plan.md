# 04. Технический план

## Proposed stack boundary

- React/Next.js-class authenticated web app;
- TypeScript;
- server/BFF layer для session cookies и API calls;
- shared UI/schema/API client packages;
- Web Audio для preview;
- durable backend state через REST;
- SSE для job progress;
- WebSocket для device presence/Send to FL;
- local IndexedDB только для unsaved drafts/cache, не для long-lived secrets.

Конкретные libraries фиксируются ADR при начале реализации.

## Proposed code layout

```text
apps/dashboard/
  routes/
  features/
    auth/
    projects/
    conversations/
    copilot/
    piano-roll/
    candidates/
    exports/
    devices/
    profiles/
    billing/
packages/
  ui/
  schemas/
  api-client/
  midi/
  audio-preview/
```

## State ownership

| State | Source of truth |
|---|---|
| Account/session | identity/backend |
| Project/conversation | PostgreSQL/backend |
| Job progress | backend + SSE snapshot |
| Artifacts | object storage metadata/backend |
| Unsaved editor draft | browser local + periodic draft API later |
| Device presence | realtime ephemeral + durable device record |
| Creator DNA | backend/local profile store depending mode |
| UI layout | local preference/backend optional |

## Data fetching

- server-render initial account/navigation where useful;
- typed API client;
- optimistic UI only for reversible metadata changes;
- generation/export never marked complete optimistically;
- cursor-based pagination for conversations/messages;
- ETag/version for conflict detection;
- request IDs visible in support diagnostics.

## MIDI handling

- parse files in controlled worker/client module;
- validate file size/tracks/events;
- normalize to canonical schema;
- preserve original file only if user chooses save;
- avoid rendering thousands of DOM nodes directly;
- use Canvas/WebGL/virtualization as measured;
- separate visual state from canonical notes;
- undo commands versioned.

## Chat UI

- messages are structured by role/type;
- tool/generation result is a typed block, not embedded arbitrary HTML;
- markdown sanitized;
- no model-generated script execution;
- retry creates new ChatRequest linked to parent;
- cancel works through backend;
- partial progress not persisted as final answer;
- failure includes retry/fallback guidance.

## Realtime

WebSocket messages contain event references, not large MIDI payloads where avoidable:

```json
{
  "type": "artifact.delivery.requested",
  "event_id": "uuid",
  "device_id": "uuid",
  "artifact_id": "uuid",
  "version": 3
}
```

Client fetches authorized artifact manifest, validates, acknowledges and reports final status.

## Uploads

- direct-to-object-storage signed upload only when needed;
- MIME/extension/content validation;
- size and event limits;
- malware/file safety process;
- upload record expires if project save not completed;
- raw audio future feature uses separate stricter pipeline.

## Error taxonomy

- authentication;
- authorization/scope;
- validation;
- quota;
- job/provider;
- artifact expired;
- device offline;
- version conflict;
- unsupported MIDI;
- internal.

UI maps error code to action; raw stack trace never shown.

## Testing

- component/accessibility;
- schema contract;
- MIDI parser fuzz/edge fixtures;
- browser audio lifecycle;
- conversation pagination;
- SSE reconnect;
- WebSocket resync;
- auth/session/CSRF;
- device approve/deny/revoke;
- export contents/checksums;
- Playwright-class critical flows;
- visual regression for Piano Roll/candidates.

## Performance

- route code splitting;
- Piano Roll bundle lazy-loaded;
- transcript virtualization;
- waveform/audio assets lazy;
- no full project refetch per message;
- progress connection cleanup;
- object URLs revoked;
- browser memory tests for long conversations.

## Accessibility

- full keyboard navigation;
- MIDI notes list/table alternative;
- candidate actions labelled;
- playback state announced appropriately;
- color not sole diff signal;
- reduced motion;
- focus restored after dialogs;
- chat streaming doesn't steal focus.

