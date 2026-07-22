# 07. Архитектурные решения

## ADR-001: Modular monolith first

### Status

Accepted for planning.

### Context

Маленькая команда, early product, неизвестные boundaries/load.

### Decision

Один FastAPI codebase с доменными модулями; API и workers как отдельные deployables. Не создавать microservices.

### Trade-offs

- Плюс: быстрее build/debug/deploy, простые transactions.
- Минус: меньше независимого release/scale модулей.
- Mitigation: module boundaries, queues/outbox, extraction triggers.

### Revisit trigger

Команда >10, independent ownership/release или измеренная необходимость scale domain отдельно.

## ADR-002: PostgreSQL + object storage

### Status

Accepted for planning.

### Context

Relational ownership/status/jobs и binary MIDI/audio/ZIP artifacts.

### Decision

PostgreSQL для metadata/durable state; object storage для artifacts. Не хранить большие binaries в DB.

### Trade-offs

- Плюс: transactions/queryability + scalable artifact storage.
- Минус: consistency между DB/object requires orchestration.
- Mitigation: artifact states, checksums, cleanup/reconciliation.

### Revisit trigger

Measured object access pattern требует different storage/CDN strategy.

## ADR-003: External browser OAuth with PKCE for sidebar

### Status

Accepted for planning.

### Context

Native/plugin client не может хранить secret; password/token paste опасен.

### Decision

Authorization Code + PKCE через system browser/loopback companion. Device Authorization fallback. Secure OS token storage.

### Trade-offs

- Плюс: standards-based, no password in plugin, revoke/scopes.
- Минус: companion/browser/loopback complexity.
- Mitigation: device flow fallback and clear UX.

### Revisit trigger

Target identity provider не поддерживает required native/device flows или platform constraints require claimed HTTPS/custom scheme.

## ADR-004: Async jobs for generation and export

### Status

Accepted.

### Context

Model/export latency unpredictable; synchronous handlers hurt reliability.

### Decision

Create durable request/job, enqueue through outbox, progress via SSE/events.

### Trade-offs

- Плюс: retries/cancel/scale/isolation.
- Минус: eventual consistency and job complexity.
- Mitigation: explicit states, idempotency, reconciliation.

### Revisit trigger

Pure local operation bypasses backend job; lightweight synchronous operations may have separate safe endpoint later.

## ADR-005: REST + SSE + limited WebSocket

### Status

Accepted for planning.

### Context

Durable CRUD/jobs plus realtime sidebar delivery.

### Decision

REST for resources/commands, SSE for one-way job progress, WebSocket only for device presence/delivery/conversation events.

### Trade-offs

- Плюс: simpler than all-WebSocket/event platform.
- Минус: multiple transport patterns.
- Mitigation: shared event envelope and reconnect cursors.

### Revisit trigger

Realtime collaboration/presence becomes dominant and requires dedicated gateway/protocol.

## ADR-006: Managed identity before custom auth

### Status

Proposed/strong recommendation.

### Context

Password security, OAuth native/device flows and recovery are high-risk undifferentiated work.

### Decision

Choose standards-based managed identity provider supporting OIDC, native PKCE, device authorization or compatible extension, session/revoke needs.

### Trade-offs

- Плюс: faster/safer launch.
- Минус: vendor cost/dependency and feature constraints.
- Mitigation: store provider subject mapping; keep domain authorization in backend; export/migration plan.

### Revisit trigger

Cost, data residency, enterprise federation or provider limitations materially block product.

## ADR-007: Artifact/provenance first-class

### Status

Accepted.

### Context

User requires export of completed requests/results; reproducibility and safe FL delivery require immutable references/checksums.

### Decision

Candidate/result/export represented as versioned Artifact with checksum/provenance, not arbitrary message attachment.

### Trade-offs

- Плюс: export, delivery, audit, reproduction.
- Минус: more metadata/lifecycle logic early.
- Mitigation: small artifact schema and limited kinds in MVP.

### Revisit trigger

Artifact graph becomes complex enough for dedicated service/index, after measured need.

## ADR-008: One shared canonical Signal contract

### Status

Accepted.

### Context

Browser and sidebar must do the same creative operations without diverging.

### Decision

Versioned `MusicalContext`, `Intent`, `CandidateSet`, `ArtifactManifest` and error/event envelopes shared by all clients.

### Trade-offs

- Плюс: parity and testing.
- Минус: schema evolution coordination with old sidebar clients.
- Mitigation: backward compatibility window, version handshake, minimum safe version.

### Revisit trigger

Surface-specific needs prove canonical contract too restrictive; extend through explicit optional capabilities, not forks.

