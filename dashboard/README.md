# Dashboard

Authenticated web application Signal.

## Роль

Dashboard — control center и полноценный browser-copilot:

- account/session;
- projects и conversations;
- MIDI import/editor/playback;
- те же chat operations, что в sidebar;
- candidate history;
- экспорт завершённых requests и результатов;
- отправка результата в подключённый FL sidebar;
- Creator DNA;
- connected devices и revoke;
- usage/billing/privacy settings.

## Документы

1. [Продукт и информационная архитектура](./01-product-and-information-architecture.md)
2. [Browser Copilot](./02-browser-copilot.md)
3. [Авторизация, устройства, экспорт и данные](./03-auth-devices-exports.md)
4. [Технический план](./04-technical-build-plan.md)
5. [Roadmap и критерии приёмки](./05-roadmap-and-acceptance.md)

## Главный принцип

Dashboard и sidebar — два клиента одного Conversation/Signal Core. Они не должны создавать несовместимые типы запросов или результатов.

