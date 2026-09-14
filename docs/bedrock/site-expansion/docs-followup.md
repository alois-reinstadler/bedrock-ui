# Documentation rendering and contextual examples

Follow-up to `15bbf5d`. All 100 component families now have independently lazy-loaded common previews before Installation and a contextual product example under Examples. The three batch reports map each scenario. Block and component imports are highlighted during server rendering/prerendering. Example source is fetched from a prerendered JSON endpoint only when opened, already highlighted; it no longer downloads alongside the live example. A server singleton highlighter keeps a bounded 200-result cache. The public CodeBlock also applies light token colors and returns cached HTML synchronously.

## Navigation decisions

- Keep the existing full-document reliability boundary, now inherited by cross-page links throughout documentation. Same-page reference tabs explicitly opt out and remain linkable.
- Disable source disclosure until hydration so an early click cannot be silently lost.
- Ignore generated build output and visual verification artifacts in the development watcher.
- The preview at port 4009 now runs the production build, removing development reload interruptions from normal review. The observed SvelteKit 3 development SSR restart failure matches https://github.com/sveltejs/kit/issues/16832 and is not claimed as an upstream fix. Restart Vite preview after each build because its asset index retains old hashed paths.

## Additional failures found by the full catalogue sweep

- Selectable Card preview and contextual data now initialize every bound selection to false; passing undefined to a bindable fallback caused a runtime failure.
- Superforms 2.30.2 imports the removed `$app/stores` module. A narrow Vite transform redirects only that dependency's two store imports to a local bridge using official `$app/state` and `toStore`. This is a site compatibility adapter, not a claim that all Superforms server/action APIs support SvelteKit 3. New application code and the Forms guide continue to use current framework APIs. No dependency versions or vendor files changed.
- Frozen Avatar/Badge contrast exceptions and the upstream Slider thumb-labeling limitation remain explicit and unchanged.

## Verification

Final verification and bundle measurements are recorded in the follow-up audit after template integration. Regression coverage includes every registered component, source lazy loading, server-rendered highlighting without JavaScript, light/dark token colors, actual example interactions, repeated navigation with delayed example chunks, and form/tab teardown.
