# 12. Решения, допущения и открытые вопросы

## Принятые рабочие решения

| ID | Решение | Причина | Статус |
|---|---|---|---|
| D-001 | Первый продукт — creative MIDI copilot | самый короткий путь к проверяемой ценности | принято |
| D-002 | Первый хост — FL Studio | deep Piano Roll scripting и ясный сегмент | принято |
| D-003 | Первый workflow — transform selected MIDI | меньше cold start, права и latency | принято |
| D-004 | MIDI раньше audio | editable, дешёво, валидируемо | принято |
| D-005 | Pure Piano Roll script раньше VST3 | проверяет ценность до plugin engineering | принято |
| D-006 | Creator DNA сначала из собственных MIDI | лучше signal и ниже legal risk | принято |
| D-007 | Reference audio — после product validation | высокий friction и сложность | принято |
| D-008 | Flow sequencing — отдельный будущий продукт | другой пользователь и distribution | принято |
| D-009 | Structured schemas и validator обязательны | AI output нельзя напрямую вставлять в DAW | принято |
| D-010 | Local-first basic transforms | latency, privacy и resilience | принято |
| D-011 | FL-only не является конечным moat | Gopher/platform risk | принято |
| D-012 | Продукт состоит из landing, dashboard/browser copilot, sidebar и общего backend | единый путь от discovery до DAW workflow | принято 21.07.2026 |
| D-013 | Dashboard и sidebar используют одну модель conversation/artifact и Signal Core | результаты и история должны быть переносимы между браузером и FL Studio | принято 21.07.2026 |
| D-014 | Sidebar авторизуется через внешний браузер: Authorization Code + PKCE, fallback — Device Authorization | безопаснее token paste и embedded login | принято 21.07.2026 |
| D-015 | Backend начинается как modular monolith с отдельными workers | меньше операционной сложности при сохранении границ модулей | принято 21.07.2026 |
| D-016 | Artifact, provenance и экспорт завершённых запросов — first-class сущности | воспроизводимость, доверие и переносимость результатов | принято 21.07.2026 |
| D-017 | Отправка из dashboard в FL требует online device и локального подтверждения | удалённая команда не должна молча изменять проект | принято 21.07.2026 |

## Ключевые допущения

| ID | Допущение | Уверенность | Как проверить |
|---|---|---|---|
| A-001 | Продюсерам часто нужно продолжение/вариация существующего MIDI | средняя | 15 интервью + diary study |
| A-002 | Прямая вставка важнее красивого standalone UI | средняя | сравнить script vs web prototype |
| A-003 | Четыре варианта — оптимальный выбор | низкая | A/B 2/4/8 candidates |
| A-004 | Users доверят собственные MIDI для local profiling | средняя/низкая | privacy concept test |
| A-005 | Creator DNA повысит acceptance | низкая | controlled experiment |
| A-006 | FL users смогут установить script | средняя | unmoderated install test |
| A-007 | VST bridge станет нужен после script | средняя | beta interviews/usage |
| A-008 | Subscription около $10 приемлема | низкая | Van Westendorp + purchase test |
| A-009 | Local engine достаточно хорош для common transforms | средняя | benchmark на corpus |
| A-010 | Gopher не закроет personal music profile быстро | низкая/средняя | quarterly competitor review |

## Открытые продуктовые вопросы

1. Какой первый жанровый диапазон выбрать?
2. Что важнее: continue, variation или bassline?
3. Должен ли Signal начинаться с кнопок или natural language?
4. Нужно ли показывать объяснение musical changes?
5. Сколько контекста пользователь готов передать?
6. Что является полезным edit, а что сигналом плохого output?
7. Как избежать ощущения «generic MIDI pack»?
8. Нужен ли встроенный preview synth в script/MVP?
9. Должен ли Creator DNA быть одним или несколькими профилями по жанрам?
10. Нужно ли пользователю управлять closeness к своему стилю?

## Открытые технические вопросы

1. Filesystem и standard library capabilities `.pyscript`.
2. Undo semantics Piano Roll scripting.
3. Selection boundaries и создание нового pattern.
4. Safe IPC между VST/desktop и script.
5. State storage в `.flp`.
6. Cross-platform installer и signing.
7. VST3 MIDI routing в FL Studio для целевого workflow.
8. Выбор symbolic model после baseline.
9. Локальный inference footprint.
10. Формат Creator DNA и backward compatibility.
11. Какой официальный FL integration surface останется стабильным для sidebar-like UI.
12. Нужен ли VST3 panel уже в MVP или достаточно external companion window + `.pyscript` bridge.
13. Какие browser APIs/library выбрать для Piano Roll и MIDI preview без расхождения с Signal Core.
14. Нужны ли sender-constrained refresh tokens в первой production-версии или достаточно rotation + replay detection.

## Открытые юридические вопросы

1. В каких странах запускается beta и commercial release?
2. Кто владеет uploaded reference material?
3. Где физически обрабатываются cloud requests?
4. Используются ли inputs/outputs provider-ом для training?
5. Как формулируется license на generated MIDI?
6. Нужен ли DMCA agent/process для выбранной модели хранения?
7. Как оформляются licensed creator profiles?
8. Можно ли использовать название `Signal` в music software category?

## Решения, которые сознательно отложены

- окончательный programming language для VST;
- конкретный cloud model/provider;
- PostgreSQL vs managed database;
- audio generator;
- payments provider;
- pricing;
- branding redesign;
- mobile app;
- streaming integrations;
- playlist flow engine.

Эти решения не блокируют первые 30 дней и не должны отвлекать от product validation.

## Change log policy

При изменении решения добавляется:

- дата;
- старое и новое решение;
- evidence;
- последствия для roadmap;
- владелец решения.
