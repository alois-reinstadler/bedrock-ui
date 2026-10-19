# Bedrock UI

An in-tree Svelte 5 design system and SvelteKit documentation site with accessible components, reusable blocks, and complete application templates. Product code imports the local `#lib/bedrock` surface.

## Development

Use the pinned pnpm version in `package.json`:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`--frozen-lockfile` preserves the checked-in dependency resolution. For shared-container previews, follow the repository's `AGENTS.md` preview-manager instructions.

## Motion

Bedrock owns motion policy and component behavior. CSS handles ordinary feedback;
Astra Motion supplies coordinated presence, layout, gestures and animated values.

- `MotionProvider.svelte` and `policy.svelte.js` in `#lib/bedrock/motion`: engine-free
  application/system reduction, including context-aware portal attachments.
- `#lib/bedrock/motion/AstraPolicy.svelte`: policy bridge for engine compositions.
- `astra-motion`: direct authoring APIs for custom compositions. Astra durations use seconds.
- `#lib/bedrock/motion/index.js`: compatible native helpers and millisecond tokens.

The exact Astra archive is checked into `vendor`; installation needs no sibling
checkout. The former `astra-motion/css`, `CssButton` and `CssPanel` integration has
been retired. Normal Button/CSS usage excludes the engine; components that coordinate
motion can include it. Astra's optional Kit navigation adapters remain unqualified
for this site's Kit 3 version.

Read the [motion integration contract](docs/bedrock/motion.md), browse `/docs/motion`,
and try the coordinated project cards at `/motion`. The
[integration plan](docs/bedrock/astra-integration/plan.md) records the rollout gates;
the [implementation report](docs/bedrock/astra-integration/implementation.md) records
verified results and remaining compatibility boundaries.

## Verification

```sh
pnpm motion:verify
pnpm assets:verify
pnpm check
pnpm lint
pnpm test:unit --run
pnpm build
```

`--run` makes Vitest finish after one pass. Browser checks require the shared Chrome and a managed local preview; see [agent instructions](AGENTS.md). Package maintenance instructions and motion-specific verification are in the [motion guide](docs/bedrock/motion.md).

## Template media

Music and film templates stream from remote URLs and require an internet connection.
Artwork, subtitles and attribution remain in the repository. Audio/video downloads
are ignored; `pnpm assets:verify` also rejects staged template media and static
files over 2 MiB. The existing `static/demo/clip.mp4` is the small fixture used by
the VideoPlayer documentation. Playback E2E tests require access to the remote hosts and run separately with
`pnpm test:e2e:media`. The default `pnpm test:e2e` excludes `@remote-media` tests.

Animated icons are deferred on the local `parked/animated-icons` branch. The main
site uses static icons.

## Architecture and browser tests

Theme tokens and shared utilities live in `src/lib/bedrock/styles.css`; the site
imports that stylesheet through its route entry point. ESLint enforces the public
Bedrock import boundary for the site and templates, and keeps Bedrock independent
of site, server and routing modules.

Playwright specs under `src` import `test` from `scripts/shared-browser-test.ts`. Local runs
attach the shared Chrome and create isolated test contexts; they require
`DEV_LOCAL_URL` from the preview manager. Browser test files run serially because
animation assertions share browser timing. GitHub-hosted verification owns its
Chromium and production preview, and runs lint, type checks, unit tests, the
production build, reference freshness and non-remote E2E tests.

Documentation preview and code panels have a 10rem minimum and a maximum of
40rem or 75% of the small viewport height (whichever is smaller, with the minimum
preserved). Intermediate content uses its natural height; oversized content
scrolls within its panel.

The agent-driven example checks live in `tests/e2e`. Run `e2e-run` in the shared
container; its model credentials stay outside the repository. The runner uses
one shared-Chrome worker and exact assertions after each agent goal. For other
environments, supply the variables documented in `e2e.config.ts` and run
`pnpm test:e2e:agent`.

The [October 5 main baseline](docs/bedrock/main-baseline-2026-10-05.md) records the
consolidated work, component polish, verification results, and remaining limits.
