# Audit evidence

Read [the report](../ui-consistency-audit.md) for findings and the exact coverage limits.

- `inventory.json`: actual registry/data expansion, 258 routes and 127 components.
- `source-inventory.json`: consumer scan, not full semantic review.
- `corner-candidates.json`: syntactic triage candidates, not confirmed defects.
- `sweep-0.json.gz`: complete initial computed-style/console/network samples. Gzip round-trip integrity verified; compact geometry/navigation results are in `route-summary.json`.
- `route-retry.json`: corrected Aspect Ratio and Async Button checks; Form remains dev-blocked.
- `examples.json` plus `examples-retry.json`: Preview/Code frame checks; seven selector/hidden-preview failures were retried successfully.
- `interactions.json`, `state-checks.json`, `followup.json`, `workflows.json`: preserve initial attempts, including locator/hydration failures. These are not all product bugs.
- `final-states.json`: corrected catalogue empty, tasks, inline compose, queue/like, stepped-form submission and video review results.
- `shared-final.json`: DataTable frame, menu/Tabs, footer and settled music-input data. Initial Select role assumption was incorrect; Tooltip role absence was a real defect.
- `tooltip-select-retry.json`: corrected Select success; Tooltip DOM semantics reproduced in dev and production.
- `production.json`: nine targeted production URLs only, not a production-wide audit.
- `map-gallery.json`: all 22 selected variants rendered; deep map interaction remains untested.
- PNGs show the viewport/state named by the file; `hero-reduced-motion.webm` records movement while reduced motion was enabled.
- Build/typecheck/server-test logs retain the observed baseline. One server test failed.

Browser-only form/task/post values are audit demo data. No real email or external message was sent. Application source was not repaired.
