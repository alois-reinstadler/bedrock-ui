# Astra RC3 upgrade verification

Bedrock now vendors astra-motion `0.1.0-rc.3` from the clean neighboring repository
at commit `2acb6b2` (full commit and archive SHA-256 in `vendor/astra-motion.json`).
The former `0.0.1` archive is replaced. No upstream source was modified.

RC3 removed `astra-motion/css`. The wrappers now use `motion.bind` from
`astra-motion/state`. `bindings.js` exposes `MotionButton`, `MotionPanel`, and
`motion`; the previous `css.js` names and `createMotion` remain compatibility
aliases. These aliases now include the engine and no longer provide the old
CSS-only implementation. The guide and examples describe this change.

The package verifier checks all 1,223 packed entries against the installed files,
export targets, and eight consumer bundles. Its engine detection covers RC3's
embedded vendor directory. Native Bedrock's legacy entry remains engine-free.

## Checks

Run from `/home/node/.t3/worktrees/bedrock-ui/t3-e89bc983`, except packaging:

- In `/home/node/repos/astra-motion`: `pnpm pack --pack-destination /home/node/.t3/worktrees/bedrock-ui/t3-e89bc983/vendor` — exit 0; generated element check, package build, embedded engine packaging, and strict publint passed.
- `pnpm install` — exit 0; lockfile updated with the versioned local archive.
- `pnpm check` — exit 0; zero errors and warnings.
- `pnpm motion:verify` — exit 0; archive, installed content, exports, and bundle boundaries passed.
- `NODE_ENV=test pnpm exec vitest run --project server src/lib/bedrock/motion` — exit 0; 50 tests passed.
- `NODE_ENV=test pnpm exec vitest run --project client src/lib/bedrock/motion/astra.svelte.test.ts` — exit 0; five browser tests passed (native activation, disabled behavior, refs/attachments/styles, links, and provider policy).
- `pnpm build` — exit 0; static production site generated.
- `DEV_LOCAL_URL=http://127.0.0.1:4582 pnpm exec playwright test src/routes/motion/motion.e2e.ts --workers=1` — exit 0; nine tests passed against the production preview allocated by Portless; checks activation, retained/reversed exits, reactive targets and reduced motion, spring exits, guide navigation, mobile overflow, and light/dark accessibility.
- Changed code passed ESLint; all changed Svelte components passed the Svelte MCP autofixer without issues or suggestions. `git diff --check` passed.

The initial server-test invocation omitted the project's `NODE_ENV=test` and
failed one development-warning assertion; the correctly configured run passed.
The first browser-test attempt lacked Chromium; installing it with
`pnpm exec playwright install chromium` resolved that prerequisite.

## Limits

Astra still declares an optional SvelteKit 2 peer; Bedrock uses SvelteKit 3 next.
The route adapter is not used or qualified by this upgrade. Installation reports
peer warnings, and the static adapter emits its existing configuration-deprecation
warning. Full repository-wide E2E and lint suites were not run; checks target the
upgraded integration, with full application type checking and production build.
