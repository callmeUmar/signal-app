# 05. Roadmap и критерии приёмки

## Phase D0 — Authenticated shell, 1 неделя

- login/logout/session;
- protected routes;
- navigation;
- account/settings skeleton;
- error/status handling;
- shared design system.

Acceptance:

- no tokens in localStorage/URLs;
- session expiration/relogin works;
- unauthorized routes protected;
- mobile management navigation usable.

## Phase D1 — Projects and conversations, 1–2 недели

- project CRUD;
- conversation CRUD;
- message timeline;
- request statuses;
- candidate/result typed cards with mocked backend;
- pagination;
- provenance drawer.

## Phase D2 — Browser Copilot vertical slice, 2–3 недели

- MIDI import;
- minimal Piano Roll;
- playback;
- operation palette/chat request;
- generation job progress;
- four candidates;
- apply/save;
- local draft/undo.

Gate:

- user completes `import → request → preview → save/export` without help;
- no invalid candidate reaches editor;
- p95 UI interaction stays responsive on fixture corpus;
- browser result matches shared backend contract.

## Phase D3 — Exports, 1–2 недели

- selected MIDI export;
- request export;
- conversation bundle;
- export center;
- progress/expiry/regenerate;
- manifest/checksum verification;
- account data export request skeleton.

## Phase D4 — Connected devices, 1–2 недели

- device authorize/deny;
- PKCE callback surface;
- activation-code fallback;
- device list/revoke;
- presence;
- `Send to FL` delivery command;
- delivery status.

Gate:

- stolen/reused code rejected;
- revoked device loses realtime/API access;
- dashboard cannot silently mutate FL;
- reconnect/resync works.

## Phase D5 — Creator DNA and billing, 2–4 недели

- profile management;
- consent/export/delete;
- usage;
- pricing entitlements;
- checkout/customer portal only after value validation;
- clear cloud/local limits.

## Full acceptance

### Core flows

- create/open project;
- import/edit MIDI;
- run chat request;
- observe progress;
- preview/select candidate;
- save/apply;
- export result/request/conversation;
- authorize/revoke sidebar;
- send candidate to online FL device;
- delete/export data.

### Reliability

- refresh/reopen preserves durable state;
- failed job doesn't create completed result;
- reconnect obtains current job/device state;
- expired export regenerates safely;
- duplicate submit controlled by idempotency;
- no raw creative content in analytics.

### Security

- CSRF/session tests;
- access control per project/artifact/device;
- signed URL scope/TTL;
- sanitized chat content;
- no model code execution;
- token/device revocation end-to-end.

## Launch blockers

- browser/sidebar contract mismatch;
- data loss in Piano Roll editor;
- invalid MIDI export;
- cross-account project/artifact access;
- token leak;
- revoked device remains active;
- export bundle omits provenance/checksums unexpectedly;
- hidden training consent.

