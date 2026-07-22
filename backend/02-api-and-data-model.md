# 02. API и модель данных

## API principles

- versioned `/v1`;
- JSON schemas shared/generated;
- resource-oriented REST;
- idempotency for create/generation/export/delivery;
- cursor pagination;
- request/correlation IDs;
- consistent error envelope;
- no unstructured model output as API contract;
- optimistic concurrency/version where concurrent clients edit durable state.

## Main endpoints

### Identity/user

```text
GET    /v1/me
PATCH  /v1/me
GET    /v1/me/sessions
DELETE /v1/me/sessions/{session_id}
POST   /v1/me/data-export
POST   /v1/me/deletion-request
```

### Projects

```text
GET    /v1/projects
POST   /v1/projects
GET    /v1/projects/{project_id}
PATCH  /v1/projects/{project_id}
DELETE /v1/projects/{project_id}
```

### Conversations/messages

```text
GET    /v1/projects/{project_id}/conversations
POST   /v1/projects/{project_id}/conversations
GET    /v1/conversations/{conversation_id}
PATCH  /v1/conversations/{conversation_id}
DELETE /v1/conversations/{conversation_id}
GET    /v1/conversations/{conversation_id}/messages
```

Messages обычно создаются как часть ChatRequest/use case, чтобы текст и job не расходились.

### Chat/generation

```text
POST   /v1/conversations/{conversation_id}/requests
GET    /v1/requests/{request_id}
POST   /v1/requests/{request_id}/cancel
POST   /v1/requests/{request_id}/retry
GET    /v1/requests/{request_id}/events       # SSE
GET    /v1/requests/{request_id}/candidates
POST   /v1/candidates/{candidate_id}/decisions
```

### Artifacts/exports

```text
GET    /v1/artifacts/{artifact_id}
POST   /v1/artifacts/{artifact_id}/download
POST   /v1/exports
GET    /v1/exports
GET    /v1/exports/{export_id}
POST   /v1/exports/{export_id}/download
DELETE /v1/exports/{export_id}
```

### Devices/realtime

```text
POST   /v1/devices/register-metadata
GET    /v1/devices
PATCH  /v1/devices/{device_id}
DELETE /v1/devices/{device_id}
POST   /v1/devices/{device_id}/deliveries
GET    /v1/deliveries/{delivery_id}
POST   /v1/deliveries/{delivery_id}/ack
WS     /v1/realtime
```

OAuth authorization/token endpoints принадлежат identity/authorization server, а не придумываются произвольно в resource API.

### Profiles

```text
GET    /v1/profiles
POST   /v1/profiles
GET    /v1/profiles/{profile_id}
PATCH  /v1/profiles/{profile_id}
POST   /v1/profiles/{profile_id}/sources
POST   /v1/profiles/{profile_id}/rebuild
POST   /v1/profiles/{profile_id}/export
DELETE /v1/profiles/{profile_id}
```

## Error envelope

```json
{
  "error": {
    "code": "CONTEXT_STALE",
    "message": "The FL context changed before insertion.",
    "request_id": "uuid",
    "retryable": false,
    "details": {}
  }
}
```

User-visible message локализуется client-side по stable code, если appropriate. Sensitive details не возвращаются.

## Core tables

### users

- `id`;
- `identity_subject` unique;
- `email_normalized` if needed;
- `status`;
- `created_at/updated_at/deleted_at`.

Password hashes не хранятся, если используется managed identity.

### projects

- `id`, `user_id`;
- `name`;
- `source_surface`;
- `default_tempo/key/time_signature`;
- `version`;
- timestamps/deleted_at.

### conversations

- `id`, `project_id`, `user_id`;
- `title`;
- `status`;
- `parent_conversation_id` optional;
- `version`;
- timestamps.

### messages

- `id`, `conversation_id`;
- `sequence_number`;
- `role`;
- `content_type`;
- `content_json`;
- `request_id` optional;
- timestamps.

`content_json` validated per content type. Не хранить arbitrary provider response as trusted message.

### chat_requests

- `id`, `conversation_id`, `user_id`;
- `status`;
- `intent_json`;
- `controls_json`;
- `context_snapshot_id`;
- `profile_id/version` optional;
- `idempotency_key`;
- `parent_request_id` optional;
- timestamps/error_code.

### context_snapshots

- `id`;
- canonical context JSON or artifact reference;
- `schema_version`;
- content hash;
- source surface;
- minimization flags;
- retention class.

### generation_jobs

- `id`, `chat_request_id`;
- `status/attempt`;
- `engine/provider/model/prompt_version`;
- `queue`;
- `started/finished`;
- `latency_ms`;
- `cost_units`;
- `error_code`;
- cancellation fields.

### candidate_sets / candidates

- set links to request/job;
- schema/generator versions;
- candidate order/label;
- metrics JSON;
- artifact ID;
- validation status/report;
- provenance.

### artifacts

- `id`, `user_id`, project/conversation/request links;
- `kind`;
- `media_type`;
- `object_key`;
- `size_bytes`;
- `sha256`;
- `schema_version`;
- `retention_class`;
- `expires_at/deleted_at`;
- provenance JSON.

### export_jobs

- `id`, `user_id`;
- `scope_type/scope_id`;
- `selection_json`;
- `status`;
- `snapshot_version`;
- output artifact ID;
- timestamps/error.

### devices

- `id`, `user_id`;
- display/client/OS/version metadata;
- scopes;
- authorized/last_seen/revoked;
- no raw refresh token.

### deliveries

- `id`, `user_id`, `device_id`, `artifact_id`;
- status;
- one-time command token/reference;
- expected context hash optional;
- created/expires/acked/completed;
- error code.

### profiles / profile_sources

- profile metadata/version/status;
- derived features reference;
- source consent/ownership declaration;
- source artifact/derived-only policy;
- build job;
- export/delete state.

### usage_events / audit_events / outbox_events

- append-oriented operational records;
- no raw note/prompt content by default;
- indexes/retention separate from product data.

## Indexing first pass

- ownership + updated cursor;
- project conversations;
- conversation sequence;
- request status/time;
- job queue/status;
- artifact owner/link;
- export owner/status;
- device owner/revoked;
- outbox unpublished.

Добавлять indexes по query plans, не дублировать всё заранее.

## Data versioning

- API version;
- schema version per JSON domain object;
- generator/model/prompt version;
- profile feature version;
- artifact manifest version;
- optimistic row version where concurrent browser/sidebar edits matter.

## Retention classes

- durable user project/conversation;
- derived profile;
- temporary upload;
- generated artifact;
- export bundle;
- operational logs;
- security audit;
- billing/legal record.

Каждый класс имеет documented TTL/delete behavior.

