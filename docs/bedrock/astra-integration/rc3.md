# Astra RC.3 integration — 2026-10-01

Bedrock adopts the combined Astra release after source and exact packed-consumer
qualification. Text animation remains in `astra-motion/text`; Bedrock supplies
policy, examples and styled compositions. TiltCard now uses `astra-motion/tilt`
with its styled Spotlight surface inside the rotating content.

## Candidate identity

- Version: `0.1.0-rc.3`.
- Archive: `vendor/astra-motion-0.1.0-rc.3-c7a0c1aac16f.tgz`.
- SHA-256: `c7a0c1aac16f170ce7f755de04136a64ba2165825fa2c1dc1cb9aa9b8a7eb780`.
- Base: `4f609394089684fa287402852f23d04503ff12ac`, plus the frozen existing
  runtime/docs changes and this punctuation correction. This is a source snapshot,
  not a claim that the base commit alone reproduces the archive.
- [Package provenance](../../../vendor/astra-motion.json) records the retained
  source snapshot, toolchain, notices and source-manifest digest.
- [Source manifest](../../../vendor/astra-motion-source-manifest.json) identifies
  the captured files. `motion:verify` validates both archive and manifest digests.
- Full upstream evidence and recoverable source are retained at
  `/workspace/releases/astra-motion/0.1.0-rc.3/`.

## Adopted behavior

Word segmentation keeps trailing punctuation in the same animated fragment:
`Hello. Next!` yields two fragments, with no extra punctuation delay or wrapping
opportunity. Grapheme mode still segments punctuation independently. Regression
coverage includes opening punctuation and text reconstruction.

`TextReveal` and `TextSwap` share effect and segmentation options. The example
uses reserved space and wait mode; input identity, focus and value survive rapid
message replacements. Sync mode's documented interruption behavior snaps to the
latest value. Live announcements remain opt-in.

TiltCard delegates pointer geometry and springs to Astra. Bedrock retains its
surface, Spotlight and policy, with local focus/scroll reset behavior. Touch,
explicit disabling and motion reduction remain neutral. Transform ownership is
separated between the stationary wrapper and rotating content.

The legacy `createMotion` export is removed. Package fixtures and the SSR contract
now use `motion.bind`. No extra Motion runtime dependency was added.

## Verification

Upstream qualification completed before installing the candidate in the isolated
Bedrock integration worktree:

- 254 server tests and 8 script tests passed.
- 70 source Chromium tests passed across nine files.
- Separately installed plain and Kit consumers passed 9 runtime fixtures and
  15 runtime cases across 11 routes respectively.
- Type checks, guide checks, strict installed declarations (`skipLibCheck=false`),
  production builds, strict publint, full ESLint and changed-file formatting passed.
- Archive/installed/served provenance and optional-entry graph isolation passed.

Bedrock candidate verification:

- 216 server tests passed across 39 files.
- 62 focused Chromium tests passed across seven files: policy/native integration,
  text replacement, TiltCard/Spotlight, AsyncButton and AvatarStack.
- `pnpm check`: zero errors and warnings. Production static build passed.
- Full `pnpm lint` passed (repository formatting and ESLint).
- `pnpm motion:verify`: exact installed bytes, source-manifest integrity, export
  targets, licenses and all 13 production graph fixtures passed. Ordinary Button
  excludes the engine; text/tilt entries remain separate; consumers contain no
  duplicate Motion runtime, React runtime or optional Kit route adapter.
- Production preview: `/docs/motion` and `/docs/components/tilt-card` exercised at
  desktop and 390px mobile widths. Text replacement/input retention, reduction,
  example-source loading, pointer tilt, neutral touch and scroll reset passed.
  No console warnings/errors or failed resources were observed. No page overflow.
- Screenshots retained as `/tmp/bedrock-rc3-{text,tilt}-{desktop,mobile}.png`.

After copying the verified files into the main Bedrock working tree, the frozen
lockfile install replaced only Astra. Package integrity and all graph fixtures
passed again, as did the nine text/decorative browser regressions and `pnpm check`
(zero errors and warnings). Every other captured working file remained unchanged.
Logs, screenshots and integrated-file hashes are retained in the release's
`bedrock-evidence/` directory.

## Qualification boundary

This is a controlled Chromium integration candidate. Firefox and WebKit were not
rerun for RC.3; RC.2's prior three-browser results remain historical evidence.
The Kit 3 optional navigation adapters are not qualified by this work.

Upstream full formatting still flags the preserved preexisting temporary
`.astra-webkit-verification.config.ts`; changed files are formatted. Package
generation emits existing excluded-site/lab declaration warnings and an
`import.meta.env` notice; strict installed declarations and publint pass. An
initial Chromium run stalled on the final import after 69 passing cases; a clean
retry passed those 69 and the remaining native test passed separately.

The archive is retained locally and has not been published. Earlier archives and
the original [integration record](implementation.md) remain available for history.
