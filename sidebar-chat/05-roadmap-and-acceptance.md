# 05. Roadmap и критерии приёмки

## Phase S0 — FL adapter spike, 1 неделя

- install `.pyscript`;
- capture selection;
- canonical JSON;
- insert fixed validated candidate;
- undo/save/reopen;
- filesystem/network capability matrix;
- Windows/macOS smoke.

Gate:

- no data loss;
- selected/unselected notes handled correctly;
- fail-closed behavior;
- documented IPC path.

## Phase S1 — Companion + local panel alpha, 2–3 недели

- companion lifecycle;
- authenticated local IPC;
- panel shell;
- context card;
- operation buttons;
- local deterministic candidates;
- preview;
- insert confirmation;
- diagnostics.

Gate:

- end-to-end `capture → generate → preview → insert`;
- FL remains stable if panel/companion crashes;
- no network required for local baseline;
- p95 local result within product budget.

## Phase S2 — Browser account connection, 1–2 недели

- external browser PKCE;
- device-code fallback;
- secure storage;
- scopes;
- dashboard device page;
- revoke;
- realtime connection.

Gate:

- no secrets in project/logs;
- revoke immediate/effective;
- fallback works when loopback unavailable;
- support flow understandable.

## Phase S3 — Shared chat/backend, 2–3 недели

- create/open conversation;
- structured chat intent;
- async generation progress;
- candidate set;
- save/open in dashboard;
- resync/reconnect;
- cloud failure local fallback.

## Phase S4 — Dashboard ↔ FL delivery, 1–2 недели

- device presence;
- `Send to FL`;
- local confirmation;
- artifact checksum;
- status delivery/insert;
- stale-context protection.

## Phase S5 — VST3/sidebar production shell, 4–8 недель

- choose native/WebView ADR;
- plugin scan/state;
- resizable UI;
- transport/tempo sync where useful;
- installers/signing;
- crash reporting;
- update/rollback;
- compatibility matrix;
- private beta.

## Acceptance criteria

### UX

- user connects account without copying a permanent token;
- context source clearly visible;
- chat interpreted controls inspectable;
- four candidates comparable;
- insert requires local confirmation;
- failed/offline state preserves result;
- conversation opens in dashboard.

### Safety

- validator on server/local + adapter;
- stale context detected;
- no silent replacement;
- undo path verified;
- companion/plugin crash does not crash FL in target matrix;
- no network in audio callback;
- no token in `.flp`, preset, logs or exports.

### Reliability

- reconnect resyncs durable state;
- duplicate delivery cannot double-insert without confirmation;
- job cancel/retry safe;
- revoked device disconnected;
- artifact checksum mismatch blocks insertion;
- unsupported version degrades to export/read-only.

## Launch blockers

- true native docking marketed but unavailable;
- project mutation without confirmation;
- token persistence in project/config plaintext;
- cross-user artifact delivery;
- stale replacement bug;
- FL crash/data loss;
- no rollback/uninstall;
- dashboard/sidebar conversation mismatch.

