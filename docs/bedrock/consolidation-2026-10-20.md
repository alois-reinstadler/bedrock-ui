# Bedrock branch consolidation — 2026-10-20

The owner requested a single `main` branch, preserving useful changes and all worktree
folders. The integration starts at `7494769`, which already contains the latest
vendored Astra RC3 snapshot from upstream `2acb6b2`. Astra's repository is maintained
separately; this consolidation does not modify it.

## Integrated work

The primary checkout's 131 dirty file entries were copied into an isolated checkout
and checked against their SHA-256 backup manifest. They include Video and Dock Layout,
Page annotations under Tools with legacy documentation links, component navigation,
reference-page extraction, and the email/calendar/music and motion-demo refactors.
Mail regressions cover draft preservation, forwarding source identity, and clearing
bulk selections on folder changes. No original worktree was overwritten during review.

## Branch disposition

| Starting branch                              | Starting tip | Disposition                                                                                                                                                        |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `t3/check-astra-motion-version`              | `7494769`    | Astra upgrade already on main; used for this integration.                                                                                                          |
| `agent/bedrock-astra-rc3`                    | `f4c6cc4`    | Committed tip already ancestral; dirty RC3 snapshot superseded by main's newer motion, component, docs, and template fixes.                                        |
| `agent/bedrock-chat-consolidation`           | `f4c6cc4`    | Already ancestral.                                                                                                                                                 |
| `agent/bedrock-audit-runtime`                | `b9a0a71`    | Temporary October 5 baseline; main retains the subsequent audited fixes.                                                                                           |
| `agent/bedrock-audit-surfaces`               | `b9a0a71`    | Same temporary baseline.                                                                                                                                           |
| `agent/bedrock-audit-templates`              | `b9a0a71`    | Same temporary baseline.                                                                                                                                           |
| `integration/bedrock-consolidation-20260929` | `924342a`    | Older verification snapshot; retain newer main implementations.                                                                                                    |
| `t3code/categorize-sidebar-components`       | `f4c6cc4`    | Dirty taxonomy and tests incorporated in the current navigation, including newer Tools, Dock Layout, and Video entries.                                            |
| `t3code/polish-component-examples`           | `f4c6cc4`    | Clean ancestral checkout; main already contains the later example baseline.                                                                                        |
| `t3code/polish-docs-marketing`               | `7674ddb`    | Alternative strata design archived; retain main's newer audited homepage, shared theme stylesheet, docs headers, navigation, and single-logo shell.                |
| `parked/animated-icons`                      | `8059463`    | Preserve the explicitly deferred experiment, including its tests and bundle verifier, without enabling a second icon-motion API as a side effect of consolidation. |

Power Search and Data Toolbar in the September snapshot were deleted by the newer
`c6f4576` baseline; they are not resurrected. Its old Outline tests and implementation
are superseded by main's route-scoped heading/observer regression coverage. Old
`CssButton`, `CssPanel`, and CSS facade files are superseded by the present Astra
integration. The old monolithic Shapes API is superseded by individual shape exports.
The detached architecture checkout is likewise an older snapshot; its 8,191 generated
verification-cache entries are retained in place and in the dirty-file archive.

Archiving is not a claim that every experimental idea was shipped. It preserves
those ideas without replacing the newer application with an old snapshot.

## Recovery

Verified backups are outside the repository:

`/workspace/backups/bedrock-ui/consolidation-20261020T001116Z`

The directory contains a verified all-ref/reflog Git bundle, starting ref and worktree
inventories, staged/unstaged binary patches, dirty-file tar archives, per-file SHA-256
manifests, and backup checksums. Each original non-main branch tip also has a local
`archive/2026-10-20/<original-branch>` tag. Tags are recovery references, not branches
or releases. No history is rewritten. Existing earlier archive tags/stashes remain.

Recover a branch with `git switch -c recovery-name archive/2026-10-20/<original-branch>`
in a separate worktree. Alternatively, fetch its original ref from `repository.bundle`
into a recovery repository. Restore dirty-file archives into an empty recovery folder
and apply the corresponding patches as needed; do not extract over current work.

Non-main worktrees are detached at their existing commits and retained with their
original dirty files. The primary checkout is fast-forwarded only after preserving
its integrated dirty edits in a retained stash. No worktree directory is removed.

## Verification

Verification commands and results are recorded in the adjacent backup's evidence
files. This consolidation uses the repository's type, lint, build, motion/package,
asset, server-unit, focused browser-unit, and production browser checks. Remote-media
playback and paid agentic E2E are outside this run. Three delegated review attempts
hit their provider usage limit without producing reports; the parent performed the
review. No deployment or release is part of this operation.

Observed checks in `/home/node/.t3/worktrees/bedrock-ui/t3-e89bc983`:

- `pnpm install --frozen-lockfile`: passed.
- `pnpm check`: zero errors and warnings.
- `pnpm lint`: full Prettier and ESLint checks passed (exit 0).
- Svelte analyzer: all 91 changed components have no issues or suggestions.
- `pnpm test:unit --run --project server`: 277 tests in 53 files passed.
- `pnpm test:unit --run --project client src/lib/bedrock/ui/video/video.svelte.test.ts src/lib/bedrock/motion/surface-motion.svelte.test.ts`: 12 tests passed.
- `pnpm motion:verify`, `pnpm assets:verify`, and `pnpm build`: passed.
- Production Playwright selection (email workspace, Dock Layout, music shell, Motion Lab, docs navigation, Page annotations): all 41 tests passed. Command: `DEV_LOCAL_URL=http://127.0.0.1:4824 pnpm exec playwright test src/lib/templates/email-client/email-client.e2e.ts src/lib/site/dock-layout.e2e.ts src/routes/templates/music-player/music-player.e2e.ts src/routes/demo/motion/motion-lab.e2e.ts src/routes/docs/components/docs-navigation.e2e.ts src/lib/site/feedback.e2e.ts --grep-invert @remote-media`. The port came from the owned Portless preview.
- Manual collaborative-browser check: Video's Load video button loaded the local clip, revealed native controls, and removed the loading button; the fallback remained visible for the missing-source example. Screenshot retained in backup evidence.

The existing adapter deprecation and large-chunk build warnings remain. This is a
focused production browser run, not a rerun of every historical browser test.
