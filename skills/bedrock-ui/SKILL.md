---
name: bedrock-ui
description: Build or review Svelte interfaces that should use the local Bedrock UI design system, its composition layers, motion tokens, and accessibility contracts.
---

# Bedrock UI

Use this skill when product work in this repository should be implemented with Bedrock.

## Work from the public layer

- Inspect `src/lib/site/registry.ts` and `src/lib/bedrock/ui/*/index.ts` before creating UI.
- Import app-facing controls from `#lib/bedrock/ui/<component>`, not the generated shadcn tree.
- Choose the smallest suitable layer: components for primitives, blocks for recurring workflows, templates for complete product surfaces.
- Add a new primitive only when existing public APIs cannot express the behavior cleanly.

## Preserve the system contract

- Use semantic color, radius, typography, and Bedrock motion tokens instead of isolated values.
- Keep native semantics, keyboard behavior, focus visibility, labeling, status announcements, contrast, and reduced-motion behavior explicit.
- Treat wrappers as the stable customization boundary. Document any intentional behavior difference from an upstream primitive.
- Keep product data, permissions, validation rules, and routing outside reusable UI primitives.

## Document and verify

- Give a new component an installation path, usage guidance, anatomy, best practices, realistic examples, properties, and component-specific accessibility notes.
- Run `pnpm check`, focused unit tests, and a production build.
- Browser-test the changed workflow, including keyboard navigation, mobile layout, both themes, console errors, failed requests, and reduced motion where relevant.
- Run the Svelte autofixer on every changed Svelte file until it reports no issues or suggestions.

## Known boundaries

- `src/lib/shadcn` is frozen upstream source. Make product changes in Bedrock wrappers.
- Stepper displays progress; Stepped Form coordinates validation, navigation and submission.
- Keep example implementations lazy and source highlighting on demand. Never import all
  examples or templates into a shared layout.
- Documentation links deliberately use `data-sveltekit-reload` for a known teardown race.
  Preserve it unless repeated automated production SPA navigation proves stability.
- Frozen tinted destructive Badge and avatar contrast exceptions, and the Bits UI Slider
  thumb-labeling gap, remain explicit upstream decisions. Do not claim them fixed by reuse.
- For forms, verify remote-function APIs against the installed SvelteKit version and
  current official docs. A static site cannot execute server-side mutations itself.

For component changes, consult `docs/bedrock/component-contract.md`; for motion,
consult `docs/bedrock/motion-contract.md`. Use repository instructions for language,
package management and verification. Keep the user's requested scope and authorization.
