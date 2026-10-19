# Component expansion — 29 September 2026

Implemented the agreed Bedrock set using isolated subagents, then reviewed and integrated their source into the current working tree. Astra changes remain a separate task; the ready-to-use brief is [Astra Motion agent prompt](./astra-motion-agent-prompt.md).

## Delivered

- Six composable color controls, retaining the assembled ColorPicker API. Shared state and standalone bindings support hue memory, transparency, text drafts and keyboard/pointer editing.
- PhoneInput with country search, raw editable text, international parsing, extensions and separate valid E.164 metadata/form submission.
- QRCode, Marquee, AnimatedSignature, Spotlight/SpotlightGroup, TiltCard, TextShimmer and TextHighlight.
- AnimatedGradient and LightRays using pinned Paper Shaders; DotPattern, GridPattern and NoiseOverlay using CSS/SVG.
- Slider feedback polish and a shared stroke-drawing Lucide checkbox mark. No strikethrough.
- Eighteen new documentation entries with examples, previews and generated API references. Map and both shader backgrounds explicitly declare WebGL2 requirements.

The existing Slider thumb-labeling limitation remains documented in its accessibility guide; this pass changes its presentation and feedback, not the primitive's labeling API. TiltCard currently uses a local pointer/CSS recipe with an independent transform layer. Its eventual migration to reusable Astra Tilt is covered by the separate prompt.

## Verification

- Production build passed after the final color-state correction.
- Integrated type check passed with zero errors and warnings; the subsequent color correction also passed scoped type checking.
- Full server suite: 204 tests passed. The additional controlled-color SSR regression and existing conversions then passed as an 18-test focused run.
- Integrated shared-Chrome client suite: 40 tests across six files passed, including the new external blue → gray → black hue-memory regression, phone forms/country selection, slider/checkbox behavior, marquee and spotlight/tilt interactions.
- Documentation E2E loaded all eighteen new pages without page errors, and checked six representative pages at a 390px viewport without horizontal page overflow.
- The WebGL2-unavailable fallback E2E passed for both shader backgrounds. Its initial five-second hydration wait was too short under the shared development workload; the final test waits up to twenty seconds for the actual example.
- Motion archive/import verification and static asset policy checks passed.
- Svelte autofixer passed for written components/examples. Repository-wide formatting and ESLint passed.
- Manual shared-Chrome checks exercised slider keyboard input, Lucide checkbox state/drawing, shared spotlight coordinates and desktop/mobile presentation. Console checks on reviewed pages had no warnings or errors. Screenshots are under `/workspace/recordings/bedrock-component-expansion/`.

Some CDP connections timed out before any tests ran. The successful integrated retry used the existing shared browser, without launching or modifying a browser. An exploratory server run without the project's `NODE_ENV=test` script produced a development-warning expectation failure; the proper package script passed the full suite.

## Remaining verification boundary

Shared Chrome reports `canvas.getContext('webgl2') === null`. Static fallbacks, SSR, loading failure behavior and documentation are verified; actual Paper shader compilation, rendered GPU output and physical-device performance are **not verified in this environment**. The implementation uses the inspected vanilla `@paper-design/shaders@0.0.81` API, disposes rendering resources and explicitly releases contexts. This does not replace a check on a WebGL2-capable device.

The managed preview remains available at http://100.64.0.2:4085/docs/components. Browser tools use http://127.0.0.1:4085. Agent-owned review tabs and test contexts were closed.

## Maintenance notes

Exact added dependencies: `@paper-design/shaders@0.0.81`, `libphonenumber-js@1.13.14`, `qrcode@1.5.4`, `opentype.js@2.0.0`, `@types/qrcode@1.5.6`, and `@types/opentype.js@1.3.10`. The existing pnpm store was reused to avoid replacing installed dependencies. Paper's installed LICENSE and NOTICE accompany the internal renderer.

One unrelated generated map JSON file was formatted without changing its data so the repository-wide formatting gate could pass. Existing user changes were otherwise preserved. No commits or publishing actions were performed.
