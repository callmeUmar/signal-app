# 11. Бизнес-модель и метрики

## Принцип монетизации

Пользователь должен платить за повторяемую экономию творческого времени и персональную ценность, а не за случайное количество AI tokens.

## Рынок задаёт ценовой ориентир, но не доказательство

Близкий продукт Lemonaide указывает $9.99/месяц за Seeds с 150 monthly credits и VST Bridge. Это подтверждает существование subscription модели в категории, но не доказывает, что аудитория Signal примет ту же цену. [Lemonaide pricing](https://www.lemonaide.ai/pricing)

Music plugin users также привыкли к one-time licenses. Поэтому нужна модель, отделяющая локальную ценность от облачных variable costs.

## Рекомендуемая гипотеза упаковки

### Free

- FL Piano Roll script;
- deterministic transforms;
- ограниченная local history;
- несколько starter profiles;
- без обязательного account для первого value moment.

### Signal Pro — гипотеза $9–12/месяц или $79–99/год

- advanced contextual generation;
- Creator DNA;
- cross-project memory;
- cloud candidate generation с fair-use limits;
- VST3 UI/bridge;
- profile sync;
- advanced variations и multi-track tools.

### Optional one-time/local license

- local engines;
- offline workflow;
- без cloud credits;
- paid major upgrades или annual maintenance.

Эта модель может понравиться пользователям, которые не хотят subscription, но её unit economics зависят от возможности выполнять качественную генерацию локально.

### Future marketplace

- licensed creator grammars;
- genre packs;
- workflow packs;
- team profiles.

Marketplace нельзя запускать до доказанного core retention.

## Unit economics

Для каждого successful creative action считать:

```text
gross revenue allocation
- inference
- storage/egress
- payment processing
- support
- refunds
= contribution margin
```

Ключевая единица — не API call, а **accepted candidate**. Если пользователь генерирует 100 раз и принимает один результат, низкая цена одного call скрывает плохую экономику и плохое качество.

Target-гипотезы после MVP:

- cloud cost < 10–15% subscription revenue;
- cost per accepted candidate < $0.05;
- local engine обрабатывает большинство simple transforms;
- не более четырёх candidates по умолчанию;
- cache только deterministic/repeat-safe requests;
- rate limits объясняются через fair use, а не неожиданную блокировку.

## North Star Metric

**Accepted Creative Actions per Weekly Active Creator (ACA/WAC).**

Accepted action:

- candidate вставлен;
- не отменён в течение 30 секунд;
- остаётся в проекте после разумного интервала или был осмысленно отредактирован.

## Product funnel

1. Installed.
2. Opened Signal.
3. Supplied/selected valid context.
4. Generated candidates.
5. Previewed at least two.
6. Inserted one.
7. Retained/edited result.
8. Returned in another session/project.
9. Created Creator DNA.
10. Converted to paid.

## MVP metrics

### Activation

- installation completion;
- first valid generation;
- time-to-first-candidate;
- first insertion;
- time-to-first-retained-result.

### Quality

- candidate insertion rate;
- immediate undo rate;
- retained-after-session rate;
- average edits after insertion;
- accepted candidates per request;
- pairwise preference vs baseline.

### Reliability

- generation success rate;
- validation rejection rate;
- p50/p95 latency;
- script errors;
- crash-free sessions;
- offline fallback success.

### Retention

- W1/W4 creator retention;
- projects with repeated use;
- operations per retained user;
- Creator DNA enabled/disabled;
- churn reasons.

## Предварительные gates

### Problem gate

- минимум 10 из 15 интервью содержат недавний конкретный creative-block episode;
- минимум 8 пользователей уже используют workaround;
- минимум 5 готовы протестировать tool на текущем проекте.

### Workflow gate

- 80% testers устанавливают script с инструкцией без звонка;
- median time-to-first-result < 5 минут от начала установки;
- ни один тест не приводит к потере notes/project state.

### Value gate

- ≥30% generation requests приводят к insertion хотя бы одного candidate;
- ≤35% inserted candidates immediately undone;
- contextual baseline выигрывает у random in-scale baseline в blind preference;
- ≥40% testers используют tool повторно в течение 7 дней в guided beta.

Это не отраслевые стандарты, а стартовые thresholds. Их нужно калибровать по реальным данным.

### Personalization gate

- profile-conditioned candidates получают статистически и практически значимое преимущество над generic engine;
- пользователи понимают, какие данные использованы;
- ≥50% eligible beta users добровольно создают Creator DNA после объяснения privacy;
- профиль можно удалить без support request.

## Метрики, которых следует избегать

- общее число generations;
- количество созданных нот;
- время в plugin без связи с результатом;
- vanity downloads;
- «модель была вызвана» как success;
- субъективные demo quotes без retention.

