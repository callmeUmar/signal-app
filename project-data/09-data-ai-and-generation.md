# 09. Данные, AI и генерация

## Главный принцип

Signal не должен доверять свободному текстовому output модели. Любая модель возвращает структурированный результат, который проходит schema и music validation.

LLM полезен для:

- преобразования natural language intent в controls;
- объяснения вариантов;
- выбора operation plan;
- помощи в onboarding.

LLM не обязан генерировать каждую ноту. Для нот лучше специализированный symbolic engine с формальными constraints.

## Canonical MusicalContext

Минимальная модель:

```json
{
  "tempo_bpm": 128,
  "time_signature": [4, 4],
  "ppq": 96,
  "selection": {"start": 0, "end": 1536},
  "key": {"tonic": 6, "mode": "minor", "confidence": 0.9},
  "chords": [],
  "notes": [
    {
      "pitch": 66,
      "start": 0,
      "duration": 96,
      "velocity": 0.82,
      "channel": 0
    }
  ]
}
```

Внутренняя модель использует ticks/PPQ, а не float seconds, чтобы избежать накопления ошибок и сохранить музыкальную сетку.

## CandidateSet

```json
{
  "schema_version": "1.0",
  "request_id": "uuid",
  "generator": {
    "name": "rule_variation",
    "version": "0.1.0",
    "seed": 4312
  },
  "candidates": [
    {
      "id": "conservative",
      "notes": [],
      "scores": {
        "constraint_pass": 1.0,
        "similarity": 0.72,
        "diversity": 0.41
      },
      "changes": {
        "pitch_changed_ratio": 0.24,
        "rhythm_changed_ratio": 0.12
      }
    }
  ]
}
```

## Лестница generator sophistication

### G0 — deterministic transformations

- transpose;
- invert contour;
- rhythmic displacement;
- density reduction;
- octave/register remap;
- velocity humanization;
- motif repetition with controlled mutations.

Это baseline и offline fallback.

### G1 — constrained probabilistic grammar

- chord-tone weighting;
- scale-degree transitions;
- interval Markov model;
- rhythm vocabulary;
- cadence rules;
- voice-leading constraints.

Можно персонализировать лёгкими distributions без обучения большой модели.

### G2 — symbolic generative model

- continuation;
- infilling;
- multi-track conditioning;
- attribute-controlled generation;
- candidate sampling + reranking.

Добавляется только если превосходит G1 в blind/user evaluation.

### G3 — personal adaptation

- profile-conditioned sampling;
- retrieval of user-approved patterns/features;
- preference reranker;
- optional local fine-tuning при достаточном объёме согласованных данных.

### G4 — audio renderer

Получает утверждённый MIDI/harmony/tempo plan. Audio model не должен быть единственным источником композиции.

## Creator DNA features

### Melody

- pitch-class histogram;
- scale-degree distribution;
- interval histogram и direction;
- contour shapes;
- range/register;
- motif length;
- repetition/mutation ratio;
- cadence behavior.

### Rhythm

- onset positions relative to grid;
- note-duration vocabulary;
- syncopation;
- swing/microtiming;
- rests;
- density per beat/bar;
- phrase boundary patterns.

### Harmony

- chord types/extensions;
- harmonic rhythm;
- transition graph;
- voice leading;
- modal interchange frequency;
- melody-to-chord degree relationship.

### Editing preference

- accepted variation strength;
- notes typically deleted/retained;
- preferred candidate axis;
- typical changes after insertion;
- repeated undo patterns.

## Feedback taxonomy

События должны различать:

- previewed;
- inserted;
- immediately undone;
- retained after 5/30 minutes;
- heavily edited;
- lightly edited;
- exported/rendered project later, если пользователь согласился на такую метрику.

Нажатие `Generate` не является положительным feedback.

## Privacy-preserving feedback

По умолчанию аналитика отправляет только агрегаты:

```json
{
  "operation": "variation",
  "generator_version": "0.4.1",
  "latency_ms": 812,
  "candidate_inserted": true,
  "undo_within_30s": false,
  "pitch_changed_ratio": 0.31,
  "note_content_included": false
}
```

Сами pitches, project name и raw MIDI не отправляются без отдельного opt-in.

## Evaluation corpus

Нужен versioned набор fixtures:

- monophonic melodies;
- polyphonic chords;
- basslines;
- sparse и dense rhythms;
- different keys/modes;
- triplets/swing;
- edge cases: empty selection, zero-length notes, out-of-range, long selections.

Для каждого generator release:

1. schema pass;
2. constraint pass;
3. regression comparison;
4. diversity check;
5. similarity/leakage check;
6. listening panel или preference test.

## Quality metrics

Формальные метрики не заменяют музыкальную оценку, но ловят regressions:

- in-scale ratio;
- chord-tone ratio on strong beats;
- pitch range;
- note density;
- rhythmic entropy;
- motif similarity;
- exact-copy ratio;
- candidate diversity;
- voice crossings;
- monophonic overlap;
- user acceptance/retention.

## Prompt and model discipline

Если используется LLM:

- prompt хранится в version control;
- output только по JSON schema;
- user text отделяется от system constraints;
- model response не исполняет код;
- каждое изменение проходит regression suite;
- request cost и tokens измеряются;
- timeout имеет deterministic fallback;
- provider outage не блокирует basic transforms;
- model name/version записываются в provenance.

## Главный R&D-эксперимент

Сравнить четыре условия на одинаковых контекстах:

1. random in-scale baseline;
2. deterministic/rule baseline;
3. generic symbolic model;
4. profile-conditioned model.

Персонализацию развивать только если условие 4 статистически и практически превосходит 2–3 по acceptance/retention, а не только по субъективной демонстрации команды.

