# 06. Продуктовая стратегия

## Позиционирование

### Короткая версия

**Signal помогает развить вашу музыкальную идею прямо в Piano Roll — в вашем контексте, под вашим контролем и со временем в вашем собственном почерке.**

### Что Signal не обещает

- написать готовый хит;
- имитировать конкретного артиста;
- заменить музыкальное решение пользователя;
- автоматически перестроить весь проект без preview;
- гарантировать оригинальность только потому, что использован AI;
- понимать весь DAW-проект без явного доступного контекста.

## Product wedge

Первый wedge — **Transform Selected MIDI**.

Пользователь уже вложил авторское намерение в выбранные ноты. Signal должен предложить контролируемое изменение, а не начинать с пустоты.

Первый набор действий:

| Действие | Сохраняется | Изменяется |
|---|---|---|
| Continue | мотив, key, rhythm vocabulary | следующие 2–8 тактов |
| Variation | узнаваемость и длина | часть pitches/rhythm/velocity |
| Simplify | harmony и contour | note count, ornaments |
| Humanize | pitches и форма | velocity, timing в пределах constraints |
| Reharmonize | melodic anchors | chord support/scale degrees |
| Bassline | chord roots и groove context | новая bass voice |

## Уровни персонализации

### Level 0 — Project Context

Без аккаунта и истории:

- tempo;
- time signature;
- key/scale;
- selected notes;
- chords, если доступны;
- пользовательские controls.

### Level 1 — Session Preferences

В пределах проекта:

- выбранные варианты;
- отклонённые варианты;
- desired variation strength;
- register/density preferences.

### Level 2 — Creator DNA

Только opt-in, на основе явно выбранных собственных MIDI-проектов:

- melodic intervals;
- rhythm vocabulary;
- phrase length;
- syncopation;
- chord vocabulary;
- preferred degrees;
- range;
- repetition/mutation balance;
- edit history.

### Level 3 — Reference Profiles

Опциональные референсные аудио/MIDI, право на использование которых подтверждает пользователь. Этот уровень не должен быть нужен для первого value moment.

## Основной UX-цикл

1. Пользователь выделяет музыкальный фрагмент.
2. Выбирает действие или коротко описывает intent.
3. Signal строит четыре контролируемо различающихся варианта.
4. Пользователь preview-ит их через текущий инструмент или простой synth.
5. Выбирает `Insert as new pattern`, `Replace selection` или `Add after selection`.
6. Signal сохраняет только разрешённую обратную связь.
7. Пользователь продолжает редактирование обычными средствами FL Studio.

## Почему четыре варианта

Один вариант создаёт бинарную оценку «угадал/не угадал». Слишком много вариантов превращают инструмент в slot machine. Четыре дают:

- достаточно пространства выбора;
- возможность сравнить разные axes;
- управляемое время preview;
- полезный preference signal.

Варианты должны быть намеренно различными:

1. conservative;
2. rhythmic variation;
3. melodic variation;
4. adventurous.

## Controls вместо ложной магии

Первые controls должны иметь формальное влияние:

- `variation_strength`;
- `rhythm_change`;
- `pitch_change`;
- `density`;
- `range_low/high`;
- `syncopation`;
- `tension`;
- `repetition`;
- `bars`;
- `seed`.

Параметры `energy`, `darkness` и `brightness` можно показывать только после определения прозрачного mapping. Например, `darkness` может управлять register, modal choices, chord extensions и contour — пользователь должен понимать, что именно меняется.

## Differentiation stack

Один feature легко копируется. Нужен stack:

1. Глубокое преобразование выбранного MIDI.
2. Предсказуемые controls.
3. Хорошая интеграция и безопасный undo workflow.
4. Creator DNA пользователя.
5. Cross-DAW перенос профиля.
6. Evaluation corpus и preference data.
7. Privacy и provenance.

## Стратегия против platform risk

FL Studio — launch channel, но не единственное место хранения ценности.

Нельзя строить moat на:

- окне чата;
- кнопке `Generate`;
- одном `.pyscript`;
- доступе к текущему Piano Roll.

Нужно строить moat на независимом Signal Core, данных о предпочтениях и качестве transforms. Тогда даже если Gopher добавит похожую команду, Signal сможет предлагать более персональный и воспроизводимый результат.

## Лестница ценности

1. **Utility:** корректно изменяет MIDI.
2. **Quality:** предложения часто музыкально полезны.
3. **Control:** пользователь понимает и регулирует изменения.
4. **Personalization:** Signal становится заметно лучше generic baseline.
5. **Memory:** профиль работает между проектами.
6. **Ecosystem:** профиль и engine работают в других DAW.

Перескакивать сразу к уровню 4 без доказанных уровней 1–3 нельзя.

