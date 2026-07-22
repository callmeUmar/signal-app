# 01. Продукт и информационная архитектура

## Primary jobs

1. Продолжить работу без открытого FL Studio.
2. Найти прошлый conversation/result.
3. Создать MIDI context в browser.
4. Экспортировать request/result/project.
5. Подключить или отозвать sidebar device.
6. Управлять Creator DNA и privacy.
7. Понимать usage/plan без сюрпризов.

## Navigation MVP

- Home
- Projects
- Browser Copilot
- Creator DNA
- Exports
- Connected Devices
- Usage / Billing
- Settings
- Help / Status

## Route map

```text
/app
/app/projects
/app/projects/:projectId
/app/projects/:projectId/conversations/:conversationId
/app/copilot
/app/profiles
/app/profiles/:profileId
/app/exports
/app/devices
/app/devices/authorize
/app/activate
/app/usage
/app/billing
/app/settings/account
/app/settings/privacy
/app/settings/data
```

## Home

### First-time

- `Create browser project`;
- `Import MIDI`;
- `Connect FL Studio`;
- starter example;
- privacy summary;
- recent empty state.

### Returning

- continue last conversation;
- recent projects;
- unfinished/completed jobs;
- connected FL status;
- saved results;
- usage summary;
- product incidents/updates, если relevant.

## Project

Project объединяет:

- metadata;
- tempo/time signature/key defaults;
- conversations;
- imported contexts;
- saved artifacts;
- selected Creator DNA;
- source surface: browser/FL;
- export history.

Project не равен `.flp`. Dashboard не обещает полный FL project mirror.

## Conversation

Conversation UI:

- chat timeline;
- request status/progress;
- attached musical context summary;
- operation/controls;
- candidate cards;
- playback;
- diff/metrics;
- selected/saved/inserted state;
- export/send actions;
- provenance drawer;
- retry from same context;
- branch conversation from request.

## Browser Copilot shortcut

`/app/copilot` создаёт или открывает scratch project. Это уменьшает friction, но после первого save пользователь выбирает project name или сохраняет default.

## Creator DNA

- list profiles;
- create from selected own MIDI files/projects;
- generic/personal comparison;
- feature summary;
- included sources;
- last updated;
- export;
- delete;
- cloud sync status;
- training consent отдельно от profiling consent.

Нельзя показывать псевдоточность вроде «ваш стиль на 87% dark». Показывать interpretable musical traits.

## Exports Center

- create new export;
- filter by project/conversation/request;
- include selected/all candidates;
- format;
- job progress;
- download expiration;
- regenerate expired link;
- checksum;
- delete export artifact;
- separate account data export.

## Connected Devices

Для каждого sidebar/companion:

- display name;
- OS/app version;
- first/last connected;
- online/offline;
- granted scopes;
- revoke;
- rename;
- suspicious/replay alert;
- active FL project name не хранить/показывать без необходимости.

## Usage/Billing

- accepted/generation usage distinction;
- included local vs cloud operations;
- current period;
- limits before request;
- invoice/subscription;
- upgrade/cancel;
- no dark patterns;
- no hidden credit burn for failed/invalid jobs.

## Settings

### Account

- identity providers;
- email;
- sessions;
- delete account.

### Privacy

- content processing;
- product telemetry;
- training opt-in;
- Creator DNA sync;
- support diagnostics.

### Data

- account export;
- retention;
- delete conversations/projects/profile;
- revoke devices;
- clear drafts.

## Responsive priorities

Dashboard management pages должны работать на mobile. Full browser Piano Roll оптимизируется для desktop/tablet; на mobile допускается read/play/export, но не обещается полноценное editing до отдельного design.

