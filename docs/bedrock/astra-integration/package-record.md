# Astra package candidate

The current candidate is documented in the [RC.3 integration record](rc3.md).
The record below preserves the original integration's package identity and checks.

The original integration used `astra-motion-0.0.1-e07b17d773a8.tgz`, SHA-256
`e07b17d773a8f1237bf25afb0dcb4cf3b66166a51dd92d385bc07221f84e12b2`.
Upstream still reports version 0.0.1; the content-addressed filename distinguishes
this candidate from the retained `astra-motion-0.0.1.tgz` rollback archive.

## Source and build

The candidate was packed from the recoverable frozen source snapshot at
`/workspace/agent-jobs/bedrock-astra-migration/astra-motion-baseline`, based on
commit `4c7609539abc02b59d77558440e8ead70981caff` plus the captured dirty state.
The adjacent `astra-motion-snapshot.json` records every captured file's SHA-256;
its own SHA-256 is recorded in [package provenance](../../../vendor/astra-motion.json).
The original sibling checkout was not modified. The snapshot's dependency link
points to the sibling's installed dependencies; the packaging script checks the
reviewed Motion versions and records upstream engine source hashes in the archive.

`pnpm pack --pack-destination /workspace/wt/bedrock-astra-package/vendor` ran the
upstream prepack pipeline: generated element check, Kit sync, `svelte-package`, DOM
engine packaging and strict publint. `--pack-destination` selects the archive output
directory. The archive was then renamed with its SHA-256 prefix. Node was
24.20.0 and pnpm was 11.24.0. The snapshot, file manifest and integration baseline
live outside this repository; keep them with the integration recovery artifacts.

Astra is MIT licensed. Its archive includes `LICENSE` and separate retained MIT
notices at `dist/motion/vendor/{framer-motion,motion-dom,motion-utils}/LICENSE`.
The bundled engine provenance records Motion DOM / Framer Motion 13.4.4 and
Motion Utils 13.3.0, source hashes and the packaging-only transforms. No separate
Motion dependency remains in Bedrock's lockfile.

## Verification and measurement

`pnpm motion:verify` verifies the archive digest, export targets, licenses and
installed runtime content. It builds actual Button, configuration, AsyncButton
and AvatarStack consumers as well as compatibility and narrow-entry fixtures.
Graph inspection recognizes both Astra's bundled engine and external Motion
packages, rejects duplicate identities, React runtime and Kit route adapters,
and requires ordinary Button and the retained legacy barrel to exclude Astra's
engine. Config-only imports are measured without assuming they are engine-free.

`node scripts/measure-motion-bundles.mjs . /tmp/motion-bundles.json` measures the
fixed production fixtures and writes JS raw/gzip bytes, CSS raw bytes and rendered
module graphs. Its positional arguments select the repository and JSON report.
Use the same installed lockfile/toolchain for before/after comparisons. These
are component fixture costs, not route-level costs or interactive performance
qualification. The verification owner's baseline and final report carry those
separate results.

The focused candidate check passed: 1,188 archive entries matched the installed
package; all nine graph fixtures passed. All 1,630 frozen source files still
matched the capture manifest after prepack. These checks used the existing
lockfile installation (Vite 8.2.2). Final verification adds a tenth fixture for direct
native helpers and rejects legacy layout-engine imports in migrated components.
Component and browser evidence is recorded in the [implementation record](implementation.md).

Package qualification does not establish browser behavior, accessibility,
component migration performance budgets or Kit 3 route-adapter compatibility.
Those remain separate integration gates.
