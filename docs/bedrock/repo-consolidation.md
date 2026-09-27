# Repository status and consolidation

Audit started 2026-09-27.

## Why the checkout was still on integration/astra-motion

`main`, `origin/main` and `integration/astra-motion` already pointed to `05a5bb6`.
The motion integration had been fast-forwarded into main on September 22; the
primary checkout had simply remained on the integration branch. New work then
accumulated uncommitted in multiple worktrees.

The audit found 81 local branches and 19 worktrees. The primary checkout held the
animated-icon experiment; `bedrock-main-integration` held the template refactor
and about 179 MB of new audio/video. `bedrock-site-shell` held two untracked docs
whose newer versions were already present in the primary checkout.

## Consolidated result

- Template navigation now uses real routes with shared player/workspace state.
  Existing music, email, calendar, tasks, social and film work was preserved.
- Music and films stream remotely. Playback requires internet access and working
  third-party hosts. NCS playback uses media URLs with HTTP range support; its
  download endpoints played audio but failed the seeking test.
- Artwork, subtitles and credits stay local. No new audio/video is committed.
  Superseded template media is removed from the checkout; existing Git history is
  retained. The small `static/demo/clip.mp4` documentation fixture remains.
- `.gitignore` excludes audio/video downloads. `pnpm assets:verify` rejects
  tracked/staged template media and static files over 2 MiB.
- Animated icons are deferred on local branch `parked/animated-icons`, commit
  `8059463`. Main uses static icons. Useful clipboard failure/cleanup handling
  was retained without the icon animation API.
- Generated component reference data is about 1.5 MB, rather than the 9.8 MB
  experimental output. No motion engine migration was included.
- An existing motion burst-guard test now controls its sampling clock, avoiding
  CPU-contention failures while retaining real rendering and animation assertions.

## Verification

- `pnpm check`: zero errors and warnings.
- `pnpm lint`: passed; the final music URL edit also passed targeted checks.
- `pnpm test:unit --run`: 383 tests passed across 72 files.
- `pnpm build`: passed.
- `pnpm assets:verify`: passed. An isolated Git index with a deliberately staged
  video was rejected as expected.
- Production E2E for template routes and the email workspace: 56 passed. Includes
  all eight recordings, all four films, seeking, shared state across navigation,
  volume, mobile layouts, light/dark themes and reduced motion.
- Manual Chrome checks confirmed music/film playback and seeking with HTTP 206
  responses, no console errors, and no horizontal overflow. Screenshots captured.

Existing warnings remain: large build chunks, adapter configuration deprecation,
plugin build timings, and a Svelte `derived_inert` warning in the unit suite.
The full repository E2E suite was not rerun; browser verification targeted the
changed templates. Remote playback tests depend on provider availability.

## Recovery and working layout

The canonical checkout is `/home/node/repos/bedrock-ui` on `main`. Changes are
local; nothing was pushed. The managed preview is `bedrock-ui-main`.

Original dirty files, binary patches, SHA-256 manifests, and branch/worktree
inventories were saved outside Git at:

`/workspace/repo-backups/bedrock-consolidation-20260927T225610Z`

That archive includes the original large media and generated reference output.
Pending files in the old worktrees were checked against their archived hashes
before removal. Historical branch references are retained for recovery; the
obsolete `integration/astra-motion` alias is retired after main is updated.

## Recommended next work

1. Add CI for type checking, lint, unit tests, build and the asset policy. Keep
   remote-media browser checks explicit so provider downtime is distinguishable
   from a code regression. There is currently no GitHub Actions workflow.
2. Split the remaining large feature components by responsibility, beginning with
   the email client (1,283 lines), music shell (717), and VideoPlayer (635). Keep
   route persistence, focus, playback and keyboard behavior covered throughout.
3. Follow the existing [motion architecture review](motion-architecture-review.md):
   use CSS for ordinary visual changes and explicit JS for coordinated layout.
   Unify tokens and clarify backend boundaries before adding more motion APIs.
4. Audit consumers of `src/lib/bedrock` and `src/lib/shadcn` before reducing their
   overlap. Both are still active; bulk deletion would hide behavior differences.

Animated icons remain deferred until those foundations are settled.
