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

Astra Motion is installed from the checked-in `vendor/astra-motion-0.0.1.tgz` archive. No sibling checkout is needed to install or build Bedrock.

- `#lib/bedrock/motion/index.js`: default Astra CSS Motion, Size, createMotion, and MotionConfig; animation durations use seconds.
- `#lib/bedrock/motion/css.js`: finite CSS motion and the `CssButton` / `CssPanel` wrappers, with second-based Astra transitions.
- `#lib/bedrock/motion/engine.js`: Astra physics, gestures, and projection.
- `#lib/bedrock/motion/config.js`: shared Astra `MotionConfig` policy without the engine entry.

Production components use Astra CSS for finite motion, including measured intrinsic shells through Size. They use Astra JS for shared layout or physics. The former Bedrock motion engine and its exports have been removed. Read the [motion integration contract](docs/bedrock/motion.md), browse `/docs/motion`, and exercise the examples at `/motion`. Astra's optional route adapter is not qualified for this site's SvelteKit 3 version.

## Verification

```sh
pnpm motion:verify
pnpm check
pnpm lint
pnpm test:unit --run
pnpm build
```

`--run` makes Vitest finish after one pass. Browser checks require the shared Chrome and a managed local preview; see [agent instructions](AGENTS.md). Package maintenance instructions and motion-specific verification are in the [motion guide](docs/bedrock/motion.md).
