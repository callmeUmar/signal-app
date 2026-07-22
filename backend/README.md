# Backend

План серверной платформы Signal.

## Роль

Backend обеспечивает единое поведение landing demo, dashboard и sidebar:

- identity/session/device authorization;
- projects/conversations/chat requests;
- Signal Core orchestration;
- structured generation + validation;
- artifacts и exports;
- Creator DNA;
- realtime device delivery;
- usage/entitlements/billing hooks;
- privacy/audit/observability.

## Документы

1. [Системная архитектура](./01-system-architecture.md)
2. [API и модель данных](./02-api-and-data-model.md)
3. [Авторизация и безопасность](./03-auth-and-security.md)
4. [Generation, artifacts и exports](./04-generation-artifacts-exports.md)
5. [Масштабирование и эксплуатация](./05-scaling-and-operations.md)
6. [План поставки и критерии](./06-delivery-roadmap.md)
7. [Архитектурные решения](./07-architecture-decisions.md)

## Архитектурная позиция

**Modular monolith + background workers**, а не ранние микросервисы.

Модули имеют ясные границы и events/outbox, но запускаются в небольшом количестве deployables до появления доказанной необходимости независимого ownership/scale.

