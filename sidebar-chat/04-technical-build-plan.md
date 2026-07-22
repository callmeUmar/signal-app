# 04. Технический план

## Architecture options

| Option | Плюсы | Минусы | Роль |
|---|---|---|---|
| Pure `.pyscript` dialog | быстрая deep insertion | нет persistent modern UI/auth | Phase 0/MVP bridge |
| Desktop companion panel | быстрый shared web UI/auth | не внутри FL wrapper | de-risk alpha |
| VST3 native UI | host integration, mature plugin path | отдельный UI implementation | production option |
| VST3 shell + WebView UI | shared dashboard components | WebView/resource/host complexity | spike after alpha |

## Recommended sequence

1. `.pyscript` adapter + local bridge CLI/service.
2. Companion web-based panel для alpha.
3. Test whether users require inside-wrapper UI.
4. VST3 shell/native panel after validated workflow.
5. Reuse shared schemas/API client, not necessarily entire dashboard UI.

## Proposed boundaries

```text
apps/
  sidebar-panel/
  companion/
adapters/
  fl-piano-roll/
plugins/
  signal-vst3/
packages/
  schemas/
  api-client/
  midi/
  local-ipc/
  auth-native/
```

## Companion responsibilities

- singleton lifecycle;
- local IPC endpoint;
- PKCE/device flow;
- keychain storage;
- access token refresh;
- REST/SSE/WebSocket;
- local cache/outbox;
- artifact download/checksum;
- update/status;
- diagnostics redaction;
- optional local core.

## Adapter contract

### Capture

```json
{
  "type": "context.capture",
  "schema_version": "1.0",
  "command_id": "uuid",
  "source": {"host": "fl_studio", "adapter_version": "0.1.0"},
  "context": {},
  "context_hash": "sha256"
}
```

### Insert

```json
{
  "type": "artifact.insert",
  "command_id": "uuid",
  "artifact_id": "uuid",
  "artifact_sha256": "...",
  "expected_context_hash": "...",
  "mode": "add_after_selection"
}
```

### Result

```json
{
  "command_id": "uuid",
  "status": "inserted",
  "inserted_note_count": 24,
  "error_code": null
}
```

## Local IPC requirements

- bind loopback only;
- authenticated per install/session;
- strict content length;
- JSON schema validation;
- command allowlist;
- replay protection by command ID;
- atomic delivery/ack;
- timeouts;
- no arbitrary path/command fields;
- version negotiation;
- health endpoint returns no secrets.

## Chat/generation client

- create durable ChatRequest;
- idempotency key;
- subscribe to progress;
- cancel;
- fetch CandidateSet;
- verify checksum/schema;
- cache metadata only as needed;
- report preview/save/insert events;
- resync after reconnect.

## Local fallback

When disconnected:

- Variation;
- Simplify;
- Humanize;
- basic Continue if local engine ready;
- local conversation may remain ephemeral or sync after explicit consent;
- no claim cloud Creator DNA is available.

## Diagnostics

Support bundle may include:

- app/adapter/FL/OS versions;
- connection state/error codes;
- request IDs;
- crash stack/symbols;
- capability matrix;
- recent redacted logs.

Excluded by default:

- tokens;
- prompts;
- filenames;
- MIDI notes;
- project names;
- raw artifacts.

## Testing

- FL adapter fixtures;
- IPC fuzz/replay/size tests;
- auth flows;
- companion restart;
- FL restart/project reopen;
- network loss;
- backend outage;
- stale context;
- plugin scan/unload;
- audio thread safety;
- Windows/macOS installers;
- revoke/update/rollback;
- long chat memory/performance.

