# Astra RC3 refresh — 2026-10-19

The latest neighboring Astra checkout (`2acb6b2`, full commit in the provenance
manifest) replaces the earlier RC3 source snapshot on local main. The new
content-addressed archive is `astra-motion-0.1.0-rc.3-eb65795058f3.tgz`.
It is packed from clean tracked source using `pnpm pack`, including generated
element validation, svelte-package, engine packaging, and strict publint.
The source manifest records the tracked files and hashes at that commit.

## Merge resolution

The initial upgrade commit was built against the older `origin/main` checkout.
Local main already had a broader RC3 integration in its unpushed baseline
`c6f4576`. The merge preserves that integration: native Bedrock components,
Astra policy, text/tilt entries, graph budgets, license checks, and deliberate
removal of the CSS bridge. It does not restore the initial branch's redundant
CSS compatibility aliases or replace the newer main examples with older ones.

The original branch passed type checking, build, package verification, 50 server
tests, five wrapper browser tests, and nine production E2E checks. Those results
apply to the older checkout only. Merged-tree verification is recorded below.

## Boundaries

Astra's optional Kit peer still targets Kit 2; Bedrock uses Kit 3 next. The route
adapter is not qualified. Historical reports and previous archives remain as
release evidence. Uncommitted cleanup, Dock Layout, and video work in the main
checkout are not part of this merge.

## Merged-tree verification

Run in `/home/node/.t3/worktrees/bedrock-ui/t3-e89bc983`:

- `pnpm check`: exit 0, zero errors/warnings.
- `pnpm motion:verify`: exit 0; all 1,223 archive entries and installed content,
  license/provenance checks, production graph fixtures, and standalone/shared
  consumer budgets passed. Final archive and source-manifest hashes rechecked.
- `pnpm test:unit --run --project server`: exit 0; 273 tests in 52 files passed.
- `pnpm test:unit --run --project client` with `astra`, `policy`,
  `text-integration`, `spotlight/decorative`, `async-button`, `avatar-stack`, and
  `text` Svelte test files: exit 0; 49 tests in seven files passed.
- `pnpm build`: exit 0; static production build passed and generated reference
  remained unchanged.
- `DEV_LOCAL_URL=http://127.0.0.1:4439 pnpm exec playwright test src/routes/motion/motion.e2e.ts`:
  exit 0; all 11 production scenarios passed through the shared-browser fixtures.
  Portless allocated the temporary preview port.
- Full Prettier check identified only the existing `skeleton.e2e.ts` formatting
  issue. The formatting-only repair matches the cleanup thread's existing working
  copy exactly; changed-file formatting and `git diff --check` passed.
- `pnpm exec eslint .`: exit 0; full repository ESLint passed.

The original main checkout's uncommitted files were fingerprinted before merging.
Dependency files have a verified external backup so the merge can preserve Dock
Layout's dependency addition alongside the new Astra archive.
