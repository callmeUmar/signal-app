# Sidebar Chat

План sidebar-like Signal Copilot для FL Studio.

## Терминология

FL Studio не предоставляет подтверждённую стороннюю extension surface, эквивалентную VS Code sidebar. Поэтому продукт следует называть **sidebar-like connected panel** до доказанной native docking возможности.

Целевой UX:

- panel/plugin window остаётся рядом с FL workflow;
- chat и operation buttons;
- current context из Piano Roll через FL adapter;
- preview candidates;
- безопасная вставка обратно;
- browser-based account connection;
- conversations синхронизированы с dashboard.

## Документы

1. [UX, chat и команды](./01-ux-and-commands.md)
2. [Интеграция с FL Studio и local bridge](./02-fl-integration.md)
3. [Browser authorization и device security](./03-auth-and-device-linking.md)
4. [Технический план](./04-technical-build-plan.md)
5. [Roadmap и критерии приёмки](./05-roadmap-and-acceptance.md)

## Главное правило

Sidebar никогда не вставляет model output напрямую. Результат проходит backend/local validator, local defensive validation и явное подтверждение пользователя.

