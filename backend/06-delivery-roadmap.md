# 06. План поставки и критерии

## Phase B0 — Foundation, 1 неделя

- repository/service setup;
- configuration/secrets;
- health/readiness;
- database migrations;
- shared error/schema conventions;
- request IDs/log redaction;
- CI/test/deploy staging;
- architecture decision records.

## Phase B1 — Identity and ownership, 1–2 недели

- managed identity integration;
- dashboard session/BFF support;
- user mapping;
- project ownership helpers;
- sidebar public client registration plan;
- PKCE/device sandbox flow;
- device records/revoke;
- audit events.

Gate:

- cross-user access tests pass;
- no tokens in logs/browser storage;
- device revoke end-to-end;
- redirect/scopes reviewed.

## Phase B2 — Projects/conversations, 1–2 недели

- projects;
- conversations;
- typed messages;
- pagination/version;
- deletion/retention skeleton;
- API client generation/contracts.

## Phase B3 — Generation vertical slice, 2–3 недели

- ChatRequest/context snapshot;
- job/outbox/worker;
- deterministic/rule engine adapter;
- CandidateSet;
- validator;
- SSE progress;
- cancel/retry/idempotency;
- cost/version metrics.

Gate:

- durable request survives process restart;
- duplicate submit doesn't duplicate result;
- invalid output never completed;
- provider/worker failure retryable/visible;
- p95 within phase target.

## Phase B4 — Artifacts and exports, 1–2 недели

- object storage adapter;
- artifact metadata/checksum;
- signed download;
- MIDI artifact;
- export worker;
- request/conversation ZIP;
- manifest/checksums;
- expiry/reconciliation;
- cross-user/security tests.

## Phase B5 — Realtime devices, 1–2 недели

- connection auth;
- presence;
- delivery durable command;
- ack/status;
- reconnect cursor;
- revoke disconnect;
- artifact fetch/checksum;
- rate limits.

## Phase B6 — Profiles/usage/billing, 2–4 недели

- profile CRUD/build job;
- consent/export/delete;
- usage events/aggregation;
- entitlements;
- billing webhook/customer mapping;
- limits/failed-job policy;
- admin/support minimum surface.

## Acceptance before private alpha

- identity/ownership enforced;
- deterministic generation vertical slice;
- dashboard and sidebar can share conversation;
- no raw creative data in observability;
- backups enabled;
- restore tested at least once;
- deletion/revoke basics;
- rate limits;
- staging isolated;
- incident contacts/kill switches.

## Acceptance before public beta

- SLO dashboards/alerts;
- signed artifacts/exports;
- device PKCE + fallback tested;
- rotating refresh/replay/revoke;
- privacy/account export/delete flow;
- provider terms/data retention reviewed;
- security review/threat model;
- restore drill;
- migration/rollback;
- status page/support diagnostics;
- load test expected peak × safety factor.

## Launch blockers

- missing ownership check;
- job lost between DB and queue;
- unvalidated model output;
- refresh/token replay not handled;
- export ZIP traversal/data mix;
- unsigned public bucket;
- content in logs;
- deletion/revoke only cosmetic;
- no backup restore evidence;
- backend outage can trigger unsafe FL mutation.

