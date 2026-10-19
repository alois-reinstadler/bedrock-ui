# Astra Motion implementation prompt

Implement reusable text motion and pointer tilt in `/home/node/repos/astra-motion`. This is the Astra portion of a coordinated Bedrock expansion. Work only in Astra; deliver library APIs, examples, documentation and verification.

Read `AGENTS.md`, `README.md`, the architecture, parity and packaging contracts, and current working changes first. Preserve unrelated work. Use pnpm and the Svelte MCP documentation/autofixer workflow. Use subagents for independent, bounded work in isolated worktrees where useful; wait for them and review their changes. Every implementation progress update must include a ten-character ASCII progress bar such as `[###-------] 30% Implementing text motion`. Show 100% only after verification succeeds.

## Existing foundations

Astra already provides `motion.*`, `AnimatePresence`, `MotionConfig`, motion values, springs, transforms, in-view helpers and activity-aware lifecycle utilities. Inspect `src/lib/motion/index.ts`, the text-animation guide in `src/lib/site/content/guides.ts`, and `TextAnimationExample.svelte` before designing additions.

`TextReveal`, `TextSwap` and `Tilt` are proposed API names, not existing exports. Write concise contracts, then implement them using the existing engine. Prefer focused optional entries such as `astra-motion/text` and a tilt entry, consistent with package conventions. Do not add another animation engine, Motion dependency, or independent perpetual animation loop. Prove import isolation with packaged-consumer checks.

## TextReveal

One unstyled plain-text composition, with independent options for:

- Effect: fade, slide or blur. Fade animates opacity; slide adds translation; blur combines restrained blur, translation and opacity.
- Segmentation: whole text, words or grapheme clusters.
- Stagger: none or a configurable interval, independent of the effect.
- Direction/distance where applicable.
- Trigger: mount, viewport entry or explicit state; viewport replay once or on re-entry.

Share presets with TextSwap. Avoid separate public components for every combination. Preserve whitespace, punctuation, wrapping, language and reading order. Use `Intl.Segmenter` for graphemes and appropriate word segmentation; define an explicit unsupported-environment fallback without breaking emoji or combining marks. Keep SSR and client segmentation consistent. Automatic measured line splitting is outside this pass.

Support semantic headings/paragraphs and inline control labels through an appropriate host API or documented composition. Expose one complete accessible message while hiding decorative fragments. Plain text is sufficient; do not hide interactive rich text from accessibility APIs.

## TextSwap

Reuse existing presence orchestration and the reveal presets. Support overlapping and exit-before-enter sequences while keeping surrounding controls and focus mounted. Define bounded latest-value interruption behavior; test A→B→C, A→B→A, repeated identical values, empty strings and replacement during exit.

Make sizing explicit: reserve space for known alternatives, use a caller-sized region with a documented overflow policy, or allow content-driven resizing. Only the first two can keep surrounding layout stationary. Test multiline paragraphs, responsive widths and font changes. Prevent duplicate accessible announcements while visual layers overlap; live announcements are opt-in.

## Tilt

Provide an unstyled reusable component, attachment or managed helper for pointer-driven tilt: perspective, maximum angles, spring return, disabled state and optional axis restriction. Reuse shared motion values/springs and avoid Svelte state updates every frame.

Separate pointer measurement, perspective and transform ownership as needed. Demonstrate composition with outer entrance/layout motion without competing transform writes. Default to neutral touch/coarse-pointer behavior that preserves scrolling. Preserve focus and native interactions. Test leave/cancel, disabling mid-animation, resize, teardown and nested transforms. Document supported perspective/projection boundaries honestly; arbitrary external 3D transforms are not currently guaranteed.

## Policy and lifecycle

Keep useful content visible with SSR or failed JavaScript. Honor inherited `MotionConfig`, application policy and live preference changes. Inspect how policy is resolved: `useReducedMotion` device preference alone must not bypass explicit application policy. Reduced motion should settle text promptly and remove tilt, blur and travel, including stagger delays.

Integrate with activity lifecycle. Hidden activity, canceled work and unmounting must release or suspend observers, handlers, subscriptions and playback. Avoid late asynchronous work remounting disposed content.

SVG drawing already exists: `SVGExample.svelte` animates `motion.path` through `pathLength`. Reuse/document that for signatures; only add a generic drawing helper if an actual missing capability is demonstrated.

## Scope boundary

Bedrock owns color controls, PhoneInput, slider polish, QRCode, Marquee, AnimatedSignature presentation, Spotlight/SpotlightGroup, backgrounds/shaders, TextShimmer/TextHighlight and checkbox check drawing. No strikethrough. Do not implement those here or edit Bedrock. Bedrock may temporarily compose tilt using existing Astra primitives; provide a migration example to the new Tilt API.

Do not overwrite Bedrock's vendored runtime, publish, or install a new archive into the consumer. Supply a separate integration handoff with exact export paths, archive provenance and the steps needed to qualify the updated dependency.

## Verification and delivery

Add meaningful tests for segmentation, SSR/hydration, policy changes, interrupted presence, sizing, cleanup and tilt composition. Run `pnpm check`, `pnpm check:guide`, `pnpm lint`, relevant server/browser suites, `pnpm build` and `pnpm check:package`. Verify strict declarations and real tarball imports; distinguish failures or unavailable checks from passes.

Use the managed preview and shared Chrome through chrome-devtools, following the repository's allocated local URL rules. Check desktop/mobile layouts, console/network, reduced motion and actual interactions. Close every tab you open. Do not launch a replacement browser if the shared stack fails.

Finish with the implemented API contracts, examples, verification evidence, limitations and a precise Bedrock integration handoff.
