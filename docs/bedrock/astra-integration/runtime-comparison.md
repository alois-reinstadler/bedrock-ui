# Production runtime comparison

Final-candidate capture on 2026-09-29, production preview
`http://127.0.0.1:4086`, shared Chrome 152.0.7977.82. Source/build hashes are in
[candidate-runtime-source.json](candidate-runtime-source.json).
This record preserves the first final-candidate measurement, including its failed
ERP route gate. It must not be rewritten as a pass if a later build or paired
control resolves the discrepancy; append the later evidence separately.

## Fixed interaction gates

Exact baseline protocol: 1280 x 900, DPR 1, CPU 1x, warmed page, scroll the
fixture control into view, 500 ms preparation, 20 clicks at 100 ms intervals,
1200 ms settling and 1600 ms rest. Three runs per component. AsyncButton uses
the first docs preview button; AvatarStack alternates ERP remove/add controls.

| Component   | p95 gap, three runs   | Largest gap | Long tasks | Fixed result |
| ----------- | --------------------- | ----------- | ---------- | ------------ |
| AsyncButton | 16.7 / 16.7 / 16.8 ms | 33.3 ms     | 0          | Pass         |
| AvatarStack | 16.8 / 16.7 / 16.7 ms | 16.8 ms     | 0          | Pass         |

Each run meets p95 <=25.2 ms, maximum gap <=50 ms, and zero long tasks.
Frame samples: AsyncButton 192/193/193; AvatarStack 192/192/191.
See [AsyncButton frames](async-candidate-frames.json),
[AvatarStack frames](avatar-candidate-frames.json), and
[combined comparisons](candidate-runtime-comparison.json).
No console warnings/errors were observed on either measured page; all collected
route resources had no HTTP responses >=400.

## Initial-route gzip gate

The same resource-list method and original +42304 B allowance were used.
The original production baseline used Vite 8.0.16; this candidate uses the locked
Vite 8.2.2. These totals also include independently changed application code,
including the new ChatVoice module statically imported by ChatComposer on ERP.
They are whole-route observations, not isolated attribution to Astra.

| Route             | Baseline gzip | Candidate gzip |    Delta | Fixed result                   |
| ----------------- | ------------: | -------------: | -------: | ------------------------------ |
| Button docs       |      223532 B |       215356 B |  -8176 B | Pass                           |
| Docs shell        |      183146 B |       174700 B |  -8446 B | Pass                           |
| Motion            |      180638 B |       199763 B | +19125 B | Pass                           |
| AsyncButton docs  |      226877 B |       261569 B | +34692 B | Pass                           |
| ERP / AvatarStack |      307256 B |       352422 B | +45166 B | **Fail: 2862 B above ceiling** |

[Candidate resource lists](candidate-route-resources.json) preserve the actual
requested files. ERP's combined composer chunk changed from 14754 B gzip
(`NtJkYhwG.js`) to 15712 B (`fzzDHcM1.js`, including voice UI). The +958 B whole-chunk
change is descriptive; chunk partitioning and shared dependencies prevent treating
it as ChatVoice's isolated marginal cost. Do not subtract a standalone voice bundle
or silently increase the route allowance.

A defensible paired control would use the old motion integration with the exact
same unrelated application edits and locked toolchain, record its source hashes,
and compare actual production resource closures. It would retain the same +42304 B
allowance and preserve this original failed observation alongside the control.

## Manual variant coverage

Five variants per component: normal desktop, OS-reduced desktop, 390 px viewport,
RTL desktop and CSS `zoom: 2`. The last is **CSS 200% zoom, not browser chrome zoom**.
Checks used an isolated context through the already-qualified shared-CDP fixture
approach with `noDefaults: true`; no browser was launched or foreign tab touched.
See [variant evidence](candidate-variants.json).

AsyncButton kept keyboard focus after Enter, immediately exposed `aria-busy` and
locked-state semantics, exposed one current label, marked retained labels both
inert and hidden, and reached success with one semantic label in every variant.
Reduced mode had only the current label after 100 ms. No horizontal document
overflow occurred on its docs page.

AvatarStack retained the focused named trigger through eight rapid alternating
membership changes in every variant; after 600 ms settling, no running stack
animations remained. Normal, reduced, RTL and CSS-zoom desktop routes had no
horizontal overflow. The 390 px ERP page has 446 px document width in **both old
and new production builds**, and the first preview clips at the left edge in
both. This pre-existing demo limitation is not reported as fixed by the migration.
The stack trigger box itself remains inside the viewport. Evidence:
[mobile paired comparison](mobile-overflow-comparison.json).

The existing ERP fixture has add/remove controls but no arbitrary reorder control;
manual arbitrary reorder, browser-chrome zoom, physical touch devices and other
browser engines were not covered here. Independent focused component tests and
parent composition checks provide their separately recorded coverage.

Screenshots live in `/workspace/agent-jobs/bedrock-astra-migration/` as
`candidate-async-{normal,mobile,rtl,css-zoom-200}.png`,
`candidate-avatar-{mobile,rtl,css-zoom-200}.png` and
`baseline-avatar-mobile-comparison.png`. The mobile Avatar and RTL AsyncButton
captures were visually inspected. Every owned page/context was closed after
measurement; the user preview was left running.
