# 07. Техническая реализуемость и интеграция с FL Studio

## Что подтверждено официальной документацией

FL Studio Piano Roll Scripting API позволяет Python-коду:

- читать ноты;
- создавать ноты;
- изменять и удалять ноты;
- работать с markers;
- задавать velocity, pan, fine pitch, slide и другие свойства;
- создавать ограниченный `ScriptDialog` с knobs, combo, text и checkbox controls.

Скрипты размещаются в пользовательской папке Piano roll scripts и появляются в соответствующем меню. [Официальная Piano Roll Scripting API](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll_scripting_api.htm)

Это делает прямую вставку редактируемых нот технически реалистичной.

## Что API не обещает

Официальная scripting-документация не подтверждает:

- постоянную docked sidebar panel;
- произвольный современный UI;
- безопасные network requests;
- установку внешних Python packages;
- чтение всего проекта;
- управление любым состоянием FL Studio из Piano Roll script;
- поддерживаемый IPC с VST-плагином;
- транзакционный undo для внешней генерации.

Поэтому эти возможности нельзя считать доступными до technical spike на целевой версии FL Studio.

## Влияние FL Studio 2026

Gopher уже может выполнять часть DAW actions и генерировать Piano Roll/VFX scripts по запросу. Это повышает доступность scripting ecosystem, но снижает ценность generic assistant. [FL Studio 2026](https://www.image-line.com/fl-studio/release/2026)

Signal должен использовать API как delivery mechanism, а не считать сам доступ к API уникальностью.

## Форматы плагина

FL Studio на Windows и macOS поддерживает VST3 и CLAP; на macOS также AU. Image-Line отдельно отмечает, что AU не поддерживает MIDI output, поэтому для cross-platform MIDI-oriented Signal предпочтительнее VST3, а CLAP можно добавить после стабилизации. [Поддерживаемые plugin formats](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins_supported.htm), [установка и ограничения](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/basics_externalplugins.htm)

## Практические варианты интеграции

### Вариант A — чистый `.pyscript`

Подходит для MVP:

- мгновенная вставка;
- минимальная установка;
- нативные controls;
- нет real-time audio code;
- можно полностью работать локально.

Ограничения:

- маленький UI;
- нет постоянной истории;
- uncertain networking/package support;
- FL-only;
- сложнее сделать account/profile UX.

### Вариант B — VST3 MIDI generator

Подходит для развитого UI:

- постоянное plugin window;
- sync с tempo/transport;
- собственный preview synth;
- account, profiles и candidate history;
- перенос в другие DAW.

Ограничения:

- стандартный VST не получает произвольный доступ ко всему проекту;
- MIDI output и routing зависят от host;
- вставка persistent notes в Piano Roll не является универсальной VST-операцией;
- требуется зрелая plugin engineering discipline.

### Вариант C — VST3 + FL bridge

Целевой UX:

- VST отвечает за UI, profiles, generation и preview;
- FL script читает/получает валидированный CandidateSet;
- script вставляет notes в открытый Piano Roll.

Ключевой неизвестный вопрос — надёжный и поддерживаемый канал VST ↔ script. Возможные гипотезы:

- общая JSON-папка;
- localhost service с session token;
- clipboard/manual bridge;
- временный MIDI-файл;
- plugin MIDI output с recording/dump workflow.

Ни один вариант нельзя выбрать без spike и проверки на Windows/macOS.

### Вариант D — standalone app + VST bridge

Наиболее независимый от FL подход:

- desktop app хранит profiles и выполняет generation;
- VST bridge синхронизирует tempo и preview;
- MIDI переносится drag-and-drop или host routing.

Этот паттерн уже используется близкими продуктами, но он хуже исходного обещания «без импорта/экспорта».

## Рекомендуемый technical sequence

1. Pure Piano Roll script с локальным deterministic generator.
2. Проверка чтения selection, вставки, undo и state limits.
3. Отдельная core library с чистыми входами/выходами.
4. Loopback prototype только после подтверждения network/filesystem возможностей.
5. VST3 shell после доказанной product value.
6. Bridge spike и fallback через drag/drop MIDI.

## Audio analysis feasibility

Для будущего reference profile потребуется отдельный worker/sidecar:

- FFmpeg decode;
- tempo/beat tracking;
- chroma/key confidence;
- loudness и dynamics;
- onset/density;
- timbral embeddings;
- optional melody/chord extraction.

Эта работа не должна выполняться в real-time audio thread плагина. Анализ запускается асинхронно, имеет progress/cancel и ограничивает размер/длительность input.

## Критические technical spikes

1. Может ли `.pyscript` безопасно читать/write JSON в user data folder?
2. Какие standard-library imports доступны?
3. Можно ли получить current selection boundaries и сохранить невыделенные notes?
4. Как работает undo после `addNote/deleteNote`?
5. Можно ли создавать новый pattern или только менять active Piano Roll?
6. Как FL обрабатывает ошибки script без повреждения score?
7. Может ли VST3 MIDI output стабильно управлять internal instrument в FL?
8. Как сохранять plugin state и generation history внутри `.flp` без чрезмерного размера?
9. Какой fallback используется при offline/cloud failure?
10. Какие различия есть между FL Studio Windows и macOS?

## Feasibility verdict

- **Прямая MIDI-вставка через script:** высокая уверенность.
- **Полноценный sidebar через script:** низкая вероятность.
- **Полноценный UI через VST3:** высокая уверенность.
- **Бесшовный VST → Piano Roll bridge:** средняя/низкая уверенность до spike.
- **Полный анализ проекта обычным VST:** низкая вероятность без host-specific APIs.
- **Полезный local MIDI MVP:** высокая реализуемость.

