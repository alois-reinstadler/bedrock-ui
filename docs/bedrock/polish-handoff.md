# Bedrock interaction polish — handoff prompt

Work in `/home/node/repos/bedrock-ui`. Own a focused, evidence-led polish pass through implementation, integration, browser review and commits. Inspect current git status, branches/worktrees and AGENTS.md first. Preserve unrelated work. Read the recent sidebar/blur/accordion fixes and their regression tests before changing them. Do not restart the Astra migration; the original Bedrock motion engine is the baseline.

## Verified starting point

The repair was verified on 2026-09-21: 359 unit/component tests across 66 files and all 230 production browser tests passed. Typecheck reported 0 errors and 0 warnings; full lint, build and motion package checks passed (final navigation followup also passed scoped lint). The managed preview is `bedrock-astra-integration`; discover its current allocation rather than assuming it is still running. Code commits: `d18bee9`, `6f53c5f`, `4543b9a`, `50af965`.

Manual Chrome inspection confirmed real filtered intermediate blur frames and matching active-link/highlight rectangles. A production accordion close was sampled from 51px down to zero without rebound. New tests cover reversal, reduced motion, force mounting, highlight node identity through navigation/history, scrolled alignment, and mobile navigation/drawer closure. This verifies these repairs, not the entire future polish scope.

## Direction and reason

Make Bedrock feel like one dependable product: navigation preserves orientation, controls respond immediately, layout changes keep readable content stable, and animation settles without a last-frame jump. Prioritize repeatable interaction defects over decorative changes or adding components. A longer duration is not a root-cause fix. CSS transitions, Svelte transitions and the existing layout engine have distinct ownership; each animated property must have one owner. Use `svelte/motion` only where value interpolation demonstrably simplifies a bounded interaction; do not replace shared layout with per-frame springs by assumption.

The first repair established a persistent shared-layout sidebar highlight, fading on individual backdrop-filter surfaces, and reversible accordion presence. The relevant files are `DocsSidebar.svelte`, `progressive-blur.svelte`, `scroll-area.svelte` and Bedrock `accordion-content.svelte`; regression tests include `sidebar-motion.e2e.ts`, `progressive-blur.e2e.ts` and `accordion-motion.svelte.test.ts`. Other documentation content links still retain their prior reload boundary; do not mistake the sidebar repair for a complete routing rewrite. Verify those foundations in the current tree, including native keyboard semantics, reduced motion, interruption, and route teardown. Do not assume passing final-state assertions prove smooth motion.

## Orchestration

Use many specialized subagents in two waves, with at most four active worktrees including the orchestrator. Give each worker an isolated worktree, explicit file ownership, acceptance criteria, and a bounded task. No simultaneous edits to shared motion primitives or global CSS. Workers must finish, report evidence and commit; review each diff and rerun its checks before integration. One orchestrator owns integration, the shared browser/preview, and shared CSS. Follow the repository's ASCII progress-bar contract.

Wave 1 — diagnose and repair foundations:

1. **Navigation continuity:** docs sidebar, route history, search, mobile drawer and focus. Verify one shared indicator moves between real targets; preserve sidebar scroll and document identity on internal docs navigation. Exercise rapid/delayed navigation, browser Back/Forward, search clearing, and open portaled controls during route changes. Repair lifecycle faults rather than masking them with full reloads.
2. **Presence and intrinsic geometry:** accordion, collapsible, AsyncButton/Swap, validation messages and content-sized shells. Sample bounding rectangles through final settlement and interrupted reversals. Fix endpoint mismatches, competing animations, padding/margin jumps, overflow clipping and text scaling. Prove final geometry matches the natural layout.
3. **Scroll and decorative compositing:** progressive blur, nested scrollers, sticky headers and overlay edges. Verify actual intermediate visual rendering, not only opacity values. Test all four edges, RTL, resize/content changes, focus protection, high contrast, reduced transparency and reduced motion. Avoid rebuilding filters or expensive observers on every frame.

Wave 2 — integrate the same rules across product journeys:

4. **Interaction consistency:** audit keyboard/pointer behavior, focus-visible treatment, disabled/pending/error feedback, hover/press timing and hit areas in the affected components. Fix concrete inconsistencies using existing tokens. Preserve component public APIs and semantic state timing.
5. **Responsive composition:** review docs plus representative Mail, Music and Video journeys at 390, 768 and 1440px in light/dark themes. Find clipping, layout shifts, crowded hierarchy, unreachable controls and inconsistent spacing. Apply a coherent density/type/spacing direction, not arbitrary restyling or new showcase components.
6. **Adversarial review and performance:** independently challenge integrated changes under rapid input, slower CPU, async content, navigation teardown and repeated mount/unmount. Check stale observers, timers, retained DOM, focus traps and frame-time spikes. Distinguish measured regressions from hypotheses. Do not claim compositor-only playback for width/height animation.

## Evidence and acceptance

Maintain a short defect ledger: user-visible symptom, reproduction, root cause, owner, changed files and verification. Capture before/after evidence for each material visual fix. Add tests only for real failure modes: intermediate geometry, reversal continuity, retained node identity, lifecycle cleanup and accessibility. Test the actual production build as well as focused browser/unit fixtures. Include a short manual visual review; automated snapshots alone are insufficient.

Use pnpm. Start previews through dev-preview; discover the allocated port. Browser tools use the local URL and only tabs you opened; close them when finished. Never rebuild underneath a running browser suite; finish the build, restart its managed preview, then test. Keep preview artifacts out of source commits except intentional reviewed reference updates.

Run focused tests per integration wave, then full unit, typecheck, lint, build, package checks and relevant production E2E once the integrated tree is stable. Fix introduced failures. Keep unrelated known issues explicitly distinguished; do not disable assertions or add blanket exceptions to get green results.

Deliver coherent commits, a clean working tree, a tested preview, and a concise report of actual outcomes and test counts. Prioritize the defect ledger by user impact. Any remaining work must have a specific reproduction and reason it remains. Do not ask routine implementation questions; choose defensible defaults and document them.
