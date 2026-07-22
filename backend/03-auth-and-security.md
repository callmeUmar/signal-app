# 03. Авторизация и безопасность

## Security posture

Creative projects и unpublished MIDI могут быть коммерчески чувствительными. Signal должен считать их confidential user content, даже если regulatory classification не требует специальных категорий.

## Identity architecture

### Dashboard

- OIDC/browser authorization through managed identity;
- secure server session/BFF;
- HttpOnly cookies;
- CSRF defense;
- session rotation;
- no provider/access token in browser localStorage.

### Sidebar/companion

- public native client;
- external system browser;
- Authorization Code + PKCE;
- loopback redirect via companion;
- Device Authorization fallback;
- no client secret;
- OS secure storage;
- short access + rotating/sender-constrained refresh.

[RFC 8252](https://datatracker.ietf.org/doc/html/rfc8252), [RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628), [RFC 9700](https://datatracker.ietf.org/doc/rfc9700/)

## Authorization model

Каждый request проверяет:

1. authenticated subject/session;
2. account status;
3. token/session scopes;
4. resource ownership;
5. entitlement/quota;
6. resource state/version;
7. operation-specific constraints.

Никогда не доверять `user_id` из client body.

## Scope separation

Dashboard session может управлять account/billing/devices по role. Sidebar token ограничен creative scopes и realtime. Sidebar не может:

- менять billing;
- удалять account;
- просматривать sessions других devices beyond allowed metadata;
- расширять собственные scopes;
- выдавать новые grants.

## Token handling

- Authorization headers redacted;
- query-string tokens запрещены, кроме narrowly specified single-use authorization codes handled by standard flow;
- secrets stored in secret manager;
- signing key rotation;
- audience/issuer/expiry/nonce validation;
- clock skew bounded;
- revoke/refresh replay response;
- no token in exception/error body;
- support never requests user token.

## Browser security

- CSP;
- CSRF tokens/origin checks;
- secure cookie attributes;
- clickjacking defense especially device approval;
- strict redirect allowlist;
- output sanitization;
- rate limit login/activation/export;
- session/device alerts;
- dependency/supply-chain scanning.

## API security

- TLS only externally;
- CORS exact origins;
- request/body limits;
- schema validation;
- rate limit by account/device/IP risk signal;
- idempotency scoped to user/route;
- no mass assignment;
- opaque IDs plus ownership checks;
- signed URLs short-lived/scope-limited;
- upload content validation;
- webhook signature/replay protection;
- admin/support access separately authenticated/audited.

## Local bridge security

- bind `127.0.0.1`/`::1` only;
- never `0.0.0.0`;
- per-install/session capability;
- origin/host validation;
- request size/command allowlist;
- no arbitrary filesystem/command execution;
- version handshake;
- replay-protected command IDs;
- secure token stays in companion, not plugin.

## AI-specific security

- user text is data, not code;
- LLM tool/function allowlist;
- structured output schema;
- model cannot choose ownership IDs/object keys;
- model output goes through music validator;
- prompt injection cannot expand scopes;
- provider logs/retention reviewed;
- no provider receives full conversation/context unless necessary;
- context minimization;
- max token/note/candidate/cost limits;
- model/provider failure fail closed for DAW mutation.

## Artifact security

- checksum at creation and delivery;
- immutable object key/version for completed artifact;
- encrypted at rest by platform controls;
- access through authorized backend/signed URL;
- no guessable public bucket;
- content-disposition safe filename;
- ZIP path traversal defense;
- export manifest allowlist;
- expired exports deleted by lifecycle/reconciler.

## Data privacy controls

- no creative content in analytics by default;
- consent records versioned;
- profiling consent separate from model-training consent;
- user export/delete;
- device revoke;
- retention inventory;
- processors/providers documented;
- support access logged;
- lower environments use synthetic data.

## Abuse/cost controls

- anonymous demo quotas;
- account/device/IP rate limits;
- concurrent job caps;
- request complexity limits;
- provider budget circuit breaker;
- failed validation not billed to user unless policy transparent;
- suspicious export/download throttling;
- device-code brute-force protection.

## Security testing

- threat model per surface;
- authz unit/integration tests;
- cross-user ID tests;
- PKCE/state/nonce;
- refresh replay/revoke;
- CSRF/CORS/redirect;
- signed URL expiry/scope;
- upload/parser fuzz;
- ZIP traversal;
- local IPC fuzz;
- secret scan;
- dependency/container scan;
- backup access/restore;
- incident tabletop before public beta.

## Incident priorities

P0:

- cross-user data access;
- token/signing key compromise;
- hidden content upload/training;
- remote/local code execution;
- malicious artifact insertion;
- project data loss caused by service command.

P0 triggers distribution/feature stop, token/key response, user communication and documented postmortem.

