# 02. Структура страниц и контент

## Routes MVP

| Route | Назначение | Primary CTA |
|---|---|---|
| `/` | основной narrative | Try in browser |
| `/fl-studio` | workflow sidebar + bridge | Join/Download beta |
| `/browser` | browser-copilot explanation/demo | Open app |
| `/how-it-works` | controls, validation, Creator DNA | Try demo |
| `/privacy` | понятная privacy summary + legal link | Sign in |
| `/pricing` | планы после pricing validation | Start free |
| `/download` | supported versions/install/checksums | Connect account |
| `/docs` | installation, troubleshooting, API later | Read guide |
| `/login` | redirect to dashboard identity flow | Continue |

До появления pricing/download страницы могут быть waitlist/status pages, но URL лучше зарезервировать.

## Homepage structure

### 1. Navigation

- Product;
- FL Studio;
- Browser;
- How it works;
- Pricing;
- Docs;
- Sign in;
- Try free.

### 2. Hero

- конкретный headline;
- animated before/after Piano Roll;
- CTA `Try in browser`;
- вторичный `Watch FL workflow`;
- подпись `Editable MIDI. Preview before insert.`

### 3. Interactive proof

Мини-демо:

- исходный 2-bar motif;
- три controls;
- 2–4 precomputed candidates;
- playback;
- визуальный diff;
- переход в full browser demo.

На landing не вызывать дорогой model для каждого анонимного visitor. Использовать precomputed or deterministic demo.

### 4. Core operations

- Continue;
- Variation;
- Simplify;
- Humanize;
- Bassline;
- Harmonize.

Для launch показывать только фактически доступные operations.

### 5. Two surfaces, one project

Левая сторона: browser dashboard.  
Правая: FL sidebar.  
Между ними: одна conversation и `Send to FL`.

### 6. How it works

1. Select/import context.
2. Ask or choose operation.
3. Compare validated candidates.
4. Insert/export/edit.

### 7. Creator control

- separate rhythm/pitch change;
- variation strength;
- constraints;
- seeds/provenance;
- no silent mutation.

### 8. Creator DNA teaser

Показывать как later/pro feature только после работающего generic workflow. Формулировка: «Build a profile from projects you explicitly choose».

### 9. Privacy

- local-first baseline;
- content training off by default;
- device revoke;
- export/delete;
- link to full policy.

### 10. Social proof

Только реальные design partners и measurable quotes. До них использовать product evidence, не вымышленные logos/testimonials.

### 11. Final CTA

- Try in browser;
- Join FL beta;
- Sign in.

### 12. Footer

- Status;
- Docs;
- Privacy;
- Terms;
- Security;
- Contact;
- Changelog;
- Supported versions.

## FL Studio page

- real limitation statement: sidebar-like plugin/connected panel;
- system requirements;
- install steps;
- browser authorization animation;
- `Send selection to Signal`;
- candidate preview;
- `Insert to Piano Roll`;
- device management;
- offline/basic mode;
- known limitations;
- version compatibility.

## Browser page

- import `.mid`;
- browser piano roll;
- chat/operation palette;
- playback;
- conversation sync;
- export formats;
- send to connected FL;
- free/demo limits.

## Download page

Перед public beta:

- current version;
- release date;
- Windows/macOS build;
- supported FL versions;
- architecture/CPU;
- checksum/signature;
- install and uninstall;
- known issues;
- changelog;
- rollback/previous stable;
- report issue.

## Content states

- pre-alpha waitlist;
- private beta invite;
- public beta download;
- stable release;
- maintenance incident;
- unsupported platform.

Контент должен переключаться через release configuration, а не ручные хаотичные правки.

