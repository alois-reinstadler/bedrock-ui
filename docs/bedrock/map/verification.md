# Map integration verification

Map is part of Bedrock UI. Source attribution and the retained MIT license are recorded in `src/lib/bedrock/ui/map/NOTICE.md` and `LICENSE`.

## Coverage

- 20 adapted examples across Map, Controls, Markers, Popups, Routes, Arcs, GeoJSON, Clusters and Advanced; additional LazyMap and location finder examples.
- Map context regression: delayed initialization, instance isolation, map/style readiness distinction, style reload, teardown, and explicit failure outside a provider.
- Actual Svelte layer lifecycle with a deterministic MapLibre boundary: route, arc, GeoJSON and cluster sources/layers/listeners initialize, clean up, restore after style reload, and release on unmount.
- Marker portal regression: keyed content stays reactive; readiness changes and unmount do not leave duplicated or orphaned content.
- LazyMap regression: no map before explicit activation or intersection; observers disconnect after activation. The separate lazy entry avoids static MapLibre imports.

## Results

- Production build passed, including static generation of Map documentation.
- Svelte/TypeScript checks passed with zero errors and zero warnings.
- Scoped ESLint and Prettier checks passed.
- 24 server unit/documentation tests passed.
- 7 browser component tests passed using the shared Chrome.
- 3 documentation E2E tests passed: all 22 gallery modules and their source tabs load, unsupported WebGL2 produces a fallback, and the location finder supports keyboard selection with an announced selected place. The expanded docs passed against both the development server and the final production preview.
- 1 actual-map interaction E2E was explicitly skipped because the shared Chrome cannot create a WebGL2 context. Real basemap rendering, dragging, camera changes and geographic hit testing therefore remain unverified in this environment.
- The locally bundled MapLibre worker started in shared Chrome without an error.
- Desktop and 390px mobile docs/gallery were browser-checked; neither had horizontal overflow. The final production page had no console errors or warnings. The development site logged a pre-existing SvelteKit reload-attribute warning in its navigation.

The previously observed Vitest CDP connection timeouts cleared on the final run. The gallery is available through the managed `bedrock-preview-main` preview at `/docs/components/map`.

## Bundle verification

`node scripts/verify-map-lazy.mjs` validates the production manifest: MapLibre is absent from the lazy example's static dependency closure and reachable through a dynamic import. It also verifies that the worker was bundled rather than copied with an unresolved relative shared-module import.

The measured build is recorded in `lazy-bundle.json`. The lazy entry plus demo adds 2,512 gzip bytes beyond shared runtime dependencies, while deferring 272,782 gzip bytes of JavaScript. Map CSS and the approximately 475 KiB worker are also deferred. These are build-specific sizes, not timing estimates or a claim that the whole page weighs only 2.5 KB.

Import `LazyMap` from `#lib/bedrock/ui/map/lazy` and use its snippet-provided component family. Static marker/popup imports from the eager map entry defeat the lazy boundary. Keep regular `Map` for primary maps that should appear immediately.

## Windows rendering verification

Open `/docs/components/map` with WebGL2 enabled. In the location finder, select each place from the list and from a marker; verify the selected state and camera agree. Open the Vienna preview popup, zoom and rotate with controls, and switch the document theme. In the gallery, exercise dragging, route progress, arc/region selection, clustering, custom layers and the advanced camera. Check that layers return after a theme change. Select Lazy loading and activate Load map. Geolocation requires localhost or HTTPS and browser permission.

The user will verify actual rendering on Windows; the container checks cover documentation, component lifecycle and the unsupported-renderer fallback.
