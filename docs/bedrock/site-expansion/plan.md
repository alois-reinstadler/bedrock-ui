# Site expansion implementation plan

## Baseline and ownership

Resume the eight interrupted worktrees with user authorization. Integration stays on
`feature/site-experience-pass`, retaining homepage commit `f9281d1`. Compare against
the requested starting commit `29c7416`. No push, publication, or main merge.
English UI and documentation; pnpm only. Preserve the frozen shadcn tree.

## Stable contracts

- Global header: `/`, `/docs`, `/docs/components`, `/docs/blocks`, `/docs/templates`.
- Component details remain `/docs/components/[slug]`; query `tab` selects overview,
  properties, or accessibility. Blocks support overview and properties.
- Full-page templates live at `/templates/music-player`, `/templates/video-library`,
  `/templates/email-client`, `/templates/social-network`. Their common layout owns
  SiteHeader and a catalogue return link; individual template pages own product UI.
- Template metadata lives in `src/lib/site/templates.ts` and contains serializable
  slug, title, description, layouts, components, blocks, and thumbnail fields only.
  Never import template implementations from a catalogue or shared layout.
- Public component imports use `#lib/bedrock/ui/<slug>`; shared registries are owned
  by the orchestrator. Worker registry additions are reviewed during integration.
- Retain `data-sveltekit-reload` for documentation links. Do not claim the upstream
  teardown, Slider labeling, or frozen contrast exceptions are resolved.
- Existing candidate blocks: authentication-panel, data-toolbar, settings-section.
  Document only implemented reusable APIs; do not describe hypothetical imports.

## Phases and acceptance

1. Audit preserved diffs, record baseline build, and freeze contracts (10%).
2. Four separate template agents finish their isolated worktrees (30%). Each owns
   its template route, local data, focused E2E, consumption documentation; each
   returns a local commit after check, changed-file lint/format, and autofixer.
3. Resume shell/guides/blocks, component reference, blur, and Stepped Form in four
   isolated worktrees (55%). Review all diffs and rerun focused checks before
   cherry-picking. No concurrent agents edit the same worktree.
4. Integrate catalogues, schemas, forms guide, skill, navigation and API contracts;
   resolve gaps and cross-feature tests (75%).
5. Run check, all unit tests, changed-file Prettier/ESLint, production build and
   focused production E2E. Tour routes in shared Chrome using managed local preview;
   check mobile/desktop, themes, keyboard, reduced motion, console/network and
   capture screenshots. Compare production chunks and document decisions (95%).
6. Audit changed files/dependencies, create clean commits and report evidence,
   counts, limitations, commits, and tailnet preview (100% only on success).

At most four implementation workers are active together. Each worker must read
AGENTS.md, use Svelte MCP documentation and repeat autofixer on every changed
Svelte file until clean. Every progress update uses a ten-character ASCII bar.
Existing unfinished work is input for review, never evidence of completion.
