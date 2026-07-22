# 05. Масштабирование и эксплуатация

## Scaling principle

Сначала измерять bottleneck. Scale workers/queues independently через deployables; split code/services только когда operational/team boundaries это оправдывают.

## Stage 0 — Private alpha, 0–100 users

- one API instance + standby/autorestart;
- one worker;
- managed PostgreSQL small;
- Redis/queue;
- object storage;
- one region;
- manual invite;
- basic logs/metrics/traces;
- daily backups/PITR as provider allows;
- no microservices/Kafka/Kubernetes requirement.

## Stage 1 — Beta, 100–1,000 users

- 2+ API instances behind load balancer;
- multiple workers;
- queues: interactive/export;
- DB connection pooler;
- migration pipeline;
- alerting/on-call owner;
- rate limits/quotas;
- signed release/deploy rollback;
- restore drill;
- status page.

## Stage 2 — 1,000–10,000 active users

- autoscale API/workers;
- queues: interactive, profile/audio, export;
- priority/fair scheduling;
- provider circuit breakers;
- realtime gateway separated if connections dominate;
- object lifecycle/egress monitoring;
- DB query/performance reviews;
- read replica if measured;
- cache only safe high-value reads;
- outbox/reconciliation hardened.

## Stage 3 — 10,000–100,000

- generation worker fleets by model/hardware;
- export fleet;
- partition/archive high-volume events;
- dedicated realtime service;
- regional CDN/artifact delivery;
- data warehouse/event pipeline with privacy filters;
- stronger SLO/error budgets;
- service extraction only for independently scaled/owned domains;
- disaster recovery environment.

## Stage 4 — 100,000+

- region/data residency analysis;
- multi-region read/write decision by requirements;
- global device routing;
- dedicated generation orchestrator;
- model capacity reservation;
- shard/partition only after PostgreSQL limits measured;
- enterprise/team tenancy if product demands;
- formal security/compliance program.

## Extraction triggers

### Generation service

Extract if:

- GPU/model deploy lifecycle differs;
- team ownership separate;
- queue/scale/release independent;
- API process reliability affected.

### Realtime service

Extract if:

- WebSocket connection count/resource use dominates;
- independent deploy/reconnect behavior needed;
- regional routing required.

### Artifact/export service

Extract if:

- export CPU/I/O harms interactive workload;
- enterprise/data export policy diverges;
- storage throughput/ownership becomes separate.

Если trigger отсутствует, оставить module/deployable.

## SLO working targets

После public beta:

- API availability: 99.9% target;
- create ChatRequest p95 < 300 ms, excluding generation;
- project/conversation reads p95 < 500 ms;
- interactive generation p95 target < 5 s by supported operation/engine;
- local fallback unaffected by cloud outage;
- export small conversation p95 < 60 s;
- realtime delivery command visible < 2 s when device online;
- zero cross-user access;
- durable job loss = 0.

SLOs segmented by operation/model; одна aggregate цифра скрывает проблемы.

## Observability

### Correlation

- request_id;
- user/device pseudonymous IDs;
- conversation/request/job IDs;
- model/prompt/generator versions;
- artifact/export/delivery IDs.

### Metrics

- API latency/error;
- queue depth/age;
- job latency/status/retries;
- validation failure;
- provider availability/cost;
- accepted/undo events aggregates;
- export time/size/failure;
- realtime connections/delivery ack;
- token refresh/replay/revoke;
- DB pool/query latency;
- object storage/egress.

### Logs

- structured;
- redacted;
- sampling by severity;
- no prompts/notes/filenames by default;
- retention documented;
- support diagnostics separate.

### Traces

- API → DB/queue;
- worker → provider/storage;
- no sensitive payload attributes;
- cost/version tags.

## Alerts

- oldest interactive queue job;
- generation failure spike;
- auth/replay anomalies;
- cross-account authorization test alarm;
- DB saturation/error;
- artifact checksum mismatch;
- export backlog;
- realtime disconnect spike;
- provider cost circuit breaker;
- backup/PITR failure;
- deletion/retention reconciler failure.

## Backup and recovery

- PostgreSQL PITR;
- encrypted backups;
- object storage versioning/lifecycle appropriate;
- configuration/IaC backed up;
- identity/provider export/recovery plan;
- quarterly restore drill initially;
- RPO/RTO defined before paid launch;
- deletion policy compatible with backups and legal requirements;
- incident recovery does not re-enable revoked tokens silently.

## Deployments

- migrations backward-compatible where possible;
- expand/migrate/contract;
- canary/rolling for API/workers;
- workers drain gracefully;
- prompt/model routing feature flags;
- kill switch per provider/operation;
- rollback code and routing;
- schema/version compatibility with older sidebar clients;
- minimum supported client enforcement only for safety.

## Cost controls

- budget/alerts per provider;
- max concurrent jobs;
- operation-specific routing;
- local engine preferred;
- candidate count default 4;
- failed/invalid job cost tracked;
- object retention/lifecycle;
- export/audio egress;
- free/demo abuse limits;
- unit economics by accepted action.

## Capacity planning

Before scale event estimate:

```text
active users
× requests per active hour
× candidates per request
× model duration/cost
= worker/provider demand
```

Use measured percentile distributions, not average-only assumptions.

