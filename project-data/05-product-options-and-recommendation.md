# 05. Варианты продукта и рекомендация

## Критерии сравнения

- time-to-first-value;
- техническая сложность;
- юридический риск;
- стоимость эксплуатации;
- качество интеграции;
- возможность создать moat;
- зависимость от платформы;
- способность проверить спрос за 30–60 дней.

Оценка: 1 — плохо, 5 — хорошо. Для complexity/risk 5 означает более благоприятный вариант, то есть меньшую сложность или риск.

| Вариант | Value speed | Feasibility | Legal | Cost | Moat potential | Platform independence | Итог |
|---|---:|---:|---:|---:|---:|---:|---:|
| Отдельное web-приложение с 5 uploads и audio generation | 2 | 2 | 2 | 2 | 3 | 5 | 16 |
| FL Piano Roll script: rule-based MIDI transforms | 5 | 5 | 5 | 5 | 2 | 1 | 23 |
| FL script + cloud contextual generator | 5 | 4 | 4 | 3 | 3 | 2 | 21 |
| VST3 copilot без FL bridge | 3 | 2 | 4 | 3 | 3 | 5 | 20 |
| VST3 + FL script bridge + Creator DNA | 4 | 2 | 4 | 3 | 5 | 4 | 22 |
| Flow sequencing consumer app | 2 | 2 | 3 | 3 | 3 | 3 | 16 |

## Рекомендация

Не выбирать один большой конечный вариант сразу. Использовать последовательность, где каждый этап проверяет риск следующего.

### Шаг 1. FL Piano Roll script

Цель — доказать workflow:

> Выделил ноты → выбрал действие → получил полезный редактируемый вариант прямо в Piano Roll.

Без LLM, аккаунтов, audio uploads и сложного UI.

### Шаг 2. Contextual Signal Engine

Добавить сервис/локальный engine, который принимает строгий `MusicalContext` и возвращает валидированный `CandidateSet`.

### Шаг 3. Creator DNA из собственных MIDI

Профилировать только проекты, которые пользователь явно выбрал. Проверить, увеличивает ли профиль принятие вариантов.

### Шаг 4. VST3/CLAP UI и bridge

Создать постоянную copilot-панель, preview, историю вариантов и cross-DAW foundation.

### Шаг 5. Reference Audio Profiles

Вернуть исходную идею пяти любимых треков как дополнительный способ настройки. Анализировать локально, хранить признаки, удалять audio.

### Шаг 6. Другие DAW

VST3/CLAP позволяет расширить рынок, но deep insertion будет зависеть от возможностей каждого хоста.

## Почему не начинать с VST3

VST3 требует:

- C++/framework expertise;
- Windows/macOS builds;
- code signing и installers;
- host compatibility testing;
- real-time audio safety;
- state serialization;
- UI scaling;
- crash isolation;
- отдельного способа вставить ноты в Piano Roll.

Эта работа не отвечает на главный вопрос: нужны ли пользователю предложения Signal.

## Почему не начинать с анализа пяти песен

- высокий onboarding friction;
- сомнительные права на uploads;
- слабая связь sonic features с хорошей MIDI-композицией;
- долгая обработка;
- сложно объяснить качество;
- невозможно быстро отделить плохой analyzer от плохого generator.

## Альтернативный путь, если FL scripting окажется недостаточным

Создать standalone desktop app + VST Bridge по модели Lemonaide:

- app управляет account/profile/generation;
- VST принимает MIDI и tempo context;
- результаты перетаскиваются или направляются в DAW;
- позже добавляются host-specific bridges.

Это менее бесшовно, но снижает зависимость от FL API.

## Условия отказа от выбранного пути

Нужно пересмотреть стратегию, если выполняется хотя бы одно:

- менее 30% тестовых пользователей способны установить script без помощи;
- менее 20% предложений сохраняются даже после трёх итераций generator;
- generic baseline не хуже AI/personalized variant;
- FL API не позволяет безопасную вставку с сохранением undo/selection;
- Gopher закрывает тот же transformation workflow с сопоставимым качеством;
- пользователи последовательно предпочитают audio loops вместо editable MIDI.

