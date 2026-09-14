# Shell and initial blocks

## Decisions

- One shared SiteHeader selects exactly one active destination, including `/templates/*` under Templates. On narrow screens the primary links scroll horizontally; page content does not overflow. The Bedrock button API supplies keyboard focus and motion behavior.
- The docs sidebar sits below the shared header on desktop and uses the existing modal Sheet on mobile. Search covers guides, components, blocks, and templates; ordinary links support keyboard focus and Enter, with a live result count and empty state.
- Restored `data-sveltekit-reload` removed by the preserved draft. It remains on all sidebar content links and primary destination links. No claim of repaired Bits/Svelte SPA teardown is made.
- Sidebar.Inset supplies the main landmark; new docs pages use article landmarks to avoid nested main elements.
- Blocks are exported source, not illustrative pretend APIs: AuthenticationPanel coordinates native validation and asynchronous credential submission; DataToolbar exposes bindable query/filter IDs while callers own filtering; SettingsSection accepts a children snippet and owns pending/retry status while callers own preference data and dirty state.
- Authentication failure preserves credentials, success clears the password, and generic error text avoids leaking arbitrary service details. No credentials are sent by the demo. Production authentication and security decisions remain caller responsibilities.
- Changelog has a typed release model and renders an empty state while the release list is empty; no navigation entry exists yet.
- No dependencies or frozen shadcn files changed. Forms and the skill artifact remain preserved for orchestrator reconciliation.

## Verification

- `pnpm check`: 0 errors, 0 warnings.
- Every changed Svelte file: official Svelte autofixer, no issues or suggestions.
- Changed-file Prettier and ESLint checks.
- Focused Playwright shell suite: 3 tests passed (19.3 seconds) against the managed development preview. Covers keyboard cross-artifact search, reload boundary, linkable block properties reload, filters, async failure/retry, mobile navigation, dark/reduced-motion preferences, and no horizontal overflow.
- Shared Chrome MCP: interactive toolbar filtering yielded one result, search found the correct full-page Music Player link, desktop and mobile had no horizontal overflow, one main landmark, mobile sidebar opened as an aria-modal dialog, no console warnings/errors, document request HTTP 200. Closed owned tab.
- Screenshots: `/tmp/bedrock-shell-desktop.png`, `/tmp/bedrock-shell-mobile-dark.png`, `/tmp/bedrock-shell-mobile-nav.png`.
- Managed preview: `bedrock-shell-takeover`, local `http://127.0.0.1:4071`, user `http://100.64.0.2:4071`.

## Integration gates owned by orchestrator

- Reuse the reference agent's ApiTable renderer for block properties (shape already includes name/type/default/required/description and optional kind).
- Integrate skill download endpoint `/docs/skills/bedrock-ui.md` and the four actual `/templates/*` routes before production build/prerender.
- Run the focused suite against the integrated production build and full required unit/build/performance verification.
- Check dev prebundling: the first cold visit discovered mode-watcher, tailwind-merge, and loader-2; optimizer reloads interrupted the first browser run. The settled rerun passed. No warning thresholds changed.
