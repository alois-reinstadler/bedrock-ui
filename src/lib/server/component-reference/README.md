# Component reference extraction

Run `pnpm exec node scripts/extract-component-reference.mjs` after changing component APIs, then format the generated JSON with Prettier. The script uses the installed TypeScript checker and virtual script modules to follow public Bedrock exports through local wrappers and installed primitive declarations. Nothing from TypeScript is imported by the application.

Only the current component family's snapshot is returned from the server load. Public aliases are grouped by their resolved component. Type unions are preserved. Bindings and defaults come from `$props()` destructuring, including underlying local wrappers; external defaults are deliberately not guessed. Native DOM attributes are represented by the linked inherited Svelte contract, while explicit destructured DOM props and primitive-specific contracts get rows.

The extraction is a reference, not a replacement for the compiler: generic or unresolved external types may remain broad and are marked for source review. External declaration links are pinned to the installed package version. Relationships between parts and accessibility obligations remain authored guide metadata. Keep semantic requirements specific to the component's actual role.

The source toggle mounts code highlighting on demand. The installation import is plain selectable code, so first rendering an overview does not initialize Shiki. Query tabs use normal link semantics and retain their URL across reloads. The existing sidebar reload boundary is unchanged.
