# 10. Право, приватность и безопасность

> Это продуктовый risk analysis, а не юридическая консультация. Перед публичным запуском условия, data flows и marketing claims должны быть проверены юристом в целевых юрисдикциях.

## Почему MIDI-first снижает риск, но не устраняет его

Работа с выбранным MIDI пользователя проще, чем загрузка коммерческих аудиозаписей:

- меньше данных передаётся;
- источник чаще является собственным проектом пользователя;
- результат легче сравнить с input;
- можно работать локально;
- нет необходимости хранить sound recording.

Тем не менее MIDI может содержать защищённую музыкальную композицию. Нельзя автоматически считать любой загруженный или выбранный material свободным от прав.

## Copyright layers

Музыкальная композиция и sound recording — разные объекты прав. Абстрактные идеи, процессы и методы сами по себе не получают copyright protection в США, но конкретная мелодия, harmony/rhythm arrangement и запись могут быть охраняемыми выражениями. [17 U.S.C. §102](https://www.copyright.gov/title17/92chap1.html)

Следствие для Signal:

- tempo/key/aggregate features обычно менее рискованны, чем сохранённая melody sequence;
- извлечённая melody не становится безопасной только из-за преобразования в MIDI;
- обещание «мы используем только признаки, поэтому риска нет» недопустимо;
- similarity checks и provenance полезны, но не дают юридической гарантии.

## Human authorship и продуктовая философия

U.S. Copyright Office указывает, что AI-output может получать protection там, где человек определил достаточные expressive elements; одного prompt может быть недостаточно, а использование AI как assistive tool само по себе не лишает более широкую human-authored работу защиты. [USCO AI Copyrightability Report](https://www.copyright.gov/newsnet/2025/1060.html)

Это поддерживает выбранный UX:

- пользователь предоставляет исходный материал;
- выбирает constraints;
- сравнивает варианты;
- вставляет и редактирует результат;
- Signal сохраняет provenance.

Нельзя обещать пользователю конкретный copyright status результата без анализа юрисдикции и фактического человеческого вклада.

## Reference uploads

Если функция загрузки песен появится, нужны:

1. явное подтверждение права/разрешения пользователя;
2. ограничение назначением анализа;
3. автоматическое удаление raw audio после обработки по умолчанию;
4. запрет использовать uploads для training без отдельного opt-in;
5. retention policy;
6. механизм удаления derived profile;
7. журнал доступа и encryption;
8. policy для repeat infringement;
9. takedown process там, где он применим;
10. проверка условий third-party providers.

Для U.S.-сервиса, хранящего user material, возможная применимость DMCA §512 и требования к notice-and-takedown/registered agent должны быть отдельно проверены. [U.S. Copyright Office Section 512](https://www.copyright.gov/512/)

## Style imitation

Риск возникает не только из copyright:

- publicity/personality rights;
- false endorsement;
- trademark и confusing marketing;
- договорные ограничения datasets/providers;
- репутационный ущерб.

Рекомендации:

- не использовать `sound like [living artist]` как основной marketing;
- не продавать artist profiles без согласия и договора;
- собственный Creator DNA строить вокруг пользователя;
- licensed producer profiles считать отдельным partnership product;
- prompt policy должна блокировать или нейтрализовать прямую имитацию, если это требуется выбранной risk posture.

## Data classification

| Категория | Примеры | Политика по умолчанию |
|---|---|---|
| Project content | raw MIDI, audio, filenames | local, не отправлять в analytics |
| Derived musical features | interval histogram, density | local; cloud sync opt-in |
| Product telemetry | latency, operation, error | агрегировать без note content |
| Account data | email, subscription | минимизировать и защищать |
| Feedback content | accepted candidate, edits | derived metrics; raw only opt-in |
| Model provenance | version, seed, constraints | сохранять для воспроизводимости |

## Privacy principles

GDPR Article 5 закрепляет purpose limitation и data minimisation: данные должны быть ограничены необходимым для заявленной цели. [Официальный текст GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)

California privacy rules также предусматривают права знать, исправлять и удалять данные и требуют разумной необходимости/пропорциональности collection, use и retention для применимых businesses. [CPPA FAQ](https://cppa.ca.gov/faq)

Архитектурные последствия:

- privacy settings существуют до beta, а не после scale;
- удалить account/profile можно из продукта;
- удаление распространяется на processors/backups по применимому policy;
- raw project data не попадают в support logs;
- training consent отделён от product operation consent;
- consent нельзя прятать в bundled terms;
- retention periods задокументированы;
- пользователь может экспортировать свой Creator DNA.

## Security threats

### Local service

Если plugin/script обращается к localhost:

- random per-install/session token;
- bind только к loopback;
- строгий CORS/origin policy;
- request size limits;
- schema validation;
- path traversal protection;
- никакого произвольного code execution;
- version handshake между adapter и service.

### Plugin and installers

- signed Windows/macOS installers;
- reproducible build records;
- dependency scanning;
- auto-update с signature verification;
- минимальные filesystem permissions;
- безопасное удаление;
- crash reporting без content dump по умолчанию.

### Prompt/model layer

- user text никогда не превращается в исполняемый Python;
- LLM не формирует filesystem paths/commands для автоматического исполнения;
- schema allowlist для operations;
- max notes/bars/polyphony;
- model output считается недоверенным input;
- rate limiting и abuse monitoring.

## Privacy promise, которую можно реально выполнить

> Signal анализирует только выбранный пользователем музыкальный контекст. Проекты и референсные файлы остаются локальными по умолчанию. Мы не используем содержимое для обучения без отдельного явного согласия, а персональный профиль можно экспортировать и удалить.

Это обещание должно быть подтверждено data-flow тестами, а не только текстом privacy policy.

## Legal launch checklist

- Terms of Use;
- Privacy Notice;
- Data Processing inventory;
- provider DPAs;
- training-data provenance;
- output licensing language;
- reference upload consent;
- retention/deletion implementation;
- takedown/repeat-infringer process при необходимости;
- trademark clearance для `Signal`;
- open-source/plugin SDK license review;
- jurisdiction-specific consumer/subscription rules;
- security incident process.

