# 03. Технический план

## Предлагаемая реализация

- React/Next.js-class framework с server rendering/static generation;
- TypeScript;
- shared design tokens/components с dashboard/sidebar web UI;
- CDN и image/video optimization;
- privacy-aware analytics;
- content initially in repository, CMS later only при реальной editorial need;
- separate `www` domain от authenticated `app`.

Конкретная version/framework фиксируется ADR при начале кода.

## Proposed code boundary

```text
apps/
  landing/
packages/
  ui/
  brand/
  analytics/
  config/
```

Landing не импортирует private dashboard modules или backend secrets.

## Data dependencies

### Build-time/static

- feature flags/release status;
- docs links;
- pricing configuration;
- supported versions;
- testimonials/changelog.

### Runtime

- waitlist/signup;
- browser demo session creation;
- auth redirect;
- download manifest;
- service status.

Marketing page должен оставаться доступным, если generation backend временно недоступен. Demo показывает degraded state и status link.

## Authentication handoff

- `/login` создаёт безопасный authorization request и переводит на identity/dashboard;
- return URL allowlisted;
- campaign/referral state подписан и имеет TTL;
- не передавать access tokens в query string;
- после login пользователь попадает в `/app` или возвращается в sidebar approval flow.

## Demo architecture

### Phase 1

Precomputed/deterministic client-side candidates без аккаунта.

### Phase 2

Anonymous limited server session:

- rate limit;
- no persistent personal history;
- short TTL;
- no raw audio;
- clear conversion to account;
- abuse/bot controls.

### Phase 3

Authenticated full browser copilot расположен в dashboard, не на marketing runtime.

## Analytics events

- `hero_try_browser_clicked`;
- `fl_workflow_viewed`;
- `demo_started`;
- `demo_candidate_played`;
- `demo_completed`;
- `signup_started/completed`;
- `beta_joined`;
- `download_started/completed`;
- `docs_opened`.

Не отправлять MIDI notes, prompts или filenames в marketing analytics.

## SEO/content

- один canonical URL;
- structured metadata только для реальных страниц;
- sitemap/robots;
- Open Graph assets;
- server-rendered copy;
- pages для real user questions, не массовый AI SEO spam;
- changelog/docs индексируются по необходимости;
- auth/app routes закрыты от indexing.

## Accessibility

- keyboard navigation;
- visible focus;
- reduced-motion variant;
- captions/transcript для demo video;
- color contrast;
- semantic headings;
- playback controls доступны без hover;
- Piano Roll demo имеет текстовое explanation.

## Performance budgets

- critical route usable на обычном mobile connection;
- hero animation lazy/optimized;
- no autoplay audio;
- minimal third-party scripts;
- font fallback;
- performance regression в CI;
- landing не загружает full browser piano-roll bundle до действия пользователя.

## Security

- CSP;
- secure headers;
- dependency scanning;
- form abuse/rate protection;
- no secrets in client bundle;
- validated redirects;
- signed download manifest;
- checksum shown from release pipeline, не ручной text field.

## Environments

- local;
- preview per pull request;
- staging connected to sandbox auth/backend;
- production.

Production landing не должен случайно ссылаться на staging downloads или test checkout.

