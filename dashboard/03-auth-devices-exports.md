# 03. Авторизация, устройства, экспорт и данные

## Dashboard sign-in

Рекомендуется использовать standards-based identity provider/OIDC, а не самостоятельно строить password storage и authorization server.

Browser session:

- secure HttpOnly cookie;
- SameSite policy по flow;
- CSRF protection для mutations;
- session rotation after login/privilege change;
- session/device list;
- MFA/passkey option later;
- no bearer token in localStorage.

## Sidebar connection flow

### Primary: browser + PKCE

Dashboard route: `/app/devices/authorize`.

Экран показывает:

- device name/type;
- requested scopes;
- approximate OS/app version;
- expiration;
- Approve/Deny;
- warning, если request unexpected.

После approve sidebar получает authorization result через loopback companion flow. Внешний browser + PKCE соответствует native app guidance. [RFC 8252](https://datatracker.ietf.org/doc/html/rfc8252)

### Fallback: activation code

Dashboard route: `/app/activate`.

- user вводит/проверяет code;
- видит device/scopes;
- подтверждает;
- device flow имеет TTL, interval и rate limits;
- code нельзя использовать повторно.

[RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628)

## Scopes

Начальные scopes:

- `profile:read`;
- `projects:read`;
- `conversations:read`;
- `conversations:write`;
- `artifacts:read`;
- `artifacts:write`;
- `generation:create`;
- `device:realtime`.

Billing/account deletion не доступны sidebar token.

## Token/device security

- no static client secret в sidebar;
- short-lived access token;
- rotating refresh token или stronger sender constraint;
- OS secure storage;
- revoke per device;
- token replay detection;
- absolute and inactivity expiry;
- refresh failure requires browser reconnect;
- logout/revoke closes realtime channel;
- `.flp` stores only non-secret device/session reference if necessary.

## Conversation export UX

### Selection

- entire project;
- one conversation;
- completed requests range;
- one request;
- selected result only.

### Include options

- transcript;
- source context summary;
- raw source MIDI — off by default, explicit;
- selected candidates;
- all candidates;
- preview audio;
- controls/provenance;
- validation report;
- feedback/decision events.

### Formats

- `.mid`;
- `.json`;
- `.md`;
- `.zip` bundle;
- `.wav` when available.

## Export job

1. Client validates scope/selection.
2. `POST /exports` with idempotency key.
3. Backend snapshots referenced versions.
4. Export worker packages artifacts.
5. Checksums and manifest generated.
6. User gets completion event.
7. Download uses short-lived signed URL.
8. Export artifact expires per policy; source records remain unless deleted separately.

## Export manifest minimum

```json
{
  "schema_version": "1.0",
  "export_id": "uuid",
  "created_at": "iso8601",
  "scope": "conversation",
  "project_id": "uuid",
  "conversation_id": "uuid",
  "included_request_ids": [],
  "files": [
    {"path": "artifacts/result.mid", "sha256": "...", "media_type": "audio/midi"}
  ]
}
```

## Privacy export

Отдельная кнопка `Export my account data`:

- account;
- consents;
- devices/sessions;
- projects/conversations;
- profiles;
- telemetry, где применимо;
- billing references без full payment secrets.

Статус и retention такого export не смешиваются с creative exports.

## Delete flows

- delete request/conversation/project;
- delete generated export artifact;
- delete Creator DNA;
- revoke device;
- delete account.

UI объясняет cascading consequences и grace/recovery period, если он существует. Hard delete/retention определяются backend policy и legal review.

## Audit events

- device authorized/revoked;
- export created/downloaded/expired;
- privacy settings changed;
- profile created/deleted;
- account deletion requested;
- suspicious token replay.

Audit не содержит MIDI notes/prompts без необходимости.

