# 03. Рынок и конкуренты

## Состояние категории

Категория AI-assisted composition уже занята. Пользователь может получать chords, melodies, basslines и arrangements через Scaler, LANDR Composer, Captain Plugins, Lemonaide и другие продукты. Поэтому утверждение «мы генерируем MIDI внутри DAW» само по себе не является дифференциацией.

Одновременно FL Studio 2026 усилил встроенного Gopher: он может организовывать tracks, менять levels/routing и генерировать Piano Roll/VFX scripts по запросу. В FL Studio также появились chord detection и улучшенные chord tools. Это прямой platform risk для любого общего FL-copilot. [Официальный обзор FL Studio 2026](https://www.image-line.com/fl-studio/release/2026)

## Карта конкурентов

| Продукт | Что уже делает | Сильная сторона | Незакрытая возможность Signal |
|---|---|---|---|
| FL Studio Gopher | отвечает на вопросы, выполняет DAW actions, создаёт scripts | встроен в платформу, нет установки | persistent personal music memory и специализированная генерация |
| Scaler 3 | chords, key/scale detection из MIDI/audio, melodies, bass, arrangement, editing | глубокая музыкальная теория и зрелый workflow | обучение на решениях конкретного пользователя |
| LANDR Composer | генерирует chords, melodies, basslines, arpeggios | единый DAW plugin и быстрый старт | context transformation и personal grammar |
| Captain Plugins | отдельные инструменты для chords, melody, bass, drums | узнаваемый composition workflow | один контекстный copilot вместо suite |
| Lemonaide | AI MIDI/audio, producer models, VST bridge | consented producer models и понятная подписка | собственный Creator DNA пользователя вместо покупки чужого стиля |
| Generic LLM + script | создаёт Python/MIDI код по описанию | почти нулевая стоимость входа | гарантированная музыкальная валидность, latency и feedback learning |

## Подробные наблюдения

### FL Studio Gopher

Это наиболее опасный конкурент, потому что является функцией хоста. Если Signal будет только чат-панелью, Image-Line сможет закрыть тот же сценарий без сторонней установки.

Защитная позиция Signal:

- не универсальный DAW assistant;
- специализированный creative decision engine;
- история музыкальных решений пользователя;
- контролируемые A/B-варианты;
- одинаковый Creator DNA между DAW;
- независимый от одной платформы core.

### Scaler 3

Scaler уже умеет распознавать chords, keys и scales из MIDI/audio, строить arrangements, генерировать basslines и редактировать MIDI. Это доказывает спрос на in-DAW composition assistance, но также означает, что harmony features не являются moat. [Функции Scaler 3](https://scalermusic.com/products/scaler-3/)

Signal не должен пытаться победить Scaler количеством музыкально-теоретических экранов. Его ставка — меньше интерфейса, больше контекста и персонализации.

### LANDR Composer

LANDR объединил прежние четыре Orb-модуля в один plugin для chords, melody, bass и arpeggios. Это подтверждает, что пользователи ценят единый workflow вместо нескольких связанных plugins. [LANDR Composer](https://www.landr.com/plugins/producer-suite-3/)

### Captain Plugins

Captain закрывает те же базовые роли: chords, melody, bass и drums, с AI suggestions. Значит, список типов генерации не отличает Signal. [Captain Plugins](https://mixedinkey.com/captain-epic-tutorials/)

### Lemonaide

Это ближайший конкурент исходной философии. Lemonaide генерирует MIDI и audio, предлагает модели конкретных продюсеров и подчёркивает consent-cleared training. Базовый Seeds-план указан как $9.99/месяц за 150 monthly credits, а VST Bridge входит в предложение. [Продукт](https://www.lemonaide.ai/), [цены](https://www.lemonaide.ai/pricing)

Вывод: модель «AI melodies + VST bridge + producer style» уже существует. Signal должен развернуть персонализацию в сторону пользователя:

> Не «купи стиль известного продюсера», а «построй управляемую модель собственных решений».

## Где остаётся незакрытое пространство

### 1. Personal transformation, а не blank generation

Большинство продуктов хорошо отвечают на «дай мне что-нибудь». Signal должен лучше отвечать на:

- продолжи именно это;
- сохрани ритм, измени pitches;
- сохрани contour, измени harmony;
- сделай variation, измеримо близкую к исходнику;
- объясни, что изменилось.

### 2. Creator DNA

Персональный профиль может включать:

- interval distribution;
- preferred scale degrees;
- syncopation;
- note-length vocabulary;
- register and range;
- chord extensions;
- tension/resolution patterns;
- repetition and mutation rate;
- microtiming;
- edit preferences.

Это ближе к музыкальной грамматике, чем исходные brightness/energy.

### 3. Cross-DAW identity

Gopher знает FL Studio, но не переносит творческую память в Ableton, Logic или Reaper. Независимый Signal Core потенциально может это сделать.

### 4. Trust and provenance

Пользователь должен видеть:

- какой контекст был использован;
- какие constraints применены;
- какая версия генератора создала вариант;
- где хранятся данные;
- можно ли воспроизвести результат по seed.

## Рыночные гипотезы, которые нельзя считать доказанными

- Продюсеры хотят модель собственного стиля.
- Они готовы отдать старые MIDI-проекты для обучения/профилирования.
- FL Studio users будут устанавливать сторонний `.pyscript`.
- Пользователь заплатит за transformation чаще, чем за blank generation.
- Персональный профиль действительно повысит acceptance rate.

Эти пункты требуют интервью и прототипов, а не дополнительного desk research.

